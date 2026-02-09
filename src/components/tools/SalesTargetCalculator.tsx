"use client";

import { useState, useMemo } from 'react';
import { Target, DollarSign, Users2, Building2, Landmark } from 'lucide-react';
import { UNIT_ECON_DEFAULTS, calculateRevenuePerTenant } from '@/lib/unit-economics';

const FIXED_TIMELINE_OPTIONS = [6, 12, 24, 36];
const MAX_DYNAMIC_MONTHS = 120;
const AVG_RENT_PRESETS = [500, 750, 1000, 1500, 2000];
const BASIC_OP_RATE = 0.5; // CasaPay Payments plan: 0.5% op take rate only

function formatCompact(val: number): string {
  if (val >= 1_000_000) return '\u00A3' + (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000) return '\u00A3' + (val / 1_000).toFixed(0) + 'K';
  return '\u00A3' + val.toFixed(0);
}

function formatFull(val: number): string {
  return '\u00A3' + Math.round(val).toLocaleString();
}

interface MonthPoint {
  month: number;
  newOperators: number;
  totalOperators: number;
  activeTenants: number;
  basicTenants: number;
  onTimeTenants: number;
  monthlyTPV: number;
  monthlyRevenue: number;
  opSideRevenue: number;
  tenantSideRevenue: number;
  monthlyCommission: number;
  onTimeCommission: number;
  paymentsCommission: number;
  cumulativeCommission: number;
}

function buildTimeline(
  months: number,
  peakNewPerMonth: number,
  avgRent: number,
  commissionRate: number,
  rampMonths: number,
  tenantsPerOperator: number,
  monthlyConversion: number,
  existingPortfolio: boolean,
): MonthPoint[] {
  let cumulativeCommission = 0;
  const cohorts: number[] = [];
  const { tpvRate, fixedPerTenant } = calculateRevenuePerTenant(avgRent, commissionRate);
  const opTakeRateDecimal = UNIT_ECON_DEFAULTS.opTakeRate / 100;
  const basicRateDecimal = BASIC_OP_RATE / 100;

  return Array.from({ length: months }, (_, i) => {
    const m = i + 1;
    const rampFactor = rampMonths > 0 ? Math.min(m / rampMonths, 1) : 1;
    const newOperators = Math.round(peakNewPerMonth * rampFactor * 10) / 10;
    cohorts.push(newOperators);

    const totalOperators = Math.round(cohorts.reduce((s, n) => s + n, 0) * 10) / 10;

    let onTimeTenants = 0;
    let totalTenants = 0;
    for (let j = 0; j < cohorts.length; j++) {
      const monthsActive = m - j;
      const converted = Math.min(monthsActive * (monthlyConversion / 100), 1);
      const cohortTenants = cohorts[j] * tenantsPerOperator;
      onTimeTenants += cohortTenants * converted;
      if (existingPortfolio) {
        totalTenants += cohortTenants; // all tenants active from day 1
      } else {
        totalTenants += cohortTenants * converted; // only converted tenants active
      }
    }
    onTimeTenants = Math.round(onTimeTenants * 10) / 10;
    totalTenants = Math.round(totalTenants * 10) / 10;
    const basicTenants = existingPortfolio ? Math.round((totalTenants - onTimeTenants) * 10) / 10 : 0;

    const activeTenants = totalTenants;
    const monthlyTPV = activeTenants * avgRent;

    // On-Time tenants: full revenue (2.5% op take + tenant fees)
    const onTimeOpRevenue = onTimeTenants * avgRent * opTakeRateDecimal;
    const onTimeTenantRevenue = onTimeTenants * (avgRent * (tpvRate - opTakeRateDecimal) + fixedPerTenant);

    // Basic tenants: 0.5% op take only, no tenant fees
    const basicOpRevenue = basicTenants * avgRent * basicRateDecimal;

    const opSideRevenue = onTimeOpRevenue + basicOpRevenue;
    const tenantSideRevenue = onTimeTenantRevenue;
    const monthlyRevenue = opSideRevenue + tenantSideRevenue;
    const monthlyCommission = monthlyRevenue * (commissionRate / 100);
    const onTimeRevenue = onTimeOpRevenue + onTimeTenantRevenue;
    const onTimeCommission = onTimeRevenue * (commissionRate / 100);
    const paymentsCommission = basicOpRevenue * (commissionRate / 100);
    cumulativeCommission += monthlyCommission;

    return { month: m, newOperators, totalOperators, activeTenants, basicTenants, onTimeTenants, monthlyTPV, monthlyRevenue, opSideRevenue, tenantSideRevenue, monthlyCommission, onTimeCommission, paymentsCommission, cumulativeCommission };
  });
}

