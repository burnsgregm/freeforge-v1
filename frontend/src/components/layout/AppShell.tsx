import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellProps {
    children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
    return (
        <div className="min-h-screen bg-navy-950 text-slate-200 font-sans selection:bg-secondary-500/30">
            <TopBar />
            <Sidebar />

            <main className="pl-[260px] pt-[80px] min-h-screen transition-all duration-300">
                <div className="max-w-[1920px] mx-auto p-6 animate-in fade-in duration-500 slide-in-from-bottom-4">
                    {children}
                </div>
            </main>
        </div>
    );
}
