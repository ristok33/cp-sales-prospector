export interface UnitEconInputs {
  tpv: number;
  tenants: number;
  opTakeRate: number;
  tenantSub: number;
  cardTopUpRate: number;
  cardUsage: number;
  lateFee: number;
  payIn2Rate: number;
  payIn2Usage: number;
  defaultRate: number;
  cardCollectionRate: number;
  creditCostRate: number;
  obRate: number;
  payoutRate: number;
  salesCommissionRate: number;
}

export interface UnitEconResults {
  opRevenue: number;
  tenantSubRevenue: number;
  cardTopUpRevenue: number;
  lateFeeRevenue: number;
  payIn2Revenue: number;
  totalRevenue: number;
  creditLoss: number;
  cardCollection: number;
  creditCost: number;
  obCost: number;
  payoutCost: number;
  salesCommission: number;
  totalCogs: number;
  netProfit: number;
  margin: number;
  cardTpv: number;
  obTpv: number;
  payIn2Tpv: number;
}

export const UNIT_ECON_DEFAULTS: UnitEconInputs = {
  tpv: 1000000,
  tenants: 1000,
  opTakeRate: 2.5,
  tenantSub: 30,
  cardTopUpRate: 2,
  cardUsage: 40,
  lateFee: 3,
  payIn2Rate: 1,
  payIn2Usage: 20,
  defaultRate: 2,
  cardCollectionRate: 0.6,
  creditCostRate: 0.3,
  obRate: 0.05,
  payoutRate: 0.1,
  salesCommissionRate: 10,
};

export function calculateUnitEcon(u: UnitEconInputs): UnitEconResults {
  const cardTpv = u.tpv * (u.cardUsage / 100);
  const obTpv = u.tpv * ((100 - u.cardUsage) / 100);
  const payIn2Tpv = u.tpv * (u.payIn2Usage / 100);

  // Revenue
  const opRevenue = u.tpv * (u.opTakeRate / 100);
  const tenantSubRevenue = u.tenantSub * u.tenants;
  const cardTopUpRevenue = cardTpv * (u.cardTopUpRate / 100);
  const lateFeeRevenue = u.lateFee * u.tenants;
  const payIn2Revenue = payIn2Tpv * (u.payIn2Rate / 100);
  const totalRevenue = opRevenue + tenantSubRevenue + cardTopUpRevenue + lateFeeRevenue + payIn2Revenue;

  // COGS
  const creditLoss = u.tpv * (u.defaultRate / 100);
  const cardCollection = cardTpv * (u.cardCollectionRate / 100);
  const creditCost = payIn2Tpv * (u.creditCostRate / 100);
  const obCost = obTpv * (u.obRate / 100);
  const payoutCost = u.tpv * (u.payoutRate / 100);
  const salesCommission = totalRevenue * (u.salesCommissionRate / 100);
  const totalCogs = creditLoss + cardCollection + creditCost + payoutCost + salesCommission;

  const netProfit = totalRevenue - totalCogs;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  return {
    opRevenue, tenantSubRevenue, cardTopUpRevenue, lateFeeRevenue, payIn2Revenue, totalRevenue,
    creditLoss, cardCollection, creditCost, obCost, payoutCost, salesCommission, totalCogs,
    netProfit, margin, cardTpv, obTpv, payIn2Tpv,
  };
}

export function formatCurrency(val: number): string {
  return '\u00A3' + Math.round(val).toLocaleString();
}

export function formatCurrencyK(val: number): string {
  return '\u00A3' + (val / 1000).toFixed(0) + 'k';
}
