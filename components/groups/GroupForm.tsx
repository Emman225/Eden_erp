import React, { useState, useEffect } from 'react';
import { Group, Member } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface GroupFormProps {
  group: Group | null;
  onSave: (group: Omit<Group, 'id'> | Group) => void;
  onCancel: () => void;
}

const GroupForm: React.FC<GroupFormProps> = ({ group, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Général');
  const [leaderId, setLeaderId] = useState('');
  const [memberIds, setMemberIds] = useState<string[]>([]);

  const allMembers = dataService.getMembers();

  useEffect(() => {
    if (group) {
      setName(group.name);
      setDescription(group.description);
      setType(group.type);
      setLeaderId(group.leader.id);
      setMemberIds(group.members.map(m => m.id));
    } else {
        if(allMembers.length > 0) {
            setLeaderId(allMembers[0].id);
        }
    }
  }, [group, allMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const leader = allMembers.find(m => m.id === leaderId);
    const members = allMembers.filter(m => memberIds.includes(m.id));

    if (!leader) {
      alert("Leader non trouvé !");
      return;
    }

    const groupData = {
      tenantId: 't1',
      name,
      description,
      type,
      leader,
      members,
      createdAt: group?.createdAt || new Date().toISOString().split('T')[0],
    };

    if (group) {
      onSave({ ...group, ...groupData });
    } else {
      onSave(groupData);
    }
  };

  const handleMemberToggle = (memberId: string) => {
    setMemberIds(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <Input label="Nom du groupe" name="name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required />
        <Input label="Description" name="description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required />
        <Input label="Type" name="type" value={type} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setType(e.target.value)} required />
        <Select label="Leader" name="leaderId" value={leaderId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLeaderId(e.target.value)} required>
          {allMembers.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
        </Select>
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Membres</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto border p-2 rounded-md">
            {allMembers.map(member => (
              <label key={member.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={memberIds.includes(member.id)}
                  onChange={() => handleMemberToggle(member.id)}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>{member.firstName} {member.lastName}</span>
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

export default GroupForm;