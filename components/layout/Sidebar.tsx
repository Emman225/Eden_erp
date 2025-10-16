import React from 'react';
import { Page } from '../../types';
import { 
    ChurchIcon, DashboardIcon, UsersIcon, BuildingIcon, ShieldIcon, 
    CalendarIcon, ClipboardIcon, BriefcaseIcon, CashIcon, TruckIcon, 
    MegaphoneIcon, HeartIcon, VideoIcon, HandIcon, BellIcon, ChartBarIcon,
    UserGroupIcon
} from '../icons/Icon';

interface SidebarProps {
  currentPage: Page;
  setPage: (page: Page) => void;
}

interface NavItemProps {
    page: Page;
    label: string;
    icon: React.ReactNode;
    currentPage: Page;
    setPage: (page: Page) => void;
}

const NavItem: React.FC<NavItemProps> = ({ page, label, icon, currentPage, setPage }) => (
    <a
        href="#"
        onClick={(e) => { e.preventDefault(); setPage(page); }}
        className={`flex items-center px-4 py-2.5 text-sm font-medium transition-colors duration-200 rounded-lg ${
            currentPage === page 
                ? 'bg-blue-600 text-white' 
                : 'text-slate-300 hover:bg-slate-700 hover:text-white'
        }`}
    >
        {icon}
        <span className="ml-3">{label}</span>
    </a>
);

const PhaseTitle: React.FC<{ title: string }> = ({ title }) => (
    <h3 className="px-4 pt-4 pb-1 text-xs font-bold text-slate-500 uppercase tracking-wider">{title}</h3>
);


const Sidebar: React.FC<SidebarProps> = ({ currentPage, setPage }) => {
    const iconClass = "w-5 h-5";

    const sidebarStructure = [
        {
            phase: 'Statistiques et rapports',
            items: [
                { label: 'DASHBOARD', page: 'Tableau de bord', icon: <ChartBarIcon className={iconClass} /> },
            ]
        },
        {
            phase: 'Fondations & Authentification',
            items: [
                { label: 'ADMIN PARAMETRAGE', page: 'Gestion des Utilisateurs', icon: <UsersIcon className={iconClass} /> },
                { label: 'SECURITE', page: 'Gestion des Rôles', icon: <ShieldIcon className={iconClass} /> },
                { label: 'MULTI-EGLISE', page: 'Gestion des Églises', icon: <BuildingIcon className={iconClass} /> },
            ]
        },
        {
            phase: 'Gestion des données de base',
            items: [
                { label: 'GESTION MEMBRE', page: 'Gestion des Membres', icon: <UsersIcon className={iconClass} /> },
                { label: 'GROUPES', page: 'Gestion des Groupes', icon: <UserGroupIcon className={iconClass} /> },
                { label: 'GESTION PERSONNEL', page: 'Gestion du Personnel', icon: <BriefcaseIcon className={iconClass} /> },
            ]
        },
        {
            phase: 'Activités et interactions',
            items: [
                { label: 'EVENEMENT', page: 'Planning', icon: <CalendarIcon className={iconClass} /> },
                { label: 'PRESENCE', page: 'Suivi des Présences', icon: <ClipboardIcon className={iconClass} /> },
                { label: 'FORMATIONS', page: 'Formations', icon: <BriefcaseIcon className={`${iconClass} opacity-75`} /> },
            ]
        },
        {
            phase: 'Finances et logistique',
            items: [
                { label: 'FINANCES', page: 'Finances', icon: <CashIcon className={iconClass} /> },
                { label: 'MATERIEL & LOGISTIQUE', page: 'Logistique', icon: <TruckIcon className={iconClass} /> },
            ]
        },
        {
            phase: 'Communication & CRM',
            items: [
                { label: 'COMMUNICATION', page: 'Communication', icon: <MegaphoneIcon className={iconClass} /> },
                { label: 'NOTIFICATION & APP MOBILE', page: 'Notifications', icon: <BellIcon className={iconClass} /> },
                { label: 'SUIVI NOUVEAU FIDELE', page: 'Suivi des Nouveaux', icon: <HeartIcon className={iconClass} /> },
            ]
        },
        {
            phase: 'Médiathèque & Volontariat',
            items: [
                { label: 'MEDIATHEQUE', page: 'Médiathèque', icon: <VideoIcon className={iconClass} /> },
                { label: 'VOLONTAIRE & EQUIPE PROJET', page: 'Bénévolat', icon: <HandIcon className={iconClass} /> },
            ]
        }
    ];

  return (
    <aside className="w-64 flex-shrink-0 bg-slate-900 border-r border-slate-700 flex flex-col rounded-tr-lg">
        <div className="h-16 flex items-center justify-center px-6 border-b border-slate-700">
            <ChurchIcon className="h-8 w-8 text-blue-500" />
            <span className="ml-3 text-xl font-bold text-white">Eglise-Tech</span>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
             {sidebarStructure.map(phase => (
                <div key={phase.phase}>
                    <PhaseTitle title={phase.phase} />
                    <div className="space-y-1">
                        {phase.items.map(item => (
                            <NavItem 
                                key={item.page}
                                page={item.page}
                                label={item.label}
                                icon={item.icon}
                                currentPage={currentPage}
                                setPage={setPage}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </nav>
    </aside>
  );
};

export default Sidebar;