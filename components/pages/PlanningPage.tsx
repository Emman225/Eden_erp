
import React, { useState } from 'react';
import { PlanningEvent } from '../../types';
import { dataService } from '../../data/mockDataService';
import CalendarView from '../planning/CalendarView';
import EventDetails from '../planning/EventDetails';

const PlanningPage: React.FC = () => {
    const [events, setEvents] = useState<PlanningEvent[]>(dataService.getEvents());
    const [selectedEvent, setSelectedEvent] = useState<PlanningEvent | null>(null);

    const handleSelectEvent = (event: PlanningEvent) => {
        setSelectedEvent(event);
    };
    
    const handleCloseDetails = () => {
        setSelectedEvent(null);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Planning des Événements</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                     <CalendarView events={events} onSelectEvent={handleSelectEvent} />
                </div>
                <div className="md:col-span-1">
                    {selectedEvent ? (
                        <EventDetails event={selectedEvent} onClose={handleCloseDetails} />
                    ) : (
                        <div className="p-4 bg-white rounded-lg shadow-md text-center text-gray-500">
                            Sélectionnez un événement pour voir les détails.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanningPage;