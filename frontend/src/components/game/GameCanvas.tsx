import React, { useRef, useEffect } from 'react';
import { Game } from '../../game/Game';

const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const gameRef = useRef<Game | null>(null);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        if (gameRef.current) gameRef.current.resize(canvas.width, canvas.height);
    };

    useEffect(() => {
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const game = new Game(canvas);
        gameRef.current = game;
        game.start();

        return () => game.stop();
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;
