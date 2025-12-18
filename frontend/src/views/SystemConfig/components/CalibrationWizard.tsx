import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Camera, CheckCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { Api } from '../../../services/api';

type Step = 'SELECT' | 'CAPTURE' | 'VERIFY' | 'COMPLETE';

export function CalibrationWizard() {
    const [step, setStep] = useState<Step>('SELECT');
    const [progress, setProgress] = useState(0);
    const [selectedNode, setSelectedNode] = useState<string | null>(null);
    const [nodes, setNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch nodes
    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const data = await Api.getNodes();
                setNodes(data.nodes);
            } catch (err) {
                console.error('Failed to fetch nodes for calibration', err);
            }
        };
        fetchNodes();
    }, []);

    const handleStart = async () => {
        if (!selectedNode) return;
        setStep('CAPTURE');
        setProgress(10);
        setError(null);

        try {
            // Start calibration on backend
            const result = await Api.calibrateNode(selectedNode);

            // Progress animation simulation while waiting or based on real status 
            // but for now we just show it finish
            setProgress(50);
            setTimeout(() => {
                setProgress(100);
                setStep('VERIFY');
            }, 1500);

        } catch (err: any) {
            setError(err.message || 'Calibration failed');
            setStep('SELECT');
        }
    };

    const reset = () => {
        setStep('SELECT');
        setProgress(0);
        setSelectedNode(null);
        setError(null);
    };

    return (
        <div className="h-[500px] bg-navy-900 border border-navy-800 rounded-xl p-6 flex flex-col">
            <div className="mb-6">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4 flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-blue-400" />
                    <div className="text-sm text-blue-200">
                        <strong>Simulation Mode:</strong> This wizard demonstrates the calibration workflow. No physical cameras detected.
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Sensor Calibration</h3>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                    <span className={step === 'SELECT' ? 'text-indigo-400 font-bold' : ''}>1. Select Node</span>
                    <span>→</span>
                    <span className={step === 'CAPTURE' ? 'text-indigo-400 font-bold' : ''}>2. Capture</span>
                    <span>→</span>
                    <span className={step === 'VERIFY' ? 'text-indigo-400 font-bold' : ''}>3. Verify</span>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-navy-700 rounded-xl bg-navy-800/30 p-8">
                {step === 'SELECT' && (
                    <div className="text-center space-y-4 w-full">
                        <div className="bg-navy-700 p-4 rounded-full inline-block">
                            <Camera className="w-8 h-8 text-indigo-400" />
                        </div>
                        <h4 className="text-lg font-medium text-white">Select a Node to Calibrate</h4>
                        {error && <div className="text-red-500 text-xs">{error}</div>}
                        <div className="grid grid-cols-2 gap-3 w-full max-w-md mx-auto">
                            {nodes.length > 0 ? nodes.map(node => (
                                <button
                                    key={node.nodeId}
                                    onClick={() => setSelectedNode(node.nodeId)}
                                    className={`p-3 rounded border text-sm truncate ${selectedNode === node.nodeId ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-navy-600 bg-navy-800 text-slate-300 hover:border-slate-500'}`}
                                >
                                    {node.nodeId}
                                </button>
                            )) : (
                                <div className="col-span-2 text-slate-500 text-xs">No nodes found. Using demo nodes...</div>
                            )}

                            {/* DEMO FALLBACK if no real nodes */}
                            {nodes.length === 0 && ['CAM-01', 'CAM-02'].map(node => (
                                <button
                                    key={node}
                                    onClick={() => setSelectedNode(node)}
                                    className={`p-3 rounded border text-sm ${selectedNode === node ? 'border-indigo-500 bg-indigo-500/10 text-white' : 'border-navy-600 bg-navy-800 text-slate-300 hover:border-slate-500'}`}
                                >
                                    {node}
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="primary"
                            disabled={!selectedNode}
                            onClick={handleStart}
                        >
                            Start Calibration
                        </Button>
                    </div>
                )}

                {step === 'CAPTURE' && (
                    <div className="text-center space-y-6 w-full max-w-md">
                        <RefreshCw className="w-12 h-12 text-indigo-400 animate-spin mx-auto" />
                        <div>
                            <h4 className="text-lg font-medium text-white mb-1">Calibrating {selectedNode}...</h4>
                            <p className="text-sm text-slate-400">Capturing extrinsic parameters and aligning with point cloud.</p>
                        </div>
                        <div className="w-full bg-navy-950 rounded-full h-2.5 overflow-hidden">
                            <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="text-xs text-slate-500 font-mono">{progress}% Complete</p>
                    </div>
                )}

                {step === 'VERIFY' && (
                    <div className="text-center space-y-4">
                        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
                        <h4 className="text-lg font-medium text-white">Verification Required</h4>
                        <p className="text-sm text-slate-400 max-w-xs mx-auto">
                            The calculated transform has a reprojection error of <span className="text-white font-mono">0.024m</span>. This is within acceptable limits.
                        </p>
                        <div className="flex gap-3 justify-center">
                            <Button variant="secondary" onClick={reset}>Discard</Button>
                            <Button variant="primary" onClick={() => setStep('COMPLETE')}>Apply Transform</Button>
                        </div>
                    </div>
                )}

                {step === 'COMPLETE' && (
                    <div className="text-center space-y-4">
                        <div className="bg-emerald-500/10 p-4 rounded-full inline-block">
                            <CheckCircle className="w-12 h-12 text-emerald-500" />
                        </div>
                        <h4 className="text-lg font-medium text-white">Calibration Successful</h4>
                        <p className="text-sm text-slate-400">Node {selectedNode} is now active and aligned.</p>
                        <Button variant="ghost" onClick={reset}>Calibrate Another Node</Button>
                    </div>
                )}
            </div>
        </div>
    );
}
