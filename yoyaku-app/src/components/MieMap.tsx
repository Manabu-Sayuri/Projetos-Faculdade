'use client';
import { useEffect, useState, useRef } from 'react'; 
import { useLang } from '../contexts/LangContext';
import CityInstitutions from './CityInstitutions'; 

type City = {
  id: number;
  name_ja: string;
  name_pt: string;
  slug: string;
  is_active: number; 
};

// 1. Grelha Mobile
const mapNodesMobile = [
  { slug: 'inabe', x: 220, y: 100 },     { slug: 'kuwana', x: 580, y: 100 },     { slug: 'kisosaki', x: 940, y: 100 },
  { slug: 'toin', x: 580, y: 230 },      { slug: 'asahi', x: 940, y: 230 },
  { slug: 'komono', x: 220, y: 360 },    { slug: 'yokkaichi', x: 580, y: 360 },  { slug: 'kawagoe', x: 940, y: 360 },
  { slug: 'kameyama', x: 220, y: 490 },  { slug: 'suzuka', x: 580, y: 490 },
  { slug: 'iga', x: 220, y: 620 },       { slug: 'tsu', x: 580, y: 620 },
  { slug: 'nabari', x: 220, y: 750 },    { slug: 'matsusaka', x: 580, y: 750 },
  { slug: 'meiwa', x: 580, y: 880 },     { slug: 'tamaki', x: 940, y: 880 },
  { slug: 'taki', x: 580, y: 1010 },     { slug: 'ise', x: 940, y: 1010 },
  { slug: 'odai', x: 220, y: 1140 },     { slug: 'watarai', x: 580, y: 1140 },   { slug: 'toba', x: 940, y: 1140 },
  { slug: 'taiki', x: 220, y: 1270 },    { slug: 'minamiise', x: 580, y: 1270 }, { slug: 'shima', x: 940, y: 1270 },
  { slug: 'kihoku', x: 220, y: 1400 },
  { slug: 'owase', x: 220, y: 1530 },
  { slug: 'kumano', x: 220, y: 1660 },
  { slug: 'mihama', x: 220, y: 1790 },
  { slug: 'kiho', x: 220, y: 1920 }
];

// 2. Grelha Desktop (Espaçamento ampliado para evitar que fiquem grudadas com letra 60)
const mapNodesDesktop = [
  { slug: 'inabe', x: 500, y: 120 },     { slug: 'kuwana', x: 1300, y: 120 },    { slug: 'kisosaki', x: 1900, y: 120 },
  { slug: 'toin', x: 900, y: 280 },      { slug: 'asahi', x: 1300, y: 280 },
  { slug: 'komono', x: 500, y: 440 },    { slug: 'yokkaichi', x: 900, y: 440 },  { slug: 'kawagoe', x: 1300, y: 440 },
  { slug: 'kameyama', x: 500, y: 600 },  { slug: 'suzuka', x: 900, y: 600 },
  { slug: 'iga', x: 150, y: 760 },       { slug: 'tsu', x: 900, y: 760 },
  { slug: 'nabari', x: 150, y: 920 },    { slug: 'matsusaka', x: 900, y: 920 },
  { slug: 'meiwa', x: 1300, y: 1080 },   { slug: 'tamaki', x: 1900, y: 1080 },
  { slug: 'taki', x: 900, y: 1240 },     { slug: 'ise', x: 1900, y: 1240 },
  { slug: 'odai', x: 500, y: 1400 },     { slug: 'watarai', x: 1300, y: 1400 },  { slug: 'toba', x: 2350, y: 1400 },
  { slug: 'taiki', x: 500, y: 1560 },    { slug: 'minamiise', x: 1300, y: 1560 }, { slug: 'shima', x: 2350, y: 1560 },
  { slug: 'kihoku', x: 500, y: 1720 },
  { slug: 'owase', x: 500, y: 1880 },
  { slug: 'kumano', x: 500, y: 2040 },
  { slug: 'mihama', x: 500, y: 2200 },
  { slug: 'kiho', x: 500, y: 2360 }
];

const connections = [
  ['inabe', 'toin'], ['kuwana', 'toin'], ['kuwana', 'kisosaki'], ['kuwana', 'asahi'],
  ['asahi', 'kawagoe'], ['toin', 'yokkaichi'], ['kawagoe', 'yokkaichi'],
  ['komono', 'yokkaichi'], ['yokkaichi', 'suzuka'], ['komono', 'kameyama'],
  ['kameyama', 'suzuka'], ['kameyama', 'tsu'], ['suzuka', 'tsu'],
  ['iga', 'kameyama'], ['iga', 'nabari'], ['tsu', 'matsusaka'],
  ['matsusaka', 'meiwa'], ['matsusaka', 'taki'], ['meiwa', 'tamaki'],
  ['taki', 'odai'], ['taki', 'tamaki'], ['tamaki', 'ise'], ['ise', 'toba'],
  ['ise', 'watarai'], ['toba', 'shima'], ['watarai', 'minamiise'],
  ['odai', 'taiki'], ['taiki', 'kihoku'], ['kihoku', 'owase'],
  ['owase', 'kumano'], ['kumano', 'mihama'], ['mihama', 'kiho']
];

