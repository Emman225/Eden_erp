
import React, { useState } from 'react';
import { Group } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import GroupForm from '../groups/GroupForm';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import GroupDetails from '../groups/GroupDetails';

const GroupManagementPage: React.FC = () => {
    const [groups, setGroups] = useState<Group[]>(dataService.getGroups());
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);

    const handleOpenModal = (group: Group | null = null) => {
        setEditingGroup(group);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingGroup(null);
        setIsModalOpen(false);
    };

    const handleSaveGroup = (groupData: Omit<Group, 'id'> | Group) => {
        if ('id' in groupData) {
            dataService.updateGroup(groupData);
        } else {
            dataService.addGroup(groupData as Omit<Group, 'id'>);
        }
        setGroups([...dataService.getGroups()]);
        handleCloseModal();
        if (selectedGroup && 'id' in groupData && selectedGroup.id === groupData.id) {
            setSelectedGroup(dataService.getGroup(groupData.id) ?? null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingGroupId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingGroupId) {
            dataService.deleteGroup(deletingGroupId);
            setGroups([...dataService.getGroups()]);
            if (selectedGroup && selectedGroup.id === deletingGroupId) {
                setSelectedGroup(null);
            }
        }
        setIsConfirmOpen(false);
        setDeletingGroupId(null);
    };
    
    if (selectedGroup) {
        return <GroupDetails group={selectedGroup} onBack={() => setSelectedGroup(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Liste des Groupes</h2>
                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    Créer un groupe
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom du Groupe</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Leader</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Membres</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Créé le</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {groups.map((group) => (
                                <tr key={group.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedGroup(group)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{group.name}</div>
                                        <div className="text-xs text-gray-500">{group.description}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{group.type}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.leader.firstName} {group.leader.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.members.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.createdAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900" onClick={(e) => { e.stopPropagation(); handleOpenModal(group); }}><EditIcon /></button>
                                        <button className="text-red-600 hover:text-red-900" onClick={(e) => { e.stopPropagation(); handleDeleteClick(group.id); }}><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingGroup ? "Modifier le groupe" : "Créer un groupe"}>
                <GroupForm group={editingGroup} onSave={handleSaveGroup} onCancel={handleCloseModal} />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer ce groupe ? Cette action est irréversible."
            />
        </div>
    );
};

export default GroupManagementPage;