const GLOSSARY = [
  { term: 'TPV', definition: 'Total Payment Volume. The total rent collected through CasaPay per month.' },
  { term: 'Portfolio', definition: 'Your total active operators generating recurring monthly revenue.' },
  { term: 'Revenue/Operator', definition: "CasaPay's monthly revenue per operator: operator pays 2.5% take rate, tenants generate subs + fees." },
  { term: 'Commission', definition: "Your personal monthly earnings: 10% of CasaPay's gross revenue from your portfolio." },
  { term: 'Tenants/Operator', definition: 'Average number of tenants managed by each operator account.' },
  { term: 'Conversion Rate', definition: 'Monthly % of tenants upgrading from CasaPay Payments to CasaPay On-Time (cumulative until 100%).' },
  { term: 'Ramp-up', definition: 'Months to reach full sales velocity (linear growth during this period).' },
];

export default function SalesTargetCalculator() {
  const [avgRent, setAvgRent] = useState(1000);
  const [commissionRate, setCommissionRate] = useState(UNIT_ECON_DEFAULTS.salesCommissionRate);
  const [fixedMonths, setFixedMonths] = useState<number | null>(12); // null = dynamic
  const [rampMonths, setRampMonths] = useState(3);
  const [targetCommission, setTargetCommission] = useState(10_000);
  const [tenantsPerOperator, setTenantsPerOperator] = useState(50);
  const [monthlyConversion, setMonthlyConversion] = useState(20);
  const [existingPortfolio, setExistingPortfolio] = useState(false);
  const [dynamicOpsPerMonth, setDynamicOpsPerMonth] = useState(5);
  const [showAssumptions, setShowAssumptions] = useState(false);

  const isDynamic = fixedMonths === null;

  const perTenant = useMemo(() => calculateRevenuePerTenant(avgRent, commissionRate), [avgRent, commissionRate]);
  const commissionPerOperator = perTenant.commissionPerTenant * tenantsPerOperator;

  // Dynamic mode: find how many months to reach target with fixed ops/mo
  const dynamicResults = useMemo(() => {
    if (!isDynamic) return null;
    const tl = buildTimeline(MAX_DYNAMIC_MONTHS, dynamicOpsPerMonth, avgRent, commissionRate, rampMonths, tenantsPerOperator, monthlyConversion, existingPortfolio);
    const targetMonth = tl.findIndex(p => p.monthlyCommission >= targetCommission);
    const monthsToTarget = targetMonth >= 0 ? targetMonth + 1 : MAX_DYNAMIC_MONTHS;
    const timeline = tl.slice(0, monthsToTarget);
    const final = timeline[timeline.length - 1];
    return { monthsToTarget, timeline, final, reached: targetMonth >= 0 };
  }, [isDynamic, dynamicOpsPerMonth, targetCommission, avgRent, commissionRate, rampMonths, tenantsPerOperator, monthlyConversion, existingPortfolio]);

  // Fixed mode: find how many ops/mo needed within fixed timeline
  const fixedResults = useMemo(() => {
    if (isDynamic) return null;
    const months = fixedMonths!;
    let lo = 0, hi = 10000;
    for (let iter = 0; iter < 50; iter++) {
      const mid = (lo + hi) / 2;
      const tl = buildTimeline(months, mid, avgRent, commissionRate, rampMonths, tenantsPerOperator, monthlyConversion, existingPortfolio);
      if (tl[tl.length - 1].monthlyCommission < targetCommission) lo = mid;
      else hi = mid;
    }
    const requiredOperators = Math.ceil(hi * 10) / 10;
    const timeline = buildTimeline(months, requiredOperators, avgRent, commissionRate, rampMonths, tenantsPerOperator, monthlyConversion, existingPortfolio);
    const final = timeline[timeline.length - 1];
    return { requiredOperators, timeline, final };
  }, [isDynamic, fixedMonths, targetCommission, avgRent, commissionRate, rampMonths, tenantsPerOperator, monthlyConversion, existingPortfolio]);

  const months = isDynamic ? (dynamicResults?.monthsToTarget ?? 12) : fixedMonths!;
  const activeTimeline = isDynamic ? (dynamicResults?.timeline ?? []) : (fixedResults?.timeline ?? []);
  const activeFinal = isDynamic ? dynamicResults?.final : fixedResults?.final;

  return (
    <div className="text-slate-200 font-sans antialiased flex flex-col p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Sales Target Calculator</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">Operators &times; tenants &times; revenue streams &rarr; your commission</p>
        </div>

        {/* Primary input + Glossary */}
        <div className="flex items-start gap-4">
          <div className="glass-card p-4 rounded-xl border border-emerald-500/20 space-y-2 max-w-sm animate-in fade-in duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <DollarSign size={14} className="text-emerald-400" />
                <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Target Monthly Commission</p>
              </div>
              <span className="text-sm font-black text-white">{formatCompact(targetCommission)}</span>
            </div>
            <input type="range" min={1000} max={100000} step={500} value={targetCommission} onChange={(e) => setTargetCommission(Number(e.target.value))} className="w-full accent-emerald-500" />
            <div className="flex flex-wrap gap-1">
              {[2500, 5000, 10000, 25000, 50000].map((p) => (
                <button key={p} onClick={() => setTargetCommission(p)} className={`px-2 py-0.5 rounded text-[9px] font-bold ${targetCommission === p ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-600 border border-transparent'}`}>{formatCompact(p)}</button>
              ))}
            </div>
          </div>

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
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Avg Rent / Tenant <span className="normal-case font-medium text-slate-600">(monthly rent per tenant)</span></p>
                  <span className="text-sm font-black text-white">{formatFull(avgRent)}</span>
                </div>
                <input type="range" min={200} max={3000} step={50} value={avgRent} onChange={(e) => setAvgRent(Number(e.target.value))} className="w-full accent-emerald-500" />
                <div className="flex flex-wrap gap-1">
                  {AVG_RENT_PRESETS.map((p) => (
                    <button key={p} onClick={() => setAvgRent(p)} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${avgRent === p ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-white/5 text-slate-600 border border-transparent'}`}>{formatFull(p)}</button>
                  ))}
                </div>
              </div>

              {/* Commission Rate */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Commission Rate <span className="normal-case font-medium text-slate-600">(your % of CasaPay revenue)</span></p>
                  <span className="text-sm font-black text-white">{commissionRate}%</span>
                </div>
                <input type="range" min={5} max={15} step={1} value={commissionRate} onChange={(e) => setCommissionRate(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-[8px] text-slate-600 font-medium">Your % of CasaPay revenue ({formatFull(commissionPerOperator)}/operator/mo)</p>
              </div>

              {/* Tenants per Operator */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Tenants / Operator <span className="normal-case font-medium text-slate-600">(avg units per operator)</span></p>
                  <span className="text-sm font-black text-white">{tenantsPerOperator}</span>
                </div>
                <input type="range" min={50} max={5000} step={50} value={tenantsPerOperator} onChange={(e) => setTenantsPerOperator(Number(e.target.value))} className="w-full accent-emerald-500" />

                {/* Existing portfolio checkbox */}
                <label className="flex items-start gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={existingPortfolio}
                    onChange={(e) => setExistingPortfolio(e.target.checked)}
                    className="mt-0.5 accent-emerald-500 cursor-pointer"
                  />
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 group-hover:text-slate-300 transition-colors">Operator brings existing portfolio</p>
                    <p className="text-[8px] text-slate-600 leading-tight mt-0.5">
                      {existingPortfolio
                        ? 'All tenants active day 1 on CasaPay Payments (0.5% op take). Conversion rate = upgrade to CasaPay On-Time (2.5% + tenant fees).'
                        : 'Only converted tenants generate revenue. Enable if operators migrate existing book.'}
                    </p>
                  </div>
                </label>
              </div>

              {/* On-Time Plan Conversion */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">On-Time Plan Conversion <span className="normal-case font-medium text-slate-600">(% upgrading to On-Time/mo)</span></p>
                  <span className="text-sm font-black text-white">{monthlyConversion}%/mo</span>
                </div>
                <input type="range" min={5} max={100} step={5} value={monthlyConversion} onChange={(e) => setMonthlyConversion(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-[8px] text-slate-600 font-medium">{monthlyConversion >= 100 ? 'Instant (all tenants day 1)' : `${Math.ceil(100 / monthlyConversion)}mo to full conversion`}</p>
              </div>

              {/* Ramp-up */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ramp-up <span className="normal-case font-medium text-slate-600">(months to full sales speed)</span></p>
                  <span className="text-sm font-black text-white">{rampMonths === 0 ? 'None' : `${rampMonths}mo`}</span>
                </div>
                <input type="range" min={0} max={12} step={1} value={rampMonths} onChange={(e) => setRampMonths(Number(e.target.value))} className="w-full accent-emerald-500" />
                <p className="text-[8px] text-slate-600 font-medium">To full velocity</p>
              </div>

              {/* Timeline */}
              <div className="glass-card p-4 rounded-xl border border-white/10 space-y-2">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Timeline <span className="normal-case font-medium text-slate-600">(projection period)</span></p>
                <div className="grid grid-cols-5 gap-1">
                  <button onClick={() => setFixedMonths(null)} className={`py-2 rounded-lg font-black text-xs transition-all ${isDynamic ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/5 border border-white/5 text-slate-500'}`}>Auto</button>
                  {FIXED_TIMELINE_OPTIONS.map((m) => (
                    <button key={m} onClick={() => setFixedMonths(m)} className={`py-2 rounded-lg font-black text-xs transition-all ${!isDynamic && fixedMonths === m ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' : 'bg-white/5 border border-white/5 text-slate-500'}`}>{m}mo</button>
                  ))}
                </div>
                {isDynamic && (
                  <div className="space-y-2 mt-2 pt-2 border-t border-white/5">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-bold text-slate-500">New Operators / Month</p>
                      <span className="text-sm font-black text-white">{dynamicOpsPerMonth}</span>
                    </div>
                    <input type="range" min={1} max={50} step={1} value={dynamicOpsPerMonth} onChange={(e) => setDynamicOpsPerMonth(Number(e.target.value))} className="w-full accent-emerald-500" />
                    <p className="text-[8px] text-slate-600 font-medium">
                      {dynamicResults?.reached
                        ? `Target reached in ${dynamicResults.monthsToTarget} months`
                        : `Target not reached within ${MAX_DYNAMIC_MONTHS} months`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {activeFinal && (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                isDynamic
                  ? { label: 'Months to Target', value: dynamicResults?.reached ? `${dynamicResults.monthsToTarget}mo` : '120+', icon: Target, desc: `${dynamicOpsPerMonth} new operators/mo` }
                  : { label: 'New Operators/mo', value: fixedResults!.requiredOperators % 1 === 0 ? fixedResults!.requiredOperators.toFixed(0) : fixedResults!.requiredOperators.toFixed(1), icon: Users2, desc: 'New operators to close per month' },
                { label: `Portfolio (Mo ${months})`, value: `${Math.round(activeFinal.totalOperators)} ops`, icon: Building2, desc: `${Math.round(activeFinal.activeTenants).toLocaleString()} active tenants${existingPortfolio ? ` (${Math.round(activeFinal.onTimeTenants).toLocaleString()} On-Time)` : ''}` },
                { label: 'Monthly Revenue', value: formatFull(activeFinal.monthlyRevenue), icon: Landmark, desc: `Op: ${formatFull(activeFinal.opSideRevenue)} + Tenant: ${formatFull(activeFinal.tenantSideRevenue)}` },
                { label: 'Your Commission', value: formatFull(activeFinal.monthlyCommission), icon: Target, desc: `${commissionRate}% of ${formatFull(activeFinal.monthlyRevenue)}` },
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

        {/* Timeline Chart — parallel bars per plan */}
        {(() => {
          const maxMonthlyCommission = Math.max(...activeTimeline.map(p => p.monthlyCommission), 1);
          const final = activeFinal!;
          return (
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-black text-white uppercase tracking-tight">Monthly Commission</h3>
                <span className="text-[8px] font-bold uppercase tracking-widest text-slate-600">Hover for details</span>
              </div>
              <div className="flex items-end gap-1 h-48 overflow-visible pb-1">
                {activeTimeline.map((point) => {
                  const onTimeHeight = (point.onTimeCommission / maxMonthlyCommission) * 100;
                  const paymentsHeight = (point.paymentsCommission / maxMonthlyCommission) * 100;
                  const isQuarter = point.month % 3 === 0;
                  const isYear = point.month % 12 === 0;
                  const isRamping = rampMonths > 0 && point.month <= rampMonths;
                  return (
                    <div key={point.month} className="flex-1 min-w-[10px] h-full flex flex-col items-center justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-1.5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                        <div className="bg-slate-900/95 backdrop-blur-md border border-white/10 rounded-lg px-2.5 py-2 text-center whitespace-nowrap shadow-xl space-y-0.5">
                          <p className="text-[8px] font-black text-slate-500 uppercase">Mo {point.month} {isRamping ? '(ramp)' : ''}</p>
                          <p className="text-[9px] text-slate-400">+{point.newOperators % 1 === 0 ? point.newOperators.toFixed(0) : point.newOperators.toFixed(1)} ops &rarr; {Math.round(point.totalOperators)} portfolio</p>
                          <p className="text-[9px] text-slate-400">{Math.round(point.activeTenants).toLocaleString()} tenants{existingPortfolio ? ` (${Math.round(point.onTimeTenants).toLocaleString()} On-Time, ${Math.round(point.basicTenants).toLocaleString()} Payments)` : ''}</p>
                          <p className="text-[9px] text-slate-400">TPV: {formatFull(point.monthlyTPV)}</p>
                          <p className="text-[9px] text-slate-400">Revenue: {formatFull(point.monthlyRevenue)} (op {formatFull(point.opSideRevenue)} + tenant {formatFull(point.tenantSideRevenue)})</p>
                          {existingPortfolio && (
                            <>
                              <p className="text-[9px] text-emerald-400">On-Time: {formatFull(point.onTimeCommission)}/mo</p>
                              <p className="text-[9px] text-sky-400">Payments: {formatFull(point.paymentsCommission)}/mo</p>
                            </>
                          )}
                          <p className="text-[10px] font-black text-emerald-400">{formatFull(point.monthlyCommission)}/mo total</p>
                          <div className="h-px bg-white/5" />
                          <p className="text-[8px] text-slate-500">Cum: {formatFull(point.cumulativeCommission)}</p>
                        </div>
                      </div>
                      {/* Parallel bars */}
                      <div className="w-full flex gap-px items-end h-full">
                        <div
                          className={`flex-1 rounded-t transition-all duration-300 ${
                            isRamping ? 'bg-emerald-500/30' : 'bg-emerald-500/70'
                          } group-hover:bg-emerald-400 group-hover:shadow-[0_0_8px_rgba(16,185,129,0.3)]`}
                          style={{ height: `${Math.max(onTimeHeight, 1)}%` }}
                        />
                        {existingPortfolio && (
                          <div
                            className={`flex-1 rounded-t transition-all duration-300 ${
                              isRamping ? 'bg-sky-500/20' : 'bg-sky-500/50'
                            } group-hover:bg-sky-400 group-hover:shadow-[0_0_8px_rgba(56,189,248,0.3)]`}
                            style={{ height: `${Math.max(paymentsHeight, 1)}%` }}
                          />
                        )}
                      </div>
                      {(isQuarter || activeTimeline.length <= 12) && (
                        <span className={`text-[7px] mt-0.5 font-bold ${isYear ? 'text-emerald-400' : isRamping ? 'text-amber-500/60' : 'text-slate-600'}`}>{point.month}</span>
                      )}
                    </div>
                  );
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-2 text-[8px] font-bold text-slate-600">
                <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-emerald-500/70" /><span>On-Time (2.5% + tenant fees) &mdash; {formatFull(final.onTimeCommission)}/mo</span></div>
                {existingPortfolio && (
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-sky-500/50" /><span>Payments (0.5% op only) &mdash; {formatFull(final.paymentsCommission)}/mo</span></div>
                )}
                {rampMonths > 0 && (
                  <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-sm bg-amber-500/50" /><span>Ramp ({rampMonths}mo)</span></div>
                )}
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
}
