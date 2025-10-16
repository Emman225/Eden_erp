import React from 'react';
import { ProjectTeam } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface ProjectTeamDetailsProps {
  team: ProjectTeam;
  onBack: () => void;
}

const ProjectTeamDetails: React.FC<ProjectTeamDetailsProps> = ({ team, onBack }) => {
  return (
    <div className="space-y-6">
      <div>
        <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste</Button>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{team.name}</h2>
        <p className="text-gray-500">{team.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Détails</h3>
                     <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Leader:</strong> {team.leader.firstName} {team.leader.lastName}</p>
                        <p><strong>Statut:</strong> <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${team.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{team.status}</span></p>
                     </div>
                </div>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Membres de l'équipe ({team.members.length})</h3>
                    <ul className="mt-4 divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {team.members.map(member => (
                            <li key={member.id} className="py-3 flex items-center">
                                <img className="h-10 w-10 rounded-full" src={member.photoUrl} alt="" />
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                                    <p className="text-sm text-gray-500">{member.email}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectTeamDetails;
