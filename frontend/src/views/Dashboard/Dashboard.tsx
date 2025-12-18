import { AnomalyPanel } from './components/AnomalyPanel';
import { DashboardControls } from './components/DashboardControls';
import { StadiumMap } from './components/StadiumMap';
import { DashboardSparkline } from './components/DashboardSparkline';

const Dashboard = () => {
    return (
        <div className="space-y-6">
            <DashboardControls />

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Main View: Stadium Map */}
                <div className="flex-1">
                    <StadiumMap />

                    {/* Bottom Sparkline */}
                    <div className="mt-6 h-[100px] bg-navy-900 border border-navy-800 rounded-xl relative overflow-hidden p-2">
                        <DashboardSparkline />
                    </div>
                </div>

                {/* Right Panel: Anomalies */}
                <AnomalyPanel />
            </div>
        </div>
    );
};

export default Dashboard;
