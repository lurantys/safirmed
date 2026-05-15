import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, SendHorizonal, Stethoscope, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSpecialtyDescription } from '@/utils/symptomMatcher';
import { matchSpecialtyWithAI } from '@/utils/aiMatcher';
import { DEFAULT_CITY } from "@/constants";

const DOCTOR_TITLES = {
  "Médecine Générale": "un médecin généraliste",
  "Dentaire": "un dentiste",
  "Gynécologie – Obstétrique": "un gynécologue",
  "Pédiatrie": "un pédiatre",
  "Cardiologie": "un cardiologue",
  "Ophtalmologie": "un ophtalmologue",
  "Dermatologie": "un dermatologue",
  "ORL – Oto-Rhino-Laryngologie": "un ORL",
  "Orthopédie – Traumatologie": "un orthopédiste",
  "Psychiatrie – Psychologie": "un psychiatre",
};

export default function SymptomChat({ onBack }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Bonjour ! Décrivez vos symptômes en quelques mots, et je vous recommanderai la spécialité médicale adaptée." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const addMessage = (role, text, specialty) => {
    setMessages(prev => [...prev, { id: Date.now(), role, text, specialty }]);
  };

  const analyzeSymptoms = async (text) => {
    setLoading(true);
    const specialty = await matchSpecialtyWithAI(text);
    if (specialty) {
      const doctor = DOCTOR_TITLES[specialty] || `un spécialiste en ${specialty.toLowerCase()}`;
      addMessage('bot', `D'après vos symptômes, je vous recommande de consulter **${doctor}**.`, specialty);
    } else {
      addMessage('bot', "Je n'ai pas pu analyser vos symptômes pour le moment. Veuillez réessayer ou utiliser la recherche par spécialité.");
    }
    setLoading(false);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    addMessage('user', text);
    analyzeSymptoms(text);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleViewDoctors = (specialty) => {
    navigate(`/search?q=${encodeURIComponent(specialty)}&city=${encodeURIComponent(DEFAULT_CITY)}`);
  };

  const handleNewAnalysis = () => {
    setMessages([
      { id: Date.now(), role: 'bot', text: "Bonjour ! Décrivez vos symptômes en quelques mots, et je vous recommanderai la spécialité médicale adaptée." }
    ]);
    setInput('');
    setLoading(false);
  };

  const lastMessage = messages[messages.length - 1];
  const hasResult = lastMessage?.role === 'bot' && lastMessage?.specialty;

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 -ml-1 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </button>
          )}
          <div className="h-9 w-9 rounded-xl bg-blue-50 flex items-center justify-center">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <span className="font-semibold text-slate-800">Analyse des symptômes</span>
            <p className="text-xs text-slate-400">Décrivez ce que vous ressentez</p>
          </div>
          <span className="flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-200 ml-2">
            <Sparkles className="h-3 w-3" />
            IA
          </span>
        </div>
      </div>

      <div className="h-[400px] overflow-y-auto px-6 py-5 space-y-4" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3'
              : 'bg-slate-50 text-slate-800 rounded-2xl rounded-tl-md px-4 py-3'
            }`}>
              {msg.role === 'bot' && msg.specialty ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Stethoscope className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 text-sm">{msg.specialty}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{getSpecialtyDescription(msg.specialty)}</p>
                        <Button
                          size="sm"
                          onClick={() => handleViewDoctors(msg.specialty)}
                          className="mt-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-8 px-4"
                        >
                          Voir les médecins
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-50 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {!hasResult && (
        <div className="border-t border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Décrivez vos symptômes..."
              disabled={loading}
              className="flex-1 bg-slate-50 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all disabled:opacity-50"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              size="icon"
              className="rounded-xl h-11 w-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0"
            >
              <SendHorizonal className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}

      {hasResult && (
        <div className="border-t border-slate-100 px-6 py-4">
          <Button
            onClick={handleNewAnalysis}
            variant="outline"
            className="w-full rounded-xl text-sm font-medium h-11 border-slate-300 text-slate-600 hover:text-slate-900"
          >
            Nouvelle analyse
          </Button>
        </div>
      )}
    </div>
  );
}
