
import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="p-6">
        <p className="text-gray-600">{message}</p>
      </div>
      <div className="flex justify-end p-4 bg-gray-50 border-t rounded-b-lg space-x-2">
        <Button variant="secondary" onClick={onClose}>Annuler</Button>
        <Button variant="danger" onClick={onConfirm}>Confirmer</Button>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;
