
import React, { useState } from 'react';
import { TrainingSession } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import SessionForm from '../training/SessionForm';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import SessionDetails from '../training/SessionDetails';

const TrainingPage: React.FC = () => {
    const [sessions, setSessions] = useState<TrainingSession[]>(dataService.getTrainingSessions());
    const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSession, setEditingSession] = useState<TrainingSession | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

    const handleOpenModal = (session: TrainingSession | null = null) => {
        setEditingSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setEditingSession(null);
        setIsModalOpen(false);
    };

    const handleSaveSession = (sessionData: Omit<TrainingSession, 'id'> | TrainingSession) => {
        if ('id' in sessionData) {
            dataService.updateTrainingSession(sessionData);
        } else {
            dataService.addTrainingSession(sessionData as Omit<TrainingSession, 'id'>);
        }
        setSessions([...dataService.getTrainingSessions()]);
        handleCloseModal();
        if (selectedSession && 'id' in sessionData && selectedSession.id === sessionData.id) {
            setSelectedSession(dataService.getTrainingSession(sessionData.id) ?? null);
        }
    };

    const handleDeleteClick = (id: string) => {
        setDeletingSessionId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingSessionId) {
            dataService.deleteTrainingSession(deletingSessionId);
            setSessions([...dataService.getTrainingSessions()]);
            if (selectedSession && selectedSession.id === deletingSessionId) {
                setSelectedSession(null);
            }
        }
        setIsConfirmOpen(false);
        setDeletingSessionId(null);
    };

    if (selectedSession) {
        return <SessionDetails session={selectedSession} onBack={() => setSelectedSession(null)} />;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Formations</h2>
                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                    Créer une session
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map(session => (
                    <Card key={session.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedSession(session)}>
                        <div className="p-5">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800">{session.title}</h3>
                                    <p className="mt-1 text-sm text-gray-500">Par {session.instructor}</p>
                                </div>
                                <div className="flex space-x-1 flex-shrink-0">
                                    <button className="p-1 text-blue-600 hover:text-blue-900 rounded-full hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); handleOpenModal(session); }}><EditIcon className="w-4 h-4" /></button>
                                    <button className="p-1 text-red-600 hover:text-red-900 rounded-full hover:bg-gray-100" onClick={(e) => { e.stopPropagation(); handleDeleteClick(session.id); }}><DeleteIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="mt-4 text-sm text-gray-600">
                                <p><strong>Du:</strong> {session.startDate} <strong>Au:</strong> {session.endDate}</p>
                                <p><strong>Lieu:</strong> {session.location}</p>
                                <p className="mt-2 text-xs font-semibold">{session.participants.length} participants</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingSession ? "Modifier la session" : "Créer une session"}>
                <SessionForm session={editingSession} onSave={handleSaveSession} onCancel={handleCloseModal} />
            </Modal>

            <ConfirmationDialog
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cette session de formation ? Cette action est irréversible."
            />
        </div>
    );
};

export default TrainingPage;