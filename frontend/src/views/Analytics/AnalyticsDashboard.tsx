import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';

export const AnalyticsDashboard = () => {
    return (
        <div className="p-6 space-y-6 text-white h-full overflow-y-auto">
            <h1 className="text-2xl font-bold mb-4">System Analytics</h1>

            {/* KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KPICard title="Total Sessions" value="1,284" trend="+12%" />
                <KPICard title="Avg. Anomaly Rate" value="0.4/hr" trend="-5%" trendGood />
                <KPICard title="Active Nodes" value="24/24" trend="100%" />
                <KPICard title="Data Throughput" value="1.2 GB/s" trend="+8%" />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-4 h-80">
                    <h3 className="font-semibold mb-4">Anomaly Distribution by Type</h3>
                    <div className="flex items-end justify-around h-60 gap-4 pb-2 border-b border-slate-700">
                        <Bar height="30%" label="Speed" color="bg-blue-500" />
                        <Bar height="60%" label="Crowd" color="bg-purple-500" />
                        <Bar height="15%" label="Zone" color="bg-yellow-500" />
                        <Bar height="45%" label="Formation" color="bg-green-500" />
                    </div>
                </Card>

                <Card className="p-4 h-80">
                    <h3 className="font-semibold mb-4">System Load (24h)</h3>
                    {/* Simple SVG Line Chart */}
                    <div className="h-60 w-full relative">
                        <svg className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M0,80 Q50,20 100,50 T200,80 T300,40 T400,90 T500,20 V150 H0 Z"
                                fill="url(#grad)"
                            />
                            <path
                                d="M0,80 Q50,20 100,50 T200,80 T300,40 T400,90 T500,20"
                                fill="none"
                                stroke="#0ea5e9"
                                strokeWidth="3"
                            />
                        </svg>
                        <div className="absolute bottom-0 w-full text-xs text-slate-500 flex justify-between">
                            <span>00:00</span>
                            <span>06:00</span>
                            <span>12:00</span>
                            <span>18:00</span>
                            <span>24:00</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

const KPICard = ({ title, value, trend, trendGood = false }: any) => (
    <Card className="p-4">
        <div className="text-slate-400 text-sm">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        <div className={`text-xs mt-2 ${trendGood || trend.startsWith('+') ? 'text-green-400' : 'text-slate-500'}`}>
            {trend} vs last week
        </div>
    </Card>
);

const Bar = ({ height, label, color }: any) => (
    <div className="flex flex-col items-center flex-1 h-full justify-end group">
        <div className={`w-full max-w-[40px] rounded-t-sm ${color} transition-all duration-500`} style={{ height }}></div>
        <div className="text-xs text-slate-400 mt-2">{label}</div>
    </div>
);
