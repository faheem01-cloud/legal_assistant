// ChatInput.jsx - Auto-expanding legal inquiry input with keyboard shortcuts
import React, { useRef, useEffect } from 'react';
import { Send, CornerDownLeft, Sparkles, RefreshCw } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function ChatInput({ value, onChange, onSubmit, onClear }) {
  const textareaRef = useRef(null);
  const { isSearching } = useResearch();

  // Auto-resize textarea height as user types
  useEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isSearching && value.trim()) {
        onSubmit();
      }
    }
  };

  return (
    <div className="chat-input-sticky">
      <div className="chat-input-box">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          rows={1}
          placeholder="Ask a question about Indian law (e.g., Section 73 Contract Act, Section 138 NI Act, or Consumer Protection)..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSearching}
        />

        <div className="chat-input-actions">
          <div className="input-hint-text">
            <span>Press <kbd style={{ padding: '1px 4px', background: '#e2e8f0', borderRadius: '3px', fontSize: '11px' }}>Enter</kbd> to research • <kbd style={{ padding: '1px 4px', background: '#e2e8f0', borderRadius: '3px', fontSize: '11px' }}>Shift + Enter</kbd> for new line</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {value.trim() && (
              <button
                type="button"
                className="action-chip-btn"
                onClick={() => onChange('')}
                title="Clear input"
                style={{ fontSize: '11.5px' }}
              >
                Clear
              </button>
            )}

            <button
              type="button"
              className="send-query-btn"
              onClick={onSubmit}
              disabled={isSearching || !value.trim()}
              title="Send legal research query"
            >
              <span>Research</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="disclaimer-caption-footer">
        Evidence-grounded retrieval • LegalMind AI produces research synthesis, not legal representation. Verify with official gazettes.
      </div>
    </div>
  );
}
