import React from 'react';
import './App.css';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout.tsx';
import Dashboard from './pages/Dashboard';
import ContentPage from './pages/ContentPage';
import ErrorBoundary from './components/ErrorBoundary';

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'content',
        element: <ContentPage />,
      },
    ],
  },
]);

const App: React.FC = () => {
  console.log('App component rendering');
  
  return <RouterProvider router={router} />;
}

export default App; 