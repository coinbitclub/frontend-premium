import type { AppProps } from "next/app";
import Script from "next/script";
import '../src/styles/globals.css';
import { LanguageProvider } from '../hooks/useLanguage';
import { AuthProvider } from '../src/providers/AuthProvider';
import { ToastProvider } from '../components/Toast';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <LanguageProvider>
        <AuthProvider>
          <ToastProvider>
            <Component {...pageProps} />
          </ToastProvider>
        </AuthProvider>
      </LanguageProvider>
    </>
  );
}
