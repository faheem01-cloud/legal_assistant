// App.jsx - Main application container and router configuration
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ResearchProvider } from './context/ResearchContext.jsx';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import SourceDetailModal from './components/SourceDetailModal.jsx';
import ActViewerModal from './components/ActViewerModal.jsx';

// Pages
import ChatPage from './pages/ChatPage.jsx';
import DocumentAnalysisPage from './pages/DocumentAnalysisPage.jsx';
import LegalLibraryPage from './pages/LegalLibraryPage.jsx';
import HistoryPage from './pages/HistoryPage.jsx';

export default function App() {
  return (
    <ResearchProvider>
      <BrowserRouter>
        <div className="app-container">
          {/* Dark Navy Navigation Sidebar */}
          <Sidebar />

          {/* Main Content Workspace */}
          <div className="main-layout">
            <Header />

            <Routes>
              <Route path="/" element={<ChatPage />} />
              <Route path="/document-analysis" element={<DocumentAnalysisPage />} />
              <Route path="/library" element={<LegalLibraryPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>

          {/* Global Modals for Full Text Reading */}
          <SourceDetailModal />
          <ActViewerModal />
        </div>
      </BrowserRouter>
    </ResearchProvider>
  );
}
