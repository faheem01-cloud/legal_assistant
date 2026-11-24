// SourceDetailModal.jsx - Modal viewer for full statutory provision and judicial citation
import React, { useEffect } from 'react';
import { X, BookOpen, Copy, Check, ExternalLink, ShieldAlert } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function SourceDetailModal() {
  const { selectedSourceForModal, setSelectedSourceForModal } = useResearch();
  const [copied, setCopied] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedSourceForModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setSelectedSourceForModal]);

  if (!selectedSourceForModal) return null;

  const src = selectedSourceForModal;

  const handleCopyText = () => {
    navigator.clipboard.writeText(`${src.act} - ${src.section || ''}\n${src.title}\n\n${src.fullText || src.excerpt}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="modal-overlay"
      onClick={() => setSelectedSourceForModal(null)}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={18} style={{ color: 'var(--gold-500)' }} />
            <div>
              <h3 className="modal-title">{src.act}</h3>
              {src.section && (
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  {src.section} • {src.category || 'Statutory Code'}
                </span>
              )}
            </div>
          </div>

          <button
            className="header-icon-btn"
            style={{ width: '32px', height: '32px' }}
            onClick={() => setSelectedSourceForModal(null)}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div className="modal-source-citation">
            <strong>Official Citation:</strong> {src.citation || src.page || 'Central Acts Repository'} • Relevance: {src.relevanceScore}%
          </div>

          <div>
            <h4 style={{ fontSize: '14.5px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '8px' }}>
              {src.title}
            </h4>
            <div className="modal-full-text">
              {src.fullText || src.excerpt}
            </div>
          </div>

          <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a', fontSize: '12px', color: '#92400e', display: 'flex', gap: '8px' }}>
            <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              <strong>Statutory Notice:</strong> This text is provided for mock demonstration purposes. Always cross-reference with official gazette notifications published by the Ministry of Law & Justice or High Court law reports.
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
            <button
              className="action-chip-btn"
              onClick={handleCopyText}
              style={{ background: 'var(--bg-subtle)' }}
            >
              {copied ? <Check size={14} style={{ color: '#16a34a' }} /> : <Copy size={14} />}
              <span>{copied ? 'Citation Copied' : 'Copy Citation Text'}</span>
            </button>

            <button
              className="send-query-btn"
              style={{ padding: '6px 14px', fontSize: '12.5px' }}
              onClick={() => setSelectedSourceForModal(null)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
