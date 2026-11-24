// Sidebar.jsx - Dark Navy Navigation and Session Management Sidebar
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Scale,
  Plus,
  MessageSquare,
  FileText,
  BookOpen,
  Clock,
  Settings,
  X,
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function Sidebar() {
  const {
    startNewResearch,
    historyList,
    activeSessionId,
    loadHistoryItem,
    handleDeleteHistory,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen
  } = useResearch();

  const navigate = useNavigate();

  const handleNewResearchClick = () => {
    startNewResearch();
    navigate('/');
    setIsMobileSidebarOpen(false);
  };

  const handleHistoryClick = (item) => {
    loadHistoryItem(item);
    navigate('/');
    setIsMobileSidebarOpen(false);
  };

  return (
    <>
      {isMobileSidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setIsMobileSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={`sidebar ${isMobileSidebarOpen ? 'mobile-open' : ''}`}>
        {/* Header & Logo */}
        <div className="sidebar-header">
          <div className="brand-wrapper">
            <div className="brand-icon-box">
              <Scale size={22} strokeWidth={2.2} />
            </div>
            <div className="brand-titles">
              <div className="brand-title">
                LegalMind <span className="brand-ai">AI</span>
              </div>
              <span className="brand-subtitle">AI LEGAL RESEARCH</span>
            </div>
            {isMobileSidebarOpen && (
              <button
                className="header-icon-btn"
                style={{ marginLeft: 'auto', background: 'transparent', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                onClick={() => setIsMobileSidebarOpen(false)}
                aria-label="Close sidebar"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* New Research Button */}
        <div className="new-research-btn-wrap">
          <button className="btn-new-research" onClick={handleNewResearchClick}>
            <Plus size={16} strokeWidth={2.5} />
            <span>New Research</span>
          </button>
        </div>

        {/* Core Navigation Links */}
        <nav className="sidebar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <MessageSquare size={17} />
            <span>Legal Assistant</span>
          </NavLink>

          <NavLink
            to="/document-analysis"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <FileText size={17} />
            <span>Document Analysis</span>
          </NavLink>

          <NavLink
            to="/library"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <BookOpen size={17} />
            <span>Legal Library</span>
          </NavLink>

          <NavLink
            to="/history"
            className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <Clock size={17} />
            <span>Research History</span>
          </NavLink>
        </nav>

        {/* Recent Conversations */}
        <div className="sidebar-recents-section">
          <span className="section-label">Recent Inquiries</span>
          <div className="recent-chat-list">
            {historyList.length === 0 ? (
              <div style={{ padding: '8px 10px', fontSize: '12px', color: 'rgba(255,255,255,0.4)' }}>
                No recent sessions
              </div>
            ) : (
              historyList.slice(0, 7).map((item) => (
                <div
                  key={item.id}
                  className={`recent-chat-item ${activeSessionId === item.id ? 'active' : ''}`}
                  onClick={() => handleHistoryClick(item)}
                  title={item.title}
                  role="button"
                  tabIndex={0}
                >
                  <MessageSquare size={13} style={{ flexShrink: 0, opacity: 0.6 }} />
                  <span className="recent-chat-text">{item.title}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(item.id);
                    }}
                    style={{ opacity: 0.4, padding: '2px', display: 'flex', color: 'inherit' }}
                    title="Remove item"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Profile & Settings Footer */}
        <div className="sidebar-footer">
          <button className="settings-btn" onClick={() => alert('Settings: ChromaDB local vector store index v1.4 • Indian Central Legislation 2024 active.')}>
            <Settings size={15} />
            <span>System Settings</span>
          </button>

          <div className="user-profile-row">
            <div className="user-avatar-badge">RS</div>
            <div className="user-meta">
              <span className="user-name">Adv. Rajesh Sharma</span>
              <span className="user-role">Bar Council of India • D/1482/2012</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
