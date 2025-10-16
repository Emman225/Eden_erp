
import React from 'react';
import { PlanningEvent } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface EventDetailsProps {
    event: PlanningEvent;
    onClose: () => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, onClose }) => {
    return (
        <Card>
            <div className="p-5">
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full text-2xl leading-none">&times;</button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{event.category}</p>
                <div className="mt-4 space-y-2 text-sm">
                    <p><strong>Début:</strong> {event.start.toLocaleString()}</p>
                    <p><strong>Fin:</strong> {event.end.toLocaleString()}</p>
                    {event.location && <p><strong>Lieu:</strong> {event.location}</p>}
                    {event.description && <p className="mt-2 text-gray-600">{event.description}</p>}
                </div>
                <div className="mt-4 flex space-x-2">
                    <Button size="sm" variant="primary">Modifier</Button>
                    <Button size="sm" variant="danger">Supprimer</Button>
                </div>
            </div>
        </Card>
    );
};

export default EventDetails;