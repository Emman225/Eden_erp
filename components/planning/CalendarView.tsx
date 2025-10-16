
import React from 'react';
import { PlanningEvent } from '../../types';
import Card from '../shared/Card';

interface CalendarViewProps {
    events: PlanningEvent[];
    onSelectEvent: (event: PlanningEvent) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ events, onSelectEvent }) => {
    // This is a simplified list view, not a real calendar component.
    // A real implementation would use a library like FullCalendar or build a complex grid.
    return (
        <Card>
            <div className="p-5">
                <h3 className="font-semibold text-gray-800">Événements à venir</h3>
                <ul className="mt-4 divide-y divide-gray-200">
                    {[...events].sort((a,b) => a.start.getTime() - b.start.getTime()).map(event => (
                        <li key={event.id} className="py-3 hover:bg-gray-50 cursor-pointer" onClick={() => onSelectEvent(event)}>
                            <div className="flex justify-between">
                                <p className="text-sm font-medium text-blue-600">{event.title}</p>
                                <p className="text-sm text-gray-500">{event.start.toLocaleDateString()}</p>
                            </div>
                            <p className="text-xs text-gray-500">{event.category}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </Card>
    );
};

export default CalendarView;