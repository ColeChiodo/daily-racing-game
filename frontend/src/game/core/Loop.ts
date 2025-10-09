export class Loop {
    private last = 0;
    private running = false;
    private frameId: number | null = null;

    constructor(
        private update: (dt: number) => void,
        private render: () => void
    ) {}

    start() {
        if (this.running) return;
        this.running = true;
        this.last = performance.now();
        this.frameId = requestAnimationFrame(this.tick);
    }

    stop() {
        this.running = false;
        if (this.frameId) cancelAnimationFrame(this.frameId);
    }

    private tick = (t: number) => {
        if (!this.running) return;

        const dt = Math.min(0.05, (t - this.last) / 1000); // clamp large deltas
        this.last = t;

        this.update(dt);
        this.render();

        this.frameId = requestAnimationFrame(this.tick);
    };
}
