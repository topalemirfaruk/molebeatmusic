import React, { useEffect, useRef } from 'react';
import { usePlayer } from '../context/PlayerContext';

const Visualizer: React.FC = () => {
    const { analyserNode } = usePlayer();
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!analyserNode || !canvasRef.current) return;

        // Safety check to prevent crashes
        if (typeof analyserNode.getByteFrequencyData !== 'function') {
            return;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        let animationId: number;

        const draw = () => {
            animationId = requestAnimationFrame(draw);

            try {
                analyserNode.getByteFrequencyData(dataArray);

                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const barWidth = (canvas.width / bufferLength) * 2.5;
                let barHeight;
                let x = 0;

                for (let i = 0; i < bufferLength; i++) {
                    barHeight = dataArray[i] / 2;

                    // Create gradient
                    const gradient = ctx.createLinearGradient(0, canvas.height, 0, 0);
                    gradient.addColorStop(0, 'var(--accent-color)');
                    gradient.addColorStop(1, '#a0a0a0');

                    ctx.fillStyle = gradient;
                    ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                    x += barWidth + 1;
                }
            } catch (e) {
                console.error("Visualizer error:", e);
                cancelAnimationFrame(animationId);
            }
        };

        draw();

        return () => {
            cancelAnimationFrame(animationId);
        };
    }, [analyserNode]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={200}
            style={{
                width: '100%',
                height: '100%',
                display: 'block'
            }}
        />
    );
};

export default Visualizer;
