import { useState, useEffect } from 'react';
import { LoginPage, RegisterPage } from './submodules/auth';
import { DashboardPage } from './submodules/dashboard';
import { CollaboratorsPage } from './submodules/collaborators';
import { ClientsPage } from './submodules/clients/components/ClientsPage';
import { AppLayout } from './components/AppLayout';
import { HistoryPage } from './submodules/history/components/HistoryPage';
import { AgendaPage } from './submodules/agenda/components/AgendaPage';
import { WorkOrdersPage } from './submodules/work-orders';
import { MachineryPage } from './submodules/machinery';
import type { ThemeMode } from './styles/theme';

export function App() {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'app'>('app');
  const [activeMenuItem, setActiveMenuItem] = useState<string>('work-orders');
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [loggedUser, setLoggedUser] = useState<string | null>('joao.silva@morrogrande.com.br');

  useEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  const toggleTheme = () => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const handleLogout = () => {
    setLoggedUser(null);
    setCurrentView('login');
  };

  if (currentView === 'app') {
    return (
      <AppLayout
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        activeItem={activeMenuItem}
        onSelectMenuItem={(item) => setActiveMenuItem(item)}
        user={{
          name: loggedUser ? loggedUser.split('@')[0].replace('.', ' ') : 'João Silva',
          role: 'Gerente Agrícola',
        }}
        onLogout={handleLogout}
      >
        {activeMenuItem === 'dashboard' ? (
          <DashboardPage
            themeMode={themeMode}
            onNewWorkOrder={() => setActiveMenuItem('work-orders')}
            onGenerateReport={() => alert('Gerando Relatório Operacional em PDF...')}
          />
        ) : activeMenuItem === 'work-orders' || activeMenuItem === 'ordens-de-servico' ? (
          <WorkOrdersPage
            themeMode={themeMode}
          />
        ) : activeMenuItem === 'machinery' || activeMenuItem === 'maquinarios' || activeMenuItem === 'maquinario' ? (
          <MachineryPage
            themeMode={themeMode}
          />
        ) : activeMenuItem === 'collaborators' ? (
          <CollaboratorsPage
            themeMode={themeMode}
            onExportCSV={() => alert('Exportando lista de colaboradores em CSV...')}
          />
        ) : activeMenuItem === 'clients' ? (
          <ClientsPage
            themeMode={themeMode}
            onExportCSV={() => alert('Exportando lista de clientes em CSV...')}
          />
        ) : activeMenuItem === 'history' ? (
          <HistoryPage
            themeMode={themeMode}
          />
        ) : activeMenuItem === 'agenda' || activeMenuItem === 'agenda-calendario' || activeMenuItem === 'calendario' ? (
          <AgendaPage
            themeMode={themeMode}
          />
        ) : (
          <AgendaPage
            themeMode={themeMode}
          />
        )}
      </AppLayout>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Floating Toolbar */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-neutral-800/90 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs shadow-lg border border-neutral-700">
        <span className="font-mono text-neutral-300">Tema:</span>
        <button
          type="button"
          onClick={toggleTheme}
          className="px-2.5 py-1 rounded-full bg-[#2d7044] hover:bg-[#255d38] font-medium transition-colors cursor-pointer"
        >
          {themeMode === 'light' ? '☀️ Light' : '🌙 Dark'}
        </button>
        <button
          type="button"
          onClick={() => setCurrentView('app')}
          className="px-2.5 py-1 rounded-full bg-blue-600 hover:bg-blue-500 font-medium transition-colors cursor-pointer ml-1"
        >
          Ver Drawer ➔
        </button>
      </div>

      {currentView === 'login' ? (
        <LoginPage
          themeMode={themeMode}
          onNavigateToRegister={() => setCurrentView('register')}
          onLoginSuccess={(email) => {
            setLoggedUser(email);
            setCurrentView('app');
          }}
        />
      ) : (
        <RegisterPage
          themeMode={themeMode}
          onNavigateToLogin={() => setCurrentView('login')}
          onRegisterSuccess={(email) => {
            setLoggedUser(email);
            setCurrentView('app');
          }}
        />
      )}
    </div>
  );
}

export default App;