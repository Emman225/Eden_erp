
import React, { useState, useMemo } from 'react';
import { Revenue, Expense, ExpenseStatus, TransactionType } from '../../types';
import { dataService } from '../../data/mockDataService';
import Card from '../shared/Card';
import Button from '../shared/Button';
import { PlusIcon, EditIcon, DeleteIcon, CheckBadgeIcon } from '../icons/Icon';
import Modal from '../shared/Modal';
import ConfirmationDialog from '../shared/ConfirmationDialog';
import RevenueForm from '../finances/RevenueForm';
import ExpenseForm from '../finances/ExpenseForm';

const StatCard: React.FC<{ title: string; value: string; color: string }> = ({ title, value, color }) => (
    <Card className={`p-5 ${color}`}>
        <h4 className="text-sm font-medium text-white/80">{title}</h4>
        <p className="text-3xl font-bold text-white">{value}</p>
    </Card>
);

const RevenueTypeBadge: React.FC<{ type: TransactionType }> = ({ type }) => {
    const colors = {
        [TransactionType.Tithe]: 'bg-blue-100 text-blue-800',
        [TransactionType.Offering]: 'bg-green-100 text-green-800',
        [TransactionType.Contribution]: 'bg-yellow-100 text-yellow-800',
        [TransactionType.Donation]: 'bg-purple-100 text-purple-800',
        [TransactionType.Other]: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${colors[type]}`}>{type}</span>;
};

const ExpenseStatusBadge: React.FC<{ status: ExpenseStatus }> = ({ status }) => {
    const colors = {
        [ExpenseStatus.Pending]: 'bg-yellow-100 text-yellow-800',
        [ExpenseStatus.Approved]: 'bg-green-100 text-green-800',
        [ExpenseStatus.Rejected]: 'bg-red-100 text-red-800',
    };
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full inline-block ${colors[status]}`}>{status}</span>;
};


