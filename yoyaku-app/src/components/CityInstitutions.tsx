'use client';
import { useEffect, useState } from 'react';
import { useLang } from '../contexts/LangContext';

type ScheduleSlot = {
  days: number[];
  day_ja: string;
  day_pt: string;
  time: string;
};

type Institution = {
  id: number;
  name: string;
  name_rom: string;
  target_audience: string;
  fee_description_ja: string;
  fee_description_pt: string;
  schedule_description_ja: string;
  schedule_description_pt: string;
  schedule_slots: string | ScheduleSlot[];
  description_ja: string;
  description_pt: string;
  operating_days: string | number[];
  google_maps_url: string;
  email: string;
  phone: number;
  sns_url: string;
};

export default function CityInstitutions({ citySlug, cityName }: { citySlug: string, cityName: string }) {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const { lang } = useLang();

  const daysFilter = [
    { value: null, labelPt: 'Todos', labelJa: 'すべて' },
    { value: 1, labelPt: 'Seg', labelJa: '月' },
    { value: 2, labelPt: 'Ter', labelJa: '火' },
    { value: 3, labelPt: 'Qua', labelJa: '水' },
    { value: 4, labelPt: 'Qui', labelJa: '木' },
    { value: 5, labelPt: 'Sex', labelJa: '金' },
    { value: 6, labelPt: 'Sáb', labelJa: '土' },
    { value: 0, labelPt: 'Dom', labelJa: '日' },
  ];

  useEffect(() => {
    const fetchInstitutions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/cities/${citySlug}/institutions`, { cache: 'no-store' });
        const data = await res.json();
        setInstitutions(Array.isArray(data) ? data : []);
        setSelectedDay(null);
      } catch (err) {
        console.error('Erro ao buscar escolas:', err);
      } finally {
        setLoading(false);
      }
    };

    if (citySlug) {
      fetchInstitutions();
    }
  }, [citySlug]);

  // Função para transformar o schedule_slots do banco em array seguro
  const parseSlots = (rawSlots: string | ScheduleSlot[]): ScheduleSlot[] => {
    if (!rawSlots) return [];
    try {
      return typeof rawSlots === 'string' ? JSON.parse(rawSlots) : rawSlots;
    } catch {
      return [];
    }
  };

  // Função para identificar o emoji de Público-Alvo (Adulto / Criança)
  const getAudienceEmoji = (audience: string) => {
    const text = (audience || '').toLowerCase();
    const hasChild = text.includes('criança') || text.includes('子供') || text.includes('こども') || text.includes('child') || text.includes('kids') || text.includes('小中学生');
    const hasAdult = text.includes('adulto') || text.includes('大人') || text.includes('adult') || text.includes('一般');

    if (hasChild && hasAdult) return '🧑‍💼🧒';
    if (hasChild) return '🧒';
    return '🧑‍💼';
  };

  const filteredInstitutions = selectedDay !== null
    ? institutions.filter(inst => {
        let days: number[] = [];
        try {
          days = typeof inst.operating_days === 'string' 
            ? JSON.parse(inst.operating_days) 
            : inst.operating_days || [];
        } catch (e) {
          console.error("Erro a ler os dias:", inst.operating_days);
        }
        return Array.isArray(days) && days.includes(selectedDay);
      })
    : institutions;

  if (loading) {
    return (
      <div className="w-full bg-white p-8 sm:p-14 rounded-3xl shadow-xl border border-gray-100 text-center text-gray-500 text-lg sm:text-2xl animate-pulse">
        {lang !== 'ja' ? `A carregar escolas em ${cityName}...` : `${cityName}の教室を読み込み中...`}
      </div>
    );
  }

  return (
    <div className="w-full bg-white p-6 sm:p-14 rounded-3xl shadow-xl border border-gray-100">
      
      {/* TÍTULO PADRONIZADO COM O MIEMAP */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-5xl font-extrabold text-gray-800">
          {lang !== 'ja' ? `Aulas em ${cityName}` : `${cityName}の教室`}
        </h2>
        <p className="text-gray-500 mt-3 sm:mt-4 text-base sm:text-2xl font-medium">
          {lang !== 'ja' ? 'Selecione o seu dia de folga' : 'ご希望の曜日を選んでください'}
        </p>
      </div>

      {/* FILTRO DE DIAS DA SEMANA */}
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3.5 mb-8 sm:mb-12">
        {daysFilter.map((day) => {
          const isSelected = selectedDay === day.value;
          return (
            <button
              key={day.labelPt}
              onClick={() => setSelectedDay(day.value)}
              className={`px-5 py-2.5 sm:px-7 sm:py-3 rounded-full text-base sm:text-xl transition-all duration-300 ${
                isSelected 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lang !== 'ja' ? day.labelPt : day.labelJa}
            </button>
          );
        })}
      </div>

      {/* LISTA DE ESCOLAS (CARDS) */}
      <div className="flex flex-col divide-y divide-gray-100">
        {filteredInstitutions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-base sm:text-xl font-medium">
            {lang !== 'ja' ? 'Nenhuma aula encontrada para este dia.' : 'この曜日の教室は見つかりませんでした。'}
          </div>
        ) : (
          filteredInstitutions.map((inst, index) => {
            const allSlots = parseSlots(inst.schedule_slots);
            const visibleSlots = selectedDay !== null
              ? allSlots.filter(slot => Array.isArray(slot.days) && slot.days.includes(selectedDay))
              : allSlots;

            return (
              <div 
                key={inst.id} 
                className={`py-8 sm:py-10 ${index === 0 ? 'pt-2' : ''} ${index === filteredInstitutions.length - 1 ? 'pb-2 border-b-0' : ''} transition-all`}
              >
                
                {/* CABEÇALHO DO CARD: NOME DA ESCOLA + ÍCONES AO LADO (SEM FUNDO) */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
                  <h3 className="text-xl sm:text-3xl font-extrabold text-gray-800">
                    {lang !== 'ja' ? (inst.name_rom || inst.name) : inst.name}
                  </h3>

                  <div className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl">
                    {inst.google_maps_url && (
                      <a 
                        href={inst.google_maps_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        title={lang !== 'ja' ? 'Abrir no Google Maps' : 'Googleマップで開く'}
                        className="hover:scale-110 transition-transform"
                      >
                        🗺️
                      </a>
                    )}
                    {inst.phone && (
                      <a 
                        href={`tel:${inst.phone}`}
                        title={lang !== 'ja' ? 'Ligar' : '電話する'}
                        className="hover:scale-110 transition-transform"
                      >

                        ☎️
                      </a>
                    )}
                    {inst.email && (
                      <a 
                        href={`mailto:${inst.email}`} 
                        title={lang !== 'ja' ? 'Enviar E-mail' : 'メールを送る'}
                        className="hover:scale-110 transition-transform"
                      >
                    
                        ✉️
                      </a>
                    )}
                    
                    {inst.sns_url && (
                      <a 
                        href={inst.sns_url} 
                        target="_blank" 
                        rel="noreferrer" 
                        title={lang !== 'ja' ? 'Abrir Website / SNS' : 'ウェブサイトを開く'}
                        className="hover:scale-110 transition-transform"
                      >
                        🌐
                      </a>
                    )}
                  </div>
                </div>
                
                {/* GRID COM OS 3 ÍCONES */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
                  
                  {/* 1. PÚBLICO-ALVO (APENAS EMOJI) */}
                  <div className="bg-gray-50 p-5 sm:p-6 rounded-xl flex items-center justify-center border border-gray-100">
                    <div className="text-5xl sm:text-6xl">
                      {getAudienceEmoji(inst.target_audience)}
                    </div>
                  </div>
                  
                  {/* 2. VALOR */}
                  <div className="bg-gray-50 p-5 sm:p-6 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
                    <div className="text-3xl sm:text-4xl mb-2">💰</div>
                    <div className="text-base sm:text-lg text-gray-800 whitespace-pre-wrap">
                      {lang !== 'ja' ? inst.fee_description_pt : inst.fee_description_ja}
                    </div>
                  </div>
                  
                  {/* 3. DIAS EM CIMA E HORÁRIOS ABAIXO (FILTRADOS PELO DIA CLICADO) */}
                  <div className="bg-gray-50 p-5 sm:p-6 rounded-xl flex flex-col items-center justify-center text-center border border-gray-100">
                    <div className="text-3xl sm:text-4xl mb-3">📅</div>
                    
                    {visibleSlots.length > 0 ? (
                      <div className="flex flex-col gap-3 w-full">
                        {visibleSlots.map((slot, index) => (
                          <div 
                            key={index} 
                            className={`${index > 0 ? 'pt-3 border-t border-gray-200' : ''}`}
                          >
                            {/* Dia da Semana */}
                            <div className="text-base sm:text-lg font-bold text-gray-800">
                              {lang !== 'ja' ? slot.day_pt : slot.day_ja}
                            </div>
                            {/* Horário logo abaixo */}
                            {slot.time && slot.time !== '-' && (
                              <div className="text-base sm:text-lg text-gray-800 mt-0.5">
                                {slot.time}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-base sm:text-lg font-semibold text-gray-700 whitespace-pre-wrap">
                        {lang !== 'ja' ? inst.schedule_description_pt : inst.schedule_description_ja}
                      </div>
                    )}
                  </div>

                </div>

                {/* OBSERVAÇÕES / FOLGAS */}
                {(inst.description_ja || inst.description_pt) && (
                  <div className="bg-blue-50/50 border border-blue-100 text-gray-800 text-base sm:text-lg p-5 rounded-xl mb-6 flex items-start gap-3.5">
                    <span className="text-xl sm:text-2xl">📝</span>
                    <p className="pt-0.5 leading-relaxed text-justify">
                      {lang !== 'ja' ? inst.description_pt : inst.description_ja}
                    </p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}