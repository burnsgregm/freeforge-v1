import {
    LayoutDashboard,
    Radio,
    Server,
    Settings,
    Bell,
    Search,
    Menu,
    Play,
    LayoutGrid,
    Activity,
    Video,
    BarChart3,
    Zap,
    AlertTriangle,
    Users,
    HelpCircle,
    LogOut
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../../utils/cn';

const NAV_ITEMS = [
    { label: 'Overview', path: '/', icon: LayoutGrid },
    { label: 'Live Intelligence', path: '/live', icon: Activity },
    { label: 'Session Replay', path: '/replay/mock-session-1', icon: Play }, // Added for easy access
    { label: 'System Config', path: '/config', icon: Settings },
    { label: 'Sessions', path: '/sessions', icon: Video },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Automation', path: '/automation', icon: Zap },
    { label: 'Triage', path: '/triage', icon: AlertTriangle },
    { label: 'Entities', path: '/entities', icon: Users },
];

export function Sidebar() {
    return (
        <aside className="w-[260px] bg-navy-900 border-r border-navy-800 fixed left-0 top-0 bottom-0 pt-[80px] flex flex-col z-40">
            <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                <div className="text-xs font-bold text-slate-500 uppercase px-4 mb-2 tracking-wider">Menu</div>
                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                            isActive
                                ? "bg-secondary-600/10 text-secondary-400 border border-secondary-600/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                                : "text-slate-400 hover:bg-navy-800 hover:text-slate-200"
                        )}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </div>

            <div className="p-4 border-t border-navy-800 space-y-1">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-navy-800 hover:text-slate-200 transition-colors">
                    <HelpCircle className="w-5 h-5" />
                    Help & Docs
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-colors">
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
}
