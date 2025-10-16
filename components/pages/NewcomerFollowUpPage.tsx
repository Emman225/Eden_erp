import React, { useState } from 'react';
import { Newcomer, FollowUpStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import NewcomerForm from '../crm/NewcomerForm';
import NewcomerDetails from '../crm/NewcomerDetails';

const FollowUpStatusBadge: React.FC<{ status: FollowUpStatus }> = ({ status }) => {
    const colors = {
        [FollowUpStatus.New]: 'bg-blue-100 text-blue-800',
        [FollowUpStatus.Contacted]: 'bg-yellow-100 text-yellow-800',
        [FollowUpStatus.VisitPlanned]: 'bg-purple-100 text-purple-800',
        [FollowUpStatus.Integrated]: 'bg-green-100 text-green-800',
        [FollowUpStatus.Archived]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${colors[status]}`}>{status}</span>;
};

const NewcomerFollowUpPage: React.FC = () => {
    const [newcomers, setNewcomers] = useState<Newcomer[]>(dataService.getNewcomers());
    const [selectedNewcomer, setSelectedNewcomer] = useState<Newcomer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingNewcomer, setEditingNewcomer] = useState<Newcomer | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleOpenModal = (newcomer: Newcomer | null = null) => {
        setEditingNewcomer(newcomer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingNewcomer(null);
        setIsModalOpen(false);
    };

    const handleSave = (data: Omit<Newcomer, 'id'> | Newcomer) => {
        if ('id' in data) {
            dataService.updateNewcomer(data);
        } else {
            dataService.addNewcomer(data as Omit<Newcomer, 'id'>);
        }
        setNewcomers([...dataService.getNewcomers()]);
        handleCloseModal();
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingId) {
            dataService.deleteNewcomer(deletingId);
            setNewcomers([...dataService.getNewcomers()]);
            if (selectedNewcomer?.id === deletingId) {
                setSelectedNewcomer(null);
            }
        }
        setIsConfirmOpen(false);
        setDeletingId(null);
    };

    if (selectedNewcomer) {
        return <NewcomerDetails newcomer={selectedNewcomer} onBack={() => setSelectedNewcomer(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Suivi des Nouveaux Venus</h2>
                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    Ajouter un nouveau
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Première Visite</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Responsable</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Statut</th>
                                <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {newcomers.map((nc) => (
                                <tr key={nc.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedNewcomer(nc)}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{nc.firstName} {nc.lastName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.phone}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.firstVisitDate}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{nc.assignedTo ? `${nc.assignedTo.prenom} ${nc.assignedTo.nom}` : 'Non assigné'}</td>
                                    <td className="px-6 py-4"><FollowUpStatusBadge status={nc.status} /></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button onClick={(e) => { e.stopPropagation(); handleOpenModal(nc); }} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                        <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(nc.id); }} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingNewcomer ? "Modifier Fiche" : "Ajouter Nouveau Venu"}>
                <NewcomerForm newcomer={editingNewcomer} onSave={handleSave} onCancel={handleCloseModal} />
            </Modal>

            <ConfirmationDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Confirmer la suppression" message="Êtes-vous sûr de vouloir supprimer cette fiche ? Cette action est irréversible." />
        </div>
    );
};

export default NewcomerFollowUpPage;