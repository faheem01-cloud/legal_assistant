// UploadZone.jsx - Drag-and-drop file upload zone with sample documents and file picker
import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

export default function UploadZone({ onFileSelect, onSelectSample }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
    }
  };

  return (
    <div style={{ display: 'flex', flex_direction: 'column', gap: '14px' }}>
      <div
        className={`upload-zone ${isDragging ? 'dragging' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.doc,.txt"
          style={{ display: 'none' }}
          onChange={handleFileInputChange}
        />

        <div className="upload-zone-icon">
          <UploadCloud size={28} />
        </div>

        <div>
          <div className="upload-prompt-text">
            Drag and drop your legal contract or notice here
          </div>
          <div className="upload-sub-text">
            Supports PDF, DOCX, and TXT files (up to 25 MB). Secure local preview.
          </div>
        </div>

        <button
          type="button"
          className="browse-files-btn"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Browse Files
        </button>
      </div>

      {/* Preset Sample Selectors for Instant Evaluation */}
      <div className="sample-presets-bar">
        <span style={{ fontWeight: 600 }}>Or load a sample legal document:</span>
        <button
          type="button"
          className="sample-preset-btn"
          onClick={() =>
            onSelectSample({
              name: 'Enterprise_Cloud_Services_Agreement_2026.pdf',
              size: 2450000,
              type: 'application/pdf'
            })
          }
        >
          📄 Cloud Services Agreement (SaaS)
        </button>

        <button
          type="button"
          className="sample-preset-btn"
          onClick={() =>
            onSelectSample({
              name: 'Commercial_Office_Lease_Deed_Bengaluru.pdf',
              size: 1850000,
              type: 'application/pdf'
            })
          }
        >
          🏢 Commercial Lease Deed
        </button>

        <button
          type="button"
          className="sample-preset-btn"
          onClick={() =>
            onSelectSample({
              name: 'Section_138_Statutory_Demand_Notice.pdf',
              size: 890000,
              type: 'application/pdf'
            })
          }
        >
          ⚖️ Cheque Dishonour Demand Notice
        </button>
      </div>
    </div>
  );
}
