import { LangProvider } from '../src/contexts/LangContext';
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body>
        <LangProvider>
          {children}
        </LangProvider>
      </body>
    </html>
  );
}