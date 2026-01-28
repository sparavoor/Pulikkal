'use client';

import { useState } from 'react';
import { Building, CheckCircle, Circle, X } from 'lucide-react';
import CompletionToggle from '@/components/CompletionToggle';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function UnitCompletionModal({ project, units, completions }: { project: any, units: any[], completions: any[] }) {
    const [isOpen, setIsOpen] = useState(false);

    const completedUnits = completions.filter(c => c.type === 'UNIT').map(c => c.unitId);
    const completionCount = completedUnits.length;
    const totalUnits = units.length;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
            >
                <Building className="w-3.5 h-3.5 mr-1.5" />
                Units: {completionCount}/{totalUnits}
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 relative">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center">
                            <Building className="mr-2 h-5 w-5 text-indigo-600" />
                            Unit Completion Status
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">Mark units that have completed <strong>{project.name}</strong>.</p>

                        <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-2">
                            {units.map((unit) => {
                                const isCompleted = completedUnits.includes(unit.id);
                                return (
                                    <div key={unit.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 bg-gray-50 hover:bg-white hover:shadow-sm transition-all sm:text-sm">
                                        <div className="flex items-center font-medium text-gray-700">
                                            {isCompleted ? <CheckCircle className="w-4 h-4 text-green-500 mr-2" /> : <Circle className="w-4 h-4 text-gray-300 mr-2" />}
                                            {unit.name}
                                        </div>
                                        <CompletionToggle
                                            projectId={project.id}
                                            type="UNIT"
                                            entityId={unit.id}
                                            isCompleted={isCompleted}
                                            label={isCompleted ? "Done" : "Mark"}
                                        />
                                    </div>
                                );
                            })}
                            {units.length === 0 && (
                                <p className="text-sm text-gray-500 text-center py-4">No units found in your sector.</p>
                            )}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-200"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
