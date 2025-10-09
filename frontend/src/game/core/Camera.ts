export class Camera {
    x: number = 0;
    y: number = 0;
    zoom: number = 1;

    private targetX: number = 0;
    private targetY: number = 0;
    private targetZoom: number = 1;
    private smoothFactor = 2; // higher = snappier, lower = smoother
    private baseZoom = 1;
    private zoomFactor = 0.0001;

    constructor(private canvasWidth: number, private canvasHeight: number) {}

    update(carX: number, carY: number, carAngle: number, carSpeed: number, dt: number) {
        // Lookahead based on speed
        const lookAheadDistance = carSpeed * 0.25;
        const rad = (carAngle * Math.PI) / 180;
        this.targetX = this.canvasWidth / 2 - (carX + Math.cos(rad) * lookAheadDistance);
        this.targetY = this.canvasHeight / 2 - (carY + Math.sin(rad) * lookAheadDistance);

        // Smoothly interpolate towards target
        this.x += (this.targetX - this.x) * Math.min(dt * this.smoothFactor, 1);
        this.y += (this.targetY - this.y) * Math.min(dt * this.smoothFactor, 1);

        // Zoom based on speed (optional: adjust min/max zoom)
        this.targetZoom = this.baseZoom - carSpeed * this.zoomFactor;
        this.targetZoom = Math.max(0.8, Math.min(1.2, this.targetZoom)); // clamp zoom

        // Smooth zoom
        this.zoom += (this.targetZoom - this.zoom) * Math.min(dt * this.smoothFactor, 1);
    }

    resize(width: number, height: number) {
        this.canvasWidth = width;
        this.canvasHeight = height;
    }

    apply(ctx: CanvasRenderingContext2D) {
        ctx.setTransform(this.zoom, 0, 0, this.zoom, this.x, this.y);
    }

    reset(ctx: CanvasRenderingContext2D) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
}
