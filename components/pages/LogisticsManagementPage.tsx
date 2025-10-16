import React, { useState } from 'react';
import { Material, MaterialRequest, MaterialStatus, RequestStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon, CheckBadgeIcon, PhotoIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import MaterialForm from '../logistics/MaterialForm';
import MaterialRequestForm from '../logistics/MaterialRequestForm';

const MaterialStatusBadge: React.FC<{ status: MaterialStatus }> = ({ status }) => {
    const colors = {
        [MaterialStatus.Good]: 'bg-green-100 text-green-800',
        [MaterialStatus.Used]: 'bg-blue-100 text-blue-800',
        [MaterialStatus.Broken]: 'bg-red-100 text-red-800',
        [MaterialStatus.InMaintenance]: 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${colors[status]}`}>{status}</span>;
};

const RequestStatusBadge: React.FC<{ status: RequestStatus }> = ({ status }) => {
    const colors = {
        [RequestStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [RequestStatus.Approved]: 'bg-green-100 text-green-800',
        [RequestStatus.Rejected]: 'bg-red-100 text-red-800',
        [RequestStatus.InProgress]: 'bg-blue-100 text-blue-800',
        [RequestStatus.Returned]: 'bg-gray-100 text-gray-800',
        [RequestStatus.Cancelled]: 'bg-orange-100 text-orange-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${colors[status]}`}>{status}</span>;
};

const LogisticsManagementPage: React.FC = () => {
    const [materials, setMaterials] = useState<Material[]>(dataService.getMaterials());
    const [requests, setRequests] = useState<MaterialRequest[]>(dataService.getMaterialRequests());
    const [activeTab, setActiveTab] = useState<'inventory' | 'requests'>('inventory');
    
    const [isMaterialModalOpen, setMaterialModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [isRequestModalOpen, setRequestModalOpen] = useState(false);
    const [editingRequest, setEditingRequest] = useState<MaterialRequest | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{ id: string; type: 'material' | 'request' } | null>(null);

    // Material Handlers
    const handleOpenMaterialModal = (material: Material | null = null) => {
        setEditingMaterial(material);
        setMaterialModalOpen(true);
    };
    const handleSaveMaterial = (data: Omit<Material, 'id'> | Material) => {
        if ('id' in data) dataService.updateMaterial(data);
        else dataService.addMaterial(data as Omit<Material, 'id'>);
        setMaterials([...dataService.getMaterials()]);
        setMaterialModalOpen(false);
    };

    // Request Handlers
    const handleOpenRequestModal = (request: MaterialRequest | null = null) => {
        setEditingRequest(request);
        setRequestModalOpen(true);
    };
    const handleSaveRequest = (data: Omit<MaterialRequest, 'id'> | MaterialRequest) => {
        if ('id' in data) dataService.updateMaterialRequest(data);
        else dataService.addMaterialRequest(data as Omit<MaterialRequest, 'id'>);
        setRequests([...dataService.getMaterialRequests()]);
        setRequestModalOpen(false);
    };

    // Delete Handlers
    const handleDeleteClick = (id: string, type: 'material' | 'request') => {
        setDeletingItem({ id, type });
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = () => {
        if (!deletingItem) return;
        if (deletingItem.type === 'material') {
            dataService.deleteMaterial(deletingItem.id);
            setMaterials([...dataService.getMaterials()]);
        } else {
            dataService.deleteMaterialRequest(deletingItem.id);
            setRequests([...dataService.getMaterialRequests()]);
        }
        setIsConfirmOpen(false);
        setDeletingItem(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Gestion du Matériel et de la Logistique</h2>

            <div>
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('inventory')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'inventory' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Inventaire
                    </button>
                    <button onClick={() => setActiveTab('requests')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'requests' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Demandes de Matériel
                    </button>
                </div>
            </div>

            {activeTab === 'inventory' && (
                <Card>
                    <div className="p-4 flex justify-between items-center border-b">
                        <h3 className="font-semibold text-gray-700">Inventaire du Matériel</h3>
                        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenMaterialModal()}>
                            Ajouter du matériel
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Matériel</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Quantité</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">État</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Localisation</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {materials.map(m => (
                                    <tr key={m.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center">
                                                    {m.photoUrl ? <img src={m.photoUrl} alt={m.name} className="h-10 w-10 rounded-md object-cover"/> : <PhotoIcon className="h-6 w-6 text-gray-400" />}
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{m.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-indigo-100 text-indigo-800">{m.type}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.availableQuantity} / {m.totalQuantity}</td>
                                        <td className="px-6 py-4"><MaterialStatusBadge status={m.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.location}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleOpenMaterialModal(m)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                            <button onClick={() => handleDeleteClick(m.id, 'material')} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'requests' && (
                <Card>
                     <div className="p-4 flex justify-between items-center border-b">
                        <h3 className="font-semibold text-gray-700">Demandes de Matériel</h3>
                        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenRequestModal()}>
                            Créer une demande
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Demandeur</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Événement</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Période</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.requesterName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.eventName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.startDate} au {r.endDate}</td>
                                        <td className="px-6 py-4"><RequestStatusBadge status={r.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            {r.status === RequestStatus.Pending && <button className="text-green-600 hover:text-green-900"><CheckBadgeIcon className="w-5 h-5"/></button>}
                                            <button onClick={() => handleOpenRequestModal(r)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                            <button onClick={() => handleDeleteClick(r.id, 'request')} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal isOpen={isMaterialModalOpen} onClose={() => setMaterialModalOpen(false)} title={editingMaterial ? "Modifier le matériel" : "Ajouter du matériel"}>
                <MaterialForm material={editingMaterial} onSave={handleSaveMaterial} onCancel={() => setMaterialModalOpen(false)} />
            </Modal>
             <Modal isOpen={isRequestModalOpen} onClose={() => setRequestModalOpen(false)} title={editingRequest ? "Modifier la demande" : "Créer une demande"}>
                <MaterialRequestForm request={editingRequest} onSave={handleSaveRequest} onCancel={() => setRequestModalOpen(false)} />
            </Modal>

            <ConfirmationDialog 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message={`Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.`}
            />
        </div>
    );
};

export default LogisticsManagementPage;