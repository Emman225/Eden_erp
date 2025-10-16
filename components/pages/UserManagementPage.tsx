
import React, { useState } from 'react';
import { User } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import UserForm from '../users/UserForm';
import ConfirmationDialog from '../shared/ConfirmationDialog';

const UserStatusBadge: React.FC<{ isActive: boolean }> = ({ isActive }) => {
    const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-block';
    const statusClasses = isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
    return <span className={`${baseClasses} ${statusClasses}`}>{isActive ? 'Actif' : 'Inactif'}</span>;
};

const UserManagementPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>(dataService.getUsers());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    const handleOpenModal = (user: User | null = null) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingUser(null);
        setIsModalOpen(false);
    };

    const handleSaveUser = (userData: Omit<User, 'id'> | User) => {
        if ('id' in userData) {
            dataService.updateUser(userData);
        } else {
            dataService.addUser(userData as Omit<User, 'id'>);
        }
        setUsers([...dataService.getUsers()]);
        handleCloseModal();
    };
    
    const handleDeleteClick = (id: string) => {
        setDeletingUserId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if(deletingUserId) {
            dataService.deleteUser(deletingUserId);
            setUsers([...dataService.getUsers()]);
        }
        setIsConfirmOpen(false);
        setDeletingUserId(null);
    };

    return (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-700">Liste des Utilisateurs</h2>
            <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4"/>} onClick={() => handleOpenModal()}>
              Créer un utilisateur
            </Button>
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Email</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Rôle</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{user.prenom} {user.nom}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <UserStatusBadge isActive={user.actif} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button className="text-blue-600 hover:text-blue-900" onClick={() => handleOpenModal(user)}><EditIcon/></button>
                        <button className="text-red-600 hover:text-red-900" onClick={() => handleDeleteClick(user.id)}><DeleteIcon/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

           <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingUser ? "Modifier l'utilisateur" : "Créer un utilisateur"}>
                <UserForm user={editingUser} onSave={handleSaveUser} onCancel={handleCloseModal} />
           </Modal>

           <ConfirmationDialog 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
            />
        </div>
    );
};

export default UserManagementPage;