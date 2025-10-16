import React, { useState, useEffect } from 'react';
import { ProjectTeam, Volunteer, Member } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface ProjectTeamFormProps {
  team: ProjectTeam | null;
  onSave: (data: Omit<ProjectTeam, 'id'> | ProjectTeam) => void;
  onCancel: () => void;
}

const ProjectTeamForm: React.FC<ProjectTeamFormProps> = ({ team, onSave, onCancel }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [leaderId, setLeaderId] = useState('');
    const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
    const [memberIds, setMemberIds] = useState<string[]>([]);

    const allMembers = dataService.getMembers();
    const allVolunteers = dataService.getVolunteers();

    useEffect(() => {
        if (team) {
            setName(team.name);
            setDescription(team.description);
            setLeaderId(team.leader.id);
            setStatus(team.status);
            setMemberIds(team.members.map(m => m.id));
        } else if (allMembers.length > 0) {
            setLeaderId(allMembers[0].id);
        }
    }, [team, allMembers]);

    const handleMemberToggle = (volunteerId: string) => {
        setMemberIds(prev =>
            prev.includes(volunteerId)
                ? prev.filter(id => id !== volunteerId)
                : [...prev, volunteerId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const leader = allMembers.find(m => m.id === leaderId);
        if (!leader) {
            alert("Leader non trouvé!");
            return;
        }
        const members = allVolunteers.filter(v => memberIds.includes(v.id));
        const teamData = { 
            tenantId: 't1',
            name, 
            description, 
            leader, 
            members, 
            status 
        };

        if (team) {
            onSave({ ...team, ...teamData });
        } else {
            onSave(teamData);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <Input label="Nom de l'équipe" name="name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
                <Input label="Description" name="description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Leader" name="leaderId" value={leaderId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLeaderId(e.target.value)} required>
                        {allMembers.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
                    </Select>
                    <Select label="Statut" name="status" value={status} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as any)}>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </Select>
                </div>
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Membres de l'équipe (Bénévoles)</h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto border p-2 rounded-md">
                        {allVolunteers.map(v => (
                            <label key={v.id} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={memberIds.includes(v.id)}
                                    onChange={() => handleMemberToggle(v.id)}
                                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <span>{v.firstName} {v.lastName} <em className="text-xs text-gray-500">({v.skills.join(', ')})</em></span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default ProjectTeamForm;