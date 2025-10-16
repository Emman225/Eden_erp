
import React from 'react';
import { Member } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { MemberStatusBadge, SpiritualStatusBadge } from '../pages/MemberManagementPage';

interface MemberProfileProps {
  member: Member;
  onBack: () => void;
  onUpdate: (member: Member) => void;
}

const ProfileField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

const MemberProfile: React.FC<MemberProfileProps> = ({ member, onBack, onUpdate }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
            <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste</Button>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Profil de {member.firstName} {member.lastName}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
                <Card>
                    <div className="p-6 flex flex-col items-center">
                        <img className="h-32 w-32 rounded-full" src={member.photoUrl} alt="Profil" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.firstName} {member.lastName}</h3>
                        <p className="mt-1 text-sm text-gray-500">{member.email}</p>
                        <div className="mt-4 flex flex-col gap-2 items-center">
                             <MemberStatusBadge status={member.status} />
                             <SpiritualStatusBadge status={member.spiritualStatus} />
                        </div>
                    </div>
                </Card>
          </div>
          <div className="lg:col-span-2">
              <Card>
                <div className="border-b border-gray-200">
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">Informations Personnelles</h3>
                    </div>
                </div>
                <dl className="divide-y divide-gray-200">
                    <ProfileField label="Nom complet" value={`${member.firstName} ${member.lastName}`} />
                    <ProfileField label="Date de naissance" value={member.birthdate} />
                    <ProfileField label="Genre" value={member.gender} />
                    <ProfileField label="État civil" value={member.civilStatus} />
                    <ProfileField label="Contact" value={<div><p>{member.phone}</p><p>{member.email}</p></div>} />
                    <ProfileField label="Adresse" value={member.address} />
                </dl>
              </Card>
               <Card className="mt-6">
                <div className="border-b border-gray-200">
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">Informations Spirituelles</h3>
                    </div>
                </div>
                <dl className="divide-y divide-gray-200">
                    <ProfileField label="Date de conversion" value={member.conversionDate} />
                    <ProfileField label="Date de baptême" value={member.baptismDate} />
                    <ProfileField label="Date d'inscription" value={member.joinedAt} />
                </dl>
              </Card>
          </div>
      </div>
    </div>
  );
};

export default MemberProfile;