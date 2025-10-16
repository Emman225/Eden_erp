
import React, { useState, useEffect } from 'react';
import { Revenue, TransactionType, PaymentMethod } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface RevenueFormProps {
  revenue: Revenue | null;
  onSave: (data: Omit<Revenue, 'id'> | Revenue) => void;
  onCancel: () => void;
}

const RevenueForm: React.FC<RevenueFormProps> = ({ revenue, onSave, onCancel }) => {
    const members = dataService.getMembers();
    const initialFormState = {
        tenantId: 't1',
        type: TransactionType.Offering,
        amount: '',
        paymentDate: new Date().toISOString().split('T')[0],
        sourceMemberId: 'ANONYMOUS',
        sourceDescription: '',
        paymentMethod: PaymentMethod.Cash,
        allocation: '',
        note: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (revenue) {
            setFormData({
                ...revenue,
                amount: String(revenue.amount),
                sourceMemberId: revenue.sourceMemberId || 'ANONYMOUS',
                allocation: revenue.allocation || '',
                note: revenue.note || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [revenue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        let sourceDescription = formData.sourceDescription;
        if (formData.sourceMemberId !== 'ANONYMOUS') {
            const member = members.find(m => m.id === formData.sourceMemberId);
            sourceDescription = member ? `${member.firstName} ${member.lastName}` : 'Membre inconnu';
        } else {
            sourceDescription = sourceDescription || 'Anonyme';
        }
        
        const saveData = {
            ...formData,
            amount: parseFloat(formData.amount),
            sourceMemberId: formData.sourceMemberId === 'ANONYMOUS' ? undefined : formData.sourceMemberId,
            sourceDescription,
        };
        
        if (revenue) {
            onSave({ ...revenue, ...saveData });
        } else {
            onSave(saveData as Omit<Revenue, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Type de Revenu" name="type" value={formData.type} onChange={handleChange}>
                        {Object.values(TransactionType).map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                    <Input label="Montant" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
                    <Input label="Date de paiement" name="paymentDate" type="date" value={formData.paymentDate} onChange={handleChange} required />
                     <Select label="Mode de paiement" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                        {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                    </Select>
                </div>
                 <Select label="Source (Membre)" name="sourceMemberId" value={formData.sourceMemberId} onChange={handleChange}>
                    <option value="ANONYMOUS">Anonyme</option>
                    {members.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
                </Select>
                 <Input label="Description de la source" name="sourceDescription" placeholder="Ex: Offrande du culte" value={formData.sourceDescription} required />
                 <Input label="Affectation (Optionnel)" name="allocation" placeholder="Ex: Projet de construction" value={formData.allocation} onChange={handleChange} />
                 <Input label="Note (Optionnel)" name="note" value={formData.note} onChange={handleChange} />
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default RevenueForm;