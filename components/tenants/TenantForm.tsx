
import React, { useState, useEffect } from 'react';
import { ChurchTenant, TenantStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface TenantFormProps {
  tenant: ChurchTenant | null;
  onSave: (tenant: Omit<ChurchTenant, 'id'> | ChurchTenant) => void;
  onCancel: () => void;
}

const TenantForm: React.FC<TenantFormProps> = ({ tenant, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    plan: 'Gratuit',
    status: TenantStatus.Active,
    adminId: '',
    slug: '',
    createdAt: new Date().toISOString().split('T')[0],
  });
  
  const admins = dataService.getUsers().filter(u => u.role === 'Admin système');

  useEffect(() => {
    if (tenant) {
      setFormData({
        name: tenant.name,
        domain: tenant.domain,
        plan: tenant.plan,
        status: tenant.status,
        adminId: tenant.admin.id,
        slug: tenant.slug,
        createdAt: tenant.createdAt,
      });
    } else {
        setFormData({
            name: '',
            domain: '',
            plan: 'Gratuit',
            status: TenantStatus.Active,
            adminId: admins.length > 0 ? admins[0].id : '',
            slug: '',
            createdAt: new Date().toISOString().split('T')[0],
        });
    }
  }, [tenant, admins]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedAdmin = dataService.getUsers().find(u => u.id === formData.adminId);
    if (!selectedAdmin) {
        alert("Admin non trouvé !");
        return;
    }

    const tenantData = {
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        domain: formData.domain,
        status: formData.status,
        plan: formData.plan,
        admin: selectedAdmin,
        createdAt: formData.createdAt,
    };
    
    if (tenant) {
      onSave({ ...tenant, ...tenantData });
    } else {
      onSave(tenantData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 space-y-4">
        <Input label="Nom de l'église" name="name" value={formData.name} onChange={handleChange} required />
        <Input label="Domaine" name="domain" type="text" value={formData.domain} onChange={handleChange} placeholder="sub.erp-eglise.com" required />
        <Select label="Plan" name="plan" value={formData.plan} onChange={handleChange}>
          <option>Gratuit</option>
          <option>Premium</option>
        </Select>
        <Select label="Statut" name="status" value={formData.status} onChange={handleChange}>
          <option value={TenantStatus.Active}>Actif</option>
          <option value={TenantStatus.Suspended}>Suspendu</option>
          <option value={TenantStatus.Deleted}>Supprimé</option>
        </Select>
         <Select label="Admin Principal" name="adminId" value={formData.adminId} onChange={handleChange} required>
            {admins.map(admin => <option key={admin.id} value={admin.id}>{admin.prenom} {admin.nom}</option>)}
        </Select>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Enregistrer</Button>
      </div>
    </form>
  );
};

export default TenantForm;