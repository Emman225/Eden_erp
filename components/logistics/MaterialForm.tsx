import React, { useState, useEffect } from 'react';
import { Material, MaterialType, MaterialStatus } from '../../types';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface MaterialFormProps {
  material: Material | null;
  onSave: (data: Omit<Material, 'id'> | Material) => void;
  onCancel: () => void;
}

const MaterialForm: React.FC<MaterialFormProps> = ({ material, onSave, onCancel }) => {
    const initialFormState = {
        tenantId: 't1',
        name: '',
        type: MaterialType.Other,
        totalQuantity: 1,
        availableQuantity: 1,
        status: MaterialStatus.Good,
        location: '',
        description: '',
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (material) {
            setFormData({
                ...material,
                description: material.description || '',
            });
        } else {
            setFormData(initialFormState);
        }
    }, [material]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let finalValue: string | number = value;
        if(name === 'totalQuantity' || name === 'availableQuantity') {
            finalValue = parseInt(value, 10) || 0;
        }
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };
    
    const handleTotalQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const total = parseInt(e.target.value, 10) || 0;
        // Keep available quantity in sync if it's the first time setting total
        const currentTotal = material?.totalQuantity || 0;
        const diff = total - currentTotal;
        setFormData(prev => ({
            ...prev,
            totalQuantity: total,
            availableQuantity: prev.availableQuantity + diff > 0 ? prev.availableQuantity + diff : 0,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (formData.availableQuantity > formData.totalQuantity) {
            alert("La quantité disponible ne peut pas être supérieure à la quantité totale.");
            return;
        }

        if (material) {
            onSave({ ...material, ...formData });
        } else {
            onSave(formData as Omit<Material, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <Input label="Nom du Matériel" name="name" value={formData.name} onChange={handleChange} required />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Select label="Type" name="type" value={formData.type} onChange={handleChange}>
                        {Object.values(MaterialType).map(t => <option key={t} value={t}>{t}</option>)}
                    </Select>
                     <Select label="État" name="status" value={formData.status} onChange={handleChange}>
                        {Object.values(MaterialStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Quantité Totale" name="totalQuantity" type="number" value={formData.totalQuantity} onChange={handleTotalQuantityChange} min="0" required />
                    <Input label="Quantité Disponible" name="availableQuantity" type="number" value={formData.availableQuantity} onChange={handleChange} min="0" required />
                </div>
                 <Input label="Localisation" name="location" placeholder="Ex: Salle de son, Stock 1" value={formData.location} onChange={handleChange} required />
                 <Input label="Description (Optionnel)" name="description" value={formData.description} onChange={handleChange} />
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default MaterialForm;