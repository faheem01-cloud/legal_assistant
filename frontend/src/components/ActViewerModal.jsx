// ActViewerModal.jsx - Deep-dive viewer for acts in the Legal Library
import React from 'react';
import { X, BookOpen, Search, ArrowRight, CheckCircle2, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResearch } from '../context/ResearchContext.jsx';

export default function ActViewerModal() {
  const { selectedActForModal, setSelectedActForModal, sendQuery } = useResearch();
  const navigate = useNavigate();

  if (!selectedActForModal) return null;

  const act = selectedActForModal;

  const handleQueryAct = (sectionQuery) => {
    setSelectedActForModal(null);
    navigate('/');
    sendQuery(`Explain ${sectionQuery} from ${act.title} with practical legal implications and judicial precedents.`);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setSelectedActForModal(null)}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card" style={{ maxWidth: '720px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="ai-badge-emblem">
              <BookOpen size={16} />
            </div>
            <div>
              <h3 className="modal-title">{act.title}</h3>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                {act.category} • Enacted {act.year} • {act.type}
              </div>
            </div>
          </div>

          <button
            className="header-icon-btn"
            style={{ width: '32px', height: '32px' }}
            onClick={() => setSelectedActForModal(null)}
            aria-label="Close act viewer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--gold-50)', border: '1px solid var(--border-gold)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: 'var(--gold-600)' }}>
              <Layers size={16} />
              <span>{act.chunksCount}</span>
            </div>
            <span className="act-tag">{act.badge}</span>
          </div>

          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--navy-900)', marginBottom: '6px' }}>
              Statutory Overview & Purpose
            </h4>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
              {act.description}
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--navy-900)', marginBottom: '10px' }}>
              Key Statutory Provisions & Landmark Sections
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {(act.keySections || []).map((sec, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'var(--bg-subtle)',
                    borderRadius: '6px',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--navy-900)' }}>
                    {sec}
                  </span>
                  <button
                    className="action-chip-btn"
                    onClick={() => handleQueryAct(sec)}
                    style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-light)' }}
                    title={`Analyze ${sec}`}
                  >
                    <span>Research Section</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Demo Indian Legal Library • Live API will sync full eGazette PDFs
            </span>

            <button
              className="send-query-btn"
              onClick={() => handleQueryAct('key provisions and scope')}
            >
              <Search size={14} />
              <span>Ask AI About This Act</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
