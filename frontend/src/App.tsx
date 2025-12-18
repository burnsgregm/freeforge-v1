import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Login } from './views/Login';

import Dashboard from './views/Dashboard/Dashboard';
import SystemConfig from './views/SystemConfig/SystemConfig';

import { LiveMonitoring } from './views/LiveMonitoring/index';
import { SessionReplay } from './views/SessionReplay/SessionReplay';
import { AnalyticsDashboard } from './views/Analytics/AnalyticsDashboard';

import { PlaceholderView } from './components/common/PlaceholderView';

import { SessionsList } from './views/Sessions/SessionsList';
import { AnomalyTriage } from './views/Triage/AnomalyTriage';
import { EntityProfile } from './views/Entities/EntityProfile';
import { EntitiesList } from './views/Entities/EntitiesList';

const RequireAuth = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />

                    <Route path="/*" element={
                        <RequireAuth>
                            <AppShell>
                                <Routes>
                                    <Route path="/" element={<Dashboard />} />
                                    <Route path="/live" element={<LiveMonitoring />} />
                                    <Route path="/replay/:id" element={<SessionReplay />} />
                                    <Route path="/analytics" element={<AnalyticsDashboard />} />
                                    <Route path="/config" element={<SystemConfig />} />

                                    {/* New Features - No Longer Placeholders */}
                                    <Route path="/sessions" element={<SessionsList />} />
                                    <Route path="/sessions/:id" element={<SessionReplay />} />
                                    <Route path="/triage" element={<AnomalyTriage />} />
                                    <Route path="/entities" element={<EntitiesList />} />
                                    <Route path="/entities/:id" element={<EntityProfile />} />

                                    <Route path="/automation" element={<PlaceholderView title="Automation Rules" />} />

                                    {/* Fallback */}
                                    <Route path="*" element={<PlaceholderView title="404: Page Not Found" description="The page you are looking for does not exist." />} />
                                </Routes>
                            </AppShell>
                        </RequireAuth>
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
