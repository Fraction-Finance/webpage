import React from 'react';
    import ReactDOM from 'react-dom/client';
    import { BrowserRouter } from 'react-router-dom';
    import App from '@/App';
    import '@/index.css';
    import { Toaster } from '@/components/ui/toaster';
    import { AuthProvider } from '@/contexts/SupabaseAuthContext';
    import { SettingsProvider } from '@/contexts/SettingsContext';
    import { AlchemyProvider } from '@/contexts/AlchemyContext';

    ReactDOM.createRoot(document.getElementById('root')).render(
      <React.StrictMode>
          <BrowserRouter>
            <AuthProvider>
              <SettingsProvider>
                <AlchemyProvider>
                    <App />
                    <Toaster />
                </AlchemyProvider>
              </SettingsProvider>
            </AuthProvider>
          </BrowserRouter>
      </React.StrictMode>
    );