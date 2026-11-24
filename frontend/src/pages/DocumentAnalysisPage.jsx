// DocumentAnalysisPage.jsx - Comprehensive legal contract and notice analysis
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Trash2,
  Play,
  CheckCircle2,
  AlertTriangle,
  Clock,
  HelpCircle,
  Download,
  Building,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import UploadZone from '../components/UploadZone.jsx';
import DisclaimerBanner from '../components/DisclaimerBanner.jsx';
import {
  analyzeLegalDocument,
  uploadLegalDocument,
  fetchIndexedDocuments,
  deleteIndexedDocument
} from '../services/legalService.js';

export default function DocumentAnalysisPage() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFileForAnalysis, setSelectedFileForAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    loadIndexedDocs();
  }, []);

  const loadIndexedDocs = async () => {
    try {
      const docs = await fetchIndexedDocuments();
      if (docs && docs.length > 0) {
        const formatted = docs.map((d) => ({
          id: d.document_id,
          name: d.filename,
          size: `${d.chunk_count} chunks (${d.page_count} pages)`,
          rawSize: 0,
          uploadedAt: 'Indexed in Backend'
        }));
        setUploadedFiles(formatted);
        setSelectedFileForAnalysis(formatted[0].id);
      }
    } catch (err) {
      console.warn('Could not load indexed documents from backend:', err);
    }
  };

  const handleFileSelect = async (file) => {
    setErrorMessage(null);
    const tempId = `file-${Date.now()}`;
    const newDoc = {
      id: tempId,
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      rawSize: file.size,
      uploadedAt: 'Uploading to backend...',
      fileRef: file
    };
    setUploadedFiles((prev) => [newDoc, ...prev]);
    setSelectedFileForAnalysis(tempId);

    // Auto-index to ChromaDB via backend
    try {
      const uploadRes = await uploadLegalDocument(file);
      if (uploadRes && uploadRes.document_id) {
        setUploadedFiles((prev) =>
          prev.map((item) =>
            item.id === tempId
              ? {
                  ...item,
                  id: uploadRes.document_id,
                  document_id: uploadRes.document_id,
                  size: `${uploadRes.chunk_count} chunks (${uploadRes.page_count} pages)`,
                  uploadedAt: 'Indexed in Backend'
                }
              : item
          )
        );
        setSelectedFileForAnalysis(uploadRes.document_id);
      }
    } catch (e) {
      console.warn('Document indexing note:', e.message);
    }
  };

  const handleSelectSample = (sampleMeta) => {
    setErrorMessage(null);
    const newDoc = {
      id: `sample-${Date.now()}`,
      name: sampleMeta.name,
      size: `${(sampleMeta.size / (1024 * 1024)).toFixed(2)} MB`,
      rawSize: sampleMeta.size,
      uploadedAt: 'Ready for Analysis'
    };
    setUploadedFiles((prev) => [newDoc, ...prev]);
    setSelectedFileForAnalysis(newDoc.id);
  };

  const handleRemoveFile = async (id) => {
    try {
      await deleteIndexedDocument(id);
    } catch (_) {}
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFileForAnalysis === id) {
      setSelectedFileForAnalysis(null);
      setAnalysisResult(null);
    }
  };

  const handleRunAnalysis = async (targetDoc = null) => {
    const fileObj = targetDoc || uploadedFiles.find((f) => f.id === selectedFileForAnalysis);
    if (!fileObj) return;

    const targetId = fileObj.id;
    setSelectedFileForAnalysis(targetId);
    setIsAnalyzing(true);
    setErrorMessage(null);
    setAnalysisProgress({ step: 1, message: 'Extracting text, computing vector embeddings & indexing into ChromaDB...' });

    try {
      const result = await analyzeLegalDocument(fileObj, (prog) => {
        setAnalysisProgress(prog);
      });
      setAnalysisResult(result);
      // Immediately refresh indexed documents list from backend
      await loadIndexedDocs();
      if (result.document_id) {
        setSelectedFileForAnalysis(result.document_id);
      }
    } catch (err) {
      console.error('Document analysis failed:', err);
      setErrorMessage(err.message || 'Analysis failed. Please ensure the backend is running.');
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(null);
    }
  };

  const handleExportReport = () => {
    if (!analysisResult) return;
    const reportText = `LEGALMIND AI — CONTRACT RISK & OBLIGATIONS AUDIT REPORT\nGenerated: ${new Date().toLocaleString()}\nFile: ${analysisResult.fileName}\n\n1. OVERVIEW\nType: ${analysisResult.overview.documentType}\nGoverning Law: ${analysisResult.overview.governingLaw}\nEffective Date: ${analysisResult.overview.effectiveDate}\nParties: ${analysisResult.overview.parties.map((p) => `${p.name} (${p.role})`).join(', ')}\nSummary: ${analysisResult.overview.summary}\n\n2. KEY CLAUSES AUDIT\n${analysisResult.keyClauses.map((c) => `[${c.severity.toUpperCase()}] ${c.name}\nText: "${c.text}"\nAnalysis: ${c.commentary}\n`).join('\n')}\n\n3. CRITICAL RISKS\n${analysisResult.potentialRisks.map((r) => `• [${r.level}] ${r.title}\n  Issue: ${r.description}\n  Recommendation: ${r.recommendation}\n`).join('\n')}\n\n4. QUESTIONS TO ASK AN ADVOCATE\n${analysisResult.lawyerQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}`;

    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `LegalMind_Audit_${analysisResult.fileName.replace(/\.[^/.]+$/, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="doc-page-container">
      <div className="doc-page-inner">
        {/* Banner */}
        <div className="page-header-banner">
          <h2 className="page-banner-title">Document Intelligence & Contract Review</h2>
          <p className="page-banner-desc">
            Upload legal agreements, deeds, or court notices to extract key obligations, flag high-risk liabilities, and generate targeted inquiries for your legal counsel.
          </p>
        </div>

        {/* Upload Zone */}
        <UploadZone
          onFileSelect={handleFileSelect}
          onSelectSample={handleSelectSample}
        />

        {/* Uploaded Documents List */}
        {uploadedFiles.length > 0 && (
          <div className="uploaded-files-card">
            <div className="files-card-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={16} />
                <span>Uploaded Documents ({uploadedFiles.length})</span>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Select a document to run AI analysis
              </span>
            </div>

            <div>
              {uploadedFiles.map((doc) => (
                <div
                  key={doc.id}
                  className="file-row"
                  style={{
                    backgroundColor: selectedFileForAnalysis === doc.id ? '#fafbfc' : 'transparent',
                    borderLeft: selectedFileForAnalysis === doc.id ? '3px solid var(--navy-900)' : '3px solid transparent'
                  }}
                  onClick={() => setSelectedFileForAnalysis(doc.id)}
                >
                  <div className="file-left">
                    <div className="file-icon">
                      <FileText size={22} />
                    </div>
                    <div className="file-info">
                      <span className="file-name">{doc.name}</span>
                      <span className="file-size">{doc.size} • {doc.uploadedAt}</span>
                    </div>
                  </div>

                  <div className="file-actions">
                    <button
                      type="button"
                      className="btn-remove-file"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile(doc.id);
                      }}
                      title="Remove document"
                    >
                      <Trash2 size={16} />
                    </button>

                    <button
                      type="button"
                      className="btn-analyze-doc"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFileForAnalysis(doc.id);
                        handleRunAnalysis(doc);
                      }}
                      disabled={isAnalyzing}
                    >
                      <Play size={13} fill="currentColor" />
                      <span>{isAnalyzing && selectedFileForAnalysis === doc.id ? 'Analyzing...' : 'Analyze Document'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error Banner */}
        {errorMessage && (
          <div className="legal-disclaimer-box" style={{ borderColor: '#ef4444', backgroundColor: '#fef2f2', color: '#991b1b' }}>
            <AlertTriangle size={16} />
            <div><strong>Backend Error:</strong> {errorMessage}</div>
          </div>
        )}

        {/* Loading Progress State */}
        {isAnalyzing && (
          <div className="loading-indicator-card">
            <div className="loading-top">
              <div className="spinner-gold" />
              <span className="loading-stage-label">
                {analysisProgress?.message || 'Processing contractual structure & benchmarking risks...'}
              </span>
            </div>
            <div className="pulse-skeleton-line" style={{ width: '90%' }} />
            <div className="pulse-skeleton-line" style={{ width: '75%' }} />
          </div>
        )}

        {/* Analysis Results UI */}
        {!isAnalyzing && analysisResult && (
          <div className="analysis-report-container">
            {/* Top Report Action Bar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: 'var(--bg-surface)', border: '1px solid var(--border-light)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} style={{ color: '#16a34a' }} />
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy-900)' }}>
                  Audit Complete: {analysisResult.fileName}
                </span>
              </div>

              <button
                type="button"
                className="action-chip-btn"
                onClick={handleExportReport}
                style={{ background: 'var(--bg-subtle)' }}
              >
                <Download size={14} />
                <span>Export Audit Report</span>
              </button>
            </div>

            {/* 1. Document Overview */}
            <div className="report-overview-card">
              <div className="ai-section-title">
                <Building size={16} />
                <span>1. Document Overview & Context</span>
              </div>

              <div className="overview-grid">
                <div className="overview-item">
                  <span className="overview-label">Agreement Type</span>
                  <span className="overview-val">{analysisResult.overview.documentType}</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Governing Law & Jurisdiction</span>
                  <span className="overview-val">{analysisResult.overview.governingLaw}</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Effective Date</span>
                  <span className="overview-val">{analysisResult.overview.effectiveDate}</span>
                </div>
                <div className="overview-item">
                  <span className="overview-label">Contract Commercial Value</span>
                  <span className="overview-val">{analysisResult.overview.contractValue}</span>
                </div>
              </div>

              <div style={{ fontSize: '13.5px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                <strong>Executive Summary:</strong> {analysisResult.overview.summary}
              </div>
            </div>

            {/* 2. Key Clauses */}
            <div className="report-overview-card">
              <div className="ai-section-title">
                <Layers size={16} />
                <span>2. Key Contractual Clauses Audit</span>
              </div>

              <div className="clauses-grid">
                {analysisResult.keyClauses.map((clause, idx) => (
                  <div key={idx} className="clause-card">
                    <div className="clause-header">
                      <span className="clause-name">{clause.name}</span>
                      <span className={`severity-pill severity-${clause.severity}`}>
                        {clause.severity} Risk
                      </span>
                    </div>
                    <div className="clause-quote">
                      "{clause.text}"
                    </div>
                    <div className="clause-commentary">
                      <strong>Legal Analysis:</strong> {clause.commentary}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Important Obligations */}
            <div className="report-overview-card">
              <div className="ai-section-title">
                <CheckCircle2 size={16} />
                <span>3. Key Contractual Obligations</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysisResult.obligations.map((ob, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px 16px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-light)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--navy-900)' }}>
                        {ob.title}
                      </span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold-600)', background: 'var(--gold-50)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border-gold)' }}>
                        {ob.party}
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      {ob.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Dates and Deadlines */}
            <div className="report-overview-card">
              <div className="ai-section-title">
                <Calendar size={16} />
                <span>4. Critical Dates & Deadlines</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {analysisResult.datesAndDeadlines.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      border: '1px solid var(--border-light)',
                      borderRadius: '8px',
                      backgroundColor: '#fafbfc'
                    }}
                  >
                    <div style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                      {item.type}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy-900)', margin: '4px 0' }}>
                      {item.date}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>
                      {item.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Potential Risks or Concerns */}
            <div className="report-overview-card">
              <div className="ai-section-title" style={{ color: '#991b1b' }}>
                <AlertTriangle size={16} />
                <span>5. Potential Legal Risks & Critical Exposures</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {analysisResult.potentialRisks.map((risk, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '14px 16px',
                      borderRadius: '8px',
                      border: '1px solid #fed7aa',
                      backgroundColor: '#fffaf5'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <span className={`severity-pill ${risk.level.includes('High') ? 'severity-high' : 'severity-medium'}`}>
                        {risk.level}
                      </span>
                      <strong style={{ fontSize: '14px', color: 'var(--navy-900)' }}>
                        {risk.title}
                      </strong>
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                      {risk.description}
                    </p>
                    <div style={{ fontSize: '12.5px', color: '#9a3412', fontWeight: 500 }}>
                      <strong>Recommended Counsel Action:</strong> {risk.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Questions to Ask a Lawyer */}
            <div className="report-overview-card">
              <div className="ai-section-title">
                <HelpCircle size={16} />
                <span>6. Targeted Inquiries for Your Legal Counsel</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {analysisResult.lawyerQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                      padding: '12px 14px',
                      background: 'var(--bg-subtle)',
                      borderRadius: '6px',
                      border: '1px solid var(--border-light)',
                      fontSize: '13.5px',
                      lineHeight: 1.5,
                      color: 'var(--navy-900)'
                    }}
                  >
                    <span className="step-num">{idx + 1}</span>
                    <div style={{ fontWeight: 500 }}>{q}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <DisclaimerBanner />
          </div>
        )}
      </div>
    </div>
  );
}
