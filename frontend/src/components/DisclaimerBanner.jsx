// DisclaimerBanner.jsx - Reusable subtle legal disclaimer banner
import React from 'react';
import { ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="legal-disclaimer-box" style={{ margin: '8px 0' }}>
        <ShieldAlert size={14} />
        <div>
          <strong>Disclaimer:</strong> LegalMind AI is an informational legal technology assistant, not a licensed attorney. AI summaries may contain inaccuracies. Cross-reference all legal citations with official gazettes.
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: '12px 18px',
        backgroundColor: '#fffdf5',
        border: '1px solid rgba(197, 160, 89, 0.3)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        fontSize: '12.5px',
        lineHeight: 1.5,
        color: '#78581e'
      }}
    >
      <ShieldAlert size={18} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--gold-600)' }} />
      <div>
        <strong>Legal Safety & Regulatory Notice:</strong> LegalMind AI is an AI-powered legal research and document review platform designed solely to assist advocates, legal professionals, and individuals in finding relevant statutes and precedents. It does not provide legal representation, nor does it create an attorney-client relationship under the Advocates Act, 1961. Always consult an enrolled advocate for formal legal advice.
      </div>
    </div>
  );
}
