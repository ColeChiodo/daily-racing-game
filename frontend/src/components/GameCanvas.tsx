import React, { useRef, useEffect } from 'react';

const GameCanvas: React.FC = () => {
	  const canvasRef = useRef<HTMLCanvasElement>(null);

	  useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = 'green';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
	  }, []);

	  return <canvas ref={canvasRef} width={800} height={600} />;
};

export default GameCanvas;
