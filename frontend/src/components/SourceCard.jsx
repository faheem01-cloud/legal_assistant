// SourceCard.jsx - Individual citation card with relevance score & excerpt
import React from 'react';
import { BookOpen, ExternalLink, Scale, CheckCircle2 } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function SourceCard({ source }) {
  const { setSelectedSourceForModal } = useResearch();

  return (
    <div className="source-card">
      <div className="source-card-top">
        <h4 className="source-act-title">{source.title}</h4>
        <span className="relevance-score-badge" title="Mock Vector Cosine Similarity Score">
          {source.relevanceScore}% Match
        </span>
      </div>

      <div className="source-meta-row">
        <span style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{source.act}</span>
        {source.section && <span>•</span>}
        {source.section && <span className="source-section-tag">{source.section}</span>}
      </div>

      {source.page && (
        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          {source.citation || source.page}
        </div>
      )}

      {source.excerpt && (
        <div className="source-passage-excerpt">
          "{source.excerpt}"
        </div>
      )}

      <button
        className="btn-view-source"
        onClick={() => setSelectedSourceForModal(source)}
        title="View full statutory provision or judgment excerpt"
      >
        <span>View Full Statute / Citation</span>
        <ExternalLink size={12} />
      </button>
    </div>
  );
}
