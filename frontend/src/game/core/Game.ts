import { Car } from "../entities/Car";
import { Input } from "../input/Input";
import { Track } from "../entities/Track";
import { Renderer } from "./Renderer";
import { Camera } from "./Camera";

export class Game {
    private ctx: CanvasRenderingContext2D;
    private car: Car;
    private input: Input;
    private track: Track;
    private renderer: Renderer;
    private camera: Camera;
    private last = 0;
    private running = false;
    private trackSeed = Date.now();

    constructor(private canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("2D context not available");
        this.ctx = ctx;
        this.input = new Input();

        this.camera = new Camera(canvas.width, canvas.height);

        this.track = new Track(canvas.width, canvas.height, this.trackSeed);
        const clockwise = Math.random() < 0.5;
        const startPos = this.track.getStartingPosition(clockwise);
        this.car = new Car(startPos.x, startPos.y);
        this.car.angle = startPos.angle;

        this.renderer = new Renderer(ctx);

        this.setupReset();
    }

    onResize(width: number, height: number) {
        this.camera.resize(width, height);
        
        // Find car's position relative to the current track
        const carSegment = this.findCarSegment();
        const segmentProgress = this.getCarProgressInSegment(carSegment);
        
        // Recreate track with new dimensions
        this.track = new Track(width, height, this.trackSeed);
        
        // Store current angle before placing car
        const currentAngle = this.car.angle;
        
        // Place car at same relative position on the new track
        this.placeCarOnTrack(carSegment, segmentProgress);
        
        // Restore the original angle
        this.car.angle = currentAngle;
    }

    private findCarSegment(): number {
        let closestSegment = 0;
        let minDistance = Infinity;
        
        for (let i = 0; i < this.track.segments.length; i++) {
            const s1 = this.track.segments[i];
            const s2 = this.track.segments[(i + 1) % this.track.segments.length];
            const dist = this.track.distanceToLineSegment(this.car.x, this.car.y, s1.x, s1.y, s2.x, s2.y);
            
            if (dist < minDistance) {
                minDistance = dist;
                closestSegment = i;
            }
        }
        
        return closestSegment;
    }

    private getCarProgressInSegment(segmentIndex: number): number {
        const s1 = this.track.segments[segmentIndex];
        const s2 = this.track.segments[(segmentIndex + 1) % this.track.segments.length];
        
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        if (length === 0) return 0;
        
        // Project car position onto the segment line
        const t = ((this.car.x - s1.x) * dx + (this.car.y - s1.y) * dy) / (length * length);
        return Math.max(0, Math.min(1, t));
    }

    private placeCarOnTrack(segmentIndex: number, progress: number) {
        const s1 = this.track.segments[segmentIndex];
        const s2 = this.track.segments[(segmentIndex + 1) % this.track.segments.length];
        
        // Calculate position along the segment
        const x = s1.x + (s2.x - s1.x) * progress;
        const y = s1.y + (s2.y - s1.y) * progress;
        
        // Calculate direction along the track
        const dx = s2.x - s1.x;
        const dy = s2.y - s1.y;
        const length = Math.sqrt(dx * dx + dy * dy);
        
        let angle = 0;
        if (length > 0) {
            angle = Math.atan2(dy, dx) * (180 / Math.PI);
        }
        
        this.car.x = x;
        this.car.y = y;
        this.car.angle = angle;
    }

    private setupReset() {
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "r") {
                const clockwise = Math.random() < 0.5; // Randomly choose clockwise or counterclockwise
                const startPos = this.track.getStartingPosition(clockwise);
                this.car.reset(startPos.x, startPos.y);
                this.car.angle = startPos.angle;
            }
        });
    }

    start() {
        if (this.running) return;
        this.running = true;
        this.last = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    private loop = (t: number) => {
        if (!this.running) return;
        const dt = Math.min(0.05, (t - this.last) / 1000);
        this.last = t;

        this.update(dt);
        this.render();

        requestAnimationFrame(this.loop);
    };

    private update(dt: number) {
        this.car.update(dt, this.input.get(), this.canvas.width, this.canvas.height, this.track);
        this.camera.update(this.car.x, this.car.y, this.car.angle, this.car.speed, 1/60);
        
        // Check for checkpoint collisions
        this.track.checkCheckpointCollisions(this.car.x, this.car.y);
    }

    private render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Apply camera transform
        this.camera.apply(ctx);

        // Draw world relative to camera
        this.renderer.drawGrid(w*10, h*10);

        // Draw Entities
        this.renderer.drawTrack(this.track, this.car.x, this.car.y);
        this.renderer.drawCar(this.car);

        // Reset transform for UI/debug overlay
        this.camera.reset(ctx);
        this.renderer.drawDebug(this.car, this.canvas);
    }

    resize(width: number, height: number) {
        this.onResize(width, height);
    }
}
