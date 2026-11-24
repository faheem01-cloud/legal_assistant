// SourcesPanel.jsx - Collapsible right-hand drawer displaying retrieved legal evidence
import React from 'react';
import { X, BookMarked, Info, Database } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';
import SourceCard from './SourceCard.jsx';

export default function SourcesPanel() {
  const { isSourcesPanelOpen, setIsSourcesPanelOpen, activeSources } = useResearch();

  if (!isSourcesPanelOpen) return null;

  return (
    <aside className="sources-panel" aria-label="Retrieved Legal Sources Panel">
      <div className="sources-panel-header">
        <div className="sources-panel-title">
          <BookMarked size={17} style={{ color: 'var(--gold-600)' }} />
          <span>Legal Evidence & Sources</span>
          <span className="sources-count-badge">{activeSources.length}</span>
        </div>

        <button
          className="header-icon-btn"
          style={{ width: '28px', height: '28px' }}
          onClick={() => setIsSourcesPanelOpen(false)}
          title="Close sources panel"
          aria-label="Close sources panel"
        >
          <X size={15} />
        </button>
      </div>

      <div style={{ padding: '10px 16px', background: '#fafbfc', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11.5px', color: 'var(--text-muted)' }}>
        <Database size={13} style={{ color: 'var(--gold-500)', flexShrink: 0 }} />
        <span>Indexed ChromaDB Chunks • Grounded Indian Law</span>
      </div>

      <div className="sources-list">
        {activeSources.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 16px', color: 'var(--text-muted)', fontSize: '13px' }}>
            No sources retrieved for current context yet. Submit a research query to view statutory citations.
          </div>
        ) : (
          activeSources.map((source) => (
            <SourceCard key={source.id} source={source} />
          ))
        )}
      </div>

      <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-light)', background: '#fffdf5', fontSize: '11px', color: '#854d0e', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
        <Info size={13} style={{ flexShrink: 0, marginTop: '2px' }} />
        <span>
          Demarcation Notice: These citations represent mock retrieval results. Legal provisions must be verified against official Government of India Gazette publications.
        </span>
      </div>
    </aside>
  );
}
