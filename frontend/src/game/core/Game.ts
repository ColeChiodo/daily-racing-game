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
        this.car = new Car(canvas.width / 2, canvas.height / 2);

        this.renderer = new Renderer(ctx);

        this.setupReset();
    }

    onResize(width: number, height: number) {
        this.camera.resize(width, height);
        this.track = new Track(width, height, this.trackSeed);
        this.car.reset(width / 2, height / 2);
    }

    private setupReset() {
        window.addEventListener("keydown", (e) => {
            if (e.key.toLowerCase() === "r") {
                this.car.reset(this.canvas.width / 2, this.canvas.height / 2);
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
    }

    private render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;

        ctx.clearRect(0, 0, w, h);

        // Apply camera transform
        this.camera.apply(ctx);

        // Draw world relative to camera
        this.renderer.drawGrass(w*10, h*10);
        this.renderer.drawGrid(w*10, h*10);

        // Draw Entities
        this.renderer.drawTrack(this.track);
        this.renderer.drawCar(this.car);

        // Reset transform for UI/debug overlay
        this.camera.reset(ctx);
        this.renderer.drawDebug(this.car, this.canvas);
    }

    resize(width: number, height: number) {
        this.onResize(width, height);
    }
}
