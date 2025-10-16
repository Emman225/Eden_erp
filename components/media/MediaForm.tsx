import React, { useState, useEffect } from 'react';
import { MediaItem, MediaType, User } from '../../types';
import { dataService } from '../../data/mockDataService';
import Input from '../shared/forms/Input';
import Select from '../shared/forms/Select';
import Button from '../shared/Button';

interface MediaFormProps {
  mediaItem: MediaItem | null;
  onSave: (data: Omit<MediaItem, 'id'> | MediaItem) => void;
  onCancel: () => void;
}

const MediaForm: React.FC<MediaFormProps> = ({ mediaItem, onSave, onCancel }) => {
    const users = dataService.getUsers();
    
    const initialFormState = {
        tenantId: 't1',
        title: '',
        type: MediaType.Video,
        description: '',
        url: '',
        thumbnailUrl: '',
        tags: '', // Storing tags as a comma-separated string for simplicity
        uploaderId: users[0]?.id || '',
        uploadDate: new Date().toISOString().split('T')[0],
    };
    
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (mediaItem) {
            setFormData({
                ...mediaItem,
                description: mediaItem.description || '',
                thumbnailUrl: mediaItem.thumbnailUrl || '',
                tags: mediaItem.tags.join(', '),
                uploaderId: mediaItem.uploader.id,
            });
        } else {
            setFormData(initialFormState);
        }
    }, [mediaItem]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const uploader = users.find(u => u.id === formData.uploaderId);
        if (!uploader) {
            alert("Uploader non trouvé !");
            return;
        }

        const { uploaderId, tags, ...rest } = formData;
        const saveData = {
            ...rest,
            tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
            uploader,
        };

        if (mediaItem) {
            onSave({ ...mediaItem, ...saveData });
        } else {
            onSave(saveData as Omit<MediaItem, 'id'>);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                <Input label="Titre" name="title" value={formData.title} onChange={handleChange} required />
                <Select label="Type de Média" name="type" value={formData.type} onChange={handleChange}>
                    {Object.values(MediaType).map(t => <option key={t} value={t}>{t}</option>)}
                </Select>
                 <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={3}
                        value={formData.description}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <Input label="URL du Média" name="url" type="url" placeholder="https://..." value={formData.url} onChange={handleChange} required />
                <Input label="URL de la Miniature (Optionnel)" name="thumbnailUrl" type="url" placeholder="https://..." value={formData.thumbnailUrl} onChange={handleChange} />
                <Input label="Tags (séparés par des virgules)" name="tags" value={formData.tags} onChange={handleChange} />
            </div>
            <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
                <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
                <Button type="submit" variant="primary">Enregistrer</Button>
            </div>
        </form>
    );
};

export default MediaForm;