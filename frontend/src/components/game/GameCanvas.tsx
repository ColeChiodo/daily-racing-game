import React, { useRef, useEffect } from 'react';
import { Main } from '../../game/Main'; // adjust import path

const GameCanvas: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mainRef = useRef<Main | null>(null);

    const resizeCanvas = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (mainRef.current) {
            mainRef.current.resize(w, h);
        } else {
            canvas.width = w;
            canvas.height = h;
        }
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const main = new Main(canvas);
        mainRef.current = main;
        main.start();

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        return () => {
            main.stop();
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    return <canvas ref={canvasRef} style={{ display: 'block' }} />;
};

export default GameCanvas;
