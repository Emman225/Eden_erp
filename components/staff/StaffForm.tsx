import React, { useState, useEffect } from 'react';
import { StaffMember, StaffStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface StaffFormProps {
  staffMember: StaffMember | null;
  onSave: (staff: Omit<StaffMember, 'staffId'> | StaffMember) => void;
  onCancel: () => void;
}

const StaffForm: React.FC<StaffFormProps> = ({ staffMember, onSave, onCancel }) => {
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [position, setPosition] = useState('');
  const [department, setDepartment] = useState('');
  const [hiredAt, setHiredAt] = useState(new Date().toISOString().split('T')[0]);
  const [staffStatus, setStaffStatus] = useState<StaffStatus>(StaffStatus.Employee);

  const allMembers = dataService.getMembers();

  useEffect(() => {
    if (staffMember) {
      setSelectedMemberId(staffMember.id);
      setPosition(staffMember.position);
      setDepartment(staffMember.department);
      setHiredAt(staffMember.hiredAt);
      setStaffStatus(staffMember.staffStatus);
    } else {
        if (allMembers.length > 0) {
            setSelectedMemberId(allMembers[0].id);
        }
    }
  }, [staffMember, allMembers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const member = dataService.getMember(selectedMemberId);
    if (!member) {
      alert("Membre non trouvé!");
      return;
    }

    if (staffMember) { // Update logic
        const staffData: StaffMember = {
            ...member,
            position,
            department,
            hiredAt,
            staffStatus,
            assignments: staffMember.assignments,
            staffId: staffMember.staffId,
        };
        onSave(staffData);
    } else { // Create logic
        const staffData: Omit<StaffMember, 'staffId'> = {
            ...member,
            position,
            department,
            hiredAt,
            staffStatus,
            assignments: [],
        };
        onSave(staffData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <Select label="Membre" name="memberId" value={selectedMemberId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedMemberId(e.target.value)} required disabled={!!staffMember}>
            {allMembers.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
        </Select>
        <Input label="Poste" name="position" value={position} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPosition(e.target.value)} required />
        <Input label="Département" name="department" value={department} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDepartment(e.target.value)} required />
        <Input label="Date d'embauche" name="hiredAt" type="date" value={hiredAt} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHiredAt(e.target.value)} required />
        <Select label="Statut" name="staffStatus" value={staffStatus} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStaffStatus(e.target.value as StaffStatus)}>
          {Object.values(StaffStatus).map(s => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Enregistrer</Button>
      </div>
    </form>
  );
};

export default StaffForm;