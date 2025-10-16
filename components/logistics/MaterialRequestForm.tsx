import React, { useState, useEffect } from 'react';
import { MaterialRequest, MaterialRequestItem, RequestStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';
import Input from '../shared/forms/Input';
import { PlusIcon, DeleteIcon } from '../icons/Icon';

interface MaterialRequestFormProps {
  request: MaterialRequest | null;
  onSave: (data: Omit<MaterialRequest, 'id'> | MaterialRequest) => void;
  onCancel: () => void;
}

const MaterialRequestForm: React.FC<MaterialRequestFormProps> = ({ request, onSave, onCancel }) => {
    const users = dataService.getUsers();
    const events = dataService.getEvents();
    const materials = dataService.getMaterials();

    const initialFormState = {
        tenantId: 't1',
        requesterId: users.length > 0 ? users[0].id : '',
        requestDate: new Date().toISOString().split('T')[0],
        eventId: events.length > 0 ? events[0].id : '',
        status: RequestStatus.Pending,
        comment: '',
        items: [{ materialId: materials.length > 0 ? materials[0].id : '', quantity: 1 }],
        startDate: '',
        endDate: '',
    };
    
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (request) {
            setFormData({
                ...request,
                requesterId: request.requesterId,
                eventId: request.eventId || '',
                comment: request.comment || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [request]);
    
     useEffect(() => {
        const selectedEvent = events.find(e => e.id === formData.eventId);
        if(selectedEvent) {
            setFormData(prev => ({
                ...prev,
                startDate: selectedEvent.start.toISOString().split('T')[0],
                endDate: selectedEvent.end.toISOString().split('T')[0],
            }))
        }
     }, [formData.eventId, events]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (index: number, field: keyof MaterialRequestItem, value: string | number) => {
        const newItems = [...formData.items];
        // Ensure quantity is a number
        const val = field === 'quantity' ? (parseInt(value as string, 10) || 1) : value;
        newItems[index] = { ...newItems[index], [field]: val };
        setFormData(prev => ({ ...prev, items: newItems }));
    };
    
    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { materialId: materials.length > 0 ? materials[0].id : '', quantity: 1 }],
        }));
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, items: newItems }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const requester = users.find(u => u.id === formData.requesterId);
        const event = events.find(e => e.id === formData.eventId);

        const saveData = {
            ...formData,
            requesterName: requester ? `${requester.prenom} ${requester.nom}` : 'Inconnu',
            eventName: event ? event.title : 'Aucun',
        };
        
        if (request) {
            onSave({ ...request, ...saveData });
        } else {
            onSave(saveData as Omit<MaterialRequest, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Demandeur" name="requesterId" value={formData.requesterId} onChange={handleChange}>
                        {users.map(u => <option key={u.id} value={u.id}>{u.prenom} {u.nom}</option>)}
                    </Select>
                    <Select label="Événement Associé" name="eventId" value={formData.eventId} onChange={handleChange}>
                        <option value="">Aucun</option>
                        {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
                    </Select>
                     <Input label="Date de début" name="startDate" type="date" value={formData.startDate} onChange={handleChange} required/>
                     <Input label="Date de fin" name="endDate" type="date" value={formData.endDate} onChange={handleChange} required/>
                </div>
                <hr className="my-4"/>
                <h4 className="font-semibold text-gray-700">Matériel demandé</h4>
                <div className="space-y-3">
                {formData.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <Select name="materialId" label="" value={item.materialId} onChange={(e) => handleItemChange(index, 'materialId', e.target.value)} className="flex-grow">
                             {materials.filter(m => m.availableQuantity > 0).map(m => <option key={m.id} value={m.id}>{m.name} ({m.availableQuantity} dispo.)</option>)}
                        </Select>
                        <Input name="quantity" label="" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} min="1" className="w-24" />
                        <button type="button" onClick={() => removeItem(index)} className="text-red-500 hover:text-red-700 p-2 mt-5">
                            <DeleteIcon className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
                </div>
                <Button type="button" variant="secondary" size="sm" leftIcon={<PlusIcon className="w-4 h-4"/>} onClick={addItem}>Ajouter un article</Button>
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer la demande</Button>
            </div>
        </form>
    );
};

export default MaterialRequestForm;