import React from 'react';
import { dataService } from '../../data/mockDataService';
import StatCard from '../dashboard/StatCard';
import BarChart from '../dashboard/BarChart';
import PieChart from '../dashboard/PieChart';
import Card from '../shared/Card';
import { UsersIcon, CashIcon, BuildingIcon, HeartIcon } from '../icons/Icon';
import { TransactionType } from '../../types';

const DashboardPage: React.FC = () => {
    const members = dataService.getMembers();
    const tenants = dataService.getTenants();
    const newcomers = dataService.getNewcomers();
    const revenues = dataService.getRevenues();
    const totalRevenue = revenues.reduce((sum, r) => sum + r.amount, 0);
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
    };

    const barChartData = [
        { name: 'Jan', value: 180 },
        { name: 'Fév', value: 210 },
        { name: 'Mar', value: 230 },
        { name: 'Avr', value: 220 },
        { name: 'Mai', value: 250 },
        { name: 'Juin', value: 240 },
    ];

    const pieChartData = [
        { name: TransactionType.Tithe, value: 450000, color: 'text-blue-500' },
        { name: TransactionType.Offering, value: 250000, color: 'text-green-500' },
        { name: TransactionType.Donation, value: 150000, color: 'text-purple-500' },
        { name: TransactionType.Other, value: 50000, color: 'text-gray-400' },
    ];


    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold text-gray-800">Tableau de bord</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Membres" value={String(members.length)} icon={<UsersIcon className="w-8 h-8"/>} color="text-blue-500" />
                <StatCard title="Total Revenus" value={formatCurrency(totalRevenue)} icon={<CashIcon className="w-8 h-8"/>} color="text-green-500" />
                <StatCard title="Églises / Sites" value={String(tenants.length)} icon={<BuildingIcon className="w-8 h-8"/>} color="text-indigo-500" />
                <StatCard title="Nouveaux Venus (30j)" value={String(newcomers.length)} icon={<HeartIcon className="w-8 h-8"/>} color="text-pink-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <div className="p-5">
                        <h3 className="font-semibold text-gray-700">Présences par mois</h3>
                        <BarChart data={barChartData} />
                    </div>
                </Card>
                 <Card>
                    <div className="p-5">
                        <h3 className="font-semibold text-gray-700">Répartition des revenus</h3>
                        <PieChart data={pieChartData} />
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default DashboardPage;