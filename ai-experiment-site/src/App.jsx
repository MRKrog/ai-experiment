import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootLayout from './components/RootLayout';
import Dashboard from './pages/Dashboard';
import ContentPage from './pages/ContentPage';
import ErrorBoundary from './components/ErrorBoundary';

const router = createBrowserRouter([
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
], {
  basename: '/ai-experiment/'
});

function App() {
  console.log('App component rendering');
  
  return <RouterProvider router={router} />;
}

export default App;