import { useEffect, useRef, useState } from 'react';
import { api } from '../../../services/api';

export function VideoPlaceholder({ label, nodeId }: { label: string, nodeId?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [useStream, setUseStream] = useState(!!nodeId);
    const [imgError, setImgError] = useState(false);

    // Construct stream URL
    // We need to access the baseURL from axios instance or env
    const baseURL = api.defaults.baseURL || import.meta.env.VITE_API_URL || 'https://motiongrid-api-rrsyyeqnbq-uc.a.run.app/api';
    const token = localStorage.getItem('auth_token');
    const streamUrl = nodeId ? `${baseURL}/nodes/${nodeId}/stream?token=${token}` : '';

    useEffect(() => {
        if (useStream && !imgError && nodeId) return; // If using stream, don't run canvas animation

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const draw = () => {
            time += 0.05;
            const width = canvas.width;
            const height = canvas.height;

            // Clear
            ctx.fillStyle = '#0f172a'; // bg-slate-900
            ctx.fillRect(0, 0, width, height);

            // Digital Noise / Scanlines
            for (let i = 0; i < height; i += 4) {
                ctx.fillStyle = `rgba(30, 41, 59, ${Math.random() * 0.5})`;
                ctx.fillRect(0, i, width, 1);
            }

            // Moving "Entities" (Simple Blobs)
            const x = (Math.sin(time) * 0.4 + 0.5) * width;
            const y = (Math.cos(time * 0.7) * 0.4 + 0.5) * height;

            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(79, 70, 229, 0.4)'; // Indigo
            ctx.fill();

            // Overlay Text
            ctx.font = '12px monospace';
            ctx.fillStyle = '#00ff00';
            ctx.fillText('REC', width - 40, 20);
            ctx.fillText(new Date().toLocaleTimeString(), 10, height - 10);
            ctx.fillText(label, 10, 20);

            if (imgError) {
                ctx.fillStyle = '#ef4444';
                ctx.fillText('SIGNAL LOST', width / 2 - 30, height / 2);
            }

            // Recording Dot
            if (Math.floor(Date.now() / 500) % 2 === 0) {
                ctx.beginPath();
                ctx.arc(width - 50, 15, 4, 0, Math.PI * 2);
                ctx.fillStyle = '#ef4444';
                ctx.fill();
            }

            animationFrameId = window.requestAnimationFrame(draw);
        };

        const resize = () => {
            if (canvas?.parentElement) {
                canvas.width = canvas.parentElement.clientWidth;
                canvas.height = canvas.parentElement.clientHeight;
            }
        };

        window.addEventListener('resize', resize);
        resize(); // Initial resize
        draw();

        return () => {
            window.removeEventListener('resize', resize);
            window.cancelAnimationFrame(animationFrameId);
        };
    }, [label, useStream, imgError, nodeId]);

    if (useStream && !imgError && nodeId) {
        return (
            <div className="relative w-full h-full bg-black">
                <img
                    src={streamUrl}
                    alt={label}
                    className="w-full h-full object-cover"
                    onError={() => setImgError(true)}
                />
                {/* Overlay Text for Stream too */}
                <div className="absolute top-0 left-0 p-2 text-xs font-mono text-green-500 w-full flex justify-between">
                    <span>{label}</span>
                    <span>LIVE</span>
                </div>
            </div>
        );
    }

    return (
        <canvas ref={canvasRef} className="w-full h-full block" />
    );
}
