
import React, { useState, useEffect } from 'react';
import { Expense, PaymentMethod, ExpenseStatus } from '../../types';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface ExpenseFormProps {
  expense: Expense | null;
  onSave: (data: Omit<Expense, 'id'> | Expense) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ expense, onSave, onCancel }) => {
    const initialFormState = {
        tenantId: 't1',
        description: '',
        amount: '',
        beneficiary: '',
        expenseDate: new Date().toISOString().split('T')[0],
        costCenter: '',
        status: ExpenseStatus.Pending,
        paymentMethod: PaymentMethod.Cash,
        observation: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (expense) {
            setFormData({
                ...expense,
                amount: String(expense.amount),
                observation: expense.observation || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [expense]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const saveData = {
            ...formData,
            amount: parseFloat(formData.amount),
        };

        if (expense) {
            onSave({ ...expense, ...saveData });
        } else {
            onSave(saveData as Omit<Expense, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <Input label="Description" name="description" value={formData.description} onChange={handleChange} required />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Montant" name="amount" type="number" value={formData.amount} onChange={handleChange} required />
                    <Input label="Date de dépense" name="expenseDate" type="date" value={formData.expenseDate} onChange={handleChange} required />
                </div>
                <Input label="Bénéficiaire" name="beneficiary" value={formData.beneficiary} onChange={handleChange} required />
                <Input label="Centre de Coût" name="costCenter" placeholder="Ex: Département Sonorisation" value={formData.costCenter} onChange={handleChange} required />
                <Select label="Mode de paiement" name="paymentMethod" value={formData.paymentMethod} onChange={handleChange}>
                    {Object.values(PaymentMethod).map(m => <option key={m} value={m}>{m}</option>)}
                </Select>
                <Input label="Observation (Optionnel)" name="observation" value={formData.observation} onChange={handleChange} />
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default ExpenseForm;