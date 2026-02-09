"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import { Chart } from 'react-google-charts';
import {
  calculateUnitEcon,
  formatCurrency,
  formatCurrencyK,
  UNIT_ECON_DEFAULTS,
  type UnitEconInputs,
} from '@/lib/unit-economics';

const STORAGE_KEY = 'cp-unit-econ';

interface ParamConfig {
  key: keyof UnitEconInputs;
  label: string;
  suffix: string;
  min: number;
  max: number;
  step: number;
  group: 'revenue' | 'cogs';
}

const PARAMS: ParamConfig[] = [
  { key: 'opTakeRate', label: 'Operator Take Rate', suffix: '%', min: 0.5, max: 5, step: 0.1, group: 'revenue' },
  { key: 'tenantSub', label: 'Tenant Subscription', suffix: '\u00A3', min: 5, max: 50, step: 1, group: 'revenue' },
  { key: 'cardTopUpRate', label: 'Card Top-up Fee', suffix: '%', min: 0.5, max: 5, step: 0.1, group: 'revenue' },
  { key: 'lateFee', label: 'Late Fees', suffix: '\u00A3', min: 0, max: 20, step: 0.1, group: 'revenue' },
  { key: 'payIn2Rate', label: 'Pay-in-2 Fee', suffix: '%', min: 0.5, max: 5, step: 0.1, group: 'revenue' },
  { key: 'salesCommissionRate', label: 'Sales Commission', suffix: '%', min: 0, max: 30, step: 1, group: 'cogs' },
  { key: 'defaultRate', label: 'Credit Loss (Defaults)', suffix: '%', min: 0, max: 10, step: 0.1, group: 'cogs' },
  { key: 'cardCollectionRate', label: 'Card Collection', suffix: '%', min: 0, max: 3, step: 0.1, group: 'cogs' },
  { key: 'creditCostRate', label: 'Credit Cost', suffix: '%', min: 0, max: 2, step: 0.1, group: 'cogs' },
  { key: 'payoutRate', label: 'Payouts', suffix: '%', min: 0, max: 1, step: 0.1, group: 'cogs' },
];

