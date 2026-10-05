import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CommandPalette from './components/CommandPalette';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import InvestigationWorkspacePage from './pages/InvestigationWorkspacePage';
import CasesPage from './pages/CasesPage';
import CaseWorkspacePage from './pages/CaseWorkspacePage';
import PersonsPage from './pages/PersonsPage';
import PersonProfilePage from './pages/PersonProfilePage';
import NetworkAnalysisPage from './pages/NetworkAnalysisPage';
import AiAnalysisPage from './pages/AiAnalysisPage';
import IncidentsPage from './pages/IncidentsPage';
import EvidencePage from './pages/EvidencePage';
import OrganizationsPage from './pages/OrganizationsPage';
import LocationsPage from './pages/LocationsPage';
import CrimeMapPage from './pages/CrimeMapPage';
import VehiclesPage from './pages/VehiclesPage';
import CommunicationsPage from './pages/CommunicationsPage';
import CrimeAnalyticsPage from './pages/CrimeAnalyticsPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import AuditLogsPage from './pages/AuditLogsPage';
import UsersPage from './pages/UsersPage';
import SettingsPage from './pages/SettingsPage';
import DataSourcesPage from './pages/DataSourcesPage';
import DataIntelligencePage from './pages/DataIntelligencePage';
import ExternalReviewPage from './pages/ExternalReviewPage';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    return localStorage.getItem('aegis_sidebar_collapsed') === 'true';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Selected item state for detail views
  const [selectedCaseNumber, setSelectedCaseNumber] = useState('CASE-2026-0001');
  const [selectedPersonId, setSelectedPersonId] = useState(null);

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('aegis_sidebar_collapsed', String(next));
      return next;
    });
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-intel-base text-cyan-400 relative overflow-hidden">
        {/* Subtle background radar circles */}
        <div className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/10 pointer-events-none animate-pulse-subtle"></div>
        <div className="absolute w-[400px] h-[400px] rounded-full border border-cyan-500/15 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col items-center gap-4 p-8 rounded-2xl bg-intel-card/80 border border-intel-border shadow-2xl backdrop-blur-xl">
          <div className="relative">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-cyan-glow"></span>
            </div>
          </div>
          <div className="text-center space-y-1">
            <div className="font-display font-bold text-sm tracking-wider uppercase text-slate-100">
              Aegis Intelligence Platform
            </div>
            <div className="font-mono text-xs text-cyan-400/80 tracking-wider">
              ESTABLISHING ENCRYPTED RELATIONAL GRAPH CORE...
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const navigateTo = (page, data = null) => {
    if (page === 'case-workspace' || page === 'case-detail') {
      if (data) setSelectedCaseNumber(data);
      setCurrentPage('case-workspace');
    } else if (page === 'person-profile' || page === 'person-detail') {
      if (data) setSelectedPersonId(data);
      setCurrentPage('person-profile');
    } else {
      setCurrentPage(page);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={navigateTo} />;
      case 'workspace':
        return <InvestigationWorkspacePage onNavigate={navigateTo} />;
      case 'ai-analysis':
      case 'ai-intelligence':
        return <AiAnalysisPage onNavigate={navigateTo} />;
      case 'cases':
        return (
          <CasesPage
            onNavigate={navigateTo}
            onSelectCase={(id) => navigateTo('case-workspace', id)}
          />
        );
      case 'case-workspace':
        return (
          <CaseWorkspacePage
            caseNumber={selectedCaseNumber}
            onNavigate={navigateTo}
          />
        );
      case 'persons':
        return (
          <PersonsPage
            onNavigate={navigateTo}
            onSelectPerson={(id) => navigateTo('person-profile', id)}
          />
        );
      case 'person-profile':
        return (
          <PersonProfilePage
            personId={selectedPersonId}
            onNavigate={navigateTo}
          />
        );
      case 'network':
        return <NetworkAnalysisPage onNavigate={navigateTo} />;
      case 'incidents':
        return <IncidentsPage onNavigate={navigateTo} />;
      case 'evidence':
        return <EvidencePage onNavigate={navigateTo} />;
      case 'organizations':
        return <OrganizationsPage onNavigate={navigateTo} />;
      case 'locations':
        return <LocationsPage onNavigate={navigateTo} />;
      case 'crime-map':
        return <CrimeMapPage onNavigate={navigateTo} />;
      case 'vehicles':
        return <VehiclesPage onNavigate={navigateTo} />;
      case 'communications':
        return <CommunicationsPage onNavigate={navigateTo} />;
      case 'analytics':
        return <CrimeAnalyticsPage onNavigate={navigateTo} />;
      case 'alerts':
        return <AlertsPage onNavigate={navigateTo} />;
      case 'reports':
        return <ReportsPage onNavigate={navigateTo} />;
      case 'audit-logs':
        return <AuditLogsPage onNavigate={navigateTo} />;
      case 'users':
        return <UsersPage onNavigate={navigateTo} />;
      case 'data-sources':
        return <DataSourcesPage onNavigate={navigateTo} />;
      case 'data-intelligence':
        return <DataIntelligencePage onNavigate={navigateTo} />;
      case 'external-review':
        return <ExternalReviewPage onNavigate={navigateTo} />;
      case 'settings':
        return <SettingsPage onNavigate={navigateTo} />;
      default:
        return <DashboardPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-intel-base text-slate-100 font-sans">
      {/* Tactical Classification Banner */}
      <div className="h-6 bg-intel-base border-b border-intel-border/60 flex items-center justify-between px-4 text-[10px] font-mono tracking-widest text-slate-400 select-none z-40">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 font-bold">●</span>
          <span className="text-slate-300 font-semibold">CLASSIFICATION: LAW ENFORCEMENT SENSITIVE // REL TO LE</span>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <span>STATION: AEGIS-HQ-01</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400">CIPHER: AES-256-GCM</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">DETERMINISTIC RBAC ACTIVE</span>
        </div>
      </div>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Global Tactical Sidebar */}
        <Sidebar
          currentPage={currentPage}
          onNavigate={navigateTo}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-intel-base">
          {/* Top Navbar */}
          <Navbar
            currentPage={currentPage}
            onNavigate={navigateTo}
            onOpenSearch={() => setIsCommandPaletteOpen(true)}
          />

          {/* Page Container */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-grid-pattern relative">
            <div className="max-w-[1720px] mx-auto w-full pb-8">
              {renderCurrentPage()}
            </div>
          </main>
        </div>
      </div>

      {/* Command Palette Modal (Ctrl + K / Cmd + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={navigateTo}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
