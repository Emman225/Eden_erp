import React, { useState } from 'react';
import { ProjectTeam, Volunteer } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import ProjectTeamDetails from '../volunteers/ProjectTeamDetails';
import VolunteerForm from '../volunteers/VolunteerForm';
import ProjectTeamForm from '../volunteers/ProjectTeamForm';

const VolunteerManagementPage: React.FC = () => {
    const [teams, setTeams] = useState<ProjectTeam[]>(dataService.getProjectTeams());
    const [volunteers, setVolunteers] = useState<Volunteer[]>(dataService.getVolunteers());
    const [activeTab, setActiveTab] = useState<'teams' | 'volunteers'>('teams');
    const [selectedTeam, setSelectedTeam] = useState<ProjectTeam | null>(null);

    const [isTeamModalOpen, setTeamModalOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState<ProjectTeam | null>(null);
    const [isVolunteerModalOpen, setVolunteerModalOpen] = useState(false);
    const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{ id: string; type: 'team' | 'volunteer' } | null>(null);

    // Team Handlers
    const handleOpenTeamModal = (team: ProjectTeam | null = null) => {
        setEditingTeam(team);
        setTeamModalOpen(true);
    };
    const handleSaveTeam = (data: Omit<ProjectTeam, 'id'> | ProjectTeam) => {
        if ('id' in data) dataService.updateProjectTeam(data);
        else dataService.addProjectTeam(data as Omit<ProjectTeam, 'id'>);
        setTeams([...dataService.getProjectTeams()]);
        setTeamModalOpen(false);
    };

    // Volunteer Handlers
    const handleOpenVolunteerModal = (volunteer: Volunteer | null = null) => {
        setEditingVolunteer(volunteer);
        setVolunteerModalOpen(true);
    };
    const handleSaveVolunteer = (data: Omit<Volunteer, 'id'> | Volunteer) => {
        if ('id' in data) dataService.updateVolunteer(data as Volunteer);
        else dataService.addVolunteer(data as Omit<Volunteer, 'id'>);
        setVolunteers([...dataService.getVolunteers()]);
        setVolunteerModalOpen(false);
    };

    // Delete Handlers
    const handleDeleteClick = (id: string, type: 'team' | 'volunteer') => {
        setDeletingItem({ id, type });
        setIsConfirmOpen(true);
    };
    const handleConfirmDelete = () => {
        if (!deletingItem) return;
        if (deletingItem.type === 'team') {
            dataService.deleteProjectTeam(deletingItem.id);
            setTeams([...dataService.getProjectTeams()]);
            if (selectedTeam?.id === deletingItem.id) setSelectedTeam(null);
        } else {
            dataService.deleteVolunteer(deletingItem.id);
            setVolunteers([...dataService.getVolunteers()]);
        }
        setIsConfirmOpen(false);
        setDeletingItem(null);
    };

    if (selectedTeam) {
        return <ProjectTeamDetails team={selectedTeam} onBack={() => setSelectedTeam(null)} />;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Gestion des Bénévoles et Équipes Projet</h2>

            <div className="flex border-b border-gray-200">
                <button onClick={() => setActiveTab('teams')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'teams' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Équipes Projet
                </button>
                <button onClick={() => setActiveTab('volunteers')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'volunteers' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                    Liste des Bénévoles
                </button>
            </div>

            {activeTab === 'teams' && (
                <Card>
                    <div className="p-4 flex justify-between items-center border-b">
                        <h3 className="font-semibold text-gray-700">Équipes Projet</h3>
                        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenTeamModal()}>Créer une équipe</Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Leader</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Membres</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Statut</th>
                                    <th className="relative px-6 py-3"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teams.map(team => (
                                    <tr key={team.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedTeam(team)}>
                                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{team.name}</div><div className="text-xs text-gray-500">{team.description}</div></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{team.leader.firstName} {team.leader.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{team.members.length}</td>
                                        <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${team.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{team.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={(e) => { e.stopPropagation(); handleOpenTeamModal(team); }} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                            <button onClick={(e) => { e.stopPropagation(); handleDeleteClick(team.id, 'team'); }} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {activeTab === 'volunteers' && (
                <Card>
                     <div className="p-4 flex justify-between items-center border-b">
                        <h3 className="font-semibold text-gray-700">Liste des Bénévoles</h3>
                        <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenVolunteerModal()}>Ajouter un bénévole</Button>
                    </div>
                     <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Compétences</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase">Disponibilité</th>
                                    <th className="relative px-6 py-3"></th>
                                </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {volunteers.map(v => (
                                    <tr key={v.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{v.firstName} {v.lastName}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.skills.join(', ')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{v.availability}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                            <button onClick={() => handleOpenVolunteerModal(v)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                            <button onClick={() => handleDeleteClick(v.id, 'volunteer')} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal isOpen={isTeamModalOpen} onClose={() => setTeamModalOpen(false)} title={editingTeam ? "Modifier l'équipe" : "Créer une équipe projet"} size="xl">
                <ProjectTeamForm team={editingTeam} onSave={handleSaveTeam} onCancel={() => setTeamModalOpen(false)} />
            </Modal>
            <Modal isOpen={isVolunteerModalOpen} onClose={() => setVolunteerModalOpen(false)} title={editingVolunteer ? "Modifier le bénévole" : "Ajouter un bénévole"}>
                <VolunteerForm volunteer={editingVolunteer} onSave={handleSaveVolunteer} onCancel={() => setVolunteerModalOpen(false)} />
            </Modal>

            <ConfirmationDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Confirmer la suppression" message="Êtes-vous sûr de vouloir supprimer cet élément ?" />
        </div>
    );
};

export default VolunteerManagementPage;
