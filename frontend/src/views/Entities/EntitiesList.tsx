
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Search, Filter, Eye } from 'lucide-react';
import { api } from '../../services/api';

interface Entity {
    id: string;
    type: string;
    role?: string;
    team?: string;
    lastSeen: number;
    status: 'ACTIVE' | 'INACTIVE';
}

export const EntitiesList = () => {
    const navigate = useNavigate();
    const [entities, setEntities] = useState<Entity[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchEntities = async () => {
            try {
                // Mock endpoint or real if available
                const data = await api.get('/entities');
                if (Array.isArray(data)) setEntities(data);
            } catch (err) {
                // Determine mock data if API fails (for demo robustness)
                setEntities([
                    { id: 'HOME_PLAYER_1', type: 'PERSON', role: 'PLAYER', team: 'HOME', lastSeen: Date.now(), status: 'ACTIVE' },
                    { id: 'HOME_PLAYER_2', type: 'PERSON', role: 'PLAYER', team: 'HOME', lastSeen: Date.now(), status: 'ACTIVE' },
                    { id: 'AWAY_PLAYER_1', type: 'PERSON', role: 'PLAYER', team: 'AWAY', lastSeen: Date.now(), status: 'ACTIVE' },
                    { id: 'REF_1', type: 'PERSON', role: 'REFEREE', team: 'NEUTRAL', lastSeen: Date.now(), status: 'ACTIVE' },
                    { id: 'BALL', type: 'OBJECT', role: 'game_ball', lastSeen: Date.now(), status: 'ACTIVE' },
                ]);
            }
        }
        fetchEntities();
    }, []);

    const filtered = entities.filter(e => e.id.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="p-6 text-white h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Entity Directory</h1>
                <div className="flex gap-2">
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search entities..."
                            className="bg-slate-900 border border-slate-700 rounded-md pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500 w-64"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <Button variant="outline"><Filter className="w-4 h-4 mr-2" /> Filter</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(entity => (
                    <Card key={entity.id} className="hover:border-blue-500/50 transition-colors cursor-pointer" onClick={() => navigate(`/entities/${entity.id}`)}>
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant={entity.team === 'HOME' ? 'critical' : entity.team === 'AWAY' ? 'primary' : 'outline'}>
                                {entity.role || entity.type}
                            </Badge>
                            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                        </div>
                        <h3 className="text-lg font-bold mb-1">{entity.id}</h3>
                        <div className="text-slate-400 text-sm mb-4">
                            Last seen: {new Date(entity.lastSeen).toLocaleTimeString()}
                        </div>
                        <div className="flex justify-end">
                            <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4 mr-2" /> View Profile
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};
