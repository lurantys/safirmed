import { useState } from 'react';
import { ChevronDown } from "lucide-react";
import { useEffect } from 'react';
import { buildFAQJsonld } from '@/seo/jsonld';

export default function FAQSection({ items, title = "Questions fréquentes" }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const existing = document.getElementById('faq-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'faq-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(buildFAQJsonld(items));
    document.head.appendChild(script);
    return () => script.remove();
  }, [items]);

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{title}</h2>
      <div className="divide-y divide-slate-100">
        {items.map((item, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full flex items-center justify-between py-3 sm:py-4 text-left gap-3"
              aria-expanded={openIndex === i}
            >
              <span className="text-sm sm:text-base font-medium text-slate-800">{item.question}</span>
              <ChevronDown className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <p className="text-sm text-slate-500 pb-3 sm:pb-4 leading-relaxed">{item.answer}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
