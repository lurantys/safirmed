import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Menu, ArrowUpRight } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function Navbar({ isScrolled = false }) {
  const navigate = useNavigate();

  return (
    <div className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'pt-6 px-4' : 'pt-0 px-0'}`}>
      <nav
        className={`mx-auto flex items-center justify-between transition-all duration-500 ease-in-out ${isScrolled
          ? 'max-w-4xl bg-white/90 backdrop-blur-md shadow-lg rounded-full px-5 h-16 border border-slate-200/60'
          : 'max-w-5xl bg-slate-50 px-6 h-24 border-b border-transparent'
        }`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <img src="/logo.png" alt="SafirMed Logo" className={`transition-all ${isScrolled ? 'h-8' : 'h-10'} object-contain`} />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" className={`hidden sm:flex rounded-full font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 transition-all ${isScrolled ? 'h-10 px-4 text-sm' : 'h-11 px-5 text-base'}`}>
            Patients
          </Button>
          <Button className={`hidden sm:flex rounded-full bg-[#18181A] hover:bg-black text-white shadow-sm transition-all focus:ring-slate-900 items-center gap-2 border border-transparent hover:scale-105 active:scale-95 ${isScrolled ? 'h-10 px-5 text-sm' : 'h-11 px-6 text-base'}`}>
            Docteurs / Soignants <ArrowUpRight className={isScrolled ? 'h-4 w-4' : 'h-4 w-4 text-white/80'} />
          </Button>
          <Button variant="ghost" size="icon" className="sm:hidden -mr-2 hover:bg-slate-100/50">
            <Menu className="h-6 w-6 text-slate-700" />
          </Button>
        </div>
      </nav>
    </div>
  );
}
