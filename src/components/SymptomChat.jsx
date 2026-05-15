import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, SendHorizonal, Stethoscope, ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSpecialtyDescription } from '@/utils/symptomMatcher';
import { matchSpecialtyWithAI } from '@/utils/aiMatcher';
import { DEFAULT_CITY } from "@/constants";

const SUGGESTIONS = [
  "J'ai de la fièvre et mal à la tête",
  "J'ai mal aux dents",
  "Je suis essoufflé et j'ai des palpitations",
  "Mon enfant tousse et a de la fièvre",
  "J'ai des démangeaisons sur la peau",
  "Je me sens anxieux et je ne dors pas bien",
  "J'ai mal au genou après une chute",
  "J'ai mal aux oreilles",
  "Je suis enceinte et j'ai des douleurs",
  "J'ai du mal à voir de près",
];

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
      addMessage('bot', `D'après vos symptômes, je vous recommande de consulter un **${specialty}**.`, specialty);
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

  const handleSuggestion = (text) => {
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
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          {onBack && (
            <button onClick={onBack} className="p-1.5 hover:bg-slate-100 rounded-xl transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-500" />
            </button>
          )}
          <MessageCircle className="h-5 w-5 text-blue-600" />
          <span className="font-semibold text-slate-800">Analyse des symptômes</span>
          <span className="flex items-center gap-1 text-[11px] bg-amber-50 text-amber-700 font-medium px-2 py-0.5 rounded-full border border-amber-200">
            <Sparkles className="h-3 w-3" />
            IA
          </span>
        </div>
      </div>

      <div className="h-[360px] overflow-y-auto px-5 py-4 space-y-4" style={{ scrollBehavior: 'smooth' }}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] ${msg.role === 'user'
              ? 'bg-blue-600 text-white rounded-2xl rounded-tr-md px-4 py-3'
              : 'bg-slate-100 text-slate-800 rounded-2xl rounded-tl-md px-4 py-3'
            }`}>
              {msg.role === 'bot' && msg.specialty ? (
                <div className="space-y-3">
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className="flex items-start gap-2 bg-white/80 rounded-xl p-3 border border-slate-200">
                    <Stethoscope className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{msg.specialty}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{getSpecialtyDescription(msg.specialty)}</p>
                      <Button
                        size="sm"
                        onClick={() => handleViewDoctors(msg.specialty)}
                        className="mt-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium h-8 px-4"
                      >
                        Voir les médecins
                      </Button>
                    </div>
                  </div>
                  <button
                    onClick={handleNewAnalysis}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                  >
                    Nouvelle analyse
                  </button>
                </div>
              ) : (
                <p className="text-sm leading-relaxed">{msg.text}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 rounded-2xl rounded-tl-md px-4 py-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {messages.length === 1 && !loading && (
          <div className="pt-2">
            <p className="text-xs text-slate-400 font-medium mb-2">Suggestions rapides :</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.slice(0, 5).map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-slate-600 border border-slate-200 rounded-xl px-3 py-1.5 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      <div className="border-t border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Décrivez vos symptômes..."
            disabled={loading || hasResult}
            className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all disabled:opacity-50"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading || hasResult}
            size="icon"
            className="rounded-xl h-10 w-10 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 shrink-0"
          >
            <SendHorizonal className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
