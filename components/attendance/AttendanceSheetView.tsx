
import React, { useState, useEffect } from 'react';
import { PlanningEvent, Member } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';

interface AttendanceSheetViewProps {
  event: PlanningEvent;
  onBack: () => void;
}

const AttendanceSheetView: React.FC<AttendanceSheetViewProps> = ({ event, onBack }) => {
    const [members] = useState<Member[]>(dataService.getMembers()); // In real app, might be event.attendees
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});

    useEffect(() => {
        // Initialize attendance state
        const initialAttendance = members.reduce((acc, member) => {
            acc[member.id] = false;
            return acc;
        }, {} as Record<string, boolean>);
        setAttendance(initialAttendance);
    }, [members]);
    
    const handleToggle = (memberId: string) => {
        setAttendance(prev => ({
            ...prev,
            [memberId]: !prev[memberId],
        }));
    };

    const presentCount = Object.values(attendance).filter(Boolean).length;
    const absentCount = members.length - presentCount;

    return (
        <div className="space-y-6">
            <div>
                 <Button variant="secondary" onClick={onBack}>&larr; Retour à la liste des événements</Button>
                <h2 className="text-2xl font-bold text-gray-800 mt-4">Feuille de présence: {event.title}</h2>
                <p className="text-gray-500">{event.start.toLocaleString()}</p>
            </div>
            <Card>
                <div className="p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-gray-800">Liste des Membres</h3>
                        <div className="text-sm space-x-4">
                            <span className="text-green-600 font-medium">Présents: {presentCount}</span>
                            <span className="text-red-600 font-medium">Absents: {absentCount}</span>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                             <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Nom</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Contact</th>
                                    <th className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Présent</th>
                                </tr>
                             </thead>
                             <tbody className="bg-white divide-y divide-gray-200">
                                {members.map(member => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                              <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full" src={member.photoUrl} alt="" />
                                              </div>
                                              <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                                              </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{member.email}</div>
                                            <div className="text-sm text-gray-500">{member.phone}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <input
                                                type="checkbox"
                                                className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                                                checked={attendance[member.id] || false}
                                                onChange={() => handleToggle(member.id)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                             </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end mt-6">
                        <Button variant="primary">Enregistrer la présence</Button>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default AttendanceSheetView;