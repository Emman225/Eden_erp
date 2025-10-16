import React, { useState, useMemo } from 'react';
import { MediaItem, MediaType } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon, SearchIcon, PhotoIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import MediaForm from '../media/MediaForm';

const MediaTypeBadge: React.FC<{ type: MediaType }> = ({ type }) => {
    const colors = {
        [MediaType.Video]: 'bg-red-100 text-red-800',
        [MediaType.Audio]: 'bg-blue-100 text-blue-800',
        [MediaType.Document]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-semibold rounded-full ${colors[type]}`}>{type}</span>;
};

const MediaLibraryPage: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(dataService.getMediaItems());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | MediaType>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredItems = useMemo(() => {
        return mediaItems
            .filter(item => filter === 'all' || item.type === filter)
            .filter(item => 
                item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
            );
    }, [mediaItems, filter, searchTerm]);

    const handleOpenModal = (item: MediaItem | null = null) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSave = (data: Omit<MediaItem, 'id'> | MediaItem) => {
        if ('id' in data) {
            dataService.updateMediaItem(data);
        } else {
            dataService.addMediaItem(data as Omit<MediaItem, 'id'>);
        }
        setMediaItems([...dataService.getMediaItems()]);
        setIsModalOpen(false);
    };

    const handleDeleteClick = (id: string) => {
        setDeletingId(id);
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingId) {
            dataService.deleteMediaItem(deletingId);
            setMediaItems([...dataService.getMediaItems()]);
        }
        setIsConfirmOpen(false);
        setDeletingId(null);
    };

    return (
        <div className="space-y-6">
            <div className="md:flex justify-between items-center space-y-4 md:space-y-0">
                <h2 className="text-xl font-semibold text-gray-700">Médiathèque</h2>
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </span>
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                        />
                    </div>
                    <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenModal()}>
                        Ajouter
                    </Button>
                </div>
            </div>

            <div className="flex space-x-2">
                <Button size="sm" variant={filter === 'all' ? 'primary' : 'secondary'} onClick={() => setFilter('all')}>Tous</Button>
                <Button size="sm" variant={filter === MediaType.Video ? 'primary' : 'secondary'} onClick={() => setFilter(MediaType.Video)}>Vidéos</Button>
                <Button size="sm" variant={filter === MediaType.Audio ? 'primary' : 'secondary'} onClick={() => setFilter(MediaType.Audio)}>Audios</Button>
                <Button size="sm" variant={filter === MediaType.Document ? 'primary' : 'secondary'} onClick={() => setFilter(MediaType.Document)}>Documents</Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <Card key={item.id} className="group relative">
                        <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-xl overflow-hidden">
                            {item.thumbnailUrl ? (
                                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center"><PhotoIcon className="w-12 h-12 text-gray-400" /></div>
                            )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-gray-800 truncate">{item.title}</h3>
                            <p className="text-xs text-gray-500">Par {item.uploader.prenom} le {item.uploadDate}</p>
                            <div className="mt-2 flex flex-wrap gap-1">
                                {item.tags.map(tag => <span key={tag} className="px-1.5 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600">{tag}</span>)}
                            </div>
                        </div>
                        <MediaTypeBadge type={item.type} />
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity space-x-1">
                            <Button size="sm" variant="secondary" onClick={() => handleOpenModal(item)} className="p-1 h-7 w-7"><EditIcon className="w-4 h-4"/></Button>
                            <Button size="sm" variant="danger" onClick={() => handleDeleteClick(item.id)} className="p-1 h-7 w-7"><DeleteIcon className="w-4 h-4"/></Button>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? "Modifier le média" : "Ajouter un média"}>
                <MediaForm mediaItem={editingItem} onSave={handleSave} onCancel={() => setIsModalOpen(false)} />
            </Modal>

            <ConfirmationDialog isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} onConfirm={handleConfirmDelete} title="Confirmer la suppression" message="Êtes-vous sûr de vouloir supprimer ce média ?" />
        </div>
    );
};

export default MediaLibraryPage;
