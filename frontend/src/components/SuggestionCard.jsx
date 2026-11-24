// SuggestionCard.jsx - Suggestion card on welcome/landing screen
import React from 'react';
import { Scale, BookOpen, FileSearch, ArrowRight } from 'lucide-react';

export default function SuggestionCard({ item, onClick }) {
  const getIcon = (id) => {
    switch (id) {
      case 'rights':
        return <Scale size={20} />;
      case 'section':
        return <BookOpen size={20} />;
      case 'document':
        return <FileSearch size={20} />;
      default:
        return <Scale size={20} />;
    }
  };

  return (
    <div
      className="suggestion-card"
      onClick={() => onClick(item.prompt)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(item.prompt);
        }
      }}
    >
      <div className="card-icon-wrap">
        {getIcon(item.id)}
      </div>
      <h3 className="card-title">{item.title}</h3>
      <p className="card-desc">{item.description}</p>
      <div style={{ marginTop: 'auto', paddingTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, color: 'var(--gold-600)' }}>
        <span>Explore query</span>
        <ArrowRight size={13} />
      </div>
    </div>
  );
}
