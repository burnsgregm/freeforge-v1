export function CameraStrip() {
    return (
        <div className="absolute bottom-4 left-4 right-4 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3, 4, 5].map(cam => (
                <div key={cam} className="w-40 h-24 bg-black rounded-lg border border-navy-700 relative flex-shrink-0 group cursor-pointer hover:border-indigo-500 transition-colors">
                    <div className="absolute top-1 left-1 bg-black/50 px-1 rounded text-[10px] text-slate-300">CAM-0{cam}</div>
                    <div className="w-full h-full flex items-center justify-center text-slate-700 text-xs">NO SIGNAL</div>
                    <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                </div>
            ))}
        </div>
    );
}
