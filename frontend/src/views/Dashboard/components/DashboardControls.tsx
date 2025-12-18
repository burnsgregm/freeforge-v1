import { Calendar, ChevronDown } from 'lucide-react';

export function DashboardControls() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-navy-800/50 p-4 rounded-xl border border-navy-800 backdrop-blur-sm">
            {/* Event Selector */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <div className="text-xs text-slate-400 uppercase font-bold tracking-wide">Current Event</div>
                    <div className="flex items-center gap-2 text-white font-semibold cursor-pointer hover:text-indigo-400 transition-colors">
                        Match Day: Team A vs Team B
                        <ChevronDown className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Time Range Chips */}
            <div className="flex bg-navy-900 rounded-lg p-1 border border-navy-700">
                {['Now', 'Last 30m', 'Last 2h', '24h', 'Custom'].map((range, idx) => (
                    <button
                        key={range}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${idx === 0
                            ? 'bg-secondary-600 text-white shadow-md'
                            : 'text-slate-400 hover:text-white hover:bg-navy-700'
                            }`}
                    >
                        {range}
                    </button>
                ))}
            </div>

            {/* System Status */}
            <div className="flex items-center gap-2 px-4 py-2 bg-status-success/10 border border-status-success/20 rounded-lg text-status-success">
                <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                </span>
                <span className="text-sm font-bold tracking-wide">SYSTEM OPTIMAL</span>
            </div>
        </div>
    );
}
