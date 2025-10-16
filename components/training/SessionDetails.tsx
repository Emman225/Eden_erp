
import React from 'react';
import { TrainingSession } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface SessionDetailsProps {
  session: TrainingSession;
  onBack: () => void;
}

const SessionDetails: React.FC<SessionDetailsProps> = ({ session, onBack }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste</Button>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">{session.title}</h2>
            <p className="text-gray-500">{session.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Détails</h3>
                     <div className="mt-4 space-y-2 text-sm">
                        <p><strong>Instructeur:</strong> {session.instructor}</p>
                        <p><strong>Lieu:</strong> {session.location}</p>
                        <p><strong>Début:</strong> {session.startDate}</p>
                        <p><strong>Fin:</strong> {session.endDate}</p>
                     </div>
                </div>
            </Card>
        </div>
        <div className="md:col-span-2">
            <Card>
                <div className="p-5">
                    <h3 className="font-semibold text-gray-800">Participants ({session.participants.length})</h3>
                    <ul className="mt-4 divide-y divide-gray-200 max-h-96 overflow-y-auto">
                        {session.participants.map(p => (
                            <li key={p.member.id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-full" src={p.member.photoUrl} alt="" />
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{p.member.firstName} {p.member.lastName}</p>
                                        <p className="text-sm text-gray-500">{p.member.email}</p>
                                    </div>
                                </div>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ p.status === 'Terminé' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>{p.status}</span>
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

export default SessionDetails;