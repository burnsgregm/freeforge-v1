import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const generateMockData = () => {
    const data = [];
    for (let i = 0; i < 24; i++) {
        data.push({
            time: `${i}:00`,
            events: Math.floor(Math.random() * 50) + 10,
            anomalies: Math.floor(Math.random() * 5),
        });
    }
    return data;
};

const data = generateMockData();

export function DashboardSparkline() {
    return (
        <div className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#818cf8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <XAxis dataKey="time" hide />
                    <YAxis hide />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                        itemStyle={{ color: '#818cf8' }}
                        labelStyle={{ color: '#94a3b8' }}
                    />
                    <Area
                        type="monotone"
                        dataKey="events"
                        stroke="#818cf8"
                        fillOpacity={1}
                        fill="url(#colorEvents)"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
