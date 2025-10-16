
import React, { useState, useEffect } from 'react';
import { Role, Permission } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Button from '../shared/Button';

interface RoleFormProps {
  role: Role | null;
  onSave: (role: Omit<Role, 'id'> | Role) => void;
  onCancel: () => void;
}

const RoleForm: React.FC<RoleFormProps> = ({ role, onSave, onCancel }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<Permission[]>([]);

  const allPermissions = dataService.getPermissions();

  useEffect(() => {
    if (role) {
      setNom(role.nom);
      setDescription(role.description);
      setSelectedPermissions(role.permissions);
    } else {
      setNom('');
      setDescription('');
      setSelectedPermissions([]);
    }
  }, [role]);
  
  const handlePermissionChange = (permission: Permission) => {
    setSelectedPermissions(prev => 
      prev.some(p => p.id === permission.id)
        ? prev.filter(p => p.id !== permission.id)
        : [...prev, permission]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const roleData = { nom, description, permissions: selectedPermissions };
    if (role) {
      onSave({ ...role, ...roleData });
    } else {
      onSave(roleData);
    }
  };
  
  const groupedPermissions = allPermissions.reduce((acc: Record<string, Permission[]>, p: Permission) => {
    (acc[p.module] = acc[p.module] || []).push(p);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <Input label="Nom du Rôle" name="nom" value={nom} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNom(e.target.value)} required />
        <Input label="Description" name="description" value={description} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)} required />
        
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
          <div className="space-y-3 max-h-60 overflow-y-auto border p-3 rounded-md">
            {Object.keys(groupedPermissions).map(moduleName => (
                <div key={moduleName}>
                    <h5 className="font-semibold text-gray-800 text-sm">{moduleName}</h5>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                    {groupedPermissions[moduleName].map(p => (
                        <label key={p.id} className="flex items-center space-x-2 text-sm">
                            <input 
                                type="checkbox"
                                checked={selectedPermissions.some(sp => sp.id === p.id)}
                                onChange={() => handlePermissionChange(p)}
                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <span>{p.action}</span>
                        </label>
                    ))}
                    </div>
                </div>
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

export default RoleForm;