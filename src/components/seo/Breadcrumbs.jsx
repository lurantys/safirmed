import { Link } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import { useEffect } from 'react';
import { buildBreadcrumbJsonld } from '@/seo/jsonld';

export default function Breadcrumbs({ items }) {
  useEffect(() => {
    const existing = document.getElementById('breadcrumb-jsonld');
    if (existing) existing.remove();
    const script = document.createElement('script');
    script.id = 'breadcrumb-jsonld';
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(buildBreadcrumbJsonld(items));
    document.head.appendChild(script);
    return () => script.remove();
  }, [items]);

  return (
    <nav aria-label="Fil d'Ariane" className="flex items-center gap-1 text-sm text-slate-400 mb-6 overflow-x-auto">
      {items.map((item, i) => (
        <span key={item.path} className="flex items-center gap-1 shrink-0">
          {i > 0 && <ChevronRight className="h-3.5 w-3.5" />}
          {i === items.length - 1 ? (
            <span className="text-slate-600 font-medium truncate max-w-[200px]">{item.name}</span>
          ) : (
            <Link to={item.path} className="hover:text-blue-600 transition-colors truncate max-w-[200px]">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
