
import React, { useState } from 'react';
import { Message, MessageStatus } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import MessageForm from '../communications/MessageForm';

const MessageStatusBadge: React.FC<{ status: MessageStatus }> = ({ status }) => {
  const baseClasses = 'px-2.5 py-0.5 text-xs font-medium rounded-full inline-block';
  const statusClasses = {
    [MessageStatus.Sent]: 'bg-green-100 text-green-800',
    [MessageStatus.Draft]: 'bg-gray-100 text-gray-800',
    [MessageStatus.Failed]: 'bg-red-100 text-red-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const CommunicationPage: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>(dataService.getMessages());
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSaveMessage = (data: Omit<Message, 'id' | 'status' | 'sentAt'>) => {
        dataService.addMessage(data);
        setMessages([...dataService.getMessages()]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
           <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">Communication</h2>
                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => setIsModalOpen(true)}>
                    Nouveau Message
                </Button>
            </div>
            
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Canal</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Sujet / Contenu</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Destinataires</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date d'envoi</th>
                                <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                            </tr>
                        </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
                            {messages.map(msg => (
                                <tr key={msg.id}>
                                    <td className="px-6 py-4"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{msg.channel}</span></td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{msg.subject || 'N/A'}</div>
                                        <div className="text-xs text-gray-500 truncate max-w-xs">{msg.content}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{msg.recipients.length}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">{msg.sentAt}</td>
                                    <td className="px-6 py-4"><MessageStatusBadge status={msg.status} /></td>
                                </tr>
                            ))}
                         </tbody>
                    </table>
                     {messages.length === 0 && <p className="p-4 text-center text-gray-500">Aucun message envoyé.</p>}
                </div>
            </Card>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Envoyer un nouveau message" size="xl">
                <MessageForm onSave={handleSaveMessage} onCancel={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default CommunicationPage;