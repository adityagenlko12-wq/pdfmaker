import React, { useState, useEffect } from 'react';
// @ts-ignore
import { SiteProvider, useSite } from './cms/SiteContext';
// @ts-ignore
import { TOOLS_CONFIG } from './data/toolsCatalog';
// @ts-ignore
import Header from './components/Header';
// @ts-ignore
import Footer from './components/Footer';
// @ts-ignore
import ImpersonationBanner from './components/ImpersonationBanner';
import { PopupAdsBanner } from './components/PopupAdsBanner';
import { ToastHost } from './components/ToastHost';
// @ts-ignore
import HomePage from './pages/HomePage';
// @ts-ignore
import ToolPage from './pages/ToolPage';
// @ts-ignore
import PricingPage from './pages/PricingPage';
// @ts-ignore
import AccountPage from './pages/AccountPage';
// @ts-ignore
import AdminPage from './pages/AdminPage';
// @ts-ignore
import AuthModal from './pages/AuthModal';
import { Search, X } from 'lucide-react';

function AppContent() {
  const { user } = useSite();
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedToolId, setSelectedToolId] = useState<string>('merge-pdf');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Keyboard shortcut for Cmd+K / Ctrl+K quick tool launcher
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (page: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'login') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    if (page === 'register') {
      setAuthModalMode('register');
      setAuthModalOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleSelectTool = (toolId: string) => {
    setSelectedToolId(toolId);
    setCurrentPage('tool');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const searchResults = searchQuery.trim()
    ? (TOOLS_CONFIG || []).filter(
        (t: any) =>
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.category && t.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : (TOOLS_CONFIG || []).slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-gray-900 transition-colors">
      {/* 1. Admin Impersonation Banner */}
      <ImpersonationBanner />

      {/* 2. Top Preview Notification Popup Banner (strictly at top of screen) */}
      <PopupAdsBanner onNavigate={navigate} />

      {/* 3. Global Responsive Header */}
      <Header onNavigate={navigate} currentPage={currentPage} />

      {/* 4. Active Page Router */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            onSelectTool={handleSelectTool}
            onNavigatePricing={() => navigate('pricing')}
          />
        )}

        {currentPage === 'tool' && (
          <ToolPage
            toolId={selectedToolId}
            onBack={() => navigate('home')}
            onNavigatePricing={() => navigate('pricing')}
          />
        )}

        {currentPage === 'pricing' && (
          <PricingPage
            onNavigateHome={() => navigate('home')}
            onNavigateAccount={() => navigate('account')}
            onOpenAuth={() => {
              setAuthModalMode('login');
              setAuthModalOpen(true);
            }}
          />
        )}

        {currentPage === 'account' && (
          <AccountPage
            onNavigatePricing={() => navigate('pricing')}
            onNavigateHome={() => navigate('home')}
          />
        )}

        {currentPage === 'admin' && (
          <AdminPage onNavigateHome={() => navigate('home')} />
        )}
      </main>

      {/* 5. Global Comprehensive Footer */}
      <Footer onNavigate={navigate} />

      {/* 6. Toast Notifications Host */}
      <ToastHost />

      {/* 7. Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          if (currentPage === 'pricing') {
            // Keep on pricing
          } else {
            setCurrentPage('account');
          }
        }}
      />

      {/* 8. Quick Tool Search Modal (Cmd+K / Ctrl+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center p-4 pt-20 animate-in fade-in">
          <div className="w-full max-w-xl rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-3.5 border-b border-gray-100 flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                placeholder="Search across all 78 PDF tools (e.g. merge, compress, ocr)..."
                className="w-full text-xs sm:text-sm bg-transparent border-none text-gray-900 placeholder-gray-400 focus:outline-none"
              />
              <button
                onClick={() => setSearchModalOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto p-2 space-y-1">
              {searchResults.length > 0 ? (
                searchResults.map((tool: any) => (
                  <button
                    key={tool.id}
                    onClick={() => {
                      handleSelectTool(tool.id);
                      setSearchModalOpen(false);
                    }}
                    className="w-full p-2.5 rounded-xl hover:bg-blue-50/70 flex items-center justify-between text-left transition cursor-pointer group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600">
                        {tool.name}
                      </h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{tool.description}</p>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-600 shrink-0">
                      Step {tool.step}
                    </span>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center text-xs text-gray-500">
                  No matching tools found.
                </div>
              )}
            </div>

            <div className="p-2 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-[11px] text-gray-400 px-3">
              <span>Press <kbd className="px-1 py-0.5 rounded bg-gray-200 text-gray-700 font-mono">ESC</kbd> to close</span>
              <span>78 Real PDF Tools Available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
