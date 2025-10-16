
import React, { useState, useEffect } from 'react';
import { User } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Toggle from '../shared/forms/Toggle';
import Button from '../shared/Button';

interface UserFormProps {
  user: User | null;
  onSave: (user: Omit<User, 'id'> | User) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    role: 'Utilisateur simple',
    actif: true,
    multi_sites: false,
    tenantId: 't1' // Default tenant, should be dynamic in a real app
  });
  
  const roles = dataService.getRoles();

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
        setFormData({
            prenom: '',
            nom: '',
            email: '',
            role: 'Utilisateur simple',
            actif: true,
            multi_sites: false,
            tenantId: 't1'
        });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggle = (name: 'actif' | 'multi_sites', value: boolean) => {
    setFormData(prev => ({...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onSave({ ...user, ...formData });
    } else {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <Input label="Prénom" name="prenom" value={formData.prenom} onChange={handleChange} required />
        <Input label="Nom" name="nom" value={formData.nom} onChange={handleChange} required />
        <Input label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <Select label="Rôle" name="role" value={formData.role} onChange={handleChange}>
          {roles.map(r => <option key={r.id}>{r.nom}</option>)}
        </Select>
        <div className="flex space-x-8 pt-2">
            <Toggle label="Actif" enabled={formData.actif} onChange={(val) => handleToggle('actif', val)} />
            <Toggle label="Multi-sites" enabled={formData.multi_sites} onChange={(val) => handleToggle('multi_sites', val)} />
        </div>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Enregistrer</Button>
      </div>
    </form>
  );
};

export default UserForm;