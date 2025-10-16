import React, { useState, useEffect } from 'react';
import { PlanningEvent } from '../../types';
import Input from '../shared/forms/Input';
import Button from '../shared/Button';

interface EventFormProps {
  event: PlanningEvent | null;
  onSave: (event: Omit<PlanningEvent, 'id'> | PlanningEvent) => void;
  onCancel: () => void;
}

const EventForm: React.FC<EventFormProps> = ({ event, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Service');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setCategory(event.category);
      setLocation(event.location || '');
      setDescription(event.description || '');
      // Note: Simplified date/time handling for this example
      setStartDate(event.start.toISOString().split('T')[0]);
      setStartTime(event.start.toTimeString().substring(0,5));
      setEndDate(event.end.toISOString().split('T')[0]);
      setEndTime(event.end.toTimeString().substring(0,5));
    }
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      tenantId: 't1',
      title,
      category,
      location,
      description,
      start: new Date(`${startDate}T${startTime}`),
      end: new Date(`${endDate}T${endTime}`),
      attendees: [], // Attendee selection not implemented in this form
    };

    if (event) {
      onSave({ ...event, ...eventData });
    } else {
      onSave(eventData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <Input label="Titre de l'événement" name="title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required />
        <Input label="Catégorie" name="category" value={category} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCategory(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
            <Input label="Date de début" name="startDate" type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} required />
            <Input label="Heure de début" name="startTime" type="time" value={startTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartTime(e.target.value)} required />
            <Input label="Date de fin" name="endDate" type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} required />
            <Input label="Heure de fin" name="endTime" type="time" value={endTime} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndTime(e.target.value)} required />
        </div>
        <Input label="Lieu" name="location" value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} />
        <Input label="Description" name="description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Enregistrer</Button>
      </div>
    </form>
  );
};

export default EventForm;