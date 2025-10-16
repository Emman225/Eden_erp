
import React, { useState, useEffect } from 'react';
import { Member, Gender, CivilStatus, MemberStatus, SpiritualStatus } from '../../types';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface MemberFormProps {
  member: Member | null;
  onSave: (member: Omit<Member, 'id'> | Member) => void;
  onCancel: () => void;
}

const MemberForm: React.FC<MemberFormProps> = ({ member, onSave, onCancel }) => {
  const initialFormData = {
    tenantId: 't1', // Default tenant
    firstName: '',
    lastName: '',
    gender: Gender.Male,
    birthdate: '',
    email: '',
    phone: '',
    address: '',
    civilStatus: CivilStatus.Single,
    status: MemberStatus.Active,
    spiritualStatus: SpiritualStatus.New,
    baptismDate: '',
    conversionDate: '',
    joinedAt: new Date().toISOString().split('T')[0],
    photoUrl: `https://picsum.photos/seed/${Math.random()}/200`,
  };
    
  const [formData, setFormData] = useState<Omit<Member, 'id'>>(initialFormData);

  useEffect(() => {
    if (member) {
      setFormData({
          ...member,
          baptismDate: member.baptismDate || '',
          conversionDate: member.conversionDate || '',
      });
    } else {
        setFormData(initialFormData);
    }
  }, [member]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = {
        ...formData,
        baptismDate: formData.baptismDate || undefined,
        conversionDate: formData.conversionDate || undefined,
    }
    if (member) {
      onSave({ ...member, ...finalData });
    } else {
      onSave(finalData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
        <h4 className="text-md font-semibold text-gray-800 border-b pb-2">Informations Personnelles</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} required />
            <Input label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} required />
            <Input label="Date de naissance" name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} required />
            <Select label="Genre" name="gender" value={formData.gender} onChange={handleChange}>
                {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
            </Select>
             <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
            <Input label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} required />
            <Select label="État Civil" name="civilStatus" value={formData.civilStatus} onChange={handleChange}>
                {Object.values(CivilStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input label="Adresse" name="address" value={formData.address} onChange={handleChange} />
        </div>
        <h4 className="text-md font-semibold text-gray-800 border-b pb-2 pt-4">Informations Spirituelles & Église</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select label="Statut de Membre" name="status" value={formData.status} onChange={handleChange}>
                {Object.values(MemberStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Select label="Statut Spirituel" name="spiritualStatus" value={formData.spiritualStatus} onChange={handleChange}>
                {Object.values(SpiritualStatus).map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input label="Date de conversion" name="conversionDate" type="date" value={formData.conversionDate} onChange={handleChange} />
            <Input label="Date de baptême" name="baptismDate" type="date" value={formData.baptismDate} onChange={handleChange} />
            <Input label="Date d'inscription" name="joinedAt" type="date" value={formData.joinedAt} onChange={handleChange} required />
        </div>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Enregistrer</Button>
      </div>
    </form>
  );
};

export default MemberForm;