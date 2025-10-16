
import React, { useState } from 'react';
import { PlanningEvent } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import AttendanceSheetView from '../attendance/AttendanceSheetView';

const AttendancePage: React.FC = () => {
    const [events] = useState<PlanningEvent[]>(dataService.getEvents());
    const [selectedEvent, setSelectedEvent] = useState<PlanningEvent | null>(null);

    if (selectedEvent) {
        return <AttendanceSheetView event={selectedEvent} onBack={() => setSelectedEvent(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Suivi des Présences</h2>
            </div>
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Sélectionner un événement</h3>
                    <p className="text-sm text-gray-500">Choisissez un événement pour enregistrer ou consulter les présences.</p>
                    <ul className="mt-4 divide-y divide-gray-200">
                        {[...events].sort((a, b) => b.start.getTime() - a.start.getTime()).map(event => (
                            <li key={event.id} className="py-3 hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-blue-600">{event.title}</p>
                                    <p className="text-sm text-gray-500">{event.start.toLocaleDateString()}</p>
                                </div>
                                <p className="text-xs text-gray-500">{event.category} - {event.location}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
    );
};

export default AttendancePage;