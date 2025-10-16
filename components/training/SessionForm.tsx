import React, { useState, useEffect } from 'react';
import { TrainingSession, TrainingParticipant, Member } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Button from '../shared/Button';

interface SessionFormProps {
  session: TrainingSession | null;
  onSave: (session: Omit<TrainingSession, 'id'> | TrainingSession) => void;
  onCancel: () => void;
}

const SessionForm: React.FC<SessionFormProps> = ({ session, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [participants, setParticipants] = useState<TrainingParticipant[]>([]);

  const allMembers = dataService.getMembers();

  useEffect(() => {
    if (session) {
      setTitle(session.title);
      setDescription(session.description);
      setInstructor(session.instructor);
      setStartDate(session.startDate);
      setEndDate(session.endDate);
      setLocation(session.location);
      setParticipants(session.participants);
    }
  }, [session]);

  const handleParticipantToggle = (member: Member) => {
    setParticipants(prev => {
      const existing = prev.find(p => p.member.id === member.id);
      if (existing) {
        return prev.filter(p => p.member.id !== member.id);
      } else {
        return [...prev, { member, status: 'Inscrit' }];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sessionData = {
      tenantId: 't1',
      title,
      description,
      instructor,
      startDate,
      endDate,
      location,
      participants,
    };
    if (session) {
      onSave({ ...session, ...sessionData });
    } else {
      onSave(sessionData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <Input label="Titre" name="title" value={title} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} required />
        <Input label="Description" name="description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required />
        <Input label="Instructeur" name="instructor" value={instructor} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInstructor(e.target.value)} required />
        <div className="grid grid-cols-2 gap-4">
          <Input label="Date de début" name="startDate" type="date" value={startDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStartDate(e.target.value)} required />
          <Input label="Date de fin" name="endDate" type="date" value={endDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEndDate(e.target.value)} required />
        </div>
        <Input label="Lieu" name="location" value={location} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)} required />
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Participants</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto border p-2 rounded-md">
            {allMembers.map(member => (
              <label key={member.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={participants.some(p => p.member.id === member.id)}
                  onChange={() => handleParticipantToggle(member)}
                   className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{member.firstName} {member.lastName}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t">
        <Button type="button" variant="secondary" onClick={onCancel} className="mr-2">Annuler</Button>
        <Button type="submit" variant="primary">Enregistrer</Button>
      </div>
    </form>
  );
};

export default SessionForm;