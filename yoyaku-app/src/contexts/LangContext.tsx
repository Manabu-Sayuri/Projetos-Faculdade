'use client';
import { createContext, useContext, useState, ReactNode } from 'react';
import { dict } from '../locales/dictionaries';

type Lang = 'ja' | 'pt';
type DictType = typeof dict.ja;

interface LangContextProps {
  lang: Lang;
  toggleLang: () => void;
  t: DictType;
}

const LangContext = createContext<LangContextProps | undefined>(undefined);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('ja');
  
  const toggleLang = () => {
    setLang(prev => prev === 'ja' ? 'pt' : 'ja');
  };

  return (
    <LangContext.Provider value={{ lang, toggleLang, t: dict[lang] }}>
      {children}
    </LangContext.Provider>
  );
}

export const useLang = () => {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error('useLang tem de ser usado dentro de um LangProvider');
  return ctx;
};