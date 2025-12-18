import { useState } from 'react';
import { Network, Activity, Crosshair } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { NodeTopology } from './components/NodeTopology';
import { SensorHealth } from './components/SensorHealth';
import { CalibrationWizard } from './components/CalibrationWizard';

type Tab = 'topology' | 'health' | 'calibration';

const SystemConfig = () => {
    const [activeTab, setActiveTab] = useState<Tab>('topology');

    return (
        <div className="space-y-6">
            {/* Top Bar Actions */}
            <div className="flex justify-between items-center bg-navy-800/50 p-4 rounded-xl border border-navy-800 backdrop-blur-sm">
                <div className="flex gap-2">
                    <Button
                        variant={activeTab === 'topology' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('topology')}
                        className="gap-2"
                    >
                        <Network className="w-4 h-4" /> Node Topology
                    </Button>
                    <Button
                        variant={activeTab === 'health' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('health')}
                        className="gap-2"
                    >
                        <Activity className="w-4 h-4" /> Sensor Health
                    </Button>
                    <Button
                        variant={activeTab === 'calibration' ? 'primary' : 'ghost'}
                        onClick={() => setActiveTab('calibration')}
                        className="gap-2"
                    >
                        <Crosshair className="w-4 h-4" /> Calibration
                    </Button>
                </div>
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm">Export Config</Button>
                    <Button variant="primary" size="sm">Save Changes</Button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[600px]">
                {activeTab === 'topology' && <NodeTopology />}
                {activeTab === 'health' && <SensorHealth />}
                {activeTab === 'calibration' && <CalibrationWizard />}
            </div>
        </div>
    );
};

export default SystemConfig;
