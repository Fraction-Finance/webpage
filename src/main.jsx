import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import { AlchemyProvider } from '@/contexts/AlchemyContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { EducationProvider } from '@/contexts/EducationContext';
import { SettingsProvider } from '@/contexts/SettingsContext';
import { Loader2 } from 'lucide-react';

const AppLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <Loader2 className="h-16 w-16 animate-spin text-primary" />
  </div>
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <React.Suspense fallback={<AppLoader />}>
        <AuthProvider>
          <SettingsProvider>
            <AlchemyProvider>
              <WalletProvider>
                <EducationProvider>
                  <App />
                </EducationProvider>
              </WalletProvider>
            </AlchemyProvider>
          </SettingsProvider>
          <Toaster />
        </AuthProvider>
      </React.Suspense>
    </BrowserRouter>
  </React.StrictMode>
);