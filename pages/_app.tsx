import type { AppProps } from "next/app";
import '../src/styles/globals.css';
import { LanguageProvider } from '../hooks/useLanguage';
import { AuthProvider } from '../src/contexts/AuthContext';
import { SocketProvider } from '../src/contexts/SocketContext';
import { ToastProvider } from '../components/Toast';
import SocketConnectionStatus from '../components/SocketConnectionStatus';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <LanguageProvider>
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              <SocketConnectionStatus />
              <Component {...pageProps} />
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </LanguageProvider>
    </>
  );
}
