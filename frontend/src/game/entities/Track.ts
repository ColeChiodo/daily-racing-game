import { createSeededRandom } from '../Utils';

export interface TrackSegment {
    x: number;
    y: number;
    radius: number;
}

export class Track {
    segments: TrackSegment[] = [];
    canvasWidth: number;
    canvasHeight: number;
    private asphaltTexture: HTMLCanvasElement | null = null;
    private random: () => number;

    constructor(width: number, height: number, seed: number) {
        console.log('Track constructor called with seed:', seed);
        this.canvasWidth = width;
        this.canvasHeight = height;
        this.random = createSeededRandom(seed);
        this.generateRandomLoop();
        this.createAsphaltTexture();
    }

    private generateRandomLoop() {
        const numPoints = Math.floor(this.random() * 12) + 9; // 10 to 21 points for more complex shapes
        const centerX = this.canvasWidth / 2; // Fixed center for larger track
        const centerY = this.canvasHeight / 2;
        const baseRadius = 600; // Larger base radius for bigger track
        const variation = baseRadius * 1.6; // Increased variation for more dynamic shapes
        const angleJitter = (2 * Math.PI / numPoints) * 0.2; // Increased jitter for twisty shapes
        const baseTrackRadius = 50; // Slightly wider base half-width

        for (let i = 0; i < numPoints; i++) {
            const angle = (i * 2 * Math.PI) / numPoints + (this.random() - 0.5) * angleJitter;
            const dist = baseRadius + (this.random() - 0.5) * variation;
            const x = centerX + dist * Math.cos(angle);
            const y = centerY + dist * Math.sin(angle);
            const radius = baseTrackRadius + (this.random() - 0.5) * 25; // 37.5 to 62.5 for varied thickness
            this.segments.push({ x, y, radius });
        }
    }

    private createAsphaltTexture() {
        const textureSize = 100;
        this.asphaltTexture = document.createElement('canvas');
        this.asphaltTexture.width = textureSize;
        this.asphaltTexture.height = textureSize;
        const ctx = this.asphaltTexture.getContext('2d')!;
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, textureSize, textureSize);
        const imageData = ctx.getImageData(0, 0, textureSize, textureSize);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = this.random() * 20 - 10;
            data[i] = Math.min(255, Math.max(0, 51 + noise));
            data[i + 1] = Math.min(255, Math.max(0, 51 + noise));
            data[i + 2] = Math.min(255, Math.max(0, 51 + noise));
            data[i + 3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
    }

    draw(ctx: CanvasRenderingContext2D, offsetX: number = 0, offsetY: number = 0) {
        if (this.segments.length === 0 || !this.asphaltTexture) return;

        ctx.save();
        ctx.translate(offsetX, offsetY); // Apply camera offset

        // Dirt border
        ctx.strokeStyle = '#8B4513';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.miterLimit = 10;
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = (s1.radius + s2.radius) * 1.2;
            ctx.stroke();
        }

        // Asphalt track
        ctx.strokeStyle = ctx.createPattern(this.asphaltTexture, 'repeat') || '#333';
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineWidth = Math.min(s1.radius + s2.radius, 125); // Increased cap for wider track
            ctx.stroke();
        }

        // Road markings
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.setLineDash([20, 20]);
        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            ctx.beginPath();
            ctx.moveTo(s1.x, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.stroke();
        }
        ctx.setLineDash([]);

        ctx.restore();
    }

    private distanceToLineSegment(px: number, py: number, x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const len2 = dx * dx + dy * dy;
        if (len2 === 0) return Math.hypot(px - x1, py - y1);
        let t = ((px - x1) * dx + (py - y1) * dy) / len2;
        t = Math.max(0, Math.min(1, t));
        const projx = x1 + t * dx;
        const projy = y1 + t * dy;
        return Math.hypot(px - projx, py - projy);
    }

    isOnTrack(carX: number, carY: number): boolean {
        if (this.segments.length < 2) return false;

        for (let i = 0; i < this.segments.length; i++) {
            const s1 = this.segments[i];
            const s2 = this.segments[(i + 1) % this.segments.length];
            const dist = this.distanceToLineSegment(carX, carY, s1.x, s1.y, s2.x, s2.y);
            const segmentRadius = (s1.radius + s2.radius) / 2;
            if (dist <= segmentRadius) return true;
        }
        return false;
    }
}