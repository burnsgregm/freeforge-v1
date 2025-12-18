import React from 'react';
import { Construction } from 'lucide-react';
import { Card } from '../ui/Card';

interface PlaceholderViewProps {
    title: string;
    description?: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({
    title,
    description = "This feature is currently under development. Check back soon for updates."
}) => {
    return (
        <div className="p-6 h-full flex items-center justify-center">
            <Card className="max-w-md w-full p-8 text-center flex flex-col items-center gap-4 bg-navy-800 border-navy-700">
                <div className="w-16 h-16 bg-navy-900 rounded-full flex items-center justify-center border border-navy-700 shadow-inner">
                    <Construction className="w-8 h-8 text-primary-400" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white mb-2">{title}</h2>
                    <p className="text-slate-400 leading-relaxed">
                        {description}
                    </p>
                </div>
            </Card>
        </div>
    );
};
