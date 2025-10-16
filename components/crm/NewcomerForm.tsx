import React, { useState, useEffect } from 'react';
import { Newcomer, FollowUpStatus, User } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface NewcomerFormProps {
  newcomer: Newcomer | null;
  onSave: (data: Omit<Newcomer, 'id'> | Newcomer) => void;
  onCancel: () => void;
}

const NewcomerForm: React.FC<NewcomerFormProps> = ({ newcomer, onSave, onCancel }) => {
    const users = dataService.getUsers();
    const initialFormState = {
        tenantId: 't1',
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        cameFrom: '',
        prayerRequest: '',
        firstVisitDate: new Date().toISOString().split('T')[0],
        status: FollowUpStatus.New,
        assignedToId: users.length > 0 ? users[0].id : '',
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (newcomer) {
            setFormData({
                ...newcomer,
                email: newcomer.email || '',
                prayerRequest: newcomer.prayerRequest || '',
                assignedToId: newcomer.assignedTo?.id || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [newcomer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({...prev, [e.target.name]: e.target.value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const assignedTo = users.find(u => u.id === formData.assignedToId);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { assignedToId, ...saveData } = formData;
        
        const finalData = {
            ...saveData,
            assignedTo,
            email: saveData.email || undefined,
            prayerRequest: saveData.prayerRequest || undefined,
        };

        if (newcomer) {
            onSave({ ...newcomer, ...finalData });
        } else {
            onSave(finalData as Omit<Newcomer, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} required/>
                    <Input label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} required/>
                    <Input label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} required/>
                    <Input label="Email (Optionnel)" name="email" type="email" value={formData.email} onChange={handleChange}/>
                </div>
                <Input label="Date de première visite" name="firstVisitDate" type="date" value={formData.firstVisitDate} onChange={handleChange} required/>
                <Input label="Comment a-t-il/elle connu l'église ?" name="cameFrom" value={formData.cameFrom} onChange={handleChange} required/>
                <Select label="Statut du suivi" name="status" value={formData.status} onChange={handleChange}>
                    {Object.values(FollowUpStatus).map(s => <option key={s} value={s}>{s}</option>)}
                </Select>
                 <Select label="Assigner à" name="assignedToId" value={formData.assignedToId} onChange={handleChange}>
                     <option value="">Non assigné</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                </Select>
                <Input label="Sujet de prière (Optionnel)" name="prayerRequest" value={formData.prayerRequest} onChange={handleChange}/>
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t">
                <Button type="button" variant="secondary" onClick={onCancel} className="mr-2">Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default NewcomerForm;