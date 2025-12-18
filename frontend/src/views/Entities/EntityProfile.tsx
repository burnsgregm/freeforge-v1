import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Activity, Shield, MapPin } from 'lucide-react';

export const EntityProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    return (
        <div className="p-6 text-white max-w-5xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Header */}
                <Card className="md:col-span-3 p-6 flex items-center gap-6">
                    <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-3xl font-bold text-blue-400">
                        {id?.substring(0, 2).toUpperCase() || 'E'}
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{id || 'Unknown Entity'}</h1>
                        <div className="text-slate-400 flex gap-4 mt-2">
                            <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> Security Staff</span>
                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Zone B</span>
                            <span className="flex items-center gap-1 text-green-400"><Activity className="w-4 h-4" /> Active</span>
                        </div>
                    </div>
                </Card>

                {/* Stats */}
                <Card className="p-6">
                    <h3 className="font-semibold mb-4 text-slate-400 uppercase text-xs">Movement Stats</h3>
                    <div className="space-y-4">
                        <Stat label="Avg Speed" value="1.4 m/s" />
                        <Stat label="Distance" value="4.2 km" />
                        <Stat label="Zone Violations" value="0" />
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card className="md:col-span-2 p-6">
                    <h3 className="font-semibold mb-4 text-slate-400 uppercase text-xs">Recent Activity Timeline</h3>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="text-sm text-slate-500 w-16">10:45</div>
                            <div>Entered Zone B (North Gate)</div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-sm text-slate-500 w-16">10:30</div>
                            <div>Shift Started</div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const Stat = ({ label, value }: any) => (
    <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        <span className="font-mono">{value}</span>
    </div>
);
