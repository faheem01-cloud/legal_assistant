// ResearchContext.jsx - Central application state
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  queryLegalMind,
  getStoredHistory,
  saveHistoryItem,
  deleteHistoryItem
} from '../services/legalService.js';

const ResearchContext = createContext();

export function ResearchProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [activeSources, setActiveSources] = useState([]);
  const [selectedSourceForModal, setSelectedSourceForModal] = useState(null);
  const [selectedActForModal, setSelectedActForModal] = useState(null);
  const [isSourcesPanelOpen, setIsSourcesPanelOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchProgress, setSearchProgress] = useState({ stage: '', message: '' });
  const [historyList, setHistoryList] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [currentSearchMode, setCurrentSearchMode] = useState('Central Acts & SC Precedents');

  // Load history from localStorage on startup
  useEffect(() => {
    const stored = getStoredHistory();
    setHistoryList(stored);
  }, []);

  // Send research query
  const sendQuery = async (queryText) => {
    if (!queryText || !queryText.trim() || isSearching) return;

    const trimmed = queryText.trim();
    const userMsgId = `usr-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsSearching(true);
    setSearchProgress({ stage: 'search', message: 'Connecting to Indian Legal Corpus & vector index...' });

    try {
      const response = await queryLegalMind(trimmed, (progress) => {
        setSearchProgress(progress);
      });

      const aiMsgId = `ai-${Date.now()}`;
      const aiMsg = {
        id: aiMsgId,
        sender: 'ai',
        data: response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (response.sources && response.sources.length > 0) {
        setActiveSources(response.sources);
        // Automatically open sources panel on desktop if not on mobile
        if (window.innerWidth >= 1200) {
          setIsSourcesPanelOpen(true);
        }
      }

      // Save / update in history
      const sessionId = activeSessionId || `hist-${Date.now()}`;
      setActiveSessionId(sessionId);

      const historyItem = {
        id: sessionId,
        title: trimmed.length > 50 ? `${trimmed.substring(0, 48)}...` : trimmed,
        date: 'Just now',
        timestamp: new Date().toISOString(),
        category: determineCategory(trimmed),
        preview: response.shortAnswer,
        query: trimmed,
        sourcesCount: response.sources?.length || 0,
        messages: [...messages, userMsg, aiMsg],
        sources: response.sources
      };

      const updatedHistory = saveHistoryItem(historyItem);
      setHistoryList(updatedHistory);
    } catch (err) {
      console.error('Legal research query failed:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        isError: true,
        text: 'An error occurred while synthesizing legal provisions. Please verify network status or try another query.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsSearching(false);
      setSearchProgress({ stage: '', message: '' });
    }
  };

  const determineCategory = (query) => {
    const q = query.toLowerCase();
    if (q.includes('cheque') || q.includes('138') || q.includes('bank')) return 'Banking & NI Act';
    if (q.includes('consumer') || q.includes('refund') || q.includes('product')) return 'Consumer Protection';
    if (q.includes('cyber') || q.includes('data') || q.includes('privacy') || q.includes('fraud')) return 'Cyber Law & DPDP';
    if (q.includes('lease') || q.includes('rent') || q.includes('tenant') || q.includes('property')) return 'Property & Tenancy';
    if (q.includes('bns') || q.includes('ipc') || q.includes('crime') || q.includes('fir')) return 'Criminal Law';
    return 'Commercial & Civil Law';
  };

  // Reset to empty landing state
  const startNewResearch = () => {
    setMessages([]);
    setActiveSessionId(null);
    setActiveSources([]);
    setIsSourcesPanelOpen(false);
  };

  // Load an existing conversation from history
  const loadHistoryItem = (historyItem) => {
    if (historyItem.messages && historyItem.messages.length > 0) {
      setMessages(historyItem.messages);
    } else {
      setMessages([
        {
          id: `h-usr-${historyItem.id}`,
          sender: 'user',
          text: historyItem.query,
          timestamp: historyItem.date
        },
        {
          id: `h-ai-${historyItem.id}`,
          sender: 'ai',
          data: {
            shortAnswer: historyItem.preview,
            explanation: historyItem.preview,
            disclaimer: 'Loaded from local session log.'
          },
          timestamp: historyItem.date
        }
      ]);
    }

    setActiveSessionId(historyItem.id);
    if (historyItem.sources && historyItem.sources.length > 0) {
      setActiveSources(historyItem.sources);
    } else {
      setActiveSources([]);
    }
  };

  const handleDeleteHistory = (id) => {
    const updated = deleteHistoryItem(id);
    setHistoryList(updated);
    if (activeSessionId === id) {
      startNewResearch();
    }
  };

  return (
    <ResearchContext.Provider
      value={{
        messages,
        setMessages,
        activeSources,
        setActiveSources,
        selectedSourceForModal,
        setSelectedSourceForModal,
        selectedActForModal,
        setSelectedActForModal,
        isSourcesPanelOpen,
        setIsSourcesPanelOpen,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isSearching,
        searchProgress,
        historyList,
        activeSessionId,
        currentSearchMode,
        setCurrentSearchMode,
        sendQuery,
        startNewResearch,
        loadHistoryItem,
        handleDeleteHistory
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
}

export function useResearch() {
  const context = useContext(ResearchContext);
  if (!context) {
    throw new Error('useResearch must be used within a ResearchProvider');
  }
  return context;
}
