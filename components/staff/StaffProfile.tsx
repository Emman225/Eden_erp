
import React from 'react';
import { StaffMember } from '../../types';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface StaffProfileProps {
  staffMember: StaffMember;
  onBack: () => void;
}

const ProfileField: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || '-'}</dd>
    </div>
);

const StaffProfile: React.FC<StaffProfileProps> = ({ staffMember, onBack }) => {
  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
        <div>
            <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste</Button>
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Profil de {staffMember.firstName} {staffMember.lastName}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
                <Card>
                    <div className="p-6 flex flex-col items-center">
                        <img className="h-32 w-32 rounded-full" src={staffMember.photoUrl} alt="Profil" />
                        <h3 className="mt-4 text-xl font-semibold text-gray-900">{staffMember.firstName} {staffMember.lastName}</h3>
                        <p className="mt-1 text-sm text-gray-500">{staffMember.position}</p>
                        <div className="mt-4 flex gap-2">
                             <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">{staffMember.staffStatus}</span>
                        </div>
                    </div>
                </Card>
          </div>
          <div className="lg:col-span-2">
              <Card>
                <div className="border-b border-gray-200">
                    <div className="px-6 py-4">
                        <h3 className="text-lg font-semibold leading-6 text-gray-900">Informations Professionnelles</h3>
                    </div>
                </div>
                <dl className="divide-y divide-gray-200">
                    <ProfileField label="Nom complet" value={`${staffMember.firstName} ${staffMember.lastName}`} />
                    <ProfileField label="Poste" value={staffMember.position} />
                    <ProfileField label="Département" value={staffMember.department} />
                    <ProfileField label="Date d'embauche" value={staffMember.hiredAt} />
                    <ProfileField label="Contact" value={<div><p>{staffMember.phone}</p><p>{staffMember.email}</p></div>} />
                </dl>
              </Card>
          </div>
      </div>
    </div>
  );
};

export default StaffProfile;