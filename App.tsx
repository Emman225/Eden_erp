import React, { useState } from 'react';
import { Page } from './types';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import LoginPage from './components/pages/LoginPage';
import DashboardPage from './components/pages/DashboardPage';
import TenantManagementPage from './components/pages/TenantManagementPage';
import MemberManagementPage from './components/pages/MemberManagementPage';
import UserManagementPage from './components/pages/UserManagementPage';
import RoleManagementPage from './components/pages/RoleManagementPage';
import AuditLogPage from './components/pages/AuditLogPage';
import GroupManagementPage from './components/pages/GroupManagementPage';
import StaffManagementPage from './components/pages/StaffManagementPage';
import PlanningPage from './components/pages/PlanningPage';
import AttendancePage from './components/pages/AttendancePage';
import TrainingPage from './components/pages/TrainingPage';
import FinanceManagementPage from './components/pages/FinanceManagementPage';
import LogisticsManagementPage from './components/pages/LogisticsManagementPage';
import CommunicationPage from './components/pages/CommunicationPage';
import NewcomerFollowUpPage from './components/pages/NewcomerFollowUpPage';
import MediaLibraryPage from './components/pages/MediaLibraryPage';
import VolunteerManagementPage from './components/pages/VolunteerManagementPage';
import NotificationPage from './components/pages/NotificationPage';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState<Page>('Tableau de bord');

  const handleLogin = () => {
    setIsLoggedIn(true);
    setPage('Tableau de bord');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setPage('Tableau de bord');
  };

  const renderPage = () => {
    switch (page) {
      case 'Tableau de bord':
        return <DashboardPage />;
      case 'Gestion des Églises':
        return <TenantManagementPage />;
      case 'Gestion des Membres':
        return <MemberManagementPage />;
      case 'Gestion des Utilisateurs':
          return <UserManagementPage />;
      case 'Gestion des Rôles':
          return <RoleManagementPage />;
      case 'Journal d\'Audit':
          return <AuditLogPage />;
      case 'Gestion des Groupes':
        return <GroupManagementPage />;
      case 'Gestion du Personnel':
        return <StaffManagementPage />;
      case 'Planning':
        return <PlanningPage />;
      case 'Suivi des Présences':
        return <AttendancePage />;
      case 'Formations':
        return <TrainingPage />;
      case 'Finances':
        return <FinanceManagementPage />;
      case 'Logistique':
        return <LogisticsManagementPage />;
      case 'Communication':
        return <CommunicationPage />;
      case 'Suivi des Nouveaux':
        return <NewcomerFollowUpPage />;
      case 'Médiathèque':
        return <MediaLibraryPage />;
      case 'Bénévolat':
        return <VolunteerManagementPage />;
      case 'Notifications':
        return <NotificationPage />;
      default:
        return <DashboardPage />;
    }
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar currentPage={page} setPage={setPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header page={page} onLogout={handleLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {renderPage()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;