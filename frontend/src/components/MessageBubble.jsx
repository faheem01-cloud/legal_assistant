// MessageBubble.jsx - Structured presentation of user queries and AI legal synthesis
import React, { useState } from 'react';
import {
  Scale,
  Copy,
  Check,
  BookMarked,
  Download,
  AlertTriangle,
  FileText,
  ListOrdered,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';

export default function MessageBubble({ message }) {
  const [copied, setCopied] = useState(false);
  const { setIsSourcesPanelOpen, setSelectedSourceForModal } = useResearch();

  // If user message
  if (message.sender === 'user') {
    return (
      <div className="msg-user-row">
        <div className="msg-user-bubble">
          <div>{message.text}</div>
          <div className="msg-user-time">{message.timestamp}</div>
        </div>
      </div>
    );
  }

  // If error message
  if (message.isError) {
    return (
      <div className="msg-ai-card" style={{ borderColor: '#fca5a5' }}>
        <div className="ai-card-body" style={{ color: '#991b1b' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
            <AlertTriangle size={18} />
            <span>Research Error</span>
          </div>
          <p>{message.text}</p>
        </div>
      </div>
    );
  }

  const { data, timestamp } = message;
  if (!data) return null;

  const handleCopy = () => {
    const fullText = `LegalMind AI Research Summary:\n\nShort Answer:\n${data.shortAnswer}\n\nExplanation:\n${data.explanation}\n\nRelevant Provisions:\n${(data.provisions || []).map((p) => `${p.act} - ${p.section}: ${p.summary}`).join('\n')}\n\nNext Steps:\n${(data.steps || []).join('\n')}\n\nDisclaimer:\n${data.disclaimer}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportText = () => {
    const fullText = `LegalMind AI Legal Research Memo\nGenerated: ${new Date().toLocaleString()}\n\nSUMMARY\n=======\n${data.shortAnswer}\n\nLEGAL ANALYSIS & EXPLANATION\n===========================\n${data.explanation}\n\nRELEVANT STATUTORY PROVISIONS\n============================\n${(data.provisions || []).map((p) => `• ${p.act} (${p.section})\n  ${p.title}\n  ${p.summary}\n`).join('\n')}\n\nRECOMMENDED ACTIONS FOR COUNSEL / CLIENT\n=========================================\n${(data.steps || []).map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nDISCLAIMER\n==========\n${data.disclaimer}`;
    
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LegalMind_Memo_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="msg-ai-card">
      {/* Header bar of AI Card */}
      <div className="ai-card-header">
        <div className="ai-agent-meta">
          <div className="ai-badge-emblem">
            <Scale size={15} />
          </div>
          <div>
            <span className="ai-agent-name">LegalMind AI</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
              {timestamp}
            </span>
          </div>
        </div>

        <div className="ai-verified-tag">
          {data.model ? `Model: ${data.model}` : 'Evidence-Grounded'}
        </div>
      </div>

      {/* Structured Content Body */}
      <div className="ai-card-body">
        {/* If raw answer without structured sections */}
        {!data.shortAnswer && !data.explanation && (data.rawAnswer || data.answer) && (
          <div className="ai-section-block">
            <div className="ai-section-title">
              <Scale size={14} />
              <span>Legal Analysis</span>
            </div>
            <div className="explanation-text" style={{ whiteSpace: 'pre-line' }}>
              {data.rawAnswer || data.answer}
            </div>
          </div>
        )}

        {/* 1. Short Answer */}
        {data.shortAnswer && (
          <div className="ai-section-block">
            <div className="ai-section-title">
              <Scale size={14} />
              <span>Short Answer</span>
            </div>
            <div className="short-answer-callout">
              {data.shortAnswer}
            </div>
          </div>
        )}

        {/* 2. Detailed Explanation */}
        {data.explanation && (
          <div className="ai-section-block">
            <div className="ai-section-title">
              <FileText size={14} />
              <span>Legal Explanation & Context</span>
            </div>
            <div className="explanation-text" style={{ whiteSpace: 'pre-line' }}>
              {data.explanation}
            </div>
          </div>
        )}

        {/* 3. Relevant Legal Provisions */}
        {data.provisions && data.provisions.length > 0 && (
          <div className="ai-section-block">
            <div className="ai-section-title">
              <BookOpen size={14} />
              <span>Relevant Legal Provisions</span>
            </div>
            <div className="provisions-list">
              {data.provisions.map((item, idx) => (
                <div key={idx} className="provision-card">
                  <div className="provision-header">
                    <span className="provision-act">{item.act}</span>
                    <span className="provision-section-badge">{item.section}</span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' }}>
                    {item.title}
                  </div>
                  <div className="provision-summary">{item.summary}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Steps the User May Consider */}
        {data.steps && data.steps.length > 0 && (
          <div className="ai-section-block">
            <div className="ai-section-title">
              <ListOrdered size={14} />
              <span>Steps the User May Consider</span>
            </div>
            <ol className="steps-checklist">
              {data.steps.map((step, idx) => (
                <li key={idx} className="step-item">
                  <span className="step-num">{idx + 1}</span>
                  <div>{step}</div>
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* 5. Legal Disclaimer */}
        {data.disclaimer && (
          <div className="legal-disclaimer-box">
            <AlertTriangle size={15} />
            <div>
              <strong>Legal Disclaimer:</strong> {data.disclaimer}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="ai-card-footer">
        <div className="response-actions-left">
          <button
            className="action-chip-btn"
            onClick={handleCopy}
            title="Copy structured response"
          >
            {copied ? <Check size={13} style={{ color: '#16a34a' }} /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            className="action-chip-btn"
            onClick={handleExportText}
            title="Export legal research memo"
          >
            <Download size={13} />
            <span>Export Memo</span>
          </button>
        </div>

        {data.sources && data.sources.length > 0 && (
          <button
            className="sources-pill-btn"
            onClick={() => setIsSourcesPanelOpen(true)}
            title="View primary statutory texts and judicial citations"
          >
            <BookMarked size={14} />
            <span>View {data.sources.length} Legal Sources</span>
            <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
}
