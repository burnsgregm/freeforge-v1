import { Bell, Settings, User, Search } from 'lucide-react';
import { Button } from '../ui/Button';

export function TopBar() {
    return (
        <header className="h-[80px] bg-navy-950 border-b border-navy-800 flex items-center justify-between px-6 fixed top-0 left-0 right-0 z-50">
            {/* Left: Logo & Context */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-secondary-400">
                        MotionGrid
                    </span>
                </div>

                <div className="h-8 w-px bg-navy-800 mx-2" />

                <div className="flex items-center gap-2 text-slate-400 bg-navy-900 py-2 px-4 rounded-lg border border-navy-800">
                    <Search className="w-4 h-4" />
                    <span className="text-sm">Global Search...</span>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative" onClick={() => alert("Notifications coming soon!")}>
                    <Bell className="w-5 h-5 text-slate-400" />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-status-critical rounded-full animate-pulse" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => alert("Settings panel coming soon!")}>
                    <Settings className="w-5 h-5 text-slate-400" />
                </Button>

                <div className="h-8 w-px bg-navy-800 mx-2" />

                <div
                    className="flex items-center gap-3 pl-2 cursor-pointer hover:bg-navy-900 p-2 rounded-lg transition-colors"
                    onClick={() => alert("User profile management coming soon!")}
                >
                    <div className="text-right hidden md:block">
                        <div className="text-sm font-semibold text-white">Admin User</div>
                        <div className="text-xs text-primary-400">OPERATOR</div>
                    </div>
                    <div className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center border border-navy-700">
                        <User className="w-5 h-5 text-slate-300" />
                    </div>
                </div>
            </div>
        </header>
    );
}