export default function MieMap() {
  const [cities, setCities] = useState<City[]>([]);
  const { lang } = useLang(); 

  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    setTimeout(() => {
      listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  useEffect(() => {
    fetch('/api/cities').then((res) => res.json()).then(setCities);
  }, []);

  if (cities.length === 0) return <div className="text-center p-10 text-gray-500">A carregar o mapa de Mie...</div>;

  const renderMap = (nodes: {slug: string, x: number, y: number}[], viewBox: string, pWidth: number, pHeight: number, fSize: string, sWidth: string) => (
    <svg viewBox={viewBox} className="w-full h-auto overflow-visible">
      
      {connections.map(([from, to], i) => {
        if (!nodes) return null;
        const nFrom = nodes.find(n => n.slug === from);
        const nTo = nodes.find(n => n.slug === to);
        if (!nFrom || !nTo) return null;
        return (
          <line key={i} x1={nFrom.x} y1={nFrom.y} x2={nTo.x} y2={nTo.y} stroke="#E5E7EB" strokeWidth={sWidth} />
        );
      })}

      {nodes.map((node) => {
        const dbCity = cities.find((c) => c.slug === node.slug);
        if (!dbCity) return null;
        
        const isActive = dbCity.is_active === 1;
        const label = lang !== 'ja' ? dbCity.name_pt : dbCity.name_ja;
        
        return (
            <g 
              key={node.slug} 
              className={isActive ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
              onClick={() => isActive && handleCityClick(dbCity)}
            >
            
            {isActive && (
              <rect x={node.x - (pWidth / 2)} y={node.y - (pHeight / 2) + 8} width={pWidth} height={pHeight} rx={pHeight / 2} fill="#1d4ed8" opacity="0.2" />
            )}
            
            <rect 
              x={node.x - (pWidth / 2)} 
              y={node.y - (pHeight / 2)} 
              width={pWidth} 
              height={pHeight} 
              rx={pHeight / 2} 
              className={`transition-all duration-300 ${isActive ? 'fill-blue-500 hover:fill-blue-600' : 'fill-gray-100 border border-gray-200'}`} 
            />
            
            <text 
              x={node.x} 
              y={node.y + (parseInt(fSize) / 3)}
              textAnchor="middle" 
              fontSize={fSize}
              className={`pointer-events-none tracking-wide ${isActive ? 'fill-white' : 'fill-gray-500'}`}
            >
              {label}
            </text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-gray-50 py-4 sm:py-6 relative px-4">

      <div ref={listRef} className="w-full max-w-7xl z-10 relative mb-4">
        {selectedCity && (
          <CityInstitutions 
            citySlug={selectedCity.slug} 
            cityName={lang !== 'ja' ? selectedCity.name_pt : selectedCity.name_ja} 
          />
        )}
      </div>

      <div className="relative w-full max-w-7xl bg-white shadow-xl rounded-3xl p-6 sm:p-14 border border-gray-100">
        
        {/* Título adaptado para não quebrar linha no mobile */}
        <h1 className="text-2xl sm:text-5xl font-extrabold mb-10 text-gray-800 text-center whitespace-nowrap">
          {lang !== 'ja' ? 'Mapa de Aulas em Mie' : '三重県 日本語教室マップ'}
        </h1>

        {/* Mobile: ViewBox ajustado para 2000 e largura das pílulas otimizada para não cortar */}
        <div className="block sm:hidden overflow-x-auto pb-4">
          {renderMap(
            mapNodesMobile, 
            "0 0 1150 2000", // Altura reduzida para diminuir o bloco e largura adequada
            320,   // Largura da pílula mobile
            80,    // Altura da pílula mobile
            "55",  // Tamanho da letra mobile
            "3"
          )}
        </div>

        {/* Desktop: Pílulas com 520 de largura, 130 de altura, e letra tamanho 60 perfeitamente espaçadas */}
        <div className="hidden sm:block overflow-x-auto">
          {renderMap(
            mapNodesDesktop, 
            "0 0 2700 2550", 
            300,   // Largura da pílula aumentada para acomodar a letra 60
            130,   // Altura da pílula proporcional
            "50",  // <--- LETRA TAMANHO 60 EXATO NO DESKTOP
            "6"    // Espessura da linha
          )}
        </div>

        <div className="mt-14 flex justify-center items-center gap-8 text-[12px] sm:text-xl text-gray-500">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-blue-500 shadow-sm"></span>
            <span>{lang !== 'ja' ? 'Aulas disponíveis' : '授業あり'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-gray-100 border-2 border-gray-300"></span>
            <span>{lang !== 'ja' ? 'Sem aulas' : '現在授業なし'}</span>
          </div>
        </div>

      </div>
    </div>
  );
}