export default function UnitEconomics() {
  const [inputs, setInputs] = useState<UnitEconInputs>(UNIT_ECON_DEFAULTS);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setInputs({ ...UNIT_ECON_DEFAULTS, ...JSON.parse(saved) });
      }
    } catch {}
  }, []);

  const save = useCallback((next: UnitEconInputs) => {
    setInputs(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const updateParam = useCallback((key: keyof UnitEconInputs, value: number) => {
    save({ ...inputs, [key]: value });
  }, [inputs, save]);

  const results = useMemo(() => calculateUnitEcon(inputs), [inputs]);

  const sankeyData = useMemo(() => {
    const fmtK = formatCurrencyK;
    const revLabel = 'Revenue ' + fmtK(results.totalRevenue) + '\n\n\n\n';

    return [
      ['From', 'To', 'Value'],
      ['Op Take ' + fmtK(results.opRevenue), revLabel, results.opRevenue],
      ['Tenant Subs ' + fmtK(results.tenantSubRevenue), revLabel, results.tenantSubRevenue],
      ['Card Fee ' + fmtK(results.cardTopUpRevenue), revLabel, results.cardTopUpRevenue],
      ['Late Fees ' + fmtK(results.lateFeeRevenue), revLabel, results.lateFeeRevenue],
      ['Pay-in-2 ' + fmtK(results.payIn2Revenue), revLabel, results.payIn2Revenue],
      [revLabel, '\n\nNet Profit ' + fmtK(results.netProfit), Math.max(results.netProfit, 1)],
      [revLabel, 'Credit Loss ' + fmtK(results.creditLoss), results.creditLoss],
      [revLabel, 'Card Costs ' + fmtK(results.cardCollection), results.cardCollection],
      [revLabel, 'Credit Cost ' + fmtK(results.creditCost), results.creditCost],
      [revLabel, 'Payouts ' + fmtK(results.payoutCost), results.payoutCost],
      [revLabel, 'Sales Comm ' + fmtK(results.salesCommission), results.salesCommission],
    ];
  }, [results]);

  const sankeyOptions = {
    sankey: {
      node: {
        colors: ['#60a5fa', '#4b5563', '#a78bfa', '#a78bfa', '#a78bfa', '#a78bfa', '#10b981', '#ef4444', '#ef4444', '#ef4444', '#ef4444', '#ef4444'],
        label: { fontName: 'Inter, system-ui, sans-serif', fontSize: 11, color: '#e5e7eb', bold: true },
        nodePadding: 15,
        width: 12,
      },
      link: { colorMode: 'gradient' as const },
    },
    backgroundColor: 'transparent',
  };

  const revenueParams = PARAMS.filter((p) => p.group === 'revenue');
  const cogsParams = PARAMS.filter((p) => p.group === 'cogs');

  const getFormula = (p: ParamConfig): string => {
    switch (p.key) {
      case 'opTakeRate': return `${inputs.opTakeRate}% \u00D7 \u00A31M TPV`;
      case 'tenantSub': return `\u00A3${inputs.tenantSub} \u00D7 ${inputs.tenants.toLocaleString()}`;
      case 'cardTopUpRate': return `${inputs.cardTopUpRate}% \u00D7 ${inputs.cardUsage}% TPV`;
      case 'lateFee': return `\u00A3${inputs.lateFee} \u00D7 ${inputs.tenants.toLocaleString()}`;
      case 'payIn2Rate': return `${inputs.payIn2Rate}% \u00D7 ${inputs.payIn2Usage}% TPV`;
      case 'defaultRate': return `${inputs.defaultRate}% \u00D7 \u00A31M TPV`;
      case 'cardCollectionRate': return `${inputs.cardCollectionRate}% \u00D7 ${inputs.cardUsage}% TPV`;
      case 'creditCostRate': return `${inputs.creditCostRate}% \u00D7 ${inputs.payIn2Usage}% TPV`;
      case 'payoutRate': return `${inputs.payoutRate}% \u00D7 TPV`;
      case 'salesCommissionRate': return `${inputs.salesCommissionRate}% \u00D7 Revenue`;
      default: return '';
    }
  };

  const getResult = (p: ParamConfig): number => {
    switch (p.key) {
      case 'opTakeRate': return results.opRevenue;
      case 'tenantSub': return results.tenantSubRevenue;
      case 'cardTopUpRate': return results.cardTopUpRevenue;
      case 'lateFee': return results.lateFeeRevenue;
      case 'payIn2Rate': return results.payIn2Revenue;
      case 'defaultRate': return results.creditLoss;
      case 'cardCollectionRate': return results.cardCollection;
      case 'creditCostRate': return results.creditCost;
      case 'payoutRate': return results.payoutCost;
      case 'salesCommissionRate': return results.salesCommission;
      default: return 0;
    }
  };

  return (
    <div className="text-slate-200 font-sans antialiased flex flex-col p-4 md:p-6">
      <div className="max-w-6xl mx-auto w-full space-y-5">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight">Unit Economics</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Per 1,000 Tenants @ £1,000/mo avg rent &nbsp;|&nbsp; TPV: £1M/mo
          </p>
        </div>

        {/* Two-column on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Sankey Chart */}
          <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col">
            <h3 className="text-sm font-black text-white uppercase tracking-tight mb-4">Revenue Flow</h3>
            <div className="flex-1 min-h-[400px]">
              <Chart
                chartType="Sankey"
                width="100%"
                height="100%"
                data={sankeyData}
                options={sankeyOptions}
                loader={
                  <div className="h-full flex items-center justify-center">
                    <div className="text-slate-500 text-sm font-medium">Loading chart...</div>
                  </div>
                }
              />
            </div>
          </div>

          {/* Table */}
          <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-20 lg:w-14">Type</th>
                  <th className="text-left p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Line Item</th>
                  <th className="text-center p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-28 lg:w-20">Input</th>
                  <th className="text-right p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest lg:hidden">Formula</th>
                  <th className="text-right p-3 text-[10px] font-black text-slate-500 uppercase tracking-widest w-28 lg:w-20">Result</th>
                </tr>
              </thead>
              <tbody>
                {/* Revenue rows */}
                {revenueParams.map((p, i) => (
                  <tr key={p.key} className="border-b border-white/5 bg-emerald-500/[0.03] hover:bg-emerald-500/[0.06] transition-colors">
                    {i === 0 && (
                      <td rowSpan={revenueParams.length} className="p-3 lg:p-2 text-xs font-black text-emerald-500/60 uppercase tracking-widest align-top">
                        Revenue
                      </td>
                    )}
                    <td className="p-3 lg:p-2 text-slate-300 font-medium">{p.label}</td>
                    <td className="p-3 lg:p-2 text-center">
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          value={inputs[p.key]}
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          onChange={(e) => updateParam(p.key, parseFloat(e.target.value) || 0)}
                          className="w-16 lg:w-14 bg-slate-900/80 text-emerald-400 border border-white/10 rounded-lg px-2 py-1 text-center text-xs font-bold focus:outline-none focus:border-emerald-500/50 no-spinner"
                        />
                        <span className="text-[10px] text-slate-500 font-bold">{p.suffix}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-[11px] text-slate-500 font-medium lg:hidden">{getFormula(p)}</td>
                    <td className="p-3 lg:p-2 text-right font-bold text-white">{formatCurrency(getResult(p))}</td>
                  </tr>
                ))}

                {/* Revenue total */}
                <tr className="border-b-2 border-emerald-500/20 bg-emerald-500/[0.06]">
                  <td colSpan={3} className="p-3 lg:p-2 font-black text-slate-400 text-xs uppercase tracking-widest">Total Revenue</td>
                  <td className="p-3 lg:hidden"></td>
                  <td className="p-3 lg:p-2 text-right font-black text-white text-base">{formatCurrency(results.totalRevenue)}</td>
                </tr>

                {/* Spacer */}
                <tr><td colSpan={5} className="p-1"></td></tr>

                {/* COGS rows */}
                {cogsParams.map((p, i) => (
                  <tr key={p.key} className="border-b border-white/5 bg-red-500/[0.03] hover:bg-red-500/[0.06] transition-colors">
                    {i === 0 && (
                      <td rowSpan={cogsParams.length} className="p-3 lg:p-2 text-xs font-black text-red-500/60 uppercase tracking-widest align-top">
                        COGS
                      </td>
                    )}
                    <td className="p-3 lg:p-2 text-slate-300 font-medium">{p.label}</td>
                    <td className="p-3 lg:p-2 text-center">
                      <div className="inline-flex items-center gap-1">
                        <input
                          type="number"
                          value={inputs[p.key]}
                          min={p.min}
                          max={p.max}
                          step={p.step}
                          onChange={(e) => updateParam(p.key, parseFloat(e.target.value) || 0)}
                          className="w-16 lg:w-14 bg-slate-900/80 text-red-400 border border-white/10 rounded-lg px-2 py-1 text-center text-xs font-bold focus:outline-none focus:border-red-500/50 no-spinner"
                        />
                        <span className="text-[10px] text-slate-500 font-bold">{p.suffix}</span>
                      </div>
                    </td>
                    <td className="p-3 text-right text-[11px] text-slate-500 font-medium lg:hidden">{getFormula(p)}</td>
                    <td className="p-3 lg:p-2 text-right font-bold text-red-400">-{formatCurrency(getResult(p))}</td>
                  </tr>
                ))}

                {/* COGS total */}
                <tr className="border-b-2 border-red-500/20 bg-red-500/[0.06]">
                  <td colSpan={3} className="p-3 lg:p-2 font-black text-red-400 text-xs uppercase tracking-widest">Total COGS</td>
                  <td className="p-3 lg:hidden"></td>
                  <td className="p-3 lg:p-2 text-right font-black text-red-400 text-base">-{formatCurrency(results.totalCogs)}</td>
                </tr>

                {/* Spacer */}
                <tr><td colSpan={5} className="p-1"></td></tr>

                {/* Net Profit */}
                <tr className="bg-emerald-500/10 border-2 border-emerald-500/30">
                  <td colSpan={2} className="p-4 lg:p-3 font-black text-emerald-400 uppercase tracking-widest">Net Profit</td>
                  <td className="p-4 lg:p-3 text-right text-slate-400 font-bold text-xs">{results.margin.toFixed(0)}% margin</td>
                  <td className="p-4 lg:hidden"></td>
                  <td className="p-4 lg:p-3 text-right font-black text-emerald-400 text-lg">{formatCurrency(results.netProfit)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Reset */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              save(UNIT_ECON_DEFAULTS);
            }}
            className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10 rounded-xl transition-all"
          >
            Reset Defaults
          </button>
        </div>
      </div>
    </div>
  );
}
