'use client';

import { useState } from 'react';
import { Eye, X, CheckCircle, Circle, Building, Layers, ShieldCheck, Copy, Check } from 'lucide-react';
import { Project, ProjectCompletion, Sector, Unit } from '@prisma/client';

type ProjectWithScope = Project & {
    scopeDivision: boolean;
    scopeSector: boolean;
    scopeUnit: boolean;
};

interface Props {
    project: ProjectWithScope;
    completions: ProjectCompletion[];
    sectors: Sector[];
    units: Unit[];
}

export default function ProjectStatusModal({ project, completions, sectors, units }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    // Group completions
    const divisionCompleted = completions.some(c => c.type === 'DIVISION');
    const sectorCompletions = completions.filter(c => c.type === 'SECTOR');
    const unitCompletions = completions.filter(c => c.type === 'UNIT');

    const handleCopy = () => {
        const lines = [];
        lines.push(`*📊 Project Status: ${project.name}*`);
        lines.push(`📅 Date: ${new Date().toLocaleDateString()}`);
        lines.push('');

        if (project.scopeDivision) {
            lines.push(`*Division Level:* ${divisionCompleted ? '✅ Completed' : '⭕ Pending'}`);
            lines.push('');
        }

        if (project.scopeSector) {
            lines.push('*Sector Level Status:*');
            sectors.forEach(sector => {
                const isDone = sectorCompletions.some(c => c.sectorId === sector.id);
                lines.push(`${sector.name} - ${isDone ? '☑️' : '⭕'}`);
            });
            lines.push('');
        }

        if (project.scopeUnit) {
            lines.push('*Unit Level Status (By Sector):*');
            sectors.forEach(sector => {
                const sectorUnits = units.filter(u => u.sectorId === sector.id);
                if (sectorUnits.length === 0) return; // Skip if no units in this sector

                const completedCount = sectorUnits.filter(u =>
                    unitCompletions.some(c => c.unitId === u.id)
                ).length;

                lines.push(`${sector.name} - ${completedCount}/${sectorUnits.length}`);
            });
        }

        const text = lines.join('\n');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-gray-400 hover:text-indigo-600 transition-colors"
                title="View Completion Status"
            >
                <Eye className="w-5 h-5" />
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 flex items-center">
                                    <ShieldCheck className="mr-2 h-5 w-5 text-indigo-600" />
                                    Project Status: {project.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">Completion tracking report</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center px-3 py-1.5 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors border border-indigo-200"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5 mr-1.5" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
                                    {copied ? 'Copied!' : 'Copy Report'}
                                </button>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 p-1 bg-white rounded-full shadow-sm border border-gray-200"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-6 overflow-y-auto space-y-8">
                            {/* Division Level */}
                            {project.scopeDivision && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                        <ShieldCheck className="w-4 h-4 mr-2 text-pink-500" />
                                        Division Level
                                    </h4>
                                    <div className={`p-4 rounded-lg border ${divisionCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} flex items-center`}>
                                        {divisionCompleted ? (
                                            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-300 mr-3" />
                                        )}
                                        <span className={`font-medium ${divisionCompleted ? 'text-green-800' : 'text-gray-500'}`}>
                                            {divisionCompleted ? 'Completed' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Sector Level */}
                            {project.scopeSector && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                        <Layers className="w-4 h-4 mr-2 text-purple-500" />
                                        Sector Level ({sectorCompletions.length}/{sectors.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {sectors.map(sector => {
                                            const isDone = sectorCompletions.some((c: any) => c.sectorId === sector.id);
                                            return (
                                                <div key={sector.id} className="flex items-center p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm">
                                                    {isDone ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" />
                                                    )}
                                                    <span className={isDone ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                                        {sector.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Unit Level */}
                            {project.scopeUnit && (
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center">
                                        <Building className="w-4 h-4 mr-2 text-blue-500" />
                                        Unit Level ({unitCompletions.length}/{units.length})
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                        {units.map(unit => {
                                            const isDone = unitCompletions.some((c: any) => c.unitId === unit.id);
                                            return (
                                                <div key={unit.id} className="flex items-center p-3 rounded-lg border border-gray-100 bg-gray-50 text-sm">
                                                    {isDone ? (
                                                        <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-gray-300 mr-2 flex-shrink-0" />
                                                    )}
                                                    <span className={isDone ? 'text-gray-900 font-medium' : 'text-gray-500'}>
                                                        {unit.name}
                                                    </span>
                                                    <span className="ml-auto text-xs text-gray-400 pl-2 truncate max-w-[80px]">
                                                        {sectors.find(s => s.id === unit.sectorId)?.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
