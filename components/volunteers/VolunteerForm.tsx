import React, { useState, useEffect } from 'react';
import { Volunteer, Member } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface VolunteerFormProps {
  volunteer: Volunteer | null;
  onSave: (data: Omit<Volunteer, 'id'> | Volunteer) => void;
  onCancel: () => void;
}

const VolunteerForm: React.FC<VolunteerFormProps> = ({ volunteer, onSave, onCancel }) => {
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [skills, setSkills] = useState('');
    const [availability, setAvailability] = useState('');

    const allMembers = dataService.getMembers();

    useEffect(() => {
        if (volunteer) {
            setSelectedMemberId(volunteer.id);
            setSkills(volunteer.skills.join(', '));
            setAvailability(volunteer.availability);
        } else if (allMembers.length > 0) {
            setSelectedMemberId(allMembers[0].id);
        }
    }, [volunteer, allMembers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const member = allMembers.find(m => m.id === selectedMemberId);
        if (!member) {
            alert("Membre non trouvé!");
            return;
        }

        const volunteerData = {
            ...member,
            skills: skills.split(',').map(s => s.trim()).filter(Boolean),
            availability,
        };
        
        if (volunteer) {
            onSave({ ...volunteer, ...volunteerData });
        } else {
            // This is a simplified add, assuming the member isn't already a volunteer
            onSave(volunteerData as Omit<Volunteer, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <Select label="Membre" name="memberId" value={selectedMemberId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMemberId(e.target.value)} required disabled={!!volunteer}>
                    {allMembers.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
                </Select>
                <Input label="Compétences (séparées par des virgules)" name="skills" value={skills} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSkills(e.target.value)} />
                <Input label="Disponibilité" name="availability" placeholder="Ex: Weekends, Soirs de semaine" value={availability} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAvailability(e.target.value)} />
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default VolunteerForm;