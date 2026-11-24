// ChatPage.jsx - Primary LegalMind AI conversational research interface
import React, { useState, useRef, useEffect } from 'react';
import { Scale, Sparkles, BookOpen } from 'lucide-react';
import { useResearch } from '../context/ResearchContext.jsx';
import SuggestionCard from '../components/SuggestionCard.jsx';
import MessageBubble from '../components/MessageBubble.jsx';
import ChatInput from '../components/ChatInput.jsx';
import LoadingIndicator from '../components/LoadingIndicator.jsx';
import SourcesPanel from '../components/SourcesPanel.jsx';
import { SUGGESTION_PROMPTS, QUICK_TOPIC_PILLS } from '../data/mockData.js';

export default function ChatPage() {
  const [inputText, setInputText] = useState('');
  const { messages, sendQuery, isSearching, startNewResearch } = useResearch();
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSearching]);

  const handleSuggestionClick = (prompt) => {
    setInputText(prompt);
  };

  const handleTopicPillClick = (query) => {
    setInputText(query);
  };

  const handleSend = () => {
    if (!inputText.trim() || isSearching) return;
    const query = inputText;
    setInputText('');
    sendQuery(query);
  };

  return (
    <div className="workspace-split">
      <div className="workspace-content">
        {messages.length === 0 ? (
          /* Empty / Welcome Landing Interface */
          <div className="welcome-container">
            <div className="welcome-hero">
              <div className="hero-emblem">
                <Scale size={28} />
              </div>
              <h1 className="welcome-heading">
                Understand the law.<br />Make informed decisions.
              </h1>
              <p className="welcome-subheading">
                Research legal questions, explore legislation, and understand legal documents with evidence-grounded AI.
              </p>
            </div>

            {/* Clickable 3 Core Suggestions */}
            <div className="suggestions-grid">
              {SUGGESTION_PROMPTS.map((item) => (
                <SuggestionCard
                  key={item.id}
                  item={item}
                  onClick={handleSuggestionClick}
                />
              ))}
            </div>

            {/* Quick Topic Pills for Indian Law */}
            <div className="quick-topics-row">
              <span className="quick-topic-label">Common research areas:</span>
              {QUICK_TOPIC_PILLS.map((pill, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="topic-pill"
                  onClick={() => handleTopicPillClick(pill.query)}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Conversation Scrollable View */
          <div className="conversation-scroll-area">
            <div className="conversation-inner">
              {messages.map((msg) => (
                <MessageBubble key={msg.id} message={msg} />
              ))}

              {isSearching && <LoadingIndicator />}

              <div ref={messagesEndRef} />
            </div>
          </div>
        )}

        {/* Sticky Chat Input at Bottom */}
        <ChatInput
          value={inputText}
          onChange={setInputText}
          onSubmit={handleSend}
          onClear={startNewResearch}
        />
      </div>

      {/* Retractable Evidence & Citations Panel */}
      <SourcesPanel />
    </div>
  );
}
