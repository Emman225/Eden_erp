import React, { useState } from 'react';
import { Newcomer, Interaction } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import InteractionForm from './InteractionForm';

interface NewcomerDetailsProps {
  newcomer: Newcomer;
  onBack: () => void;
}

const NewcomerDetails: React.FC<NewcomerDetailsProps> = ({ newcomer, onBack }) => {
    const [interactions, setInteractions] = useState<Interaction[]>(dataService.getInteractionsFor(newcomer.id));
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveInteraction = (data: Omit<Interaction, 'id' | 'newcomerId'>) => {
        dataService.addInteraction({ ...data, newcomerId: newcomer.id });
        setInteractions([...dataService.getInteractionsFor(newcomer.id)]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste</Button>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">{newcomer.firstName} {newcomer.lastName}</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1">
                    <Card>
                        <div className="p-5">
                            <h3 className="font-semibold text-gray-800">Informations</h3>
                            <dl className="mt-4 space-y-2 text-sm">
                                <div className="flex justify-between"><dt className="text-gray-500">Téléphone</dt><dd className="text-gray-900">{newcomer.phone}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd className="text-gray-900">{newcomer.email || '-'}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Première visite</dt><dd className="text-gray-900">{newcomer.firstVisitDate}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Venu par</dt><dd className="text-gray-900">{newcomer.cameFrom}</dd></div>
                                <div className="flex justify-between"><dt className="text-gray-500">Responsable</dt><dd className="text-gray-900">{newcomer.assignedTo?.prenom || 'N/A'}</dd></div>
                                <div className="flex justify-between items-center"><dt className="text-gray-500">Statut</dt><dd>{newcomer.status}</dd></div>
                            </dl>
                        </div>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <Card>
                        <div className="p-5">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Suivi & Interactions</h3>
                                <Button size="sm" leftIcon={<PlusIcon className="w-4 h-4"/>} onClick={() => setIsModalOpen(true)}>Ajouter</Button>
                            </div>
                             <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                                {interactions.length === 0 && <p className="text-sm text-gray-500 text-center py-4">Aucune interaction enregistrée.</p>}
                                {[...interactions].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(interaction => (
                                    <div key={interaction.id} className="p-3 bg-gray-50 rounded-md">
                                        <div className="flex justify-between items-center text-xs text-gray-500">
                                            <span>{interaction.interactor.prenom} {interaction.interactor.nom}</span>
                                            <span>{new Date(interaction.date).toLocaleString('fr-FR')}</span>
                                        </div>
                                        <p className="mt-2 text-sm text-gray-800">{interaction.notes}</p>
                                        <span className="text-xs font-semibold text-blue-700">{interaction.type}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </Card>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Ajouter une interaction">
                <InteractionForm onSave={handleSaveInteraction} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default NewcomerDetails;