import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RootLayout from './components/RootLayout.tsx';
import Dashboard from './pages/Dashboard';
import GenerationPage from './pages/GenerationPage';
import ErrorBoundary from './components/ErrorBoundary';

const App: React.FC = () => {
  return (
    <BrowserRouter basename="/ai-experiment">
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="content" element={<GenerationPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App; 