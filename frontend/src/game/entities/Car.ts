import { InputState } from "../input/Input";
import { clamp, degToRad } from "../Utils";
import { Track } from "./Track";

export class Car {
    x: number;
    y: number;
    angle: number = 0;
    speed: number = 0;

    width = 40;
    height = 18;

    private readonly baseTurnSpeed = 160;
    private readonly maxSpeed = 400;
    private readonly accel = 600;
    private readonly brakePower = 800;
    private friction = 400;
    private readonly reverseMax = -200;

    private drifting = false;
    private driftTimer = 0;
    private driftDirection = 0;
    private driftCharge = 0;

    private boostTimer = 0;
    private readonly boostedMaxSpeed = 550;
    private readonly boostForce = 700;
    private readonly boostDuration = 0.6;

    private onTrack = true;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    reset(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.angle = 0;
        this.speed = 0;
        this.drifting = false;
        this.driftTimer = 0;
        this.driftCharge = 0;
        this.boostTimer = 0;
    }

    update(dt: number, input: InputState, canvasW: number, canvasH: number, track: Track) {
        this.handleDrift(dt, input);

        // check if on track
        this.onTrack = track.isOnTrack(this.x, this.y);

        // forward/back
        if (input.up) this.speed += this.accel * dt;
        else if (input.down) {
            if (this.speed > 0) this.speed -= this.brakePower * dt;
            else this.speed -= this.accel * 0.6 * dt;
        } else {
            if (this.speed > 0) { this.speed -= this.friction * dt; if (this.speed < 0) this.speed = 0; }
            else if (this.speed < 0) { this.speed += this.friction * dt; if (this.speed > 0) this.speed = 0; }
        }

        // steering
        let steerDir = (input.left ? -1 : 0) + (input.right ? 1 : 0);
        let effectiveTurnSpeed = this.baseTurnSpeed;

        if (this.drifting) {
            let tightness = 0.5;
            if (this.driftDirection === -1) {
                if (input.left) tightness = 1;
                else if (input.right) tightness = 0.3;
            } else if (this.driftDirection === 1) {
                if (input.right) tightness = 1;
                else if (input.left) tightness = 0.3;
            }
            steerDir = this.driftDirection * tightness;
            effectiveTurnSpeed *= 1.5;
        }

        const speedFactor = Math.min(Math.abs(this.speed) / 80, 1);
        const appliedTurn = effectiveTurnSpeed * speedFactor * steerDir * dt;
        if (this.speed < 0) this.angle -= appliedTurn;
        else this.angle += appliedTurn;

        // boost
        if (input.boost) this.triggerBoost(true);
        if (this.boostTimer > 0) { this.speed += this.boostForce * dt; this.boostTimer -= dt; }

        // max speed and friction based on onTrack
        let currentMax = this.maxSpeed;
        this.friction = 400;
        if (!this.onTrack) { currentMax *= 0.5; this.friction = 600; }
        if (this.drifting && this.boostTimer <= 0) currentMax *= 0.7;
        if (this.boostTimer > 0) currentMax = this.boostedMaxSpeed;
        this.speed = clamp(this.speed, this.reverseMax, currentMax);

        // update position
        const rad = degToRad(this.angle);
        this.x += Math.cos(rad) * this.speed * dt;
        this.y += Math.sin(rad) * this.speed * dt;
    }

    private handleDrift(dt: number, input: InputState) {
        if (this.speed < 210) {
            this.drifting = false;
            this.driftTimer = 0;
            this.driftCharge = 0;
            return;
        }
        if (input.drift && !this.drifting && (input.left || input.right)) {
            this.drifting = true;
            this.driftDirection = input.left ? -1 : 1;
            this.driftTimer = 0;
            this.driftCharge = 0;
        }

        if (this.drifting) {
            this.driftTimer += dt;
            if (this.driftTimer > 0.2 && this.driftCharge < 1) this.driftCharge = 1;
            if (this.driftTimer > 0.4 && this.driftCharge < 2) this.driftCharge = 2;
            if (this.driftTimer > 0.7 && this.driftCharge < 3) this.driftCharge = 3;
            if (!input.drift) this.endDrift();
        }
    }

    private endDrift() {
        let boostMultiplier = 0;
        switch (this.driftCharge) {
            case 1: boostMultiplier = 0; break;
            case 2: boostMultiplier = 0.5; break;
            case 3: boostMultiplier = 1; break;
        }
        if (boostMultiplier > 0) {
            const boostPower = boostMultiplier * this.boostForce;
            this.speed += boostPower;
            this.boostTimer = this.boostDuration;
        }
        this.drifting = false;
        this.driftCharge = 0;
        this.driftTimer = 0;
    }

    private triggerBoost(full: boolean = false) {
        this.boostTimer = this.boostDuration;
        const boostPower = full ? this.boostForce : this.boostForce * 0.5;
        this.speed += boostPower;
        if (this.speed > this.boostedMaxSpeed) this.speed = this.boostedMaxSpeed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(degToRad(this.angle));

        ctx.fillStyle = "#ffcc00";
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);

        ctx.fillStyle = "#b33";
        ctx.fillRect(this.width / 4, -this.height / 6, this.width / 6, this.height / 3);

        if (this.drifting) {
            const colors = ["", "blue", "orange", "purple"];
            ctx.fillStyle = colors[this.driftCharge] || "blue";
            ctx.fillRect(-this.width / 2, -this.height / 2 - 6, this.width, 4);
        }

        ctx.restore();
    }
}
