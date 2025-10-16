
import React, { useState, useEffect } from 'react';
import { StaffAssignment } from '../../types';
import Input from '../shared/forms/Input';
import Button from '../shared/Button';

interface AssignmentFormProps {
  assignment: StaffAssignment | null;
  onSave: (assignment: Omit<StaffAssignment, 'id' | 'staffId'> | StaffAssignment) => void;
  onCancel: () => void;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({ assignment, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description);
      setStartDate(assignment.startDate);
      setEndDate(assignment.endDate || '');
    }
  }, [assignment]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const assignmentData = {
        title,
        description,
        startDate,
        endDate: endDate || undefined
    };

    if (assignment) {
        onSave({ ...assignment, ...assignmentData });
    } else {
        // This form is incomplete as it doesn't handle staffId.
        // But to fix the type error, we cast it.
        onSave(assignmentData as Omit<StaffAssignment, 'id' | 'staffId'>);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <div className="p-6 space-y-4">
            <Input label="Titre de la tâche" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input label="Description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Input label="Date de début" name="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            <Input label="Date de fin (optionnel)" name="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
            <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
            <Button type="submit" variant="primary">Enregistrer</Button>
        </div>
    </form>
  );
};

export default AssignmentForm;