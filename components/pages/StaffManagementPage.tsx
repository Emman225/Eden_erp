
import React, { useState } from 'react';
import { StaffMember } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import StaffForm from '../staff/StaffForm';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import StaffProfile from '../staff/StaffProfile';

const StaffManagementPage: React.FC = () => {
    const [staff, setStaff] = useState<StaffMember[]>(dataService.getStaff());
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingStaffId, setDeletingStaffId] = useState<string | null>(null);

    const handleOpenModal = (staffMember: StaffMember | null = null) => {
        setEditingStaff(staffMember);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingStaff(null);
        setIsModalOpen(false);
    };

    const handleSaveStaff = (staffData: Omit<StaffMember, 'staffId'> | StaffMember) => {
        if ('staffId' in staffData && staffData.staffId) {
            dataService.updateStaff(staffData as StaffMember);
        } else {
            dataService.addStaff(staffData as Omit<StaffMember, 'staffId'>);
        }
        setStaff([...dataService.getStaff()]);
        handleCloseModal();
        if (selectedStaff && 'id' in staffData && selectedStaff.id === staffData.id) {
            setSelectedStaff(dataService.getStaffMember(staffData.id) ?? null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingStaffId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingStaffId) {
            dataService.deleteStaff(deletingStaffId);
            setStaff([...dataService.getStaff()]);
        }
        setIsConfirmOpen(false);
        setDeletingStaffId(null);
        if (selectedStaff && selectedStaff.id === deletingStaffId) {
            setSelectedStaff(null);
        }
    };

    if (selectedStaff) {
        return <StaffProfile staffMember={selectedStaff} onBack={() => setSelectedStaff(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Liste du Personnel</h2>
                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    Ajouter un membre du personnel
                </Button>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Poste</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Département</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date d'embauche</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {staff.map((staffMember) => (
                                <tr key={staffMember.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedStaff(staffMember)}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={staffMember.photoUrl} alt="" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{staffMember.firstName} {staffMember.lastName}</div>
                                                <div className="text-xs text-gray-500">{staffMember.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{staffMember.position}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staffMember.department}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{staffMember.staffStatus}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{staffMember.hiredAt}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900" onClick={(e) => { e.stopPropagation(); handleOpenModal(staffMember); }}><EditIcon /></button>
                                        <button className="text-red-600 hover:text-red-900" onClick={(e) => { e.stopPropagation(); handleDeleteClick(staffMember.id); }}><DeleteIcon /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingStaff ? "Modifier le membre du personnel" : "Ajouter un membre du personnel"}>
                <StaffForm staffMember={editingStaff} onSave={handleSaveStaff} onCancel={handleCloseModal} />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer ce membre du personnel ? Cette action est irréversible."
            />
        </div>
    );
};

export default StaffManagementPage;