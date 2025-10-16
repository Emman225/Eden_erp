
import React from 'react';
import { Group } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface GroupDetailsProps {
  group: Group;
  onBack: () => void;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ group, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste</Button>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{group.name}</h2>
            <p className="text-gray-500">{group.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Détails</h3>
                     <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Type:</strong> <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{group.type}</span></p>
                        <p><strong>Créé le:</strong> {group.createdAt}</p>
                        <p><strong>Leader:</strong> {group.leader.firstName} {group.leader.lastName}</p>
                     </div>
                </div>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Membres ({group.members.length})</h3>
                    <ul className="mt-4 divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {group.members.map(member => (
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

export default GroupDetails;