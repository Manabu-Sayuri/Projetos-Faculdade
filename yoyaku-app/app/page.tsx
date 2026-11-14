import MieMap from '../src/components/MieMap';
import LanguageToggle from '../src/components/LanguageToggle';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-black">
      {/* O nosso novo botão automático! */}
      <LanguageToggle />
      
      <MieMap />
    </main>
  );
}