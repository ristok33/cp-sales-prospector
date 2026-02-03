"use client";

import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronRight, ChevronLeft, BarChart3, ShieldCheck, 
  AlertCircle, TrendingDown, Wallet, Users2, 
  CreditCard, GraduationCap, Briefcase, Globe,
  Zap, LayoutGrid, Calendar, Info,
  Home, Clock, MousePointer2, UserCheck
} from 'lucide-react';
import Link from 'next/link';

const QuestionTooltip = ({ why, impact, position = 'top' }: { why: string; impact: string; position?: 'top' | 'bottom' }) => {
  return (
    <div className="group relative inline-block">
      <Info size={14} className="text-slate-500 hover:text-slate-300 transition-colors cursor-help" />
      <div className={`absolute z-[9999] ${position === 'bottom' ? 'top-full mt-2 -translate-y-2' : 'bottom-full mb-2 translate-y-2'} right-0 w-64 p-4 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 group-hover:translate-y-0 pointer-events-none`}>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-blue-400 uppercase tracking-[0.2em]">The "Why"</p>
            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{why}</p>
          </div>
          <div className="h-px bg-white/5 w-full" />
          <div className="space-y-1">
            <p className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Business Impact</p>
            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{impact}</p>
          </div>
        </div>
        <div className={`absolute ${position === 'bottom' ? '-top-1 border-l border-t' : '-bottom-1 border-r border-b'} right-2 w-2 h-2 bg-slate-900 border-white/10 rotate-45`} />
      </div>
    </div>
  );
};

const SLIDES = [
  { id: 'problem', title: 'Problem Validation' },
  { id: 'impact', title: 'Financial Impact' },
  { id: 'solution', title: 'Solution Value' },
];

const IntroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-4xl w-full glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border-white/20 shadow-2xl">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 blur-[100px] -ml-48 -mb-48 rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-3">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 mb-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">The CasaPay Loop</span>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Rental Cashflow <br/><span className="text-blue-400">Autopilot.</span>
             </h2>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                CasaPay is the financial engine that powers your Rental Finance Lifecycle—automating collections, securing payouts, and guaranteeing 100% cashflow stability.
             </p>
          </div>

          {/* Loop Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full relative">
             {/* Connector Lines (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-8" />
             
             {[
               { step: 1, title: 'Vetting', icon: UserCheck, desc: 'Tenant acquisition & risk assessment', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
               { step: 2, title: 'Collections', icon: CreditCard, desc: 'Automated rent & deposit payments', color: 'text-blue-400', bg: 'bg-blue-500/10' },
               { step: 3, title: 'Guarantee', icon: ShieldCheck, desc: 'Proactive 100% payment security', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
               { step: 4, title: 'Recovery', icon: Globe, desc: 'Global debt collection & legal', color: 'text-purple-400', bg: 'bg-purple-500/10' },
             ].map((item, i) => (
               <div key={i} className="relative group p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all duration-500 hover:-translate-y-1">
                  <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                     <item.icon size={28} />
                  </div>
                  <div className="space-y-1">
                     <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Step 0{item.step}</p>
                     <h3 className="text-lg font-bold text-white">{item.title}</h3>
                     <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                  </div>
               </div>
             ))}
          </div>

          <button 
            onClick={onClose}
            className="group relative px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)] hover:shadow-white/30"
          >
            START VALIDATION
            <div className="absolute inset-0 rounded-2xl bg-white blur-lg opacity-0 group-hover:opacity-20 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function SalesDeck() {
  const [showIntro, setShowIntro] = useState(false);
  
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem('casapay-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const closeIntro = () => {
    setShowIntro(false);
    localStorage.setItem('casapay-intro-seen', 'true');
  };

  const [currentSlide, setCurrentSlide] = useState(0);
  const [answers, setAnswers] = useState({
    payments: 'bank',
    tenants: 'mixed',
    type: 'mixed',
    securityDeposit: 'medium',
    latePayers: 'medium',
    defaultRate: 'medium',
    portfolioSize: '100-500',
    contractDuration: '6-12m',
    occupancyRate: '80-95',
    timeToContract: '7-21',
    onlineBooking: 'no',
    pms: 'no'
  });

  const nextSlide = () => setCurrentSlide(prev => Math.min(prev + 1, SLIDES.length - 1));
  const prevSlide = () => setCurrentSlide(prev => Math.max(prev - 1, 0));

  const fitScore = useMemo(() => {
    let score = 10;
    if (answers.payments === 'cash') score += 10;
    if (answers.payments === 'bank') score += 5;
    
    if (answers.tenants === 'foreigner') score += 10;
    if (answers.tenants === 'mixed') score += 5;

    if (answers.type === 'students') score += 10;
    if (answers.type === 'mixed') score += 5;

    if (answers.securityDeposit === 'low') score += 10;
    if (answers.securityDeposit === 'medium') score += 5;

    if (answers.latePayers === 'high') score += 10;
    if (answers.latePayers === 'medium') score += 5;

    if (answers.defaultRate === 'high') score += 10;
    if (answers.defaultRate === 'medium') score += 5;

    if (answers.portfolioSize === '500+') score += 10;
    if (answers.portfolioSize === '100-500') score += 5;

    if (answers.contractDuration === '<6m') score += 10;
    if (answers.contractDuration === '6-12m') score += 5;

    if (answers.occupancyRate === '<80') score += 10;
    if (answers.occupancyRate === '80-95') score += 5;

    if (answers.timeToContract === '>21') score += 10;
    if (answers.timeToContract === '7-21') score += 5;

    if (answers.onlineBooking === 'no') score += 10;
    if (answers.onlineBooking === 'semi') score += 5;

    if (answers.pms === 'no' || answers.pms === '3rd-party') score += 10;
    if (answers.pms === 'in-house') score += 15;

    return Math.min(score, 100);
  }, [answers]);

  const renderSlide = () => {
    switch (currentSlide) {
      case 0:
        return (
          <div className="flex flex-col lg:flex-row gap-6 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Sidebar: Fit Score Visualization */}
            <div className="lg:w-80 shrink-0 flex flex-col items-center justify-center glass-card p-6 rounded-3xl border border-white/10 bg-white/5">
              <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    className="text-white/5"
                  />
                  <circle
                    cx="96"
                    cy="96"
                    r="88"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 88}
                    strokeDashoffset={2 * Math.PI * 88 * (1 - fitScore / 100)}
                    className={`${fitScore > 75 ? 'text-emerald-500' : fitScore > 50 ? 'text-blue-500' : 'text-amber-500'} transition-all duration-1000 ease-out`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-white">{fitScore}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Fit Score</span>
                </div>
                <div className={`absolute -inset-2 rounded-full blur-2xl opacity-20 ${fitScore > 75 ? 'bg-emerald-500' : fitScore > 50 ? 'bg-blue-500' : 'bg-amber-500'}`} />
              </div>
              
              <div className="text-center w-full">
                <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tight">
                  {fitScore > 75 ? "Highly Qualified" : fitScore > 50 ? "Solid Candidate" : "Moderate Value"}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed mb-6">
                  {fitScore > 75 ? "Priority: HIGH. Recommended immediate engagement." : "Focus on highlighting automation and guarantee features."}
                </p>

                <div className="grid grid-cols-2 gap-2 w-full">
                  {[
                    { label: 'Scale Potential', val: answers.portfolioSize === '500+' ? 'Huge' : answers.portfolioSize === '100-500' ? 'High' : 'Med', color: 'text-indigo-400' },
                    { label: 'Ops Velocity', val: answers.contractDuration === '<6m' ? 'Fast' : 'Stable', color: 'text-pink-400' },
                    { label: 'Risk Profile', val: answers.defaultRate === 'high' ? 'High' : answers.defaultRate === 'medium' ? 'Mod' : 'Low', color: 'text-amber-400' },
                    { label: 'Dealflow', val: answers.portfolioSize === '500+' ? 'Ent' : 'Mid', color: 'text-emerald-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-2 rounded-xl text-center">
                        <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-0.5">{stat.label}</p>
                        <p className={`text-[10px] font-bold ${stat.color}`}>{stat.val}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Questions Grid */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1.5">
              {/* Question 1: Portfolio Size */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                      <LayoutGrid size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Portfolio Size</h3>
                  </div>
                  <QuestionTooltip 
                    why="Determines total revenue opportunity and operational scale." 
                    impact="Larger portfolios benefit more from automated collection and batch processing." 
                    position="bottom"
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: '<100', label: '< 100 units', weight: 0 },
                    { id: '100-500', label: '100 - 500 units', weight: 5 },
                    { id: '500+', label: '500+ units', weight: 10 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.portfolioSize === opt.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="portfolioSize" 
                        className="hidden" 
                        checked={answers.portfolioSize === opt.id} 
                        onChange={() => setAnswers({...answers, portfolioSize: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.portfolioSize === opt.id ? 'border-indigo-500 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 2: Average Contract Duration */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-pink-500/20 rounded-lg text-pink-400">
                      <Calendar size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Average Contract Duration</h3>
                  </div>
                  <QuestionTooltip 
                    why="Measures tenant turnover velocity." 
                    impact="Shorter contracts mean higher admin burden; CasaPay automates the repeat screening and setup." 
                    position="bottom"
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: '<6m', label: '< 6 months', weight: 10 },
                    { id: '6-12m', label: '6 - 12 months', weight: 5 },
                    { id: '12+m', label: '12+ months', weight: 0 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.contractDuration === opt.id ? 'bg-pink-500/10 border-pink-500/50 text-pink-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="contractDuration" 
                        className="hidden" 
                        checked={answers.contractDuration === opt.id} 
                        onChange={() => setAnswers({...answers, contractDuration: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.contractDuration === opt.id ? 'border-pink-500 bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 3: Local vs Foreigner Ratio */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                      <Globe size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Local vs Foreigner Ratio</h3>
                  </div>
                  <QuestionTooltip 
                    why="Foreigners are often forced into massive upfront rent." 
                    impact="CasaPay eliminates the need for 6-12 month upfront payments, opening your property to a global market." 
                    position="bottom"
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'local', label: 'Mostly Local', weight: 0 },
                    { id: 'mixed', label: 'Balanced Mix', weight: 5 },
                    { id: 'foreigner', label: 'Foreigners', weight: 10 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.tenants === opt.id ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="tenants" 
                        className="hidden" 
                        checked={answers.tenants === opt.id} 
                        onChange={() => setAnswers({...answers, tenants: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.tenants === opt.id ? 'border-purple-500 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 4: Students vs Professionals */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-400">
                      <GraduationCap size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Students vs Professionals</h3>
                  </div>
                  <QuestionTooltip 
                    why="Students often lack credit history." 
                    impact="Our embedded screening replaces traditional credit checks, making student default risk manageable." 
                    position="bottom"
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'professionals', label: 'Professionals', weight: 0 },
                    { id: 'mixed', label: 'Balanced Mix', weight: 5 },
                    { id: 'students', label: 'Mostly Students', weight: 10 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.type === opt.id ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="type" 
                        className="hidden" 
                        checked={answers.type === opt.id} 
                        onChange={() => setAnswers({...answers, type: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.type === opt.id ? 'border-emerald-500 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 5: Occupancy Rate */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-teal-500/20 rounded-lg text-teal-400">
                      <Home size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Occupancy Rate</h3>
                  </div>
                  <QuestionTooltip 
                    why="Measures inventory efficiency." 
                    impact="High vacancy costs are often linked to friction in the deposit/onboarding flow." 
                    position="bottom"
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: '<80', label: '< 80%', weight: 10 },
                    { id: '80-95', label: '80 - 95%', weight: 5 },
                    { id: '>95', label: '> 95%', weight: 0 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.occupancyRate === opt.id ? 'bg-teal-500/10 border-teal-500/50 text-teal-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="occupancyRate" 
                        className="hidden" 
                        checked={answers.occupancyRate === opt.id} 
                        onChange={() => setAnswers({...answers, occupancyRate: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.occupancyRate === opt.id ? 'border-teal-500 bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 6: Time to Contract */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-orange-500/20 rounded-lg text-orange-400">
                      <Clock size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Time to Contract</h3>
                  </div>
                  <QuestionTooltip 
                    why="Measures sales cycle velocity." 
                    impact="Reducing friction with CasaPay speeds up the move-in process and reduces empty room days." 
                    position="bottom"
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: '<7', label: '< 7 days', weight: 0 },
                    { id: '7-21', label: '7 - 21 days', weight: 5 },
                    { id: '>21', label: '> 21 days', weight: 10 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.timeToContract === opt.id ? 'bg-orange-500/10 border-orange-500/50 text-orange-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="timeToContract" 
                        className="hidden" 
                        checked={answers.timeToContract === opt.id} 
                        onChange={() => setAnswers({...answers, timeToContract: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.timeToContract === opt.id ? 'border-orange-500 bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 7: Online Payments */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                      <CreditCard size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Online Payments</h3>
                  </div>
                  <QuestionTooltip 
                    why="Validates current tech stack." 
                    impact="Manual/Cash workflows are high-risk and labor-intensive; we provide a digital first-path." 
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'cash', label: 'Manual (<30%)', weight: 10 },
                    { id: 'bank', label: 'Mixed (30-70%)', weight: 5 },
                    { id: 'online', label: 'Digital (>70%)', weight: 0 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.payments === opt.id ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="payments" 
                        className="hidden" 
                        checked={answers.payments === opt.id} 
                        onChange={() => setAnswers({...answers, payments: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.payments === opt.id ? 'border-blue-500 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 8: Online Booking Option */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-indigo-500/20 rounded-lg text-indigo-400">
                      <MousePointer2 size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Online Booking Option</h3>
                  </div>
                  <QuestionTooltip 
                    why="Measures conversion friction." 
                    impact="Manual bookings are the #1 bottleneck for scaling; CasaPay enables instant, digital-first onboarding." 
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'no', label: 'No', weight: 10 },
                    { id: 'semi', label: 'Semi-automated', weight: 5 },
                    { id: 'fully', label: 'Fully automated', weight: 0 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.onlineBooking === opt.id ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="onlineBooking" 
                        className="hidden" 
                        checked={answers.onlineBooking === opt.id} 
                        onChange={() => setAnswers({...answers, onlineBooking: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.onlineBooking === opt.id ? 'border-indigo-500 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 9: PMS */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-500/20 rounded-lg text-purple-400">
                      <Briefcase size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">PMS</h3>
                  </div>
                  <QuestionTooltip 
                    why="Determines technical maturity and integration path." 
                    impact=" 'No' or '3rd party' means our @casapay.me alias logic is perfect; 'In-house' suggests a robust direct API integration opportunity." 
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'no', label: 'No', weight: 10 },
                    { id: '3rd-party', label: '3rd party', weight: 10 },
                    { id: 'in-house', label: 'In-house', weight: 15 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.pms === opt.id ? 'bg-purple-500/10 border-purple-500/50 text-purple-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="pms" 
                        className="hidden" 
                        checked={answers.pms === opt.id} 
                        onChange={() => setAnswers({...answers, pms: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.pms === opt.id ? 'border-purple-500 bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 10: Average Security Deposit / Upfront Rent */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-400">
                      <Wallet size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Average Security Deposit / Upfront Rent</h3>
                  </div>
                  <QuestionTooltip 
                    why="High deposits are the #1 cause of tenant drop-off." 
                    impact="Reducing deposits increases your conversion rate and lead flow immediately." 
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'low', label: '0 - 1 Month', weight: 10 },
                    { id: 'medium', label: '2 - 3 Months', weight: 5 },
                    { id: 'high', label: '4+ Months', weight: 0 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.securityDeposit === opt.id ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="securityDeposit" 
                        className="hidden" 
                        checked={answers.securityDeposit === opt.id} 
                        onChange={() => setAnswers({...answers, securityDeposit: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.securityDeposit === opt.id ? 'border-blue-500 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 11: Late Payers % */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-500/20 rounded-lg text-amber-400">
                      <TrendingDown size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Late Payers %</h3>
                  </div>
                  <QuestionTooltip 
                    why="Measures operational drag." 
                    impact="We guarantee on-time payouts, removing the need for manual debt collection and follow-ups." 
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'low', label: '< 5% (Low)', weight: 0 },
                    { id: 'medium', label: '5 - 15% (Mod)', weight: 5 },
                    { id: 'high', label: '> 15% (High)', weight: 10 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.latePayers === opt.id ? 'bg-amber-500/10 border-amber-500/50 text-amber-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="latePayers" 
                        className="hidden" 
                        checked={answers.latePayers === opt.id} 
                        onChange={() => setAnswers({...answers, latePayers: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.latePayers === opt.id ? 'border-amber-500 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 12: Default % */}
              <div className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-red-500/20 rounded-lg text-red-400">
                      <AlertCircle size={16} />
                    </div>
                    <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">Default %</h3>
                  </div>
                  <QuestionTooltip 
                    why="Direct hit to NOI (Net Operating Income)." 
                    impact="CasaPay covers the loss, ensuring your cashflow is protected even if a tenant defaults." 
                  />
                </div>
                <div className="space-y-1.5">
                  {[
                    { id: 'low', label: '< 1% (Low)', weight: 0 },
                    { id: 'medium', label: '1 - 3% (Mod)', weight: 5 },
                    { id: 'high', label: '> 3% (High)', weight: 10 },
                  ].map(opt => (
                    <label key={opt.id} className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${answers.defaultRate === opt.id ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                        <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                          +{opt.weight}
                        </span>
                      </div>
                      <input 
                        type="radio" 
                        name="defaultRate" 
                        className="hidden" 
                        checked={answers.defaultRate === opt.id} 
                        onChange={() => setAnswers({...answers, defaultRate: opt.id})}
                      />
                      <div className={`w-3 h-3 rounded-full border-2 ${answers.defaultRate === opt.id ? 'border-red-500 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'border-slate-600'}`} />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 1:
        const isHighLate = answers.latePayers === 'high';
        const isMedLate = answers.latePayers === 'medium';
        const isHighDefault = answers.defaultRate === 'high';
        const isMedDefault = answers.defaultRate === 'medium';
        const isLowOccupancy = answers.occupancyRate === '<80';
        const isMedOccupancy = answers.occupancyRate === '80-95';
        const isSlowContract = answers.timeToContract === '>21';
        const isMedContract = answers.timeToContract === '7-21';
        const isManualBooking = answers.onlineBooking === 'no';
        const isSemiBooking = answers.onlineBooking === 'semi';
        
        const scale = answers.portfolioSize === '500+' ? 10 : answers.portfolioSize === '100-500' ? 3 : 1;
        const baseLeakage = (isHighDefault ? 85000 : isMedDefault ? 45000 : 12000) * scale;
        const vacancyLeakage = (isLowOccupancy ? 50000 : isMedOccupancy ? 20000 : 0) * scale;
        const speedLeakage = (isSlowContract ? 30000 : isMedContract ? 10000 : 0) * scale;
        const bookingLeakage = (isManualBooking ? 15000 : isSemiBooking ? 5000 : 0) * scale;
        const leakage = baseLeakage + vacancyLeakage + speedLeakage + bookingLeakage;

        const adminHours = Math.round((answers.portfolioSize === '500+' ? 160 : answers.portfolioSize === '100-500' ? 60 : 20) * (isHighLate ? 1.5 : 1) * (isSlowContract ? 1.2 : 1) * (isManualBooking ? 1.3 : isSemiBooking ? 1.1 : 1));

        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 glass-card p-8 rounded-3xl border border-white/10 bg-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                   <BarChart3 size={120} />
                </div>
                <h3 className="text-xl font-black text-white mb-6 uppercase tracking-tight">Cashflow Today</h3>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Collected on Time</span>
                         <span className="text-emerald-400">{isHighLate ? '65%' : isMedLate ? '80%' : '92%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-emerald-500 ${isHighLate ? 'w-[65%]' : isMedLate ? 'w-[80%]' : 'w-[92%]'} shadow-[0_0_12px_rgba(16,185,129,0.4)]`} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Late Payments (30+ days)</span>
                         <span className="text-amber-400">{isHighLate ? '25%' : isMedLate ? '15%' : '7%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-amber-500 ${isHighLate ? 'w-[25%]' : isMedLate ? 'w-[15%]' : 'w-[7%]'} shadow-[0_0_12px_rgba(245,158,11,0.4)]`} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Default / Bad Debt</span>
                         <span className="text-red-500">{isHighDefault ? '10%' : isMedDefault ? '5%' : '1%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-red-500 ${isHighDefault ? 'w-[10%]' : isMedDefault ? 'w-[5%]' : 'w-[1%]'} shadow-[0_0_12px_rgba(239,68,68,0.4)]`} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Vacancy / Velocity Loss</span>
                         <span className="text-blue-400">{isLowOccupancy ? '25%' : isMedOccupancy ? '12%' : '4%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-blue-500 ${isLowOccupancy ? 'w-[25%]' : isMedOccupancy ? 'w-[12%]' : 'w-[4%]'} shadow-[0_0_12px_rgba(59,130,246,0.4)]`} />
                      </div>
                   </div>
                </div>

                <div className="mt-10 p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                   <div className="flex items-start gap-4">
                      <AlertCircle className="text-red-500 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-bold text-slate-200">Revenue Leakage Detected</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Your current model loses approximately <span className="text-red-400 font-black">€{leakage.toLocaleString()} / year</span> in interest-free credit given to tenants and recovery costs.
                        </p>
                      </div>
                   </div>
                </div>
              </div>

              <div className="w-full md:w-80 space-y-4">
                 {[
                   { label: 'Admin Hours/Mo', val: `${adminHours}h`, desc: 'Manual reconciliation & chasing' },
                   { label: 'Collection Cost', val: `€${(scale * 1200).toLocaleString()}`, desc: 'Processing fees & manual labor' },
                   { label: 'Tenant Friction', val: answers.contractDuration === '<6m' ? 'Extreme' : 'High', desc: 'Due to manual payment chasing' },
                 ].map((card, i) => (
                   <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/10">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                      <p className="text-2xl font-black text-white">{card.val}</p>
                      <p className="text-[10px] text-slate-400 mt-2">{card.desc}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center h-full space-y-12 animate-in fade-in slide-in-from-top-4 duration-700">
             <div className="text-center space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/30 mb-2">
                   <ShieldCheck size={14} className="text-emerald-500" />
                   <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">The CasaPay Advantage</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Zero-Risk Cashflow</h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  We guarantee your rent hits your account on the 1st of every month, no matter when or how the tenant pays.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[
                  { title: '100% Guaranteed', desc: 'Full rent protection against tenant defaults and late payments.', icon: ShieldCheck, color: 'text-emerald-400' },
                  { title: 'Automated Admin', desc: 'Eliminate manual reconciliation with automated bank-grade sync.', icon: Zap, color: 'text-blue-400' },
                  { title: 'Global Coverage', desc: 'Seamlessly accept payments from international students and expats.', icon: Globe, color: 'text-purple-400' },
                  { 
                    title: 'Integration Path', 
                    desc: answers.pms === 'in-house' 
                      ? 'Direct API integration for deep, bi-directional sync with your custom PMS.' 
                      : 'Lightweight Alias integration via @casapay.me logic—live in hours, not weeks.', 
                    icon: Zap, 
                    color: 'text-amber-400' 
                  },
                ].map((feature, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-1 group">
                     <div className={`p-3 bg-white/5 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform ${feature.color}`}>
                        <feature.icon size={24} />
                     </div>
                     <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                     <p className="text-sm text-slate-400 leading-relaxed font-medium">{feature.desc}</p>
                  </div>
                ))}
             </div>

             <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-emerald-400/30">
                Start Pilot Deployment
             </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-200 font-sans antialiased overflow-hidden selection:bg-blue-500/30 flex flex-col">
      <IntroModal isOpen={showIntro} onClose={closeIntro} />
      {/* Navigation */}
      <nav className="h-12 border-b border-white/10 bg-[#0F172A]/80 backdrop-blur-xl flex items-center justify-between px-6 md:px-8 shrink-0 z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-7 h-7 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-white/20 transition-all">
              <ChevronLeft size={14} className="text-slate-400 group-hover:text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="font-black text-[10px] tracking-[0.2em] uppercase leading-none text-white">Sales Deck</h1>
              <p className="text-[8px] text-slate-500 font-bold tracking-widest uppercase mt-0.5">Interactive Draft</p>
            </div>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => setCurrentSlide(i)}
              className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${
                currentSlide === i 
                  ? 'bg-white text-slate-950 shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {slide.title}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
           <div className="w-px h-5 bg-white/10 mx-2 hidden sm:block" />
           <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Live Pilot</span>
           </div>
        </div>
      </nav>

      <main className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-6 overflow-y-auto custom-scrollbar">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(59,130,246,0.6)]" 
            style={{ width: `${((currentSlide + 1) / SLIDES.length) * 100}%` }}
          />
        </div>

        {/* Slide Header */}
        <div className="mb-4">
           <span className="text-blue-500 font-black text-[10px] uppercase tracking-[0.3em]">Slide 0{currentSlide + 1}</span>
           <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight mt-1">{SLIDES[currentSlide].title}</h2>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderSlide()}
        </div>

        {/* Footer Controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
           <button 
             onClick={prevSlide}
             disabled={currentSlide === 0}
             className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all ${
               currentSlide === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/5'
             }`}
           >
              <ChevronLeft size={16} />
              Previous
           </button>

           <div className="flex gap-2">
              {SLIDES.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentSlide === i ? 'bg-blue-500 w-4' : 'bg-white/10'}`} 
                />
              ))}
           </div>

           <button 
             onClick={nextSlide}
             disabled={currentSlide === SLIDES.length - 1}
             className={`flex items-center gap-2 px-8 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
               currentSlide === SLIDES.length - 1 
                 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                 : 'bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20'
             }`}
           >
              {currentSlide === SLIDES.length - 1 ? 'End of Deck' : 'Next Slide'}
              <ChevronRight size={16} />
           </button>
        </div>
      </main>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInFromRight {
          from { transform: translateX(20px); }
          to { transform: translateX(0); }
        }
        @keyframes slideInFromBottom {
          from { transform: translateY(20px); }
          to { transform: translateY(0); }
        }
        @keyframes slideInFromTop {
          from { transform: translateY(-20px); }
          to { transform: translateY(0); }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-in { animation-fill-mode: both; }
        .fade-in { animation-name: fadeIn; }
        .slide-in-from-right-4 { animation-name: slideInFromRight; }
        .slide-in-from-bottom-4 { animation-name: slideInFromBottom; }
        .slide-in-from-top-4 { animation-name: slideInFromTop; }
        .zoom-in { animation-name: zoomIn; }
        
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
}
