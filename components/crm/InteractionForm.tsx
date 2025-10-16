import React, { useState } from 'react';
import { Interaction } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface InteractionFormProps {
    onSave: (data: Omit<Interaction, 'id' | 'newcomerId'>) => void;
    onCancel: () => void;
}

const InteractionForm: React.FC<InteractionFormProps> = ({ onSave, onCancel }) => {
    const users = dataService.getUsers();
    const [type, setType] = useState<'Appel' | 'Visite' | 'Email' | 'SMS' | 'Rencontre'>('Appel');
    const [notes, setNotes] = useState('');
    const [interactorId, setInteractorId] = useState(users.length > 0 ? users[0].id : '');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const interactor = users.find(u => u.id === interactorId);
        if (!interactor) {
            alert('Utilisateur non trouvé');
            return;
        }

        onSave({
            date,
            type,
            notes,
            interactor,
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Select label="Type d'interaction" name="type" value={type} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setType(e.target.value as any)}>
                        <option>Appel</option>
                        <option>Visite</option>
                        <option>Email</option>
                        <option>SMS</option>
                        <option>Rencontre</option>
                    </Select>
                    <Input label="Date" name="date" type="date" value={date} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDate(e.target.value)} required />
                 </div>
                 <Select label="Effectuée par" name="interactorId" value={interactorId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInteractorId(e.target.value)}>
                    {users.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                </Select>
                 <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                    </label>
                    <textarea
                        id="notes"
                        name="notes"
                        rows={4}
                        value={notes}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                    />
                </div>
            </div>
             <div className="flex justify-end p-4 bg-gray-50 border-t">
                <Button type="button" variant="secondary" onClick={onCancel} className="mr-2">Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default InteractionForm;