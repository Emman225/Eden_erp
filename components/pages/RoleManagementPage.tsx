
import React, { useState } from 'react';
import { Role } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import RoleForm from '../roles/RoleForm';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const RoleManagementPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>(dataService.getRoles());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState<Role | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingRoleId, setDeletingRoleId] = useState<string | null>(null);

    const handleOpenModal = (role: Role | null = null) => {
        setEditingRole(role);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingRole(null);
        setIsModalOpen(false);
    };

    const handleSaveRole = (roleData: Omit<Role, 'id'> | Role) => {
        if ('id' in roleData) {
            dataService.updateRole(roleData);
        } else {
            dataService.addRole(roleData as Omit<Role, 'id'>);
        }
        setRoles([...dataService.getRoles()]);
        handleCloseModal();
    };
    
    const handleDeleteClick = (id: string) => {
        setDeletingRoleId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if(deletingRoleId) {
            dataService.deleteRole(deletingRoleId);
            setRoles([...dataService.getRoles()]);
        }
        setIsConfirmOpen(false);
        setDeletingRoleId(null);
    };

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-700">Liste des Rôles</h2>
        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4"/>} onClick={() => handleOpenModal()}>
          Créer un rôle
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map(role => (
            <Card key={role.id}>
                <div className="p-5">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-bold text-gray-800">{role.nom}</h3>
                            <p className="mt-1 text-sm text-gray-500 h-10">{role.description}</p>
                        </div>
                        <div className="flex space-x-1 flex-shrink-0">
                             <button className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100" onClick={() => handleOpenModal(role)}><EditIcon className="w-4 h-4"/></button>
                             <button className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-gray-100" onClick={() => handleDeleteClick(role.id)}><DeleteIcon className="w-4 h-4"/></button>
                        </div>
                    </div>

                    <div className="mt-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase">Permissions</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {role.permissions.slice(0, 5).map(perm => (
                                <span key={perm.id} className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                                    {perm.module}: {perm.action}
                                </span>
                            ))}
                            {role.permissions.length > 5 && (
                                <span className="px-2 py-1 text-xs font-medium rounded-md bg-gray-100 text-gray-700">
                                    + {role.permissions.length - 5} autres
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingRole ? "Modifier le rôle" : "Créer un rôle"}>
        <RoleForm role={editingRole} onSave={handleSaveRole} onCancel={handleCloseModal} />
      </Modal>

      <ConfirmationDialog 
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer ce rôle ? Cette action est irréversible."
      />
    </div>
  );
};

export default RoleManagementPage;