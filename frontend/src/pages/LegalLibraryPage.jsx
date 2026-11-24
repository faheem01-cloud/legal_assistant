// LegalLibraryPage.jsx - Indian Legislation and Precedents Repository Explorer
import React, { useState, useEffect } from 'react';
import {
  Search,
  BookOpen,
  Filter,
  Layers,
  ArrowRight,
  Database,
  ExternalLink,
  Info
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';
import { fetchLibrarySources } from '../services/legalService.js';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';

const CATEGORIES = [
  'All Categories',
  'Constitution of India',
  'Acts and legislation',
  'Criminal law',
  'Civil law',
  'Consumer rights',
  'Cyber law',
  'Judgments'
];

export default function LegalLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedActForModal } = useResearch();

  useEffect(() => {
    loadSources();
  }, [selectedCategory, searchQuery]);

  const loadSources = async () => {
    setIsLoading(true);
    try {
      const categoryFilter = selectedCategory === 'All Categories' ? 'all' : selectedCategory;
      const data = await fetchLibrarySources({ category: categoryFilter, search: searchQuery });
      setItems(data);
    } catch (err) {
      console.error('Failed to load library items:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="library-page-container">
      <div className="library-inner">
        {/* Banner */}
        <div className="page-header-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="ai-verified-tag">ChromaDB Corpus Index</span>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Indian Jurisprudence Core</span>
          </div>
          <h2 className="page-banner-title">Indian Legal Knowledge Library</h2>
          <p className="page-banner-desc">
            Explore statutory legislation, constitutional articles, modern penal codes (BNS 2023), and landmark Supreme Court citations indexed in the LegalMind AI knowledge base.
          </p>
        </div>

        {/* Demo Library Demarcation Banner */}
        <div style={{ padding: '12px 18px', background: 'var(--gold-50)', border: '1px solid var(--border-gold)', borderRadius: '8px', display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '12.5px', color: 'var(--gold-600)' }}>
          <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Demonstration Knowledge Base:</strong> This library presents curated central statutes and landmark rulings formatted for embedding and vector similarity retrieval. Live RAG integration will enable real-time synchronization with the Digital Sansad and Supreme Court e-Courts repository.
          </div>
        </div>

        {/* Search Bar */}
        <div className="library-search-bar">
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="library-search-input"
            placeholder="Search statutes, sections, keywords (e.g., 'breach', 'Section 138', 'privacy', 'cheating')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ fontSize: '12px', color: 'var(--text-muted)', padding: '2px 6px' }}
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="category-filter-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document Cards Grid */}
        <div className="library-cards-grid">
          {isLoading ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              Filtering Indian Legal Corpus...
            </div>
          ) : items.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', background: 'var(--bg-surface)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <BookOpen size={28} style={{ color: 'var(--gold-500)', margin: '0 auto 12px' }} />
              <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--navy-900)' }}>No legislation found matching your query</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Try searching for Contract, BNS, Cheque, or Privacy</div>
            </div>
          ) : (
            items.map((act) => (
              <div key={act.id} className="library-act-card">
                <div className="act-card-header">
                  <h3 className="act-title">{act.title}</h3>
                  <span className="act-tag">{act.type}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--gold-600)', fontWeight: 600 }}>
                  <Layers size={14} />
                  <span>{act.chunksCount}</span>
                </div>

                <p className="act-desc">{act.description}</p>

                {act.keySections && (
                  <div className="act-sections-list">
                    <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      Highlighted Provisions:
                    </span>
                    {act.keySections.slice(0, 3).map((sec, idx) => (
                      <div key={idx} className="section-pill-small">
                        • {sec}
                      </div>
                    ))}
                  </div>
                )}

                <div className="act-card-footer">
                  <span>Enacted {act.year}</span>
                  <button
                    className="btn-explore-act"
                    onClick={() => setSelectedActForModal(act)}
                  >
                    <span>Explore Act</span>
                    <ArrowRight size={13} />
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
