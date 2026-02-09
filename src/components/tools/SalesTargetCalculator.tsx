"use client";

import { useState, useMemo } from 'react';
import { TrendingUp, Target, DollarSign, ArrowDown, ArrowUp, Users2, Building2 } from 'lucide-react';

const TIMELINE_OPTIONS = [6, 12, 24, 36];
const AVG_RENT_PRESETS = [500, 750, 1000, 1500, 2000];

function formatCompact(val: number): string {
  if (val >= 1_000_000) return '\u00A3' + (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000) return '\u00A3' + (val / 1_000).toFixed(0) + 'K';
  return '\u00A3' + val.toFixed(0);
}

function formatFull(val: number): string {
  return '\u00A3' + Math.round(val).toLocaleString();
}

type CalcMode = 'top-down' | 'bottom-up';

interface MonthPoint {
  month: number;
  newAccounts: number;
  activeAccounts: number;
  activeTenants: number;
  monthlyTpv: number;
  monthlyCommission: number;
  cumulativeCommission: number;
}

function buildTimeline(
  months: number,
  peakNewPerMonth: number,
  avgRent: number,
  takeRate: number,
  rampMonths: number,
  tenantsPerOperator: number,
  monthlyConversion: number,
): MonthPoint[] {
  let cumulativeCommission = 0;
  const cohorts: number[] = [];

  return Array.from({ length: months }, (_, i) => {
    const m = i + 1;
    const rampFactor = rampMonths > 0 ? Math.min(m / rampMonths, 1) : 1;
    const newAccounts = Math.round(peakNewPerMonth * rampFactor * 10) / 10;
    cohorts.push(newAccounts);

    const activeAccounts = Math.round(cohorts.reduce((s, n) => s + n, 0) * 10) / 10;

    let activeTenants = 0;
    for (let j = 0; j < cohorts.length; j++) {
      const monthsActive = m - j;
      const converted = Math.min(monthsActive * (monthlyConversion / 100), 1);
      activeTenants += cohorts[j] * tenantsPerOperator * converted;
    }
    activeTenants = Math.round(activeTenants * 10) / 10;

    const monthlyTpv = activeTenants * avgRent;
    const monthlyCommission = monthlyTpv * (takeRate / 100);
    cumulativeCommission += monthlyCommission;

    return { month: m, newAccounts, activeAccounts, activeTenants, monthlyTpv, monthlyCommission, cumulativeCommission };
  });
}

const GLOSSARY = [
  { term: 'TPV', definition: 'Total Payment Volume. The total rent collected through CasaPay per month.' },
  { term: 'Take Rate', definition: "CasaPay's commission percentage on each payment processed." },
  { term: 'Commission', definition: 'Revenue earned: TPV \u00D7 Take Rate.' },
  { term: 'Accounts', definition: 'Active operators (landlords/agents) processing rent through CasaPay.' },
  { term: 'Tenants/Operator', definition: 'Average number of tenants managed by each operator account.' },
  { term: 'Conversion Rate', definition: 'Monthly % of an operator\u2019s tenants that switch to CasaPay payments (cumulative until 100%).' },
  { term: 'Ramp-up', definition: 'Months to reach full sales velocity (linear growth during this period).' },
];

export default function SalesTargetCalculator() {
  const [mode, setMode] = useState<CalcMode>('bottom-up');
  const [avgRent, setAvgRent] = useState(1000);
  const [takeRate, setTakeRate] = useState(4);
  const [months, setMonths] = useState(12);
  const [rampMonths, setRampMonths] = useState(3);
  const [accountsPerMonth, setAccountsPerMonth] = useState(5);
  const [targetMonthlyCommission, setTargetMonthlyCommission] = useState(10_000);
  const [tenantsPerOperator, setTenantsPerOperator] = useState(15);
  const [monthlyConversion, setMonthlyConversion] = useState(20);
  const [showAssumptions, setShowAssumptions] = useState(false);


  const tdTimeline = useMemo(
    () => buildTimeline(months, accountsPerMonth, avgRent, takeRate, rampMonths, tenantsPerOperator, monthlyConversion),
    [months, accountsPerMonth, avgRent, takeRate, rampMonths, tenantsPerOperator, monthlyConversion]
  );
  const tdFinal = tdTimeline[tdTimeline.length - 1];

  const buResults = useMemo(() => {
    let lo = 0, hi = 10000;
    for (let iter = 0; iter < 50; iter++) {
      const mid = (lo + hi) / 2;
      const tl = buildTimeline(months, mid, avgRent, takeRate, rampMonths, tenantsPerOperator, monthlyConversion);
      if (tl[tl.length - 1].monthlyCommission < targetMonthlyCommission) lo = mid;
      else hi = mid;
    }
    const requiredAccounts = Math.ceil(hi * 10) / 10;
    const timeline = buildTimeline(months, requiredAccounts, avgRent, takeRate, rampMonths, tenantsPerOperator, monthlyConversion);
    const final = timeline[timeline.length - 1];
    return { requiredAccounts, timeline, final };
  }, [targetMonthlyCommission, months, avgRent, takeRate, rampMonths, tenantsPerOperator, monthlyConversion]);

  const activeTimeline = mode === 'top-down' ? tdTimeline : buResults.timeline;
  const maxCumulative = activeTimeline[activeTimeline.length - 1]?.cumulativeCommission || 1;

  return (
    <div className="text-slate-200 font-sans antialiased flex flex-col p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-5">
        {/* Header + Tabs inline */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Sales Target Calculator</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Accounts &times; tenants &times; rent &times; take rate &rarr; commission</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setMode('bottom-up')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                mode === 'bottom-up'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border border-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              <ArrowUp size={12} /> Target &rarr; Accounts
            </button>
            <button
              onClick={() => setMode('top-down')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-widest transition-all ${
                mode === 'top-down'
                  ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/5 border border-white/5 text-slate-500 hover:text-slate-300'
              }`}
            >
              <ArrowDown size={12} /> Accounts &rarr; Revenue
            </button>
          </div>
        </div>

        {/* Mode-specific primary input + Glossary toggle */}
        <div className="flex items-start gap-4">
          {mode === 'bottom-up' && (
            <div className="glass-card p-4 rounded-xl border border-emerald-500/20 space-y-2 max-w-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <DollarSign size={14} className="text-emerald-400" />
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Target Monthly Commission</p>
                </div>
                <span className="text-sm font-black text-white">{formatCompact(targetMonthlyCommission)}</span>
              </div>
              <input type="range" min={1000} max={100000} step={500} value={targetMonthlyCommission} onChange={(e) => setTargetMonthlyCommission(Number(e.target.value))} className="w-full accent-emerald-500" />
              <div className="flex flex-wrap gap-1">
                {[2500, 5000, 10000, 25000, 50000].map((p) => (
                  <button key={p} onClick={() => setTargetMonthlyCommission(p)} className={`px-2 py-0.5 rounded text-[9px] font-bold ${targetMonthlyCommission === p ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-600 border border-transparent'}`}>{formatCompact(p)}</button>
                ))}
              </div>
            </div>
          )}

          {mode === 'top-down' && (
            <div className="glass-card p-4 rounded-xl border border-emerald-500/20 space-y-2 max-w-sm animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Users2 size={14} className="text-emerald-400" />
                  <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">New Accounts / Month</p>
                </div>
                <span className="text-sm font-black text-white">{accountsPerMonth}</span>
              </div>
              <input type="range" min={1} max={100} step={1} value={accountsPerMonth} onChange={(e) => setAccountsPerMonth(Number(e.target.value))} className="w-full accent-emerald-500" />
            </div>
          )}

          <div className="pt-1 shrink-0 min-w-0 flex-1">
            <p className="text-[8px] font-bold text-slate-600 uppercase tracking-widest mb-1">Glossary</p>
            <div className="space-y-0.5">
              {GLOSSARY.map(({ term, definition }) => (
                <p key={term} className="text-[8px] text-slate-600 leading-tight"><span className="font-bold text-slate-500">{term}</span> &mdash; {definition}</p>
              ))}
            </div>
          </div>
        </div>

        {/* Assumptions — collapsible */}
        <div>
          <button
            onClick={() => setShowAssumptions(!showAssumptions)}
            className="text-[10px] font-bold text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-widest"
          >
            Assumptions {showAssumptions ? '\u25BE' : '\u25B8'}
          </button>
          {showAssumptions && (
            <div className="grid grid-cols-2 gap-3 mt-2 animate-in fade-in duration-200">
              {/* Avg Rent */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Avg Rent / Tenant</p>
                  <span className="text-sm font-black text-white">{formatFull(avgRent)}</span>
                </div>
                <input type="range" min={200} max={3000} step={50} value={avgRent} onChange={(e) => setAvgRent(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex flex-wrap gap-1">
                  {AVG_RENT_PRESETS.map((p) => (
                    <button key={p} onClick={() => setAvgRent(p)} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${avgRent === p ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-600 border border-transparent'}`}>{formatFull(p)}</button>
                  ))}
                </div>
              </div>

              {/* Take Rate */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Take Rate</p>
                  <span className="text-sm font-black text-white">{takeRate}%</span>
                </div>
                <input type="range" min={1} max={8} step={0.5} value={takeRate} onChange={(e) => setTakeRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex justify-between text-[8px] text-slate-600 font-bold"><span>1%</span><span>4%</span><span>8%</span></div>
              </div>

              {/* Tenants per Operator */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tenants / Operator</p>
                  <span className="text-sm font-black text-white">{tenantsPerOperator}</span>
                </div>
                <input type="range" min={1} max={100} step={1} value={tenantsPerOperator} onChange={(e) => setTenantsPerOperator(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-[8px] text-slate-600 font-medium">Avg tenants per account</p>
              </div>

              {/* Monthly Conversion */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tenant Conversion</p>
                  <span className="text-sm font-black text-white">{monthlyConversion}%/mo</span>
                </div>
                <input type="range" min={5} max={100} step={5} value={monthlyConversion} onChange={(e) => setMonthlyConversion(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-[8px] text-slate-600 font-medium">{monthlyConversion >= 100 ? 'Instant (all tenants day 1)' : `${Math.ceil(100 / monthlyConversion)}mo to full conversion`}</p>
              </div>

              {/* Ramp-up */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ramp-up</p>
                  <span className="text-sm font-black text-white">{rampMonths === 0 ? 'None' : `${rampMonths}mo`}</span>
                </div>
                <input type="range" min={0} max={12} step={1} value={rampMonths} onChange={(e) => setRampMonths(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-[8px] text-slate-600 font-medium">To full velocity</p>
              </div>

              {/* Timeline */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Timeline</p>
                <div className="grid grid-cols-4 gap-1">
                  {TIMELINE_OPTIONS.map((m) => (
                    <button key={m} onClick={() => setMonths(m)} className={`py-2 rounded-lg font-black text-xs transition-all ${months === m ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/5 border border-white/5 text-slate-500'}`}>{m}mo</button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {mode === 'bottom-up' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Required Accounts/mo', value: buResults.requiredAccounts % 1 === 0 ? buResults.requiredAccounts.toFixed(0) : buResults.requiredAccounts.toFixed(1), icon: Users2, desc: `New accounts needed per month` },
                { label: `Active Tenants (Mo ${months})`, value: Math.round(buResults.final.activeTenants).toLocaleString(), icon: Building2, desc: `${Math.round(buResults.final.activeAccounts)} accts \u00D7 ${tenantsPerOperator} tenants` },
                { label: `Monthly TPV`, value: formatFull(buResults.final.monthlyTpv), icon: TrendingUp, desc: `${Math.round(buResults.final.activeTenants).toLocaleString()} tenants \u00D7 ${formatFull(avgRent)}` },
                { label: `Total Earned`, value: formatFull(buResults.final.cumulativeCommission), icon: Target, desc: `Cumulative over ${months}mo` },
              ].map((card, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-10"><card.icon size={32} /></div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="text-xl font-black text-white">{card.value}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {mode === 'top-down' && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: `Active Tenants (Mo ${months})`, value: Math.round(tdFinal.activeTenants).toLocaleString(), icon: Building2, desc: `${Math.round(tdFinal.activeAccounts)} accts \u00D7 ${tenantsPerOperator} tenants` },
                { label: `Monthly TPV`, value: formatFull(tdFinal.monthlyTpv), icon: TrendingUp, desc: `${Math.round(tdFinal.activeTenants).toLocaleString()} tenants \u00D7 ${formatFull(avgRent)}` },
                { label: `Monthly Commission`, value: formatFull(tdFinal.monthlyCommission), icon: DollarSign, desc: `${formatFull(tdFinal.monthlyTpv)} \u00D7 ${takeRate}%` },
                { label: `Total Earned`, value: formatFull(tdFinal.cumulativeCommission), icon: Target, desc: `Cumulative over ${months}mo` },
              ].map((card, i) => (
                <div key={i} className="glass-card p-4 rounded-xl border border-white/10 relative overflow-hidden">
                  <div className="absolute top-2 right-2 opacity-10"><card.icon size={32} /></div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="text-xl font-black text-white">{card.value}</p>
                  <p className="text-[9px] text-slate-500 mt-0.5">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timeline Chart */}
        <div className="glass-card p-4 rounded-xl border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-black text-white uppercase tracking-tight">Growth Timeline</h3>
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Hover for details</span>
          </div>
          <div className="flex items-end gap-px h-48 overflow-x-auto pb-1">
            {activeTimeline.map((point) => {
              const height = (point.cumulativeCommission / maxCumulative) * 100;
              const isQuarter = point.month % 3 === 0;
              const isYear = point.month % 12 === 0;
              const isRamping = rampMonths > 0 && point.month <= rampMonths;
              return (
                <div key={point.month} className="flex-1 min-w-[10px] h-full flex flex-col items-center justify-end group relative">
                  <div className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-2 text-center whitespace-nowrap shadow-xl space-y-0.5">
                      <p className="text-[8px] font-black text-slate-500 uppercase">Mo {point.month} {isRamping ? '(ramp)' : ''}</p>
                      <p className="text-[9px] text-slate-400">+{point.newAccounts % 1 === 0 ? point.newAccounts.toFixed(0) : point.newAccounts.toFixed(1)} accts &rarr; {Math.round(point.activeAccounts)} total</p>
                      <p className="text-[9px] text-slate-400">{Math.round(point.activeTenants).toLocaleString()} active tenants</p>
                      <p className="text-[9px] text-slate-400">TPV: {formatFull(point.monthlyTpv)}</p>
                      <p className="text-[10px] font-black text-emerald-400">{formatFull(point.monthlyCommission)}/mo</p>
                      <div className="h-px bg-white/5" />
                      <p className="text-[8px] text-slate-500">Cum: {formatFull(point.cumulativeCommission)}</p>
                    </div>
                  </div>
                  <div
                    className={`w-full rounded-t transition-all duration-300 ${
                      isRamping ? 'bg-amber-500/50 hover:bg-amber-400' : isYear ? 'bg-emerald-400' : isQuarter ? 'bg-emerald-500/80' : 'bg-emerald-500/40'
                    } ${!isRamping ? 'hover:bg-emerald-400' : ''} group-hover:shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
                    style={{ height: `${Math.max(height, 2)}%` }}
                  />
                  {(isQuarter || months <= 12) && (
                    <span className={`text-[7px] mt-0.5 font-bold ${isYear ? 'text-emerald-400' : isRamping ? 'text-amber-500/60' : 'text-slate-600'}`}>{point.month}</span>
                  )}
                </div>
              );
            })}
          </div>
          {rampMonths > 0 && (
            <div className="flex items-center gap-3 mt-2 text-[8px] font-bold text-slate-600">
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-500/50" /><span>Ramp ({rampMonths}mo)</span></div>
              <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-500/40" /><span>Full velocity</span></div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
