import { Link } from 'react-router-dom';
import { ArrowRight } from "lucide-react";

export default function RelatedLinks({ title, links, columns = 2 }) {
  if (!links || links.length === 0) return null;

  return (
    <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-100 shadow-sm">
      <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-5">{title}</h2>
      <div className={`grid grid-cols-1 sm:grid-cols-${columns} gap-2`}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-slate-600 hover:text-blue-700 transition-colors text-sm font-medium group"
          >
            <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0" />
            <span className="truncate">{link.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
