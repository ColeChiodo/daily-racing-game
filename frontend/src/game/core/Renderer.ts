import { Car } from "../entities/Car";
import { Track } from "../entities/Track";

export class Renderer {
    constructor(private ctx: CanvasRenderingContext2D) {}

    clear(w: number, h: number) {
        this.ctx.clearRect(0, 0, w, h);
    }

    drawGrid(w: number, h: number) {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = 0.12;

        // Fill background centered
        ctx.fillStyle = "#2b2b2b";
        ctx.fillRect(-w / 2, -h / 2, w, h);

        ctx.beginPath();
        const step = 40;
        ctx.strokeStyle = "#444";

        // Draw vertical lines from -w/2 to w/2
        for (let x = -w / 2; x <= w / 2; x += step) {
            ctx.moveTo(x + 0.5, -h / 2);
            ctx.lineTo(x + 0.5, h / 2);
        }

        // Draw horizontal lines from -h/2 to h/2
        for (let y = -h / 2; y <= h / 2; y += step) {
            ctx.moveTo(-w / 2, y + 0.5);
            ctx.lineTo(w / 2, y + 0.5);
        }

        ctx.stroke();
        ctx.restore();
    }


    drawGrass(w: number, h: number) {
        const ctx = this.ctx;
        ctx.save();

        // Base green color
        ctx.fillStyle = "#3c9e3c"; // nice mid-green
        ctx.fillRect(-w/2, -h/2, w, h);

        ctx.restore();
    }

    drawCar(car: Car, offsetX: number = 0, offsetY: number = 0) {
        const ctx = this.ctx;
        ctx.save();
        ctx.translate(offsetX, offsetY);
        car.draw(ctx);
        ctx.restore();
    }

    drawTrack(track: Track, offsetX: number = 0, offsetY: number = 0) {
        track.draw(this.ctx, offsetX, offsetY);
    }

    drawDebug(car: Car, canvas: HTMLCanvasElement) {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = "black";
        ctx.font = "12px monospace";
        ctx.fillText(
            `pos: ${car.x.toFixed(1)}, ${car.y.toFixed(1)}`,
            10,
            canvas.height - 46
        );
        ctx.fillText(`speed: ${car.speed.toFixed(2)}`, 10, canvas.height - 30);
        ctx.fillText(`angle: ${car.angle.toFixed(2)}°`, 10, canvas.height - 14);
        ctx.restore();
    }
}
