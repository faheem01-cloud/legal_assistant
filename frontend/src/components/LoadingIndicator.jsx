// LoadingIndicator.jsx - Multi-phase legal research synthesis indicator
import React from 'react';
import { Scale, Sparkles, Database, Search } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function LoadingIndicator() {
  const { searchProgress } = useResearch();

  const getStageIcon = () => {
    switch (searchProgress.stage) {
      case 'search':
        return <Search size={16} className="spinner-gold" />;
      case 'retrieve':
        return <Database size={16} className="spinner-gold" />;
      case 'rerank':
      case 'generate':
      default:
        return <Sparkles size={16} className="spinner-gold" />;
    }
  };

  return (
    <div className="loading-indicator-card">
      <div className="loading-top">
        <div className="ai-badge-emblem">
          <Scale size={15} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="spinner-gold" />
          <span className="loading-stage-label">
            {searchProgress.message || 'Synthesizing evidence-grounded analysis...'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="pulse-skeleton-line" style={{ width: '92%' }} />
        <div className="pulse-skeleton-line" style={{ width: '84%' }} />
        <div className="pulse-skeleton-line" style={{ width: '68%' }} />
      </div>
    </div>
  );
}