const FinanceManagementPage: React.FC = () => {
    const [revenues, setRevenues] = useState<Revenue[]>(dataService.getRevenues());
    const [expenses, setExpenses] = useState<Expense[]>(dataService.getExpenses());
    const [activeTab, setActiveTab] = useState<'revenues' | 'expenses'>('revenues');

    const [isRevenueModalOpen, setIsRevenueModalOpen] = useState(false);
    const [editingRevenue, setEditingRevenue] = useState<Revenue | null>(null);
    const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{ id: string; type: 'revenue' | 'expense' } | null>(null);

    const totals = useMemo(() => {
        const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
        const totalExpense = expenses.filter(e => e.status === ExpenseStatus.Approved).reduce((sum, e) => sum + e.amount, 0);
        return {
            revenue: totalRevenue,
            expense: totalExpense,
            balance: totalRevenue - totalExpense,
        };
    }, [revenues, expenses]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    // Revenue Handlers
    const handleOpenRevenueModal = (revenue: Revenue | null = null) => {
        setEditingRevenue(revenue);
        setIsRevenueModalOpen(true);
    };

    const handleSaveRevenue = (data: Omit<Revenue, 'id'> | Revenue) => {
        if ('id' in data) {
            dataService.updateRevenue(data);
        } else {
            dataService.addRevenue(data as Omit<Revenue, 'id'>);
        }
        setRevenues([...dataService.getRevenues()]);
        setIsRevenueModalOpen(false);
    };

    // Expense Handlers
    const handleOpenExpenseModal = (expense: Expense | null = null) => {
        setEditingExpense(expense);
        setIsExpenseModalOpen(true);
    };

    const handleSaveExpense = (data: Omit<Expense, 'id'> | Expense) => {
        if ('id' in data) {
            dataService.updateExpense(data);
        } else {
            dataService.addExpense(data as Omit<Expense, 'id'>);
        }
        setExpenses([...dataService.getExpenses()]);
        setIsExpenseModalOpen(false);
    };

    const handleApproveExpense = (expense: Expense) => {
        const updatedExpense = { ...expense, status: ExpenseStatus.Approved };
        dataService.updateExpense(updatedExpense);
        setExpenses([...dataService.getExpenses()]);
    }

    // Delete Handlers
    const handleDeleteClick = (id: string, type: 'revenue' | 'expense') => {
        setDeletingItem({ id, type });
        setIsConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (!deletingItem) return;

        if (deletingItem.type === 'revenue') {
            dataService.deleteRevenue(deletingItem.id);
            setRevenues([...dataService.getRevenues()]);
        } else {
            dataService.deleteExpense(deletingItem.id);
            setExpenses([...dataService.getExpenses()]);
        }
        setIsConfirmOpen(false);
        setDeletingItem(null);
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">Tableau de Bord Financier</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total des Revenus" value={formatCurrency(totals.revenue)} color="bg-green-500" />
                <StatCard title="Total des Dépenses (Validées)" value={formatCurrency(totals.expense)} color="bg-red-500" />
                <StatCard title="Solde Actuel" value={formatCurrency(totals.balance)} color="bg-blue-500" />
            </div>

            <div>
                <div className="flex border-b border-gray-200">
                    <button onClick={() => setActiveTab('revenues')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'revenues' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Revenus
                    </button>
                    <button onClick={() => setActiveTab('expenses')} className={`py-2 px-4 text-sm font-medium ${activeTab === 'expenses' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                        Dépenses
                    </button>
                </div>

                <div className="mt-4">
                    {activeTab === 'revenues' && (
                        <Card>
                             <div className="p-4 flex justify-between items-center border-b">
                                <h3 className="font-semibold text-gray-700">Liste des Revenus</h3>
                                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenRevenueModal()}>
                                    Ajouter un revenu
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Source</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Mode Paiement</th>
                                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {revenues.map(r => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4"><RevenueTypeBadge type={r.type} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatCurrency(r.amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.paymentDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.sourceDescription}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.paymentMethod}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <button onClick={() => handleOpenRevenueModal(r)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                                    <button onClick={() => handleDeleteClick(r.id, 'revenue')} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                    {activeTab === 'expenses' && (
                        <Card>
                            <div className="p-4 flex justify-between items-center border-b">
                                <h3 className="font-semibold text-gray-700">Liste des Dépenses</h3>
                                <Button variant="primary" leftIcon={<PlusIcon className="w-4 h-4" />} onClick={() => handleOpenExpenseModal()}>
                                    Ajouter une dépense
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                               <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Description</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Montant</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Centre de Coût</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Statut</th>
                                            <th className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {expenses.map(e => (
                                            <tr key={e.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{e.description}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatCurrency(e.amount)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.expenseDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{e.costCenter}</td>
                                                <td className="px-6 py-4"><ExpenseStatusBadge status={e.status} /></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    {e.status === ExpenseStatus.Pending && (
                                                        <button onClick={() => handleApproveExpense(e)} className="text-green-600 hover:text-green-900" title="Valider"><CheckBadgeIcon className="w-5 h-5"/></button>
                                                    )}
                                                    <button onClick={() => handleOpenExpenseModal(e)} className="text-blue-600 hover:text-blue-900"><EditIcon /></button>
                                                    <button onClick={() => handleDeleteClick(e.id, 'expense')} className="text-red-600 hover:text-red-900"><DeleteIcon /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Modal isOpen={isRevenueModalOpen} onClose={() => setIsRevenueModalOpen(false)} title={editingRevenue ? "Modifier un revenu" : "Ajouter un revenu"}>
                <RevenueForm revenue={editingRevenue} onSave={handleSaveRevenue} onCancel={() => setIsRevenueModalOpen(false)} />
            </Modal>

            <Modal isOpen={isExpenseModalOpen} onClose={() => setIsExpenseModalOpen(false)} title={editingExpense ? "Modifier une dépense" : "Ajouter une dépense"}>
                <ExpenseForm expense={editingExpense} onSave={handleSaveExpense} onCancel={() => setIsExpenseModalOpen(false)} />
            </Modal>
            
            <ConfirmationDialog 
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Confirmer la suppression"
                message="Êtes-vous sûr de vouloir supprimer cette transaction ? Cette action est irréversible."
            />
        </div>
    );
};

export default FinanceManagementPage;