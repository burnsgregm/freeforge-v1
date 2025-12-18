import React, { useState } from 'react';
import { X, Play, Loader } from 'lucide-react';
import { api } from '../../../services/api';
import { useNavigate } from 'react-router-dom';

interface SessionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SessionModal({ isOpen, onClose }: SessionModalProps) {
    const [name, setName] = useState('');
    const [sport, setSport] = useState('BASKETBALL');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Create Session
            const res = await api.post('/sessions', { name, sport });
            const sessionId = res.data.sessionId;

            // 2. Start Session (Simulation)
            await api.post(`/sessions/${sessionId}/start`);

            // 3. Navigate or refresh (For now, assume we stay on dashboard or go to details)
            // Just close for MVP, dashboard should likely subscribe to live session
            onClose();
        } catch (error) {
            console.error('Failed to start session', error);
            alert('Failed to start session');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="w-[500px] bg-navy-900 border border-navy-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-navy-800 bg-navy-950">
                    <h3 className="text-lg font-semibold text-white">Start New Session</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Session Name</label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Finals Game 1"
                            className="w-full bg-navy-800 border border-navy-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-navy-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Sport Type</label>
                        <div className="grid grid-cols-3 gap-3">
                            {['BASKETBALL', 'SOCCER', 'TENNIS'].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setSport(s)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold border transition-all ${sport === s
                                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                        : 'bg-navy-800 border-navy-700 text-slate-400 hover:border-navy-600'
                                        }`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-navy-600 text-slate-300 hover:bg-navy-800 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 transition-all font-bold disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                            Start Recording
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
