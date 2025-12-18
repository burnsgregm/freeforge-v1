import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Play, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

interface Session {
    id: string;
    sessionId: string;
    startTime: number;
    endTime?: number;
    sport: string;
    anomalies: any[]; // Expecting count or array
}

export const SessionsList = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await api.get('/sessions');
                if (Array.isArray(data)) {
                    // Map or sort data if necessary (latest first)
                    const sorted = data.sort((a: any, b: any) => b.startTime - a.startTime);
                    setSessions(sorted);
                }
            } catch (error) {
                console.error('Failed to fetch sessions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    const formatDuration = (start: number, end?: number) => {
        if (!end) return 'Live';
        const diff = end - start;
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        return `${minutes}m ${seconds}s`;
    };

    const formatDate = (ts: number) => new Date(ts).toLocaleDateString() + ' ' + new Date(ts).toLocaleTimeString();

    return (
        <div className="p-6 text-white h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Recorded Sessions</h1>
                <Button variant="primary" onClick={() => window.location.reload()}>Refresh</Button>
            </div>

            <Card className="overflow-hidden">
                {loading ? (
                    <div className="p-12 flex justify-center text-slate-500">
                        <Loader2 className="animate-spin w-8 h-8" />
                    </div>
                ) : (
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-900 uppercase text-slate-400 font-semibold">
                            <tr>
                                <th className="p-4">Session ID</th>
                                <th className="p-4">Sport</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Duration</th>
                                <th className="p-4">Anomalies</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {sessions.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="p-8 text-center text-slate-500">No sessions found.</td>
                                </tr>
                            )}
                            {sessions.map((session) => (
                                <tr key={session.id || session.sessionId} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="p-4 font-mono text-slate-300">{session.sessionId}</td>
                                    <td className="p-4 font-medium">{session.sport}</td>
                                    <td className="p-4 text-slate-400">{formatDate(session.startTime)}</td>
                                    <td className="p-4 text-slate-400">{formatDuration(session.startTime, session.endTime)}</td>
                                    <td className="p-4">
                                        <Badge variant={session.anomalies?.length > 0 ? 'critical' : 'success'}>
                                            {session.anomalies?.length || 0} Detected
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Badge variant={session.endTime ? 'outline' : 'warning'}>
                                            {session.endTime ? 'COMPLETED' : 'LIVE'}
                                        </Badge>
                                    </td>
                                    <td className="p-4">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => navigate(`/sessions/${session.sessionId}`)}
                                        >
                                            <Play className="w-4 h-4 mr-2" /> Replay
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </Card>
        </div>
    );
};
