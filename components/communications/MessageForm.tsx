import React, { useState } from 'react';
import { Message, Member, Group } from '../../types';
import { dataService } from '../../data/mockDataService';
import Select from '../shared/forms/Select';
import Input from '../shared/forms/Input';
import Button from '../shared/Button';

interface MessageFormProps {
  onSave: (data: Omit<Message, 'id' | 'status' | 'sentAt'>) => void;
  onCancel: () => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSave, onCancel }) => {
  const [channel, setChannel] = useState<'SMS' | 'Email'>('SMS');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [recipientType, setRecipientType] = useState<'all' | 'group'>('all');
  const [selectedGroupId, setSelectedGroupId] = useState('');

  const allMembers = dataService.getMembers();
  const allGroups = dataService.getGroups();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let recipients: Member[] = [];
    if (recipientType === 'all') {
      recipients = allMembers;
    } else if (recipientType === 'group') {
      const group = allGroups.find(g => g.id === selectedGroupId);
      recipients = group ? group.members : [];
    }

    onSave({
      tenantId: 't1',
      channel,
      subject: channel === 'Email' ? subject : undefined,
      content,
      recipients,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Select label="Canal" name="channel" value={channel} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChannel(e.target.value as 'SMS' | 'Email')}>
            <option value="SMS">SMS</option>
            <option value="Email">Email</option>
          </Select>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Destinataires</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="radio" value="all" checked={recipientType === 'all'} onChange={() => setRecipientType('all')} className="form-radio" />
                <span className="ml-2">Tous les membres</span>
              </label>
              <label className="flex items-center">
                <input type="radio" value="group" checked={recipientType === 'group'} onChange={() => setRecipientType('group')} className="form-radio" />
                <span className="ml-2">Un groupe spécifique</span>
              </label>
            </div>
          </div>
          {recipientType === 'group' && (
            <Select label="Groupe" name="groupId" value={selectedGroupId} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGroupId(e.target.value)}>
              {allGroups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </Select>
          )}
        </div>
        <div className="md:col-span-2 space-y-4">
          {channel === 'Email' && (
            <Input label="Sujet" name="subject" value={subject} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSubject(e.target.value)} required />
          )}
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Contenu du message
            </label>
            <textarea
              id="content"
              name="content"
              rows={10}
              value={content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" variant="primary">Envoyer</Button>
      </div>
    </form>
  );
};

export default MessageForm;