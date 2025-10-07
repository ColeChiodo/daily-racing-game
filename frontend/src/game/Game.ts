import { Ball } from './Ball';
import { Renderer } from './Renderer';

export class Game {
    private renderer: Renderer;
    private ball: Ball;
    private animationFrameId: number | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.renderer = new Renderer(canvas);

        const radius = 20;
        this.ball = new Ball(canvas.width / 2, canvas.height / 2, 4, 3, radius, 'red');
    }

    start() {
        this.update();
    }

    update = () => {
        this.renderer.clear();
        this.renderer.fillBackground('green');

        this.ball.update(this.renderer.width, this.renderer.height);
        this.ball.draw(this.renderer.getContext());

        this.animationFrameId = requestAnimationFrame(this.update);
    }

    stop() {
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    }

    resize(width: number, height: number) {
        this.renderer.resize(width, height);
        this.ball.x = width / 2;
        this.ball.y = height / 2;
    }
}
