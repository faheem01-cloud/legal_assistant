// HistoryPage.jsx - Research session archive with search, filtering, and session resumption
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Clock,
  Search,
  Plus,
  Trash2,
  ArrowRight,
  MessageSquare,
  BookMarked,
  Filter
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

export default function HistoryPage() {
  const { historyList, loadHistoryItem, handleDeleteHistory, startNewResearch } = useResearch();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  const navigate = useNavigate();

  const handleResume = (item) => {
    loadHistoryItem(item);
    navigate('/');
  };

  const handleStartNew = () => {
    startNewResearch();
    navigate('/');
  };

  const categories = ['All', 'Contract Law', 'Banking & NI Act', 'Consumer Protection', 'Cyber Law', 'Property & Tenancy'];

  const filteredHistory = historyList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.preview || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedFilter === 'All' ||
      (item.category && item.category.toLowerCase().includes(selectedFilter.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="history-page-container">
      <div className="history-inner">
        {/* Banner */}
        <div className="page-header-banner" style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h2 className="page-banner-title">Research History & Session Logs</h2>
            <p className="page-banner-desc">
              Review and resume prior legal inquiries, statutory analyses, and retrieved citations stored locally in your browser.
            </p>
          </div>

          <button
            type="button"
            className="send-query-btn"
            onClick={handleStartNew}
            style={{ flexShrink: 0 }}
          >
            <Plus size={15} strokeWidth={2.5} />
            <span>New Research</span>
          </button>
        </div>

        {/* Search & Filter Toolbar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="library-search-bar">
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="library-search-input"
              placeholder="Search past research queries or legal provisions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ fontSize: '12px', color: 'var(--text-muted)' }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="category-filter-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`cat-pill ${selectedFilter === cat ? 'active' : ''}`}
                onClick={() => setSelectedFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredHistory.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '10px', border: '1px solid var(--border-light)' }}>
              <Clock size={32} style={{ color: 'var(--gold-500)', margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--navy-900)' }}>
                No research sessions found
              </h3>
              <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', marginTop: '4px' }}>
                Launch a legal inquiry from the assistant to start building your research audit trail.
              </p>
              <button
                type="button"
                className="btn-new-research"
                style={{ maxWidth: '220px', margin: '18px auto 0', background: 'var(--navy-900)', color: '#fff' }}
                onClick={handleStartNew}
              >
                <Plus size={15} />
                <span>Start New Research</span>
              </button>
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="history-item-card"
                onClick={() => handleResume(item)}
              >
                <div className="history-card-content">
                  <div className="history-title-row">
                    <span className="history-title">{item.title}</span>
                    {item.category && (
                      <span className="history-cat-badge">{item.category}</span>
                    )}
                  </div>

                  <p className="history-preview-text">
                    "{item.preview}"
                  </p>

                  <div className="history-meta-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {item.date}
                    </span>
                    {item.sourcesCount > 0 && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--gold-600)', fontWeight: 600 }}>
                        <BookMarked size={12} />
                        {item.sourcesCount} Verified Sources
                      </span>
                    )}
                  </div>
                </div>

                <div className="history-card-actions">
                  <button
                    type="button"
                    className="action-chip-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleResume(item);
                    }}
                    style={{ background: 'var(--bg-subtle)' }}
                    title="Resume research in workspace"
                  >
                    <span>Resume</span>
                    <ArrowRight size={13} />
                  </button>

                  <button
                    type="button"
                    className="btn-remove-file"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(item.id);
                    }}
                    title="Delete session"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <DisclaimerBanner />
      </div>
    </div>
  );
}
