
import React, { useState } from 'react';
import { ChurchTenant, TenantStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, ExternalLinkIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import TenantForm from '../tenants/TenantForm';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const TenantStatusBadge: React.FC<{ status: TenantStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-block';
  const statusClasses = {
    [TenantStatus.Active]: 'bg-green-100 text-green-800',
    [TenantStatus.Suspended]: 'bg-yellow-100 text-yellow-800',
    [TenantStatus.Deleted]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};


const TenantManagementPage: React.FC = () => {
  const [tenants, setTenants] = useState<ChurchTenant[]>(dataService.getTenants());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTenant, setEditingTenant] = useState<ChurchTenant | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deletingTenantId, setDeletingTenantId] = useState<string | null>(null);

  const handleOpenModal = (tenant: ChurchTenant | null = null) => {
    setEditingTenant(tenant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingTenant(null);
    setIsModalOpen(false);
  };

  const handleSaveTenant = (tenantData: Omit<ChurchTenant, 'id'> | ChurchTenant) => {
    if ('id' in tenantData) {
      dataService.updateTenant(tenantData);
    } else {
      dataService.addTenant(tenantData as Omit<ChurchTenant, 'id'>);
    }
    setTenants([...dataService.getTenants()]);
    handleCloseModal();
  };
  
  const handleDeleteClick = (id: string) => {
    setDeletingTenantId(id);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if(deletingTenantId) {
        dataService.deleteTenant(deletingTenantId);
        setTenants([...dataService.getTenants()]);
    }
    setIsConfirmOpen(false);
    setDeletingTenantId(null);
  };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Liste des Églises</h2>
        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4"/>} onClick={() => handleOpenModal()}>
          Créer une église
        </Button>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom de l'église</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Plan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Admin Principal</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date Création</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tenant.name}</div>
                    <a href={`https://${tenant.domain}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:underline flex items-center">
                      {tenant.domain} <ExternalLinkIcon className="ml-1"/>
                    </a>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TenantStatusBadge status={tenant.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.plan}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                     <div className="text-sm text-gray-900">{tenant.admin.prenom} {tenant.admin.nom}</div>
                     <div className="text-xs text-gray-500">{tenant.admin.email}</div>
                  </td>
                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{tenant.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900" onClick={() => handleOpenModal(tenant)}><EditIcon/></button>
                    <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteClick(tenant.id)}><DeleteIcon/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingTenant ? "Modifier l'église" : "Créer une église"}>
        <TenantForm tenant={editingTenant} onSave={handleSaveTenant} onCancel={handleCloseModal} />
      </Modal>

      <ConfirmationDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cette église ? Cette action est irréversible."
      />
    </div>
  );
};

export default TenantManagementPage;