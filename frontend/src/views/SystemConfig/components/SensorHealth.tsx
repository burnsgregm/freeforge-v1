import { Badge } from '../../../components/ui/Badge';

export function SensorHealth() {
    return (
        <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
            <table className="w-full text-left text-sm">
                <thead className="bg-navy-900 text-slate-400 font-medium">
                    <tr>
                        <th className="p-4">Node ID</th>
                        <th className="p-4">Sensor</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">FPS (Target)</th>
                        <th className="p-4">Latency</th>
                        <th className="p-4">Last Update</th>
                        <th className="p-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-navy-700">
                    <tr className="hover:bg-navy-700/50 transition-colors">
                        <td className="p-4 font-mono text-slate-300">NODE_001</td>
                        <td className="p-4">Camera</td>
                        <td className="p-4"><Badge variant="success">ONLINE</Badge></td>
                        <td className="p-4">30/30</td>
                        <td className="p-4 text-green-400">12ms</td>
                        <td className="p-4 text-slate-400">Just now</td>
                        <td className="p-4 text-right">
                            <button className="text-indigo-400 hover:text-indigo-300">Restart</button>
                        </td>
                    </tr>
                    <tr className="hover:bg-navy-700/50 transition-colors">
                        <td className="p-4 font-mono text-slate-300">NODE_002</td>
                        <td className="p-4">LIDAR</td>
                        <td className="p-4"><Badge variant="critical">OFFLINE</Badge></td>
                        <td className="p-4 text-red-400">0/10</td>
                        <td className="p-4 text-slate-500">--</td>
                        <td className="p-4 text-red-400">5m ago</td>
                        <td className="p-4 text-right">
                            <button className="text-indigo-400 hover:text-indigo-300">Restart</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}
