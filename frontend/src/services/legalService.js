// legalService.js - Real Live Backend API Client for LegalMind AI
// Connects directly to FastAPI + ChromaDB + DeepSeek RAG Backend.
// All mock fallbacks have been removed.

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

/**
 * Parses markdown sections from the backend into structured fields for UI rendering.
 */
function parseBackendAnswer(answerText, rawSources = []) {
  if (!answerText) {
    return {
      shortAnswer: '',
      explanation: '',
      provisions: [],
      steps: [],
      disclaimer: '',
      rawAnswer: ''
    };
  }

  let shortAnswer = '';
  let explanation = '';
  let steps = [];
  let disclaimer = '';

  const shortAnswerMatch = answerText.match(/### Short Answer\s*([\s\S]*?)(?=###|$)/i);
  if (shortAnswerMatch) {
    shortAnswer = shortAnswerMatch[1].trim();
  }

  const explanationMatch = answerText.match(/### (?:Legal Explanation|Legal Explanation & Analysis|Retrieved Legal Evidence & Statutory Provisions)\s*([\s\S]*?)(?=###|$)/i);
  if (explanationMatch) {
    explanation = explanationMatch[1].trim();
  }

  const stepsMatch = answerText.match(/### (?:Steps to Consider|Practical Next Steps)\s*([\s\S]*?)(?=###|$)/i);
  if (stepsMatch) {
    const rawSteps = stepsMatch[1].trim().split('\n');
    steps = rawSteps
      .map((s) => s.replace(/^\d+[\.\)]\s*|-\s*/, '').trim())
      .filter((s) => s.length > 0);
  }

  const disclaimerMatch = answerText.match(/### Disclaimer\s*([\s\S]*?)$/i);
  if (disclaimerMatch) {
    disclaimer = disclaimerMatch[1].trim();
  }

  // If the answer is unstructured or plain text, adapt gracefully
  if (!shortAnswer && !explanation) {
    const paragraphs = answerText.split('\n\n').filter((p) => p.trim());
    shortAnswer = paragraphs[0] || answerText;
    explanation = paragraphs.slice(1).join('\n\n') || '';
  }

  if (!disclaimer) {
    disclaimer = 'LegalMind AI is an informational technology research assistant, not an enrolled advocate. This response does not constitute legal representation.';
  }

  // Map backend sources to provisions
  const provisions = (rawSources || [])
    .filter((s) => s.section || s.document_name)
    .map((s) => ({
      act: s.document_name,
      section: s.section || 'General Provision',
      title: s.section ? `${s.document_name} — ${s.section}` : s.document_name,
      summary: s.text ? s.text.substring(0, 160) + '...' : ''
    }));

  return {
    shortAnswer,
    explanation,
    provisions,
    steps,
    disclaimer,
    rawAnswer: answerText
  };
}

/**
 * Format backend source items into UI source cards with cosine relevance match
 */
function formatSources(rawSources = []) {
  return rawSources.map((s, idx) => ({
    id: s.document_id || `src-${idx}`,
    title: s.document_name || 'Legal Source',
    act: s.document_name || 'Central Act',
    section: s.section || '',
    page: s.page_number ? `Page ${s.page_number}` : '',
    citation: `${s.document_name} • Page ${s.page_number || 1}`,
    relevanceScore: Math.min(100, Math.round((s.score || 0.5) * 100)),
    excerpt: s.text,
    fullText: s.text
  }));
}

/**
 * Check backend health status
 */
export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.statusText}`);
  return await res.json();
}

/**
 * Perform live AI legal research query via POST /api/chat
 * @param {string} query - Legal question
 * @param {Function} onProgress - Progress reporter
 * @returns {Promise<Object>} Formatted legal research response
 */
export async function queryLegalMind(query, onProgress = null) {
  if (onProgress) {
    onProgress({ stage: 'search', message: 'Querying Indian Law Corpus & ChromaDB index...' });
  }

  const res = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: query })
  });

  if (!res.ok) {
    let errorDetail = res.statusText;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch (_) {}
    throw new Error(`Backend error (${res.status}): ${errorDetail}`);
  }

  const data = await res.json();
  const parsed = parseBackendAnswer(data.answer, data.sources);
  const formattedSources = formatSources(data.sources);

  return {
    queryId: data.chat_id,
    shortAnswer: parsed.shortAnswer,
    explanation: parsed.explanation,
    provisions: parsed.provisions,
    steps: parsed.steps,
    disclaimer: parsed.disclaimer,
    rawAnswer: data.answer,
    sources: formattedSources,
    model: data.model,
    grounded: data.grounded
  };
}

/**
 * Upload a legal PDF to the backend via POST /api/documents/upload
 */
export async function uploadLegalDocument(file, onProgress = null) {
  if (onProgress) {
    onProgress({ step: 1, message: 'Uploading PDF to LegalMind backend...' });
  }

  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${API_BASE_URL}/documents/upload`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    let errorDetail = res.statusText;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch (_) {}
    throw new Error(`Upload failed (${res.status}): ${errorDetail}`);
  }

  return await res.json();
}

