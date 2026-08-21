import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './context/ThemeContext';
import { SoundProvider } from './context/SoundContext';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { Dashboard } from './pages/Dashboard';
import { ProcessProduct } from './pages/ProcessProduct';
import { Catalog } from './pages/Catalog';
import { ProductDetail } from './pages/ProductDetail';
import { ValidationCenter } from './pages/ValidationCenter';
import { Settings } from './pages/Settings';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5000
    }
  }
});

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SoundProvider>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="process" element={<ProcessProduct />} />
                  <Route path="catalog" element={<Catalog />} />
                  <Route path="catalog/:productId" element={<ProductDetail />} />
                  <Route path="validation" element={<ValidationCenter />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </QueryClientProvider>
        </SoundProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
