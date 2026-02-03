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

const QuestionTooltip = ({ why, impact, position = 'top' }: { why: string; impact: string; position?: 'top' | 'bottom' }) => {
  return (
    <div className="group relative inline-block">
      <Info size={14} className="text-slate-500 hover:text-slate-300 transition-colors cursor-help" />
      <div className={`absolute z-[9999] ${position === 'bottom' ? 'top-full mt-2 -translate-y-2' : 'bottom-full mb-2 translate-y-2'} right-0 w-64 p-4 bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 group-hover:translate-y-0 pointer-events-none`}>
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">The "Why"</p>
            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{why}</p>
          </div>
          <div className="h-px bg-white/5 w-full" />
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Business Impact</p>
            <p className="text-[11px] text-slate-200 leading-relaxed font-medium">{impact}</p>
          </div>
        </div>
        <div className={`absolute ${position === 'bottom' ? '-top-1 border-l border-t' : '-bottom-1 border-r border-b'} right-2 w-2 h-2 bg-slate-900 border-white/10 rotate-45`} />
      </div>
    </div>
  );
};

const STEPS = [
  { id: 'problem', title: 'Problem Validation' },
  { id: 'impact', title: 'Financial Impact' },
  { id: 'solution', title: 'Solution Value' },
];

const QUESTIONS = [
  {
    key: 'portfolioSize',
    title: 'Portfolio Size',
    icon: LayoutGrid,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Determines total revenue opportunity and operational scale.',
    impact: 'Larger portfolios benefit more from automated collection and batch processing.',
    options: [
      { id: '<100', label: '< 100 units', weight: 0 },
      { id: '100-500', label: '100 - 500 units', weight: 5 },
      { id: '500+', label: '500+ units', weight: 10 },
    ]
  },
  {
    key: 'contractDuration',
    title: 'Average Contract Duration',
    icon: Calendar,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Measures tenant turnover velocity.',
    impact: 'Shorter contracts mean higher admin burden; CasaPay automates the repeat screening and setup.',
    options: [
      { id: '<6m', label: '< 6 months', weight: 10 },
      { id: '6-12m', label: '6 - 12 months', weight: 5 },
      { id: '12+m', label: '12+ months', weight: 0 },
    ]
  },
  {
    key: 'tenants',
    title: 'Local vs Foreigner Ratio',
    icon: Globe,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Foreigners are often forced into massive upfront rent.',
    impact: 'CasaPay eliminates the need for 6-12 month upfront payments, opening your property to a global market.',
    options: [
      { id: 'local', label: 'Mostly Local', weight: 0 },
      { id: 'mixed', label: 'Balanced Mix', weight: 5 },
      { id: 'foreigner', label: 'Foreigners', weight: 10 },
    ]
  },
  {
    key: 'type',
    title: 'Students vs Professionals',
    icon: GraduationCap,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Students often lack credit history.',
    impact: 'Our embedded screening replaces traditional credit checks, making student default risk manageable.',
    options: [
      { id: 'professionals', label: 'Professionals', weight: 0 },
      { id: 'mixed', label: 'Balanced Mix', weight: 5 },
      { id: 'students', label: 'Mostly Students', weight: 10 },
    ]
  },
  {
    key: 'occupancyRate',
    title: 'Occupancy Rate',
    icon: Home,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Measures inventory efficiency.',
    impact: 'High vacancy costs are often linked to friction in the deposit/onboarding flow.',
    options: [
      { id: '<80', label: '< 80%', weight: 10 },
      { id: '80-95', label: '80 - 95%', weight: 5 },
      { id: '>95', label: '> 95%', weight: 0 },
    ]
  },
  {
    key: 'timeToContract',
    title: 'Time to Contract',
    icon: Clock,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Measures sales cycle velocity.',
    impact: 'Reducing friction with CasaPay speeds up the move-in process and reduces empty room days.',
    options: [
      { id: '<7', label: '< 7 days', weight: 0 },
      { id: '7-21', label: '7 - 21 days', weight: 5 },
      { id: '>21', label: '> 21 days', weight: 10 },
    ]
  },
  {
    key: 'payments',
    title: 'Online Payments',
    icon: CreditCard,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Validates current tech stack.',
    impact: 'Manual/Cash workflows are high-risk and labor-intensive; we provide a digital first-path.',
    options: [
      { id: 'cash', label: 'Manual (<30%)', weight: 10 },
      { id: 'bank', label: 'Mixed (30-70%)', weight: 5 },
      { id: 'online', label: 'Digital (>70%)', weight: 0 },
    ]
  },
  {
    key: 'onlineBooking',
    title: 'Online Booking Option',
    icon: MousePointer2,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Measures conversion friction.',
    impact: 'Manual bookings are the #1 bottleneck for scaling; CasaPay enables instant, digital-first onboarding.',
    options: [
      { id: 'no', label: 'No', weight: 10 },
      { id: 'semi', label: 'Semi-automated', weight: 5 },
      { id: 'fully', label: 'Fully automated', weight: 0 },
    ]
  },
  {
    key: 'pms',
    title: 'PMS',
    icon: Briefcase,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Determines technical maturity and integration path.',
    impact: " 'No' or '3rd party' means our @casapay.me alias logic is perfect; 'In-house' suggests a robust direct API integration opportunity.",
    options: [
      { id: 'no', label: 'No', weight: 10 },
      { id: '3rd-party', label: '3rd party', weight: 10 },
      { id: 'in-house', label: 'In-house', weight: 15 },
    ]
  },
  {
    key: 'securityDeposit',
    title: 'Security Deposit / Upfront Rent',
    icon: Wallet,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'High deposits are the #1 cause of tenant drop-off.',
    impact: 'Reducing deposits increases your conversion rate and lead flow immediately.',
    options: [
      { id: 'low', label: '0 - 1 Month', weight: 10 },
      { id: 'medium', label: '2 - 3 Months', weight: 5 },
      { id: 'high', label: '4+ Months', weight: 0 },
    ]
  },
  {
    key: 'latePayers',
    title: 'Late Payers %',
    icon: TrendingDown,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Measures operational drag.',
    impact: 'We guarantee on-time payouts, removing the need for manual debt collection and follow-ups.',
    options: [
      { id: 'low', label: '< 5% (Low)', weight: 0 },
      { id: 'medium', label: '5 - 15% (Mod)', weight: 5 },
      { id: 'high', label: '> 15% (High)', weight: 10 },
    ]
  },
  {
    key: 'defaultRate',
    title: 'Default %',
    icon: AlertCircle,
    color: 'text-slate-400',
    bg: 'bg-slate-500/20',
    activeClass: 'bg-slate-500/10 border-slate-500/50 text-slate-200',
    dotClass: 'border-slate-400 bg-slate-400 shadow-[0_0_8px_rgba(148,163,184,0.6)]',
    why: 'Direct hit to NOI (Net Operating Income).',
    impact: 'CasaPay covers the loss, ensuring your cashflow is protected even if a tenant defaults.',
    options: [
      { id: 'low', label: '< 1% (Low)', weight: 0 },
      { id: 'medium', label: '1 - 3% (Mod)', weight: 5 },
      { id: 'high', label: '> 3% (High)', weight: 10 },
    ]
  }
];

const IntroModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="max-w-4xl w-full glass-card rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden border-white/20 shadow-2xl">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-slate-500/10 blur-[100px] -mr-48 -mt-48 rounded-full" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-slate-500/10 blur-[100px] -ml-48 -mb-48 rounded-full" />
        
        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="space-y-3">
             <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                Rental Cashflow <span className="text-slate-400">Autopilot.</span>
             </h2>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
                The financial engine for your <span className="text-white">Rental Finance Lifecycle</span>—automating collections and guaranteeing 100% cashflow stability.
             </p>
          </div>

          {/* Loop Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full relative">
             {/* Connector Lines (Desktop) */}
             <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-8" />
             
             {[
               { step: 1, title: 'Vetting', icon: UserCheck, desc: 'Tenant acquisition & risk assessment', color: 'text-slate-400', bg: 'bg-slate-500/10' },
               { step: 2, title: 'Collections', icon: CreditCard, desc: 'Automated rent & deposit payments', color: 'text-slate-400', bg: 'bg-slate-500/10' },
               { step: 3, title: 'Guarantee', icon: ShieldCheck, desc: 'Proactive 100% payment security', color: 'text-slate-400', bg: 'bg-slate-500/10' },
               { step: 4, title: 'Recovery', icon: Globe, desc: 'Global debt collection & legal', color: 'text-slate-400', bg: 'bg-slate-500/10' },
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
  const [showIntro, setShowIntro] = useState(true);

  const closeIntro = () => {
    setShowIntro(false);
  };

  const [currentStep, setCurrentStep] = useState(0);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({
    payments: '',
    tenants: '',
    type: '',
    securityDeposit: '',
    latePayers: '',
    defaultRate: '',
    portfolioSize: '',
    contractDuration: '',
    occupancyRate: '',
    timeToContract: '',
    onlineBooking: '',
    pms: ''
  });

  const handleAnswer = (key: string, value: string, index: number) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    if (index === activeQuestionIndex) {
      setActiveQuestionIndex(prev => Math.min(prev + 1, 11));
    }
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

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

  const renderStep = () => {
    switch (currentStep) {
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
              {QUESTIONS.map((q, i) => {
                const isVisible = i <= activeQuestionIndex;
                const Icon = q.icon;

                if (!isVisible) {
                  return (
                    <div key={q.key} className="glass-card p-2 rounded-xl border border-white/5 bg-white/[0.01] h-[163px] flex items-center justify-center transition-all duration-500">
                       <div className="w-16 h-16 rounded-full border border-white/20 flex flex-col items-center justify-center bg-white/5">
                          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Step</span>
                          <span className="text-xl font-black text-slate-400">{String(i + 1).padStart(2, '0')}</span>
                       </div>
                    </div>
                  );
                }

                return (
                  <div key={q.key} className="glass-card p-2 rounded-xl border border-white/10 bg-white/5 relative hover:z-[100] transition-all animate-in zoom-in duration-500">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 ${q.bg} rounded-lg ${q.color}`}>
                          <Icon size={16} />
                        </div>
                        <h3 className="text-xs font-black text-slate-200 uppercase tracking-tight">{q.title}</h3>
                      </div>
                      <QuestionTooltip 
                        why={q.why} 
                        impact={q.impact} 
                        position={i < 6 ? 'bottom' : 'top'}
                      />
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map(opt => (
                        <label 
                          key={opt.id} 
                          className={`flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                            answers[q.key as keyof typeof answers] === opt.id 
                              ? q.activeClass 
                              : 'bg-white/5 border-transparent text-slate-400 hover:border-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold leading-tight">{opt.label}</span>
                            <span className={`text-[8px] font-black px-1 py-0.5 rounded-md ${opt.weight > 0 ? 'bg-slate-500/10 text-slate-400' : 'bg-white/5 text-slate-500'}`}>
                              +{opt.weight}
                            </span>
                          </div>
                          <input 
                            type="radio" 
                            name={q.key} 
                            className="hidden" 
                            checked={answers[q.key as keyof typeof answers] === opt.id} 
                            onChange={() => handleAnswer(q.key, opt.id, i)}
                          />
                          <div className={`w-3 h-3 rounded-full border-2 ${
                            answers[q.key as keyof typeof answers] === opt.id 
                              ? q.dotClass 
                              : 'border-slate-600'
                          }`} />
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
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
                         <span className="text-slate-200">{isHighLate ? '65%' : isMedLate ? '80%' : '92%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-slate-400 ${isHighLate ? 'w-[65%]' : isMedLate ? 'w-[80%]' : 'w-[92%]'} shadow-[0_0_12px_rgba(148,163,184,0.4)]`} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Late Payments (30+ days)</span>
                         <span className="text-slate-300">{isHighLate ? '25%' : isMedLate ? '15%' : '7%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-slate-500 ${isHighLate ? 'w-[25%]' : isMedLate ? 'w-[15%]' : 'w-[7%]'} shadow-[0_0_12px_rgba(100,116,139,0.4)]`} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Default / Bad Debt</span>
                         <span className="text-slate-400">{isHighDefault ? '10%' : isMedDefault ? '5%' : '1%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-slate-600 ${isHighDefault ? 'w-[10%]' : isMedDefault ? 'w-[5%]' : 'w-[1%]'} shadow-[0_0_12px_rgba(71,85,105,0.4)]`} />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                         <span>Vacancy / Velocity Loss</span>
                         <span className="text-slate-500">{isLowOccupancy ? '25%' : isMedOccupancy ? '12%' : '4%'}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                         <div className={`h-full bg-slate-700 ${isLowOccupancy ? 'w-[25%]' : isMedOccupancy ? 'w-[12%]' : 'w-[4%]'} shadow-[0_0_12px_rgba(51,65,85,0.4)]`} />
                      </div>
                   </div>
                </div>

                <div className="mt-10 p-6 rounded-2xl bg-white/5 border border-white/10">
                   <div className="flex items-start gap-4">
                      <AlertCircle className="text-slate-400 shrink-0 mt-1" size={20} />
                      <div>
                        <p className="text-sm font-bold text-slate-200">Revenue Leakage Detected</p>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          Your current model loses approximately <span className="text-slate-200 font-black">€{leakage.toLocaleString()} / year</span> in interest-free credit given to tenants and recovery costs.
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
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-500/10 rounded-full border border-slate-500/30 mb-2">
                   <ShieldCheck size={14} className="text-slate-400" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">The CasaPay Advantage</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Zero-Risk Cashflow</h2>
                <p className="text-slate-400 text-lg font-medium leading-relaxed">
                  We guarantee your rent hits your account on the 1st of every month, no matter when or how the tenant pays.
                </p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
                {[
                  { title: '100% Guaranteed', desc: 'Full rent protection against tenant defaults and late payments.', icon: ShieldCheck, color: 'text-slate-400' },
                  { title: 'Automated Admin', desc: 'Eliminate manual reconciliation with automated bank-grade sync.', icon: Zap, color: 'text-slate-400' },
                  { title: 'Global Coverage', desc: 'Seamlessly accept payments from international students and expats.', icon: Globe, color: 'text-slate-400' },
                  { 
                    title: 'Integration Path', 
                    desc: answers.pms === 'in-house' 
                      ? 'Direct API integration for deep, bi-directional sync with your custom PMS.' 
                      : 'Lightweight Alias integration via @casapay.me logic—live in hours, not weeks.', 
                    icon: Zap, 
                    color: 'text-slate-400' 
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

             <button className="px-8 py-4 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-slate-300 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-white/30">
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

      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full p-4 md:p-6 overflow-y-auto custom-scrollbar">
        {/* Progress Bar */}
        <div className="w-full h-1 bg-white/5 rounded-full mb-4 overflow-hidden">
          <div 
            className="h-full bg-slate-400 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(148,163,184,0.6)]" 
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {renderStep()}
        </div>

        {/* Footer Controls */}
        <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5">
           <button 
             onClick={prevStep}
             disabled={currentStep === 0}
             className={`flex items-center gap-2 px-6 py-2 rounded-xl font-bold text-xs transition-all ${
               currentStep === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-white/5'
             }`}
           >
              <ChevronLeft size={16} />
              PREVIOUS STEP
           </button>

           <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${currentStep === i ? 'bg-slate-400 w-4' : 'bg-white/10'}`} 
                />
              ))}
           </div>

           <button 
             onClick={nextStep}
             disabled={currentStep === STEPS.length - 1}
             className={`flex items-center gap-2 px-8 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all ${
               currentStep === STEPS.length - 1 
                 ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                 : 'bg-slate-200 text-slate-950 hover:bg-white shadow-lg shadow-white/10'
             }`}
           >
              {currentStep === STEPS.length - 1 ? 'End of Deck' : 'NEXT STEP'}
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