/**
 * Analyze an uploaded legal document (PDF) via POST /api/documents/analyze
 * @param {File|Object} file - File object or metadata
 * @param {Function} onProgress - Progress reporter
 * @returns {Promise<Object>} Comprehensive document analysis report
 */
export async function analyzeLegalDocument(file, onProgress = null) {
  if (onProgress) {
    onProgress({ step: 1, message: 'Uploading document to backend intelligence engine...' });
  }

  const formData = new FormData();
  if (file instanceof File || file instanceof Blob) {
    formData.append('file', file, file.name);
  } else if (file?.fileRef instanceof File) {
    formData.append('file', file.fileRef, file.fileRef.name);
  } else {
    // If selecting an existing indexed document, pass document_id
    if (file?.id && !file.id.startsWith('file-') && !file.id.startsWith('sample-')) {
      formData.append('document_id', file.id);
    }
    // If it is a sample preset or named document
    if (file?.name) {
      formData.append('sample_name', file.name);
    }
  }

  const res = await fetch(`${API_BASE_URL}/documents/analyze`, {
    method: 'POST',
    body: formData
  });

  if (!res.ok) {
    let errorDetail = res.statusText;
    try {
      const errJson = await res.json();
      errorDetail = errJson.detail || errJson.message || JSON.stringify(errJson);
    } catch (_) {}
    throw new Error(`Analysis failed (${res.status}): ${errorDetail}`);
  }

  const report = await res.json();
  return {
    ...report,
    analyzedAt: new Date().toISOString()
  };
}

/**
 * Fetch legal library sources directly from backend via GET /api/library
 */
export async function fetchLibrarySources({ category = 'all', search = '' } = {}) {
  const res = await fetch(`${API_BASE_URL}/library`);
  if (!res.ok) {
    throw new Error(`Failed to load library: ${res.statusText}`);
  }

  const data = await res.json();
  let list = (data.documents || []).map((doc) => ({
    id: doc.document_id,
    title: doc.title,
    category: doc.category,
    type: doc.type,
    year: 'Central Statute',
    chunksCount: `${doc.total_chunks} indexed passages (${doc.total_pages} pages)`,
    description: doc.description || 'Statutory legal code indexed in ChromaDB.',
    keySections: [
      `${doc.title} — Key Provisions`,
      'Jurisdiction & Applicability',
      'Statutory Remedies & Penalties'
    ],
    badge: doc.type
  }));

  if (category && category !== 'all' && category !== 'All Categories') {
    list = list.filter((item) => item.category.toLowerCase().includes(category.toLowerCase()));
  }

  if (search.trim()) {
    const term = search.toLowerCase();
    list = list.filter(
      (item) =>
        item.title.toLowerCase().includes(term) ||
        item.description.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
    );
  }

  return list;
}

/**
 * List all documents indexed in the backend via GET /api/documents
 */
export async function fetchIndexedDocuments() {
  const res = await fetch(`${API_BASE_URL}/documents`);
  if (!res.ok) throw new Error(`Failed to fetch documents: ${res.statusText}`);
  return await res.json();
}

/**
 * Delete an indexed document via DELETE /api/documents/{id}
 */
export async function deleteIndexedDocument(documentId) {
  const res = await fetch(`${API_BASE_URL}/documents/${documentId}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`Failed to delete document: ${res.statusText}`);
  return await res.json();
}

/**
 * LocalStorage conversation management
 */
const STORAGE_KEY = 'legalmind_research_history';

export function getStoredHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to read research history from localStorage:', err);
  }
  return [];
}

export function saveHistoryItem(item) {
  try {
    const current = getStoredHistory();
    const updated = [item, ...current.filter((c) => c.id !== item.id)];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    return getStoredHistory();
  }
}

export function deleteHistoryItem(id) {
  try {
    const current = getStoredHistory();
    const updated = current.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete history item:', err);
    return getStoredHistory();
  }
}
