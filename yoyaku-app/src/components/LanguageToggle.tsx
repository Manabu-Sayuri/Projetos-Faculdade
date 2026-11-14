'use client';
import { useLang } from '../contexts/LangContext';

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();

  return (
    <button
      onClick={toggleLang}
      className="fixed top-4 right-4 md:top-6 md:right-8 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md transition-all px-4 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-2xl text-gray-700 flex items-center gap-2"
    >
      {lang === 'ja' ? '🇯🇵' : '🇧🇷'}
    </button>
  );
}