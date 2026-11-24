// Header.jsx - Top Header bar with breadcrumbs, mode indicator, and panel toggles
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, BookMarked, ShieldCheck, Sparkles, User } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function Header() {
  const location = useLocation();
  const {
    isSourcesPanelOpen,
    setIsSourcesPanelOpen,
    activeSources,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useResearch();

  const getPageMeta = () => {
    switch (location.pathname) {
      case '/document-analysis':
        return { title: 'Document Analysis', breadcrumb: 'Contracts & Notices' };
      case '/library':
        return { title: 'Legal Library', breadcrumb: 'Statutes & Precedents' };
      case '/history':
        return { title: 'Research History', breadcrumb: 'Past Sessions' };
      case '/':
      default:
        return { title: 'Legal Assistant', breadcrumb: 'Indian Law Research' };
    }
  };

  const meta = getPageMeta();

  return (
    <header className="top-header">
      <div className="header-left">
        <button
          className="mobile-toggle-btn header-icon-btn"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          aria-label="Toggle navigation menu"
        >
          <Menu size={18} />
        </button>

        <div className="header-title-section">
          <div className="header-breadcrumbs">
            <span>LegalMind AI</span>
            <span>/</span>
            <span className="breadcrumb-active">{meta.breadcrumb}</span>
          </div>
          <h1 className="page-main-title">{meta.title}</h1>
        </div>
      </div>

      <div className="header-right">
        {/* Research Mode Indicator */}
        <div className="mode-indicator-pill" title="Connected to Central Acts, BNS 2023, and Supreme Court Precedents">
          <span className="status-dot-pulse"></span>
          <span>Indian Law Corpus v2.4</span>
        </div>

        {/* Toggle Evidence Panel Button (Visible on Chat Page) */}
        {location.pathname === '/' && (
          <button
            className={`header-icon-btn ${isSourcesPanelOpen ? 'active' : ''}`}
            onClick={() => setIsSourcesPanelOpen(!isSourcesPanelOpen)}
            title="Toggle Legal Sources & Evidence Panel"
            style={{ width: 'auto', padding: '0 12px', gap: '6px' }}
          >
            <BookMarked size={16} />
            <span style={{ fontSize: '12px', fontWeight: 600 }}>
              Evidence ({activeSources.length})
            </span>
          </button>
        )}

        {/* Profile Avatar Quick Button */}
        <button
          className="header-icon-btn"
          title="Adv. Rajesh Sharma (Bar Council ID: D/1482/2012)"
          onClick={() => alert('Profile: Adv. Rajesh Sharma • Bar Council of India • Verified Practitioner')}
        >
          <User size={17} />
        </button>
      </div>
    </header>
  );
}
