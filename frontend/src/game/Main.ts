// src/main.ts
import { Game } from "./core/Game";

export class Main {
  private game: Game;

  constructor(private canvas: HTMLCanvasElement) {
    this.game = new Game(canvas);
    this.resize(canvas.width, canvas.height);
  }

  start() {
    this.game.start();
  }

  stop() {
    this.game.stop();
  }

  resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.game.resize(width, height);
  }
}
