import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { 
  LayoutDashboard, 
  Gamepad2, 
  GlassWater, 
  UserCheck, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Wallet, 
  User, 
  Clock, 
  Play, 
  XCircle, 
  X,
  Settings, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
  AlertCircle,
  Search, 
  Check, 
  Receipt,
  UserPlus,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Calendar,
  FileText,
  ChevronRight,
  BarChart3,
  Printer,
  Eye,
  EyeOff,
  Package,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Unlock,
  Key,
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  Edit3,
  Activity,
  Timer,
  Trophy,
  Coins,
  Sliders,
  RotateCcw,
  CreditCard,
  Tag,
  Bell,
  LogOut,
  RefreshCw,
  Share2
} from "lucide-react";
import { 
  initialConsoles,
  clubLogos,
  snackProducts, 
  initialStats, 
  initialTopConsoles, 
  initialTopProducts, 
  initialActivityLog,
  initialStockMovements,
  defaultExpenseCategories,
  initialExpenses,
  initialPurchases,
  initialCaisseSessions,
  initialSuppliers,
  initialPlayers
} from "./mockData";

const generateMockSales = () => {
  return [];
};

// ============================================================
// COMPTABILITE VIEW COMPONENT
// ============================================================
function ComptabiliteView({
  sales, expenses, purchases, products, formatPrice,
  comptaStartDate, comptaEndDate, setComptaStartDate, setComptaEndDate,
  comptaCategoryFilter, setComptaCategoryFilter,
  comptaSearchQuery, setComptaSearchQuery,
  comptaSellerFilter, setComptaSellerFilter,
  comptaPeriodFilterToggled, setComptaPeriodFilterToggled,
  comptaExpandedSaleId, setComptaExpandedSaleId,
  setShowCancelSaleModal, setShowReceiptModal
}) {
  const start = React.useMemo(() => {
    const d = new Date(comptaStartDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [comptaStartDate]);

  const end = React.useMemo(() => {
    const d = new Date(comptaEndDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [comptaEndDate]);

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleQuickPeriod = (period) => {
    const today = new Date();
    let s = new Date();
    let e = new Date();
    switch (period) {
      case "today": s = today; e = today; break;
      case "yesterday": {
        s = new Date(today); s.setDate(today.getDate() - 1);
        e = new Date(s); break;
      }
      case "this_week": {
        const cd = today.getDay();
        const dist = cd === 0 ? 6 : cd - 1;
        s = new Date(today); s.setDate(today.getDate() - dist);
        e = today; break;
      }
      case "last_week": {
        const cd2 = today.getDay();
        const dist2 = cd2 === 0 ? 6 : cd2 - 1;
        s = new Date(today); s.setDate(today.getDate() - dist2 - 7);
        e = new Date(s); e.setDate(s.getDate() + 6); break;
      }
      case "this_month":
        s = new Date(today.getFullYear(), today.getMonth(), 1);
        e = today; break;
      case "last_month":
        s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        e = new Date(today.getFullYear(), today.getMonth(), 0); break;
      case "this_quarter": {
        const q = Math.floor(today.getMonth() / 3);
        s = new Date(today.getFullYear(), q * 3, 1);
        e = today; break;
      }
      case "this_year":
        s = new Date(today.getFullYear(), 0, 1);
        e = today; break;
      default: break;
    }
    setComptaStartDate(s.toISOString().slice(0, 10));
    setComptaEndDate(e.toISOString().slice(0, 10));
  };

  const filteredSales = React.useMemo(() => (sales || []).filter(s => {
    if (!s) return false;
    const saleDate = new Date(s.date || Date.now());
    const inDateRange = saleDate >= start && saleDate <= end;
    const customerName = s.customer || "Client Comptant";
    const saleId = s.id || "";
    const matchesSearch = customerName.toLowerCase().includes(comptaSearchQuery.toLowerCase()) ||
                          saleId.toLowerCase().includes(comptaSearchQuery.toLowerCase());
    const sellerName = s.seller || "Gérant";
    const matchesSeller = comptaSellerFilter === "all" || sellerName.toLowerCase() === comptaSellerFilter.toLowerCase();
    const items = s.itemsList || [];
    const matchesCategory = comptaCategoryFilter === "all" || items.some(item => item && item.product && item.product.category === comptaCategoryFilter);
    return inDateRange && matchesSearch && matchesSeller && matchesCategory;
  }), [sales, start, end, comptaSearchQuery, comptaSellerFilter, comptaCategoryFilter]);

  const periodGamesRevenue = React.useMemo(() => comptaCategoryFilter === "all" ? (sales || []).filter(s => {
    if (!s) return false;
    const d = new Date(s.date || Date.now());
    return d >= start && d <= end && s.status !== "annulée";
  }).reduce((sum, s) => sum + (s.gameCost || 0), 0) : 0, [sales, start, end, comptaCategoryFilter]);

  const periodSnackRevenue = React.useMemo(() => (sales || []).filter(s => {
    if (!s) return false;
    const d = new Date(s.date || Date.now());
    return d >= start && d <= end && s.status !== "annulée";
  }).reduce((sum, s) => {
    const items = s.itemsList || [];
    const filteredItems = items.filter(item => item && item.product && (comptaCategoryFilter === "all" || item.product.category === comptaCategoryFilter));
    return sum + filteredItems.reduce((s2, item) => s2 + (item.product.price || 0) * (item.quantity || 0), 0);
  }, 0), [sales, start, end, comptaCategoryFilter]);

  const periodTotalRevenue = periodGamesRevenue + periodSnackRevenue;

  const periodCOGS = React.useMemo(() => (sales || []).filter(s => {
    if (!s) return false;
    const d = new Date(s.date || Date.now());
    return d >= start && d <= end && s.status !== "annulée";
  }).reduce((sum, s) => {
    const items = s.itemsList || [];
    const filteredItems = items.filter(item => item && item.product && (comptaCategoryFilter === "all" || item.product.category === comptaCategoryFilter));
    return sum + filteredItems.reduce((s2, item) => s2 + (item.product.purchasePrice || 0) * (item.quantity || 0), 0);
  }, 0), [sales, start, end, comptaCategoryFilter]);

  const comptaPeriodExpenses = React.useMemo(() => (expenses || []).filter(e => {
    if (!e) return false;
    const d = new Date(e.date || Date.now());
    return d >= start && d <= end;
  }), [expenses, start, end]);

  const comptaPeriodPurchases = React.useMemo(() => (purchases || []).filter(p => {
    if (!p) return false;
    const d = new Date(p.date || Date.now());
    return d >= start && d <= end;
  }), [purchases, start, end]);

  const periodExpensesAmount = comptaPeriodExpenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const periodPurchasesAmount = comptaPeriodPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
  const periodTotalOPEX = periodExpensesAmount + periodPurchasesAmount;
  const periodMargeBrute = periodTotalRevenue - periodCOGS;
  const periodNetProfit = periodMargeBrute - periodTotalOPEX;
  const periodMargePercent = periodTotalRevenue > 0 ? (periodMargeBrute / periodTotalRevenue) * 100 : 0;
  const netProfitMargePercent = periodTotalRevenue > 0 ? (periodNetProfit / periodTotalRevenue) * 100 : 0;

  const periodCancelledSales = (sales || []).filter(s => {
    if (!s) return false;
    const d = new Date(s.date || Date.now());
    return d >= start && d <= end && s.status === "annulée";
  });
  const periodCancelledAmount = periodCancelledSales.reduce((sum, s) => sum + (s.total || 0), 0);
  const durationDays = Math.max(1, Math.round(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);

  let healthStatus = "Situation critique";
  let healthColor = "text-rose-500";
  let healthBg = "bg-rose-950/20 border-rose-500/20 shadow-rose-950/10";
  let progressPercent = 0;
  if (periodNetProfit > 0) {
    if (netProfitMargePercent < 15) {
      healthStatus = "Situation stable"; healthColor = "text-amber-500";
      healthBg = "bg-amber-950/20 border-amber-500/20 shadow-amber-950/10"; progressPercent = 40;
    } else if (netProfitMargePercent >= 15 && netProfitMargePercent < 35) {
      healthStatus = "Bonne rentabilité"; healthColor = "text-emerald-400";
      healthBg = "bg-emerald-950/20 border-emerald-500/20 shadow-emerald-950/10"; progressPercent = 75;
    } else {
      healthStatus = "Excellent bénéfice"; healthColor = "text-teal-400";
      healthBg = "bg-teal-950/20 border-teal-500/20 shadow-teal-950/10"; progressPercent = 95;
    }
  }

  const periodROI = (periodCOGS + periodTotalOPEX) > 0 ? (periodNetProfit / (periodCOGS + periodTotalOPEX)) * 100 : 0;
  const periodTMCV = periodTotalRevenue > 0 ? (periodMargeBrute / periodTotalRevenue) : 0;
  const periodSR = periodTMCV > 0 ? periodTotalOPEX / periodTMCV : 0;
  const averageDailyRevenue = periodTotalRevenue / durationDays;
  const daysToSR = averageDailyRevenue > 0 && periodSR > 0 ? periodSR / averageDailyRevenue : 0;

  const dailyPoints = React.useMemo(() => {
    const days = [];
    const curr = new Date(start);
    if (isNaN(curr.getTime())) return [];
    while (curr <= end) {
      days.push(curr.toISOString().slice(0, 10));
      curr.setDate(curr.getDate() + 1);
    }
    const displayDays = days.length > 15 ? days.slice(-15) : days;
    return displayDays.map(day => {
      const dStart = new Date(day); dStart.setHours(0, 0, 0, 0);
      const dEnd = new Date(day); dEnd.setHours(23, 59, 59, 999);
      const daySales = (sales || []).filter(s => { if (!s || !s.date) return false; const d = new Date(s.date); return d >= dStart && d <= dEnd && s.status !== "annulée"; });
      const dayExpenses = (expenses || []).filter(e => { if (!e || !e.date) return false; const d = new Date(e.date); return d >= dStart && d <= dEnd; });
      const dayPurchases = (purchases || []).filter(p => { if (!p || !p.date) return false; const d = new Date(p.date); return d >= dStart && d <= dEnd; });
      const rev = daySales.reduce((sum, s) => sum + (s.total || 0), 0);
      const exp = dayExpenses.reduce((sum, e) => sum + (e.amount || 0), 0) + dayPurchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
      return { label: new Date(day).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }), revenue: rev, expenses: exp, profit: rev - exp };
    });
  }, [sales, expenses, purchases, start, end]);

  const maxDailyVal = dailyPoints.length > 0
    ? Math.max(50000, ...dailyPoints.map(d => Math.max(d.revenue, d.expenses, Math.abs(d.profit), 50000))) * 1.15
    : 100000;

  const productCategories = [...new Set((products || []).map(p => p.category).filter(Boolean))];
  const sellers = [...new Set((sales || []).map(s => s.seller || "Gérant").filter(Boolean))];

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-6xl mx-auto font-sans">

      {/* Banner Rentabilité */}
      <div className={`glass-panel p-6 rounded-2xl border ${healthBg} flex flex-col gap-6 transition-all duration-300`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-2xl bg-zinc-950 flex items-center justify-center border border-zinc-800 shadow-md ${healthColor}`}>
            <TrendingDown className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] text-zinc-400 font-extrabold tracking-widest uppercase">Rentabilité du mois</span>
            <h3 className={`text-xl font-black ${healthColor} uppercase tracking-wide`}>{healthStatus}</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl space-y-1 hover:border-zinc-750 transition-all duration-300">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[9px] font-extrabold uppercase tracking-wider">Bénéfice Net</span>
              <span className="text-xs">📉</span>
            </div>
            <p className={`text-base font-black font-mono tracking-tight ${periodNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatPrice(periodNetProfit)}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl space-y-1 hover:border-zinc-750 transition-all duration-300">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[9px] font-extrabold uppercase tracking-wider">% Marge</span>
              <span className="text-xs">📊</span>
            </div>
            <p className={`text-base font-black font-mono tracking-tight ${netProfitMargePercent >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{netProfitMargePercent.toFixed(1)}%</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl space-y-1 hover:border-zinc-750 transition-all duration-300">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[9px] font-extrabold uppercase tracking-wider">Revenus</span>
              <span className="text-xs text-emerald-400">💵</span>
            </div>
            <p className="text-base font-black text-white font-mono tracking-tight">{formatPrice(periodTotalRevenue)}</p>
          </div>
          <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl space-y-1 hover:border-zinc-750 transition-all duration-300">
            <div className="flex justify-between items-center text-zinc-500">
              <span className="text-[9px] font-extrabold uppercase tracking-wider">Dépenses</span>
              <span className="text-xs text-rose-500">💸</span>
            </div>
            <p className="text-base font-black text-white font-mono tracking-tight">{formatPrice(periodCOGS + periodTotalOPEX)}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-zinc-400 font-bold">
            <span>Score de santé</span>
            <span className={healthColor}>{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${progressPercent >= 75 ? 'bg-emerald-500' : progressPercent >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="glass-panel p-4 rounded-2xl border border-zinc-850/60 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-violet-400" />
            <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">Période d'analyse</span>
          </div>
          <span className="text-[10px] text-zinc-500 font-mono">{formatDateStr(comptaStartDate)} – {formatDateStr(comptaEndDate)}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { key: "today", label: "Aujourd'hui" },
            { key: "yesterday", label: "Hier" },
            { key: "this_week", label: "Cette semaine" },
            { key: "last_week", label: "Sem. passée" },
            { key: "this_month", label: "Ce mois" },
            { key: "last_month", label: "Mois passé" },
            { key: "this_quarter", label: "Ce trimestre" },
            { key: "this_year", label: "Cette année" }
          ].map(p => (
            <button key={p.key} onClick={() => handleQuickPeriod(p.key)}
              className="px-3 py-1.5 text-[10px] font-bold rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all">
              {p.label}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Du</label>
            <input type="date" value={comptaStartDate} onChange={e => setComptaStartDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-lg px-3 py-2 text-xs text-white outline-none transition-all" />
          </div>
          <div>
            <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Au</label>
            <input type="date" value={comptaEndDate} onChange={e => setComptaEndDate(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-lg px-3 py-2 text-xs text-white outline-none transition-all" />
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-zinc-850/60 space-y-1 hover:border-zinc-750 transition-all duration-300">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider block">ROI</span>
          <p className="text-base font-black text-white font-mono tracking-tight">{Math.max(0, periodROI).toFixed(1)}%</p>
          <span className="text-[9px] text-zinc-600 block">Retour sur investissement</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-zinc-850/60 space-y-1 hover:border-zinc-750 transition-all duration-300">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider block">Seuil de Rentabilité</span>
          <p className="text-base font-black text-amber-500 font-mono tracking-tight">{formatPrice(periodSR)}</p>
          <span className="text-[9px] text-zinc-600 block">Point d'équilibre</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-zinc-850/60 space-y-1 hover:border-zinc-750 transition-all duration-300">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider block">Flux de Trésorerie</span>
          <p className={`text-base font-black font-mono tracking-tight ${periodNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{formatPrice(periodNetProfit)}</p>
          <span className="text-[9px] text-zinc-600 block">Bénéfice net période</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-zinc-850/60 space-y-1 hover:border-zinc-750 transition-all duration-300">
          <span className="text-[9px] text-zinc-500 font-extrabold uppercase tracking-wider block">Marge Brute</span>
          <p className="text-base font-black text-blue-400 font-mono tracking-tight">{periodMargePercent.toFixed(1)}%</p>
          <span className="text-[9px] text-zinc-600 block">{formatPrice(periodMargeBrute)}</span>
        </div>
      </div>

      {/* Ventes Summary */}
      <div className="glass-panel p-5 rounded-2xl border border-zinc-850/60 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">Résumé des Ventes</span>
          <div className="flex items-center gap-3 text-[10px] text-zinc-500">
            <span className="font-bold text-emerald-400">{filteredSales.filter(s => s.status !== "annulée").length} ventes actives</span>
            <span className="text-zinc-700">|</span>
            <span className="font-bold text-rose-400">{periodCancelledSales.length} annulée(s)</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl text-center">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Jeux</span>
            <p className="text-sm font-black text-blue-400 font-mono">{formatPrice(periodGamesRevenue)}</p>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl text-center">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Snack</span>
            <p className="text-sm font-black text-amber-400 font-mono">{formatPrice(periodSnackRevenue)}</p>
          </div>
          <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-xl text-center">
            <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Annulées</span>
            <p className="text-sm font-black text-rose-400 font-mono">{formatPrice(periodCancelledAmount)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-850/60 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider block">Revenus vs Dépenses</span>
            <span className="text-[10px] text-zinc-500 font-medium">Bilan global</span>
          </div>
          <div className="h-44 flex items-end justify-around pb-3 pt-6 bg-zinc-950/60 rounded-xl border border-zinc-900 relative">
            {(() => {
              const maxVal = Math.max(periodTotalRevenue, periodCOGS + periodTotalOPEX, Math.abs(periodNetProfit), 100000);
              const hRev = (periodTotalRevenue / maxVal) * 110;
              const hExp = ((periodCOGS + periodTotalOPEX) / maxVal) * 110;
              const hProf = (Math.max(0, periodNetProfit) / maxVal) * 110;
              return (
                <>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[9px] font-mono text-emerald-400 font-bold">{formatPrice(periodTotalRevenue)}</span>
                    <div className="w-12 bg-gradient-to-t from-emerald-600 to-teal-500 rounded-t-lg shadow-lg" style={{ height: `${Math.max(5, hRev)}px` }} />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Revenus</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[9px] font-mono text-rose-500 font-bold">{formatPrice(periodCOGS + periodTotalOPEX)}</span>
                    <div className="w-12 bg-gradient-to-t from-rose-600 to-pink-500 rounded-t-lg shadow-lg" style={{ height: `${Math.max(5, hExp)}px` }} />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Dépenses</span>
                  </div>
                  <div className="flex flex-col items-center gap-2 group cursor-pointer">
                    <span className="text-[9px] font-mono text-amber-500 font-bold">{formatPrice(periodNetProfit)}</span>
                    <div className="w-12 bg-gradient-to-t from-amber-600 to-orange-500 rounded-t-lg shadow-lg" style={{ height: `${Math.max(5, hProf)}px` }} />
                    <span className="text-[9px] font-bold text-zinc-500 uppercase">Bénéfice</span>
                  </div>
                </>
              );
            })()}
          </div>
        </div>

        {/* Line Chart */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-850/60 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
            <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider block">Evolution Quotidienne</span>
            <span className="text-[10px] text-zinc-500 font-medium">Flux récents</span>
          </div>
          <div className="bg-zinc-950/60 rounded-xl border border-zinc-900 p-3 flex flex-col justify-between h-44 relative">
            {dailyPoints.length > 0 ? (
              <svg className="w-full h-full" viewBox="0 0 400 130">
                <line x1="20" y1="20" x2="390" y2="20" stroke="#1f2937" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="20" y1="60" x2="390" y2="60" stroke="#1f2937" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="20" y1="100" x2="390" y2="100" stroke="#1f2937" strokeWidth="1" strokeDasharray="3,3" />
                {(() => {
                  const points = dailyPoints.map((d, idx) => {
                    const step = 370 / Math.max(1, dailyPoints.length - 1);
                    const x = 20 + idx * step;
                    const yRev = 110 - (d.revenue / maxDailyVal) * 90;
                    const yExp = 110 - (d.expenses / maxDailyVal) * 90;
                    return { x, yRev, yExp };
                  });
                  const pathRev = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.yRev}`).join(' ');
                  const pathExp = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.yExp}`).join(' ');
                  return (
                    <>
                      <path d={pathRev} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map((p, idx) => <circle key={`r-${idx}`} cx={p.x} cy={p.yRev} r="3.5" fill="#020205" stroke="#10b981" strokeWidth="2" />)}
                      <path d={pathExp} fill="none" stroke="#f43f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1,1" />
                      {points.map((p, idx) => <circle key={`e-${idx}`} cx={p.x} cy={p.yExp} r="3" fill="#020205" stroke="#f43f5e" strokeWidth="1.5" />)}
                    </>
                  );
                })()}
                {dailyPoints.map((d, idx) => {
                  const step = 370 / Math.max(1, dailyPoints.length - 1);
                  const x = 20 + idx * step;
                  const isLabelVisible = idx === 0 || idx === Math.floor(dailyPoints.length / 2) || idx === dailyPoints.length - 1;
                  if (!isLabelVisible) return null;
                  return <text key={idx} x={x} y="125" fill="#6b7280" fontSize="8" fontWeight="bold" textAnchor="middle">{d.label}</text>;
                })}
              </svg>
            ) : (
              <div className="flex items-center justify-center h-full text-[10px] text-zinc-500 font-medium">Pas de données d'évolution</div>
            )}
            <div className="flex justify-center gap-4 text-[9px] font-extrabold uppercase text-zinc-500 pt-1 border-t border-zinc-900/60">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Revenus</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /> Dépenses</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales List */}
      <div className="glass-panel p-5 rounded-2xl border border-zinc-850/60 space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
          <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">Détail des Ventes</span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={comptaSearchQuery}
              onChange={e => setComptaSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-700 w-36 transition-all"
            />
            <select
              value={comptaCategoryFilter}
              onChange={e => setComptaCategoryFilter(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white outline-none focus:border-zinc-700 transition-all"
            >
              <option value="all">Toutes catégories</option>
              {productCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {filteredSales.length === 0 ? (
            <div className="text-center py-8 text-zinc-500 text-xs font-medium">Aucune vente sur cette période.</div>
          ) : filteredSales.map(sale => {
            const isExpanded = comptaExpandedSaleId === sale.id;
            const formattedDate = new Date(sale.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
            return (
              <div key={sale.id} className={`bg-zinc-950/60 border rounded-xl p-3 space-y-2 cursor-pointer transition-all ${sale.status === "annulée" ? 'border-rose-900/40 opacity-60' : 'border-zinc-900 hover:border-zinc-800'}`}>
                <div className="flex items-center justify-between" onClick={() => setComptaExpandedSaleId(isExpanded ? null : sale.id)}>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${sale.status === "annulée" ? 'bg-rose-950/60 text-rose-400' : 'bg-emerald-950/60 text-emerald-400'}`}>
                      {sale.status || "Terminée"}
                    </span>
                    <span className="text-xs text-zinc-300 font-bold">{sale.customer}</span>
                    <span className="text-[10px] text-zinc-600 font-mono">{sale.id}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-mono">{formattedDate}</span>
                    <span className="text-sm font-black text-white font-mono">{formatPrice(sale.total)}</span>
                    {sale.status !== "annulée" && (
                      <button onClick={e => { e.stopPropagation(); setShowCancelSaleModal(sale); }}
                        className="w-7 h-7 rounded-lg bg-rose-950/60 border border-rose-900/60 flex items-center justify-center text-rose-400 hover:text-white hover:bg-rose-900 transition-all"
                        title="Annuler cette vente">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                    <button onClick={e => { e.stopPropagation(); setShowReceiptModal({ id: `REC-${sale.id.slice(-6)}`, customer: sale.customer, itemsList: sale.itemsList, gameCost: sale.gameCost || 0, snackCost: sale.snackCost || 0, total: sale.total, date: new Date(sale.date).toLocaleTimeString(), type: sale.gameCost > 0 ? "Clôture Station & Snacks" : "Facture Directe", paymentMethod: sale.paymentMethod }); }}
                      className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                      title="Imprimer le reçu">
                      <Printer className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                {isExpanded && (
                  <div className="bg-zinc-950/60 border border-zinc-900 p-3 rounded-lg space-y-1 animate-fade-in">
                    {sale.gameCost > 0 && <div className="flex justify-between text-[11px] text-zinc-300"><span>🕹️ Session</span><span>{formatPrice(sale.gameCost)}</span></div>}
                    {(sale.itemsList || []).map((item, i) => item && item.product ? (
                      <div key={i} className="flex justify-between text-[11px] text-zinc-400">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ) : null)}
                    {sale.cancelReason && <div className="text-[10px] text-rose-400 pt-1 border-t border-zinc-900">Motif: {sale.cancelReason}</div>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SALES HISTORY VIEW COMPONENT
// ============================================================
function SalesHistoryView({
  sales, formatPrice,
  salesHistStartDate, salesHistEndDate, setSalesHistStartDate, setSalesHistEndDate,
  salesHistFilterTab, setSalesHistFilterTab,
  salesHistShowFilters, setSalesHistShowFilters,
  salesHistSearchQuery, setSalesHistSearchQuery,
  salesHistSellerFilter, setSalesHistSellerFilter,
  salesHistPaymentFilter, setSalesHistPaymentFilter,
  setShowCancelSaleModal, setShowReceiptModal
}) {
  const start = React.useMemo(() => {
    const d = new Date(salesHistStartDate);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [salesHistStartDate]);

  const end = React.useMemo(() => {
    const d = new Date(salesHistEndDate);
    d.setHours(23, 59, 59, 999);
    return d;
  }, [salesHistEndDate]);

  const formatDateStr = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleQuickPeriod = (period) => {
    const today = new Date();
    let s = new Date();
    let e = new Date();
    switch (period) {
      case "today": s = today; e = today; break;
      case "yesterday": {
        s = new Date(today); s.setDate(today.getDate() - 1);
        e = new Date(s); break;
      }
      case "this_week": {
        const cd = today.getDay();
        const dist = cd === 0 ? 6 : cd - 1;
        s = new Date(today); s.setDate(today.getDate() - dist);
        e = today; break;
      }
      case "last_week": {
        const cd2 = today.getDay();
        const dist2 = cd2 === 0 ? 6 : cd2 - 1;
        s = new Date(today); s.setDate(today.getDate() - dist2 - 7);
        e = new Date(s); e.setDate(s.getDate() + 6); break;
      }
      case "this_month":
        s = new Date(today.getFullYear(), today.getMonth(), 1);
        e = today; break;
      case "last_month":
        s = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        e = new Date(today.getFullYear(), today.getMonth(), 0); break;
      default: break;
    }
    setSalesHistStartDate(s.toISOString().slice(0, 10));
    setSalesHistEndDate(e.toISOString().slice(0, 10));
  };

  const filteredPeriodSales = React.useMemo(() => {
    return (sales || []).filter(s => {
      if (!s) return false;
      const saleDate = new Date(s.date || Date.now());
      const inDateRange = saleDate >= start && saleDate <= end;
      if (!inDateRange) return false;
      
      const customerName = s.customer || "Client Comptant";
      const saleId = s.id || "";
      
      // Items description search
      const itemsList = s.itemsList || [];
      const matchesItems = itemsList.some(item => 
        item && item.product && item.product.name.toLowerCase().includes(salesHistSearchQuery.toLowerCase())
      );
      
      const matchesSearch = customerName.toLowerCase().includes(salesHistSearchQuery.toLowerCase()) ||
                            saleId.toLowerCase().includes(salesHistSearchQuery.toLowerCase()) ||
                            matchesItems;
      if (!matchesSearch) return false;
      
      const sellerName = s.seller || "Gérant";
      const matchesSeller = salesHistSellerFilter === "all" || sellerName.toLowerCase() === salesHistSellerFilter.toLowerCase();
      if (!matchesSeller) return false;
      
      const pMethod = (s.paymentMethod || "espèces").toLowerCase();
      const matchesPayment = salesHistPaymentFilter === "all" || 
                             pMethod.includes(salesHistPaymentFilter.toLowerCase());
      return matchesPayment;
    });
  }, [sales, start, end, salesHistSearchQuery, salesHistSellerFilter, salesHistPaymentFilter]);

  // Active vs Cancelled counts
  const activeSales = React.useMemo(() => filteredPeriodSales.filter(s => s.status !== "annulée"), [filteredPeriodSales]);
  const cancelledSales = React.useMemo(() => filteredPeriodSales.filter(s => s.status === "annulée"), [filteredPeriodSales]);

  // Feed list based on filter tab selection
  const feedSales = React.useMemo(() => {
    return salesHistFilterTab === "annulees" ? cancelledSales : filteredPeriodSales;
  }, [salesHistFilterTab, filteredPeriodSales, cancelledSales]);

  // KPI calculations
  const caTotal = React.useMemo(() => activeSales.reduce((sum, s) => sum + (s.total || 0), 0), [activeSales]);
  const activeSalesCount = activeSales.length;
  const panierMoyen = activeSalesCount > 0 ? caTotal / activeSalesCount : 0;
  const cancelledSalesCount = cancelledSales.length;

  const cashSalesTotal = React.useMemo(() => {
    return activeSales.filter(s => {
      const method = (s.paymentMethod || "espèces").toLowerCase();
      return method === "espèces" || method === "especes" || method.includes("espèces + mobile");
    }).reduce((sum, s) => {
      if ((s.paymentMethod || "").toLowerCase().includes("espèces + mobile") || (s.paymentMethod || "").toLowerCase().includes("mixte")) {
        return sum + (s.cashUsed || (s.total / 2));
      }
      return sum + (s.total || 0);
    }, 0);
  }, [activeSales]);

  // Get unique operators for selection dropdown
  const uniqueSellers = React.useMemo(() => {
    return [...new Set((sales || []).map(s => s.seller || "Gérant").filter(Boolean))];
  }, [sales]);

  const handleWhatsAppShare = (sale) => {
    const customerName = sale.customer || "Client Comptant";
    const saleId = sale.id || "";
    const dateFormatted = new Date(sale.date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    let itemsText = "";
    if (sale.gameCost > 0) {
      itemsText += `• Session Station: ${formatPrice(sale.gameCost)}\n`;
    }
    (sale.itemsList || []).forEach(item => {
      if (item && item.product) {
        itemsText += `• ${item.product.name} x${item.quantity}: ${formatPrice(item.product.price * item.quantity)}\n`;
      }
    });
    
    const message = `*PS LOUNGE - Reçu de Vente*\n` +
                    `--------------------------------\n` +
                    `*Ticket :* #${saleId}\n` +
                    `*Client :* ${customerName}\n` +
                    `*Date :* ${dateFormatted}\n` +
                    `*Statut :* ${sale.status || "Terminée"}\n` +
                    `--------------------------------\n` +
                    `*Détails :*\n${itemsText}` +
                    `--------------------------------\n` +
                    `*TOTAL :* ${formatPrice(sale.total)}\n` +
                    `*Moyen de Paiement :* ${sale.paymentMethod || "Espèces"}\n` +
                    `--------------------------------\n` +
                    `Merci de votre confiance ! ⚡`;
                    
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const triggerRefreshAnimation = () => {
    gsap.fromTo(
      ".refresh-icon",
      { rotate: 0 },
      { rotate: 360, duration: 0.6, ease: "power2.out" }
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto font-sans">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="sticker-badge bg-zinc-900 border border-zinc-800 text-zinc-400 font-extrabold px-3 py-1 text-[9px] uppercase tracking-widest inline-block rounded-md">
            ps lounge – ps lounge
          </span>
          <h2 className="text-xl font-black text-white tracking-wide uppercase mt-1">Historique des ventes</h2>
        </div>
        <button 
          onClick={triggerRefreshAnimation}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white rounded-xl transition-all self-start"
        >
          <RefreshCw className="w-3.5 h-3.5 refresh-icon" />
          Actualiser
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* CA TOTAL */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-850 bg-zinc-950/40 relative overflow-hidden group hover:border-zinc-750 transition-all duration-300">
          <div className="flex justify-between items-start text-zinc-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">CA TOTAL</span>
            <span className="text-sm bg-emerald-500/10 p-1.5 rounded-lg font-bold">💰</span>
          </div>
          <p className="text-base font-black text-white font-mono tracking-tight">{formatPrice(caTotal)}</p>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">{activeSalesCount} ventes actives</span>
        </div>

        {/* PANIER MOYEN */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-850 bg-zinc-950/40 relative overflow-hidden group hover:border-zinc-750 transition-all duration-300">
          <div className="flex justify-between items-start text-zinc-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">PANIER MOYEN</span>
            <span className="text-sm bg-violet-500/10 p-1.5 rounded-lg font-bold">🛒</span>
          </div>
          <p className="text-base font-black text-white font-mono tracking-tight">{formatPrice(panierMoyen)}</p>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">Valeur moyenne</span>
        </div>

        {/* ANNULÉES */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-850 bg-zinc-950/40 relative overflow-hidden group hover:border-zinc-750 transition-all duration-300">
          <div className="flex justify-between items-start text-zinc-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">ANNULÉES</span>
            <span className="text-sm bg-rose-500/10 p-1.5 rounded-lg font-bold">❌</span>
          </div>
          <p className="text-base font-black text-rose-500 font-mono tracking-tight">{cancelledSalesCount}</p>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">Ventes annulées</span>
        </div>

        {/* ESPÈCES */}
        <div className="glass-panel p-5 rounded-2xl border border-zinc-850 bg-zinc-950/40 relative overflow-hidden group hover:border-zinc-750 transition-all duration-300">
          <div className="flex justify-between items-start text-zinc-500 mb-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider">ESPÈCES</span>
            <span className="text-sm bg-amber-500/10 p-1.5 rounded-lg font-bold">💵</span>
          </div>
          <p className="text-base font-black text-white font-mono tracking-tight">{formatPrice(cashSalesTotal)}</p>
          <span className="text-[10px] text-zinc-500 font-semibold mt-1 block">Ventes en espèces</span>
        </div>
      </div>

      {/* Filters and Navigation Tabs */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center bg-zinc-950/60 p-2 border border-zinc-900 rounded-2xl">
          <div className="flex gap-2">
            <button
              onClick={() => setSalesHistFilterTab("toutes")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                salesHistFilterTab === "toutes" 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Toutes
            </button>
            <button
              onClick={() => setSalesHistFilterTab("annulees")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                salesHistFilterTab === "annulees" 
                  ? "bg-zinc-800 text-white" 
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Ventes annulées
              {cancelledSalesCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {cancelledSalesCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={() => setSalesHistShowFilters(v => !v)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border ${
              salesHistShowFilters 
                ? "bg-violet-600 border-violet-500 text-white" 
                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white"
            }`}
          >
            🔍 Filtres
          </button>
        </div>

        {/* Advanced Filters Panel */}
        {salesHistShowFilters && (
          <div className="bg-zinc-950/40 border border-zinc-850 p-5 rounded-2xl space-y-4 animate-slide-down">
            <div className="flex items-center gap-2 border-b border-zinc-900 pb-2">
              <Calendar className="w-4 h-4 text-violet-400" />
              <span className="text-xs font-extrabold text-zinc-300 uppercase tracking-wider">Filtres avancés</span>
            </div>

            {/* Quick periods */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: "today", label: "Aujourd'hui" },
                { key: "yesterday", label: "Hier" },
                { key: "this_week", label: "Cette semaine" },
                { key: "last_week", label: "Semaine passée" },
                { key: "this_month", label: "Ce mois" }
              ].map(p => (
                <button key={p.key} onClick={() => handleQuickPeriod(p.key)}
                  className="px-3 py-1.5 text-[9px] font-bold rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white transition-all">
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Du</label>
                <input type="date" value={salesHistStartDate} onChange={e => setSalesHistStartDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all" />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Au</label>
                <input type="date" value={salesHistEndDate} onChange={e => setSalesHistEndDate(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all" />
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Moyen de paiement</label>
                <select value={salesHistPaymentFilter} onChange={e => setSalesHistPaymentFilter(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all cursor-pointer">
                  <option value="all">Tous</option>
                  <option value="espèces">Espèces</option>
                  <option value="mobile money">Mobile Money</option>
                  <option value="Wave">Wave</option>
                  <option value="espèces + mobile">Espèces + Mobile</option>
                  <option value="Mixte">Mixte</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Opérateur</label>
                <select value={salesHistSellerFilter} onChange={e => setSalesHistSellerFilter(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-xl px-3 py-2 text-xs text-white outline-none transition-all cursor-pointer">
                  <option value="all">Tous</option>
                  {uniqueSellers.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Recherche (Client, Produit, ID)</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  value={salesHistSearchQuery} 
                  onChange={e => setSalesHistSearchQuery(e.target.value)} 
                  placeholder="Tapez le nom d'un client, d'un produit ou l'identifiant..."
                  className="w-full bg-zinc-900 border border-zinc-800 focus:border-violet-600/50 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none transition-all" 
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Feed List of Sales */}
      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
        {feedSales.length === 0 ? (
          <div className="glass-panel text-center py-12 border border-zinc-900 text-zinc-500 text-xs font-semibold rounded-2xl bg-zinc-950/20">
            Aucune vente trouvée correspondant aux critères.
          </div>
        ) : (
          feedSales.map((sale, index) => {
            const formattedDate = new Date(sale.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit'
            });

            // Parse items list representation
            const items = (sale.itemsList || []).map(item => {
              if (!item || !item.product) return "";
              return `${item.product.name} ×${item.quantity}`;
            }).filter(Boolean);
            
            if (sale.gameCost > 0) {
              items.unshift("🕹️ Session Console");
            }
            
            const itemsDetailText = items.join(", ");
            const isCancelled = sale.status === "annulée";

            // Payment badge color
            const payMethod = (sale.paymentMethod || "espèces").toLowerCase();
            let payBadgeColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400";
            if (payMethod.includes("mobile money") || payMethod.includes("momo")) {
              payBadgeColor = "bg-amber-500/10 border-amber-500/20 text-amber-400";
            } else if (payMethod.includes("wave")) {
              payBadgeColor = "bg-sky-500/10 border-sky-500/20 text-sky-400";
            } else if (payMethod.includes("mixte") || payMethod.includes("espèces + mobile")) {
              payBadgeColor = "bg-purple-500/10 border-purple-500/20 text-purple-400";
            }

            return (
              <div 
                key={sale.id}
                className={`bg-zinc-950/20 border p-4 rounded-2xl flex flex-col gap-3 transition-all duration-300 relative overflow-hidden ${
                  isCancelled 
                    ? "border-rose-950/40 bg-rose-950/5 shadow-rose-950/5 opacity-85" 
                    : "border-zinc-900 hover:border-zinc-800 bg-zinc-950/10 hover:bg-zinc-950/20 shadow-lg"
                }`}
              >
                {/* Row 1: Header (Index + Type & Status) */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-zinc-500 font-bold font-mono">#{filteredPeriodSales.length - index}</span>
                    <span className="text-[10px] text-amber-400 italic font-black uppercase tracking-wider font-mono">
                      {sale.gameCost > 0 ? "station" : "local"}
                    </span>
                  </div>
                  
                  {isCancelled ? (
                    <span className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full flex items-center gap-1">
                      ❌ Annulée
                    </span>
                  ) : (
                    <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full flex items-center gap-1">
                      ✓ OK
                    </span>
                  )}
                </div>

                {/* Row 2: Date, Time & Seller */}
                <div className="text-[11px] text-zinc-400 font-bold flex justify-between items-center">
                  <span>{formattedDate}</span>
                  <span className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 text-[10px] font-bold px-2 py-0.5 rounded-md text-zinc-300">
                    👤 {sale.seller || "Gérant"}
                  </span>
                </div>

                {/* Row 3: Customer Icon & Name */}
                <div className="flex items-center gap-1.5 text-xs font-black text-white tracking-wide">
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                  <span>{sale.customer || "Client Comptant"}</span>
                </div>

                {/* Row 4: Items sold description */}
                <div className="text-[11px] text-zinc-400 font-semibold italic leading-relaxed bg-zinc-950/40 p-2.5 rounded-xl border border-zinc-900/40">
                  {itemsDetailText || "Aucun article"}
                </div>

                {/* Row 5: Total Amount and Payment badge */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-sm font-black text-white font-mono tracking-tight">{formatPrice(sale.total)}</span>
                  <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${payBadgeColor}`}>
                    {sale.paymentMethod || "Espèces"}
                  </span>
                </div>

                {/* Row 6: Action Buttons */}
                <div className="flex gap-2 pt-2 border-t border-zinc-900/40">
                  <button
                    onClick={() => handleWhatsAppShare(sale)}
                    className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-300 hover:text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Share2 className="w-3 h-3 text-emerald-400" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => setShowReceiptModal({
                      id: `REC-${sale.id.slice(-6)}`,
                      customer: sale.customer,
                      itemsList: sale.itemsList,
                      gameCost: sale.gameCost || 0,
                      snackCost: sale.snackCost || 0,
                      total: sale.total,
                      date: new Date(sale.date).toLocaleTimeString(),
                      type: sale.gameCost > 0 ? "Clôture Station & Snacks" : "Facture Directe",
                      paymentMethod: sale.paymentMethod
                    })}
                    className="flex-1 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-850 text-zinc-300 hover:text-white rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                  >
                    <Printer className="w-3 h-3 text-violet-400" />
                    Imprimer
                  </button>
                  {!isCancelled && (
                    <button
                      onClick={() => setShowCancelSaleModal(sale)}
                      className="flex-1 py-2 bg-zinc-900 hover:bg-rose-950/20 border border-zinc-850 hover:border-rose-900/30 text-rose-400 hover:text-rose-305 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3 h-3 text-rose-500" />
                      Annuler
                    </button>
                  )}
                </div>

                {/* Row 7: Cancellation reason (if cancelled) */}
                {isCancelled && sale.cancelReason && (
                  <div className="text-[10px] text-rose-400 font-bold bg-rose-500/5 p-2 rounded-lg border border-rose-900/10 italic">
                    Motif : {sale.cancelReason}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

// ============================================================
// CANCEL SALE MODAL COMPONENT
// ============================================================
function CancelSaleModal({ sale, onClose, onConfirm }) {
  const [localReason, setLocalReason] = React.useState("");
  const [localCustom, setLocalCustom] = React.useState("");
  const [localReturnStock, setLocalReturnStock] = React.useState(true);
  const hasStock = sale.itemsList && sale.itemsList.length > 0;

  const itemsSummary = React.useMemo(() => {
    if (sale.gameCost > 0 && (!sale.itemsList || sale.itemsList.length === 0)) {
      return "Session Station Console";
    }
    const items = (sale.itemsList || []).map(item => {
      if (!item || !item.product) return "";
      return `"${item.product.name}" × ${item.quantity}`;
    }).filter(Boolean);
    
    if (sale.gameCost > 0) {
      items.unshift("Session Station");
    }
    return items.join(", ");
  }, [sale]);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{background:'rgba(0,0,0,0.85)'}}>
      <div
        className="relative w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
        style={{boxShadow:'0 0 60px rgba(239,68,68,0.15)'}}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-950/80 to-zinc-950 border-b border-rose-900/40 p-5 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                <XCircle className="w-4 h-4 text-rose-400" />
              </div>
              <h3 className="text-sm font-black text-white tracking-tight">Annuler la vente</h3>
            </div>
            <p className="text-[10px] text-zinc-400">ID Vente &mdash; <span className="font-mono text-rose-300">{sale.id}</span></p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
            <XCircle className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Sale details card */}
          <div className="bg-zinc-900/40 border border-zinc-850 p-4 rounded-xl space-y-1.5">
            <div className="text-[10px] text-zinc-500 font-mono">#{sale.id}</div>
            <div className="text-xl font-black text-emerald-400 font-mono">
              {sale.total ? sale.total.toLocaleString('fr-FR') : 0} FCFA
            </div>
            <div className="text-xs text-zinc-400 italic font-medium">
              {itemsSummary || "Aucun article"}
            </div>
          </div>

          {/* Motif Selector */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block">
              MOTIF <span className="text-rose-500">*</span>
            </label>
            <select
              value={localReason}
              onChange={e => {
                setLocalReason(e.target.value);
                if (e.target.value !== "Autre") setLocalCustom("");
              }}
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-500/50 rounded-xl px-3 py-2.5 text-xs text-white outline-none transition-all cursor-pointer"
            >
              <option value="" disabled>- Sélectionner -</option>
              <option value="Erreur de saisie">Erreur de saisie</option>
              <option value="Produit défectueux">Produit défectueux</option>
              <option value="Produit cassé">Produit cassé</option>
              <option value="Client a annulé">Client a annulé</option>
              <option value="Doublon">Doublon</option>
              <option value="Retour produit">Retour produit</option>
              <option value="Autre">Autre</option>
            </select>

            {localReason === "Autre" && (
              <textarea
                value={localCustom}
                onChange={e => setLocalCustom(e.target.value)}
                placeholder="Décrivez le motif d'annulation..."
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-rose-600/50 rounded-xl p-3 text-xs text-white placeholder-zinc-600 resize-none h-20 outline-none transition-all mt-2"
              />
            )}
          </div>

          {/* Stock return option */}
          {hasStock && (
            <label className="flex items-center gap-3 p-3 bg-zinc-900/60 border border-zinc-800 rounded-xl cursor-pointer hover:border-zinc-700 transition-all">
              <div
                onClick={() => setLocalReturnStock(v => !v)}
                className={`w-10 h-5 rounded-full border transition-all relative flex-shrink-0 ${
                  localReturnStock ? 'bg-emerald-600 border-emerald-500' : 'bg-zinc-800 border-zinc-700'
                }`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
                  localReturnStock ? 'left-5' : 'left-0.5'
                }`} />
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-200">Retourner au stock</span>
                <p className="text-[10px] text-zinc-500">Les articles vendus seront remis en inventaire</p>
              </div>
            </label>
          )}

          {/* Warning */}
          <div className="bg-amber-950/20 border border-amber-900/30 rounded-xl p-3 flex gap-2">
            <span className="text-amber-400 text-sm mt-0.5">⚠️</span>
            <p className="text-[10px] text-amber-300/80 leading-relaxed">
              Cette action est <strong>irréversible</strong>. La vente sera marquée comme annulée et les montants correspondants seront retirés de la caisse.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 flex items-center gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
          >
            Annuler
          </button>
          <button
            onClick={() => onConfirm(sale.id, localReason, localCustom, localReturnStock)}
            disabled={!localReason || (localReason === "Autre" && !localCustom.trim())}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-900 disabled:text-zinc-650 disabled:border-zinc-850 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/30 active:scale-95 transition-all border border-transparent flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-3.5 h-3.5" />
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // App states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [role, setRole] = useState("admin"); // 'admin' or 'gerant'
  const [consoles, setConsoles] = useState(() => {
    const initializedTest = localStorage.getItem("system_test_reset_v5_zero_stats");
    const saved = localStorage.getItem("system_consoles");
    const list = saved ? JSON.parse(saved) : initialConsoles;
    if (!initializedTest) {
      return list.map(c => ({
        ...c,
        status: "libre",
        totalSessions: 0,
        totalRevenue: 0,
        totalTimeSeconds: 0,
        activeSession: null
      }));
    }
    return list;
  });
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("system_products");
    return saved ? JSON.parse(saved) : snackProducts;
  });

  // --- Global System Settings States ---
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem("system_settings");
    const defaults = {
      companyName: "HOUSEPUB",
      companySubtitle: "PS LOUNGE",
      companySlogan: "\"La Maison du Bonheur\"",
      logoUrl: "/logo.jpg",
      currency: "FCFA",
      currencyLocale: "fr-FR",
      phone: "+237 6 55 11 22 33",
      email: "contact@housepub.cm",
      address: "Rue du Commerce, Yaoundé Centre",
      defaultStockThreshold: 5,
      alertLowStock: true,
      alertOutOfStock: true,
      alertHighExpense: true,
      alertUnclosedCaisse: true,
      alertConsoleMaintenance: true,
      highExpenseThreshold: 50000,
      theme: "sombre",
    };
    return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
  });

  const [toastText, setToastText] = useState("Événement simulé appliqué avec succès !");
  const [tempAlertLowStock, setTempAlertLowStock] = useState(() => systemSettings.alertLowStock);
  const [tempAlertOutOfStock, setTempAlertOutOfStock] = useState(() => systemSettings.alertOutOfStock);
  const [tempAlertHighExpense, setTempAlertHighExpense] = useState(() => systemSettings.alertHighExpense);
  const [tempAlertUnclosedCaisse, setTempAlertUnclosedCaisse] = useState(() => systemSettings.alertUnclosedCaisse);
  const [tempAlertConsoleMaintenance, setTempAlertConsoleMaintenance] = useState(() => systemSettings.alertConsoleMaintenance);
  const [tempHighExpenseThreshold, setTempHighExpenseThreshold] = useState(() => systemSettings.highExpenseThreshold);

  const [productCategories, setProductCategories] = useState(() => {
    const saved = localStorage.getItem("system_product_categories");
    return saved ? JSON.parse(saved) : [
      { id: "boissons", label: "Boissons", emoji: "🥤" },
      { id: "eau", label: "Eaux", emoji: "💧" },
      { id: "chicha", label: "Chichas", emoji: "💨" },
      { id: "whisky", label: "Whisky & Alcool", emoji: "🥃" }
    ];
  });

  const [paymentMethods, setPaymentMethods] = useState(() => {
    const saved = localStorage.getItem("system_payment_methods");
    return saved ? JSON.parse(saved) : ["espèces", "wave", "mobile money", "carte bancaire", "virement"];
  });

  const [players, setPlayers] = useState(() => {
    const initializedTest = localStorage.getItem("system_test_reset_v5_zero_stats");
    const saved = localStorage.getItem("system_players");
    const list = saved ? JSON.parse(saved) : initialPlayers;
    if (!initializedTest) {
      return list.map(p => ({
        ...p,
        totalSessions: 0,
        totalSpent: 0,
        totalTimeMinutes: 0
      }));
    }
    return list;
  });

  const [zones, setZones] = useState(() => {
    const saved = localStorage.getItem("system_zones");
    return saved ? JSON.parse(saved) : ["A", "B", "C"];
  });

  // --- Sync States to localStorage ---
  useEffect(() => {
    localStorage.setItem("system_zones", JSON.stringify(zones));
  }, [zones]);

  useEffect(() => {
    localStorage.setItem("system_consoles", JSON.stringify(consoles));
  }, [consoles]);

  useEffect(() => {
    localStorage.setItem("system_products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("system_settings", JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    if (systemSettings.theme === "clair") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
  }, [systemSettings.theme]);

  useEffect(() => {
    const initializedTest = localStorage.getItem("system_test_reset_v5_zero_stats");
    if (!initializedTest) {
      localStorage.removeItem("system_pos_tickets");
      localStorage.removeItem("system_active_caisse_session");
      localStorage.removeItem("system_expenses");
      localStorage.removeItem("system_purchases");
      localStorage.removeItem("system_activity_log");
      localStorage.removeItem("system_stock_movements");
      localStorage.removeItem("system_sales");

      // Reset consoles statistics but keep their configurations
      const savedConsoles = localStorage.getItem("system_consoles");
      if (savedConsoles) {
        try {
          const parsed = JSON.parse(savedConsoles);
          const resetConsoles = parsed.map(c => ({
            ...c,
            status: "libre",
            totalSessions: 0,
            totalRevenue: 0,
            totalTimeSeconds: 0,
            activeSession: null
          }));
          localStorage.setItem("system_consoles", JSON.stringify(resetConsoles));
        } catch (e) {
          console.error(e);
        }
      }

      // Reset players statistics but keep their profiles
      const savedPlayers = localStorage.getItem("system_players");
      if (savedPlayers) {
        try {
          const parsed = JSON.parse(savedPlayers);
          const resetPlayers = parsed.map(p => ({
            ...p,
            totalSessions: 0,
            totalSpent: 0,
            totalTimeMinutes: 0
          }));
          localStorage.setItem("system_players", JSON.stringify(resetPlayers));
        } catch (e) {
          console.error(e);
        }
      }

      localStorage.setItem("system_test_reset_v5_zero_stats", "true");
      window.location.reload();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("system_product_categories", JSON.stringify(productCategories));
  }, [productCategories]);

  useEffect(() => {
    localStorage.setItem("system_payment_methods", JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem("system_players", JSON.stringify(players));
  }, [players]);

  // Global helper for formatting prices/currency dynamically
  const formatPrice = (amount) => {
    const amt = Number(amount || 0);
    const locale = systemSettings.currencyLocale || "fr-FR";
    const symbol = systemSettings.currency || "FCFA";
    return `${amt.toLocaleString(locale)} ${symbol}`;
  };

  const [stats, setStats] = useState(initialStats);
  const [topConsolesState, setTopConsolesState] = useState(initialTopConsoles);
  const [topProductsState, setTopProductsState] = useState(initialTopProducts);
  const [activityLog, setActivityLog] = useState(initialActivityLog);

  const [sales, setSales] = useState(() => {
    const initializedTest = localStorage.getItem("system_test_reset_v5_zero_stats");
    if (!initializedTest) {
      return [];
    }
    const saved = localStorage.getItem("system_sales");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.every(s => s && typeof s === 'object' && 'itemsList' in s)) {
          return parsed;
        }
      } catch (e) {
        console.error("Failed parsing sales history:", e);
      }
    }
    const mock = generateMockSales();
    localStorage.setItem("system_sales", JSON.stringify(mock));
    return mock;
  });

  useEffect(() => {
    localStorage.setItem("system_sales", JSON.stringify(sales));
  }, [sales]);

  // Detailed daily report tracking
  const [dailyConsolesRevenue, setDailyConsolesRevenue] = useState(() => {
    return initialConsoles.map(c => {
      const topC = initialTopConsoles.find(x => x.name === c.name);
      return {
        name: c.name,
        type: c.type,
        revenue: topC ? topC.revenue : 0,
        sessions: topC ? topC.sessions : 0
      };
    });
  });

  const [dailyProductsRevenue, setDailyProductsRevenue] = useState(() => {
    return snackProducts.map(p => {
      const topP = initialTopProducts.find(x => x.name === p.name);
      return {
        name: p.name,
        category: p.category,
        quantity: topP ? topP.quantity : 0,
        revenue: topP ? topP.revenue : 0
      };
    });
  });

  // Live clock
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  useEffect(() => {
    const ticker = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(ticker);
  }, []);

  // Z-Report modal
  const [showZReportModal, setShowZReportModal] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);

  const [stockMovements, setStockMovements] = useState(initialStockMovements);
  
  // Stock sub-tab
  const [stockSubTab, setStockSubTab] = useState("inventory"); // 'inventory' or 'movements'
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [stockCategoryFilter, setStockCategoryFilter] = useState("all");
  const [stockMovementTypeFilter, setStockMovementTypeFilter] = useState("all");

  // Stock Modals
  const [showAdjustStockModal, setShowAdjustStockModal] = useState(null);
  const [showEditProductModal, setShowEditProductModal] = useState(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Stock Adjust Form State
  const [adjustType, setAdjustType] = useState("entrée");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState("");

  // Edit Product Form State
  const [editProdName, setEditProdName] = useState("");
  const [editProdCategory, setEditProdCategory] = useState("boissons");
  const [editProdPurchasePrice, setEditProdPurchasePrice] = useState(0);
  const [editProdPrice, setEditProdPrice] = useState(0);
  const [editProdMinThreshold, setEditProdMinThreshold] = useState(5);
  const [editProdImage, setEditProdImage] = useState("🥤");

  // Add Product Form State
  const [addProdName, setAddProdName] = useState("");
  const [addProdCategory, setAddProdCategory] = useState("boissons");
  const [addProdImage, setAddProdImage] = useState("🥤");
  const [addProdPurchasePrice, setAddProdPurchasePrice] = useState(0);
  const [addProdPrice, setAddProdPrice] = useState(0);
  const [addProdInitialStock, setAddProdInitialStock] = useState(0);
  const [addProdMinThreshold, setAddProdMinThreshold] = useState(5);

  // Add Console Form State
  const [showAddConsoleModal, setShowAddConsoleModal] = useState(false);
  const [addConsoleName, setAddConsoleName] = useState("");
  const [addConsoleZone, setAddConsoleZone] = useState("A");
  const [addConsoleType, setAddConsoleType] = useState("PS5");
  const [addConsoleRate, setAddConsoleRate] = useState(1500);
  const [addConsoleImage, setAddConsoleImage] = useState("");

  // Edit Console Form State
  const [showEditConsoleModal, setShowEditConsoleModal] = useState(null);
  const [editConsoleName, setEditConsoleName] = useState("");
  const [editConsoleZone, setEditConsoleZone] = useState("A");
  const [editConsoleType, setEditConsoleType] = useState("PS5");
  const [editConsoleRate, setEditConsoleRate] = useState(1500);
  const [editConsoleImage, setEditConsoleImage] = useState("");

  // Expenses management states
  const [expenses, setExpenses] = useState(initialExpenses);

  // Purchases management states
  const [purchases, setPurchases] = useState(initialPurchases);
  const [purchaseSearchQuery, setPurchaseSearchQuery] = useState("");
  const [purchaseFilterPaymentMethod, setPurchaseFilterPaymentMethod] = useState("all");
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [showEditPurchaseModal, setShowEditPurchaseModal] = useState(null); // stores purchase object to edit

  // Add/Edit Purchase Form State
  const [purchaseSupplier, setPurchaseSupplier] = useState("");
  const [purchaseIsCustomSupplier, setPurchaseIsCustomSupplier] = useState(false);
  const [purchaseCustomSupplierName, setPurchaseCustomSupplierName] = useState("");
  const [purchaseProduct, setPurchaseProduct] = useState("Autre"); // can be "Autre" or existing product name
  const [purchaseCustomProductName, setPurchaseCustomProductName] = useState(""); // if "Autre"
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseUnitPrice, setPurchaseUnitPrice] = useState("");
  const [purchaseTotalAmount, setPurchaseTotalAmount] = useState("");
  const [purchasePaymentMethod, setPurchasePaymentMethod] = useState("espèces");
  const [purchaseResponsible, setPurchaseResponsible] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");

  // Comptabilité states
  const [comptaStartDate, setComptaStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [comptaEndDate, setComptaEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [comptaCategoryFilter, setComptaCategoryFilter] = useState("all");
  const [comptaSearchQuery, setComptaSearchQuery] = useState("");
  const [comptaSellerFilter, setComptaSellerFilter] = useState("all");
  const [comptaPeriodFilterToggled, setComptaPeriodFilterToggled] = useState(false);
  const [comptaExpandedSaleId, setComptaExpandedSaleId] = useState(null);

  // Sales History states
  const [salesHistStartDate, setSalesHistStartDate] = useState(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
  });
  const [salesHistEndDate, setSalesHistEndDate] = useState(() => {
    return new Date().toISOString().slice(0, 10);
  });
  const [salesHistFilterTab, setSalesHistFilterTab] = useState("toutes"); // "toutes" or "annulees"
  const [salesHistShowFilters, setSalesHistShowFilters] = useState(false);
  const [salesHistSearchQuery, setSalesHistSearchQuery] = useState("");
  const [salesHistSellerFilter, setSalesHistSellerFilter] = useState("all");
  const [salesHistPaymentFilter, setSalesHistPaymentFilter] = useState("all");

  // States for sale cancellation
  const [showCancelSaleModal, setShowCancelSaleModal] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [customCancelReason, setCustomCancelReason] = useState("");
  const [reputInStock, setReputInStock] = useState(true);

  // Sync purchaseTotalAmount on quantity or price change
  useEffect(() => {
    const qty = Number(purchaseQuantity || 0);
    const up = Number(purchaseUnitPrice || 0);
    setPurchaseTotalAmount(qty * up);
  }, [purchaseQuantity, purchaseUnitPrice]);

  // Caisse (Cash register) management states
  const [caisseStatus, setCaisseStatus] = useState("ouverte");
  const [caisseSessions, setCaisseSessions] = useState(initialCaisseSessions);
  const [activeCaisseSession, setActiveCaisseSession] = useState({
    id: "shift-permanent",
    dateOpen: new Date().toISOString(),
    openedBy: "Gérant",
    openingBalance: 0,
    gamesRevenue: 0,
    snackRevenue: 0,
    expensesMaintenance: 0,
    expensesDiverses: 0,
    purchases: 0,
    purchasesCash: 0,
    refunds: 0,
    paymentEspèces: 0,
    paymentMobileMoney: 0,
    paymentCarte: 0,
    transactionsCount: 0,
    movements: []
  });
  const [caisseSubTab, setCaisseSubTab] = useState("suivi"); // 'suivi' or 'historique'
  const [reportSubTab, setReportSubTab] = useState("journalier"); // 'journalier', 'hebdomadaire', 'mensuel'
  const [showOpenCaisseModal, setShowOpenCaisseModal] = useState(false);
  const [showCloseCaisseModal, setShowCloseCaisseModal] = useState(false);
  const [showAddMovementModal, setShowAddMovementModal] = useState(false);
  const [movementType, setMovementType] = useState("entrée"); // 'entrée' or 'sortie'
  const [movementAmount, setMovementAmount] = useState("");
  const [movementReason, setMovementReason] = useState("");
  const [movementOperator, setMovementOperator] = useState("");

  const [caisseTimerTick, setCaisseTimerTick] = useState(0);
  useEffect(() => {
    let interval;
    if (caisseStatus === "ouverte") {
      interval = setInterval(() => {
        setCaisseTimerTick(prev => prev + 1);
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [caisseStatus]);

  const getSessionDuration = () => {
    if (!activeCaisseSession || !activeCaisseSession.dateOpen) return "0 min";
    const start = new Date(activeCaisseSession.dateOpen);
    const now = new Date();
    const diffMs = Math.abs(now - start);
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    }
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hrs}h ${mins}min`;
  };

  // Form states for open/close caisse
  const [openCaisseBalance, setOpenCaisseBalance] = useState("");
  const [openCaisseOperator, setOpenCaisseOperator] = useState("");
  const [closeCaisseRealBalance, setCloseCaisseRealBalance] = useState("");
  const [closeCaisseNotes, setCloseCaisseNotes] = useState("");
  const [closeCaisseOperator, setCloseCaisseOperator] = useState("");

  // ─── Fournisseurs (Suppliers) ──────────────────────────────────────────
  const [suppliers, setSuppliers] = useState(initialSuppliers);
  const [supplierSearch, setSupplierSearch] = useState("");
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditSupplierModal, setShowEditSupplierModal] = useState(null); // stores supplier obj
  const [showSupplierDetailModal, setShowSupplierDetailModal] = useState(null); // for detail view

  // Add/Edit Supplier Form State
  const [suppNom, setSuppNom] = useState("");
  const [suppTel, setSuppTel] = useState("");
  const [suppEmail, setSuppEmail] = useState("");
  const [suppAdresse, setSuppAdresse] = useState("");
  const [suppProduits, setSuppProduits] = useState(""); // comma-separated string
  const [suppNotes, setSuppNotes] = useState("");

  // ─── Players (Joueurs) State declarations ──────────────────────────────
  const [playerSearch, setPlayerSearch] = useState("");
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showEditPlayerModal, setShowEditPlayerModal] = useState(null); // stores player obj
  const [showViewPlayerModal, setShowViewPlayerModal] = useState(null); // stores player obj

  // New CRUD Action States
  const [showViewProductModal, setShowViewProductModal] = useState(null); // product obj
  const [showViewExpenseModal, setShowViewExpenseModal] = useState(null); // expense obj
  const [showViewPurchaseModal, setShowViewPurchaseModal] = useState(null); // purchase obj
  const [showViewShiftModal, setShowViewShiftModal] = useState(null); // shift/session obj
  const [showEditExpenseModal, setShowEditExpenseModal] = useState(null); // expense obj to edit
  const [editExpenseAmount, setEditExpenseAmount] = useState("");
  const [editExpenseCategory, setEditExpenseCategory] = useState("électricité");
  const [editExpenseDescription, setEditExpenseDescription] = useState("");
  const [editExpenseResponsible, setEditExpenseResponsible] = useState("");
  const [editExpenseDate, setEditExpenseDate] = useState("");


  // Add/Edit Player Form Fields
  const [playNom, setPlayNom] = useState("");
  const [playTel, setPlayTel] = useState("");
  const [playEmail, setPlayEmail] = useState("");

  // Prefill price when selecting snack products
  useEffect(() => {
    if (purchaseProduct !== "Autre") {
      const matched = products.find(p => p.name === purchaseProduct);
      if (matched) {
        setPurchaseUnitPrice(matched.purchasePrice);
      }
    } else {
      setPurchaseUnitPrice("");
    }
  }, [purchaseProduct, products]);
  const [expenseCategories, setExpenseCategories] = useState(defaultExpenseCategories);
  const [expenseSearchQuery, setExpenseSearchQuery] = useState("");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("all");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showManageCategoriesModal, setShowManageCategoriesModal] = useState(false);

  // Add Expense Form State
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("électricité");
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseResponsible, setExpenseResponsible] = useState("");
  const [expenseDate, setExpenseDate] = useState("");

  // Stock operations helpers
  const handleStockAdjustment = (productId, type, quantity, reason) => {
    if (quantity <= 0) return;
    
    // Update product stock
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        let newStock = p.stock;
        if (type === "entrée") {
          newStock += quantity;
        } else {
          newStock = Math.max(0, p.stock - quantity);
        }
        return { ...p, stock: newStock };
      }
      return p;
    }));

    // Find product name
    const targetProd = products.find(p => p.id === productId);
    const productName = targetProd ? targetProd.name : "Produit inconnu";

    // Add movement log
    setStockMovements(prev => [
      {
        id: Date.now(),
        date: new Date().toISOString(),
        productId,
        productName,
        type,
        quantity,
        reason: reason.trim() || "Ajustement manuel",
        user: role === "admin" ? "Administrateur" : "Gérant"
      },
      ...prev
    ]);

    addLog("stock_adjust", `Stock ajusté pour ${productName} (${type.toUpperCase()} : ${quantity} unités. Motif : ${reason})`, "snack");
  };

  const handleUpdateProductSettings = (productId, name, category, purchasePrice, price, minThreshold, image) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          name,
          category,
          purchasePrice: Number(purchasePrice),
          price: Number(price),
          minThreshold: Number(minThreshold),
          image
        };
      }
      return p;
    }));

    addLog("stock_update", `Paramètres du produit ${name} mis à jour par l'Administrateur`, "snack");
  };

  const handleAddProduct = (newProduct) => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 101;
    const productToAdd = {
      id: nextId,
      name: newProduct.name,
      category: newProduct.category,
      image: newProduct.image || "📦",
      price: Number(newProduct.price),
      purchasePrice: Number(newProduct.purchasePrice),
      stock: Number(newProduct.initialStock),
      minThreshold: Number(newProduct.minThreshold)
    };

    setProducts(prev => [...prev, productToAdd]);

    // Create entry stock movement if initial stock > 0
    if (Number(newProduct.initialStock) > 0) {
      setStockMovements(prev => [
        {
          id: Date.now(),
          date: new Date().toISOString(),
          productId: nextId,
          productName: newProduct.name,
          type: "entrée",
          quantity: Number(newProduct.initialStock),
          reason: "Stock initial à la création du produit",
          user: role === "admin" ? "Administrateur" : "Gérant"
        },
        ...prev
      ]);
    }

    addLog("stock_add", `Nouveau produit ajouté au stock : ${newProduct.name} (Stock : ${newProduct.initialStock} unités)`, "snack");
  };

  const handleImageUpload = (file, callback) => {
    if (!file) return;
    if (file.size > 500 * 1024) {
      alert("L'image est trop volumineuse. Veuillez choisir une image de moins de 500 Ko.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      callback(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAddConsole = () => {
    if (!addConsoleName.trim()) return;
    const nextId = consoles.length > 0 ? Math.max(...consoles.map(c => c.id)) + 1 : 1;
    const newConsole = {
      id: nextId,
      name: addConsoleName.trim().toUpperCase(),
      zone: addConsoleZone,
      type: addConsoleType,
      status: "libre",
      ratePerHour: Number(addConsoleRate),
      image: addConsoleImage || "",
      totalSessions: 0,
      totalRevenue: 0,
      totalTimeSeconds: 0,
      activeSession: null
    };

    setConsoles(prev => [...prev, newConsole]);
    addLog("settings_update", `Nouvelle console ajoutée : ${newConsole.name} (${newConsole.type}, Zone ${newConsole.zone}, Tarif: ${newConsole.ratePerHour} FCFA/h)`, "console");
    
    setAddConsoleName("");
    setAddConsoleZone(zones[0] || "A");
    setAddConsoleType("PS5");
    setAddConsoleRate(1500);
    setAddConsoleImage("");
    setShowAddConsoleModal(false);

    setToastText(`Console ${newConsole.name} ajoutée avec succès !`);
    gsap.fromTo(
      ".notification-toast",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
        setTimeout(() => {
          gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
        }, 3500);
      }}
    );
  };

  const handleUpdateConsole = (consoleId) => {
    if (!editConsoleName.trim()) return;
    setConsoles(prev => prev.map(c => {
      if (c.id === consoleId) {
        return {
          ...c,
          name: editConsoleName.trim().toUpperCase(),
          zone: editConsoleZone,
          type: editConsoleType,
          ratePerHour: Number(editConsoleRate),
          image: editConsoleImage
        };
      }
      return c;
    }));
    addLog("settings_update", `Console modifiée : ${editConsoleName.toUpperCase()} (${editConsoleType}, Zone ${editConsoleZone}, Tarif: ${editConsoleRate} FCFA/h)`, "console");
    setShowEditConsoleModal(null);
    
    setToastText(`Console ${editConsoleName.toUpperCase()} modifiée avec succès !`);
    gsap.fromTo(
      ".notification-toast",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
        setTimeout(() => {
          gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
        }, 3500);
      }}
    );
  };

  const openAdjustStockModal = (product) => {
    setShowAdjustStockModal(product);
    setAdjustType("entrée");
    setAdjustQty(1);
    setAdjustReason("");
  };

  const openEditProductModal = (product) => {
    setShowEditProductModal(product);
    setEditProdName(product.name);
    setEditProdCategory(product.category);
    setEditProdPurchasePrice(product.purchasePrice || 0);
    setEditProdPrice(product.price);
    setEditProdMinThreshold(product.minThreshold || 5);
    setEditProdImage(product.image || "🥤");
  };

  const openAddProductModal = () => {
    setShowAddProductModal(true);
    setAddProdName("");
    setAddProdCategory("boissons");
    setAddProdImage("🥤");
    setAddProdPurchasePrice(0);
    setAddProdPrice(0);
    setAddProdInitialStock(0);
    setAddProdMinThreshold(5);
  };

  // Expense operations helpers
  const handleAddExpense = (amount, category, description, responsible, dateStr) => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) return;
    const newExpense = {
      id: Date.now(),
      date: dateStr ? new Date(dateStr).toISOString() : new Date().toISOString(),
      category,
      amount: amt,
      description: description.trim(),
      responsible: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
    };

    setExpenses(prev => [newExpense, ...prev]);

    // deduct from stats.cashBalance
    setStats(prev => ({
      ...prev,
      cashBalance: prev.cashBalance - amt
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => {
        const isMaintenance = category.toLowerCase().includes("maintenance") || category.toLowerCase().includes("technique");
        return {
          ...prev,
          expensesMaintenance: isMaintenance ? (prev.expensesMaintenance || 0) + amt : (prev.expensesMaintenance || 0),
          expensesDiverses: !isMaintenance ? (prev.expensesDiverses || 0) + amt : (prev.expensesDiverses || 0)
        };
      });
    }

    addLog(
      "expense_add", 
      `Dépense enregistrée : ${amt.toLocaleString('fr-FR')} FCFA (${category}) - ${description.slice(0, 30)}`,
      "console"
    );

    // High expense threshold alert check
    if (systemSettings.alertHighExpense && amt >= (systemSettings.highExpenseThreshold || 50000)) {
      addLog(
        "expense_alert", 
        `⚠️ DÉPENSE IMPORTANTE : Le montant de ${amt.toLocaleString('fr-FR')} FCFA dépasse le seuil d'alerte de ${(systemSettings.highExpenseThreshold || 50000).toLocaleString('fr-FR')} FCFA! (Catégorie: ${category}, Responsable: ${newExpense.responsible})`,
        "console"
      );

      // Trigger a beautiful GSAP warning toast
      setToastText(`⚠️ Dépense importante enregistrée : ${amt.toLocaleString('fr-FR')} FCFA !`);
      gsap.fromTo(
        ".notification-toast",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
          setTimeout(() => {
            gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
          }, 3500);
        }}
      );
    }
  };

  const handleDeleteExpense = (id) => {
    if (role !== "admin") return;
    
    const target = expenses.find(e => e.id === id);
    if (!target) return;

    setExpenses(prev => prev.filter(e => e.id !== id));

    // refund to stats.cashBalance
    setStats(prev => ({
      ...prev,
      cashBalance: prev.cashBalance + target.amount
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => {
        const isMaintenance = target.category.toLowerCase().includes("maintenance") || target.category.toLowerCase().includes("technique");
        return {
          ...prev,
          expensesMaintenance: isMaintenance ? Math.max(0, (prev.expensesMaintenance || 0) - target.amount) : (prev.expensesMaintenance || 0),
          expensesDiverses: !isMaintenance ? Math.max(0, (prev.expensesDiverses || 0) - target.amount) : (prev.expensesDiverses || 0)
        };
      });
    }

    addLog(
      "expense_delete", 
      `Dépense supprimée : ${target.amount.toLocaleString('fr-FR')} FCFA (${target.category}) - ${target.description.slice(0, 30)} (Remboursé à la caisse)`,
      "console"
    );
  };

  const handleDeleteProduct = (productId) => {
    if (role !== "admin") return;
    const target = products.find(p => p.id === productId);
    if (!target) return;

    if (confirm(`Voulez-vous vraiment supprimer le produit "${target.name}" ?`)) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      addLog(
        "product_delete",
        `Produit supprimé : ${target.name} (Catégorie : ${target.category})`,
        "console"
      );
    }
  };

  const handleEditExpense = (id, amount, category, description, responsible, dateStr) => {
    if (role !== "admin") return;
    const target = expenses.find(e => e.id === id);
    if (!target) return;

    const newAmt = parseFloat(amount) || 0;
    if (newAmt <= 0) return;

    const diff = newAmt - target.amount;

    setExpenses(prev => prev.map(e => e.id === id ? {
      ...e,
      date: dateStr ? new Date(dateStr).toISOString() : e.date,
      category,
      amount: newAmt,
      description: description.trim(),
      responsible: responsible.trim() || e.responsible
    } : e));

    setStats(prev => ({
      ...prev,
      cashBalance: prev.cashBalance - diff
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => {
        const isMaintenance = category.toLowerCase().includes("maintenance") || category.toLowerCase().includes("technique");
        const wasMaintenance = target.category.toLowerCase().includes("maintenance") || target.category.toLowerCase().includes("technique");
        
        let nextMaintenance = prev.expensesMaintenance || 0;
        let nextDiverses = prev.expensesDiverses || 0;
        
        if (wasMaintenance) {
          nextMaintenance = Math.max(0, nextMaintenance - target.amount);
        } else {
          nextDiverses = Math.max(0, nextDiverses - target.amount);
        }
        
        if (isMaintenance) {
          nextMaintenance += newAmt;
        } else {
          nextDiverses += newAmt;
        }
        
        return {
          ...prev,
          expensesMaintenance: nextMaintenance,
          expensesDiverses: nextDiverses
        };
      });
    }

    addLog(
      "expense_edit", 
      `Dépense modifiée : ${target.amount.toLocaleString('fr-FR')} -> ${newAmt.toLocaleString('fr-FR')} FCFA (${category})`,
      "console"
    );

    if (systemSettings.alertHighExpense && newAmt >= (systemSettings.highExpenseThreshold || 50000)) {
      addLog(
        "expense_alert", 
        `⚠️ DÉPENSE IMPORTANTE MODIFIÉE : Le montant de ${newAmt.toLocaleString('fr-FR')} FCFA dépasse le seuil d'alerte de ${(systemSettings.highExpenseThreshold || 50000).toLocaleString('fr-FR')} FCFA!`,
        "console"
      );
    }
  };

  const handleDeleteCaisseSession = (sessionId) => {
    if (role !== "admin") return;
    const target = caisseSessions.find(s => s.id === sessionId);
    if (!target) return;

    if (confirm(`Voulez-vous vraiment supprimer le shift clôturé du ${new Date(target.dateOpen).toLocaleDateString('fr-FR')} (${target.openedBy}) de l'historique ?`)) {
      setCaisseSessions(prev => prev.filter(s => s.id !== sessionId));
      addLog(
        "caisse_shift_delete",
        `Shift clôturé supprimé : ID ${target.id} (Opérateur: ${target.openedBy})`,
        "console"
      );
    }
  };

  const handleCancelSale = (saleId, reason, customReason, returnToStock) => {
    const targetReason = reason === "Autre" ? customReason.trim() : reason;
    if (!targetReason) {
      alert("Veuillez spécifier un motif d'annulation.");
      return;
    }

    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    if (sale.status === "annulée") {
      alert("Cette vente est déjà annulée.");
      return;
    }

    setSales(prev => prev.map(s => {
      if (s.id === saleId) {
        return {
          ...s,
          status: "annulée",
          cancelReason: targetReason,
          cancelledAt: new Date().toISOString()
        };
      }
      return s;
    }));

    // Refund amounts
    setStats(prev => {
      const newGamesRev = Math.max(0, prev.gamesRevenue - (sale.gameCost || 0));
      const newSnacksRev = Math.max(0, prev.snackRevenue - (sale.snackCost || (sale.total - (sale.gameCost || 0))));
      const newCash = prev.cashBalance - (sale.paid || sale.total);
      return {
        ...prev,
        gamesRevenue: newGamesRev,
        snackRevenue: newSnacksRev,
        cashBalance: newCash
      };
    });

    // Stock return
    if (returnToStock && sale.itemsList && sale.itemsList.length > 0) {
      setProducts(prev => {
        return prev.map(p => {
          const soldItem = sale.itemsList.find(item => item.product && item.product.id === p.id);
          if (soldItem) {
            return {
              ...p,
              stock: p.stock + soldItem.quantity
            };
          }
          return p;
        });
      });

      // Stock movement log
      setStockMovements(prev => [
        {
          id: Date.now(),
          productId: "ALL",
          productName: "Annulation Vente " + sale.id,
          type: "entrée",
          quantity: sale.itemsList.reduce((sum, item) => sum + (item.quantity || 0), 0),
          reason: `Annulation vente: ${targetReason}`,
          responsible: role === "admin" ? "Administrateur" : "Gérant",
          date: new Date().toISOString()
        },
        ...prev
      ]);
    }

    // Active Caisse Session Adjustments
    if (caisseStatus === "ouverte" && activeCaisseSession) {
      const saleDate = new Date(sale.date || Date.now());
      const sessionOpenDate = new Date(activeCaisseSession.dateOpen);
      if (saleDate >= sessionOpenDate) {
        // Adjust payment types
        let cashDeduct = 0;
        let mmDeduct = 0;
        let cardDeduct = 0;
        const totalPaid = sale.paid || sale.total || 0;

        const method = (sale.paymentMethod || "espèces").toLowerCase();
        if (method === "espèces" || method === "especes") {
          cashDeduct = totalPaid;
        } else if (method === "mobile money" || method === "momo") {
          mmDeduct = totalPaid;
        } else if (method === "mixte") {
          cashDeduct = sale.cashUsed || (totalPaid / 2);
          mmDeduct = sale.mobileUsed || (totalPaid / 2);
        } else {
          cardDeduct = totalPaid;
        }

        setActiveCaisseSession(prev => ({
          ...prev,
          gamesRevenue: Math.max(0, prev.gamesRevenue - (sale.gameCost || 0)),
          snackRevenue: Math.max(0, prev.snackRevenue - (sale.snackCost || (sale.total - (sale.gameCost || 0)))),
          paymentEspèces: Math.max(0, (prev.paymentEspèces || 0) - cashDeduct),
          paymentMobileMoney: Math.max(0, (prev.paymentMobileMoney || 0) - mmDeduct),
          paymentCarte: Math.max(0, (prev.paymentCarte || 0) - cardDeduct),
          refunds: (prev.refunds || 0) + totalPaid,
          transactionsCount: Math.max(0, (prev.transactionsCount || 0) - 1)
        }));
      }
    }

    addLog(
      "sale_cancel",
      `Vente ${saleId} annulée pour motif : ${targetReason}`,
      "console"
    );

    // Toast alert
    setToastText(`⚠️ Vente ${saleId} annulée avec succès.`);
    gsap.fromTo(
      ".notification-toast",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
        setTimeout(() => {
          gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
        }, 3000);
      }}
    );

    setShowCancelSaleModal(null);
  };

  // Purchase operations helpers
  const handleAddPurchase = (supplier, product, quantity, unitPrice, totalAmount, paymentMethod, responsible, dateStr) => {
    const qty = parseInt(quantity) || 0;
    const up = parseFloat(unitPrice) || 0;
    const total = parseFloat(totalAmount) || (qty * up);
    if (qty <= 0 || up <= 0 || total <= 0) return;

    const date = dateStr ? new Date(dateStr).toISOString() : new Date().toISOString();
    const cleanProduct = product === "Autre" ? purchaseCustomProductName.trim() : product.trim();
    if (!cleanProduct) return;

    const newPurchase = {
      id: Date.now(),
      date,
      supplier: supplier.trim(),
      product: cleanProduct,
      quantity: qty,
      unitPrice: up,
      totalAmount: total,
      paymentMethod,
      responsible: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
    };

    setPurchases(prev => [newPurchase, ...prev]);

    // deduct from stats.cashBalance
    setStats(prev => ({
      ...prev,
      cashBalance: prev.cashBalance - total
    }));

    if (caisseStatus === "ouverte") {
      const isCash = paymentMethod.toLowerCase() === "espèces" || paymentMethod.toLowerCase() === "especes";
      setActiveCaisseSession(prev => ({
        ...prev,
        purchases: prev.purchases + total,
        purchasesCash: isCash ? (prev.purchasesCash || 0) + total : (prev.purchasesCash || 0)
      }));
    }

    // If it's an existing snack product, increment its stock and record stock movement
    const snackProd = products.find(p => p.name === cleanProduct);
    if (snackProd) {
      setProducts(prev => prev.map(p => {
        if (p.id === snackProd.id) {
          return {
            ...p,
            stock: p.stock + qty
          };
        }
        return p;
      }));

      // record stock movement
      setStockMovements(prev => [
        {
          id: Date.now(),
          date,
          productId: snackProd.id,
          productName: snackProd.name,
          type: "entrée",
          quantity: qty,
          reason: `Achat fournisseur (${supplier.trim()})`,
          user: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
        },
        ...prev
      ]);
    }

    addLog(
      "purchase_add", 
      `Achat enregistré : ${total.toLocaleString('fr-FR')} FCFA (${qty}x ${cleanProduct}) chez ${supplier}`,
      "console"
    );
  };

  const handleEditPurchase = (id, supplier, product, quantity, unitPrice, totalAmount, paymentMethod, responsible, dateStr) => {
    if (role !== "admin") return;

    const oldPurchase = purchases.find(p => p.id === id);
    if (!oldPurchase) return;

    const qty = parseInt(quantity) || 0;
    const up = parseFloat(unitPrice) || 0;
    const total = parseFloat(totalAmount) || (qty * up);
    if (qty <= 0 || up <= 0 || total <= 0) return;

    const date = dateStr ? new Date(dateStr).toISOString() : oldPurchase.date;
    const cleanProduct = product === "Autre" ? purchaseCustomProductName.trim() : product.trim();
    if (!cleanProduct) return;

    // 1. Adjust cashBalance: add back old amount, subtract new amount
    setStats(prev => ({
      ...prev,
      cashBalance: prev.cashBalance + oldPurchase.totalAmount - total
    }));

    if (caisseStatus === "ouverte") {
      const isCash = paymentMethod.toLowerCase() === "espèces" || paymentMethod.toLowerCase() === "especes";
      const wasCash = oldPurchase.paymentMethod.toLowerCase() === "espèces" || oldPurchase.paymentMethod.toLowerCase() === "especes";
      
      setActiveCaisseSession(prev => {
        let nextPurchasesCash = prev.purchasesCash || 0;
        if (wasCash) {
          nextPurchasesCash = Math.max(0, nextPurchasesCash - oldPurchase.totalAmount);
        }
        if (isCash) {
          nextPurchasesCash += total;
        }
        return {
          ...prev,
          purchases: Math.max(0, prev.purchases - oldPurchase.totalAmount + total),
          purchasesCash: nextPurchasesCash
        };
      });
    }

    // 2. Adjust stock if products or quantities changed
    const oldSnackProd = products.find(p => p.name === oldPurchase.product);
    const newSnackProd = products.find(p => p.name === cleanProduct);

    if (oldPurchase.product === cleanProduct) {
      // Product didn't change, adjust quantity if it changed
      if (oldSnackProd && oldPurchase.quantity !== qty) {
        const delta = qty - oldPurchase.quantity;
        setProducts(prev => prev.map(p => {
          if (p.id === oldSnackProd.id) {
            return {
              ...p,
              stock: p.stock + delta
            };
          }
          return p;
        }));

        // add a corrective stock movement
        setStockMovements(prev => [
          {
            id: Date.now(),
            date,
            productId: oldSnackProd.id,
            productName: oldSnackProd.name,
            type: delta >= 0 ? "entrée" : "sortie",
            quantity: Math.abs(delta),
            reason: `Correction d'achat #${id} (${supplier.trim()})`,
            user: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
          },
          ...prev
        ]);
      }
    } else {
      // Product changed!
      // Decrement stock of old product
      if (oldSnackProd) {
        setProducts(prev => prev.map(p => {
          if (p.id === oldSnackProd.id) {
            return {
              ...p,
              stock: Math.max(0, p.stock - oldPurchase.quantity)
            };
          }
          return p;
        }));

        setStockMovements(prev => [
          {
            id: Date.now(),
            date,
            productId: oldSnackProd.id,
            productName: oldSnackProd.name,
            type: "sortie",
            quantity: oldPurchase.quantity,
            reason: `Annulation achat suite à modif (vers ${cleanProduct})`,
            user: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
          },
          ...prev
        ]);
      }

      // Increment stock of new product
      if (newSnackProd) {
        setProducts(prev => prev.map(p => {
          if (p.id === newSnackProd.id) {
            return {
              ...p,
              stock: p.stock + qty
            };
          }
          return p;
        }));

        setStockMovements(prev => [
          {
            id: Date.now(),
            date,
            productId: newSnackProd.id,
            productName: newSnackProd.name,
            type: "entrée",
            quantity: qty,
            reason: `Achat fournisseur suite à modif (depuis ${oldPurchase.product})`,
            user: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
          },
          ...prev
        ]);
      }
    }

    // 3. Update purchases list
    setPurchases(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          date,
          supplier: supplier.trim(),
          product: cleanProduct,
          quantity: qty,
          unitPrice: up,
          totalAmount: total,
          paymentMethod,
          responsible: responsible.trim() || (role === "admin" ? "Administrateur" : "Gérant")
        };
      }
      return p;
    }));

    addLog(
      "purchase_edit", 
      `Achat modifié #${id} : ${total.toLocaleString('fr-FR')} FCFA (${qty}x ${cleanProduct})`,
      "console"
    );
  };

  const handleDeletePurchase = (id) => {
    if (role !== "admin") return;

    const target = purchases.find(p => p.id === id);
    if (!target) return;

    setPurchases(prev => prev.filter(p => p.id !== id));

    // refund cashBalance
    setStats(prev => ({
      ...prev,
      cashBalance: prev.cashBalance + target.totalAmount
    }));

    if (caisseStatus === "ouverte") {
      const wasCash = target.paymentMethod.toLowerCase() === "espèces" || target.paymentMethod.toLowerCase() === "especes";
      setActiveCaisseSession(prev => ({
        ...prev,
        purchases: Math.max(0, prev.purchases - target.totalAmount),
        purchasesCash: wasCash ? Math.max(0, (prev.purchasesCash || 0) - target.totalAmount) : (prev.purchasesCash || 0)
      }));
    }

    // If it was a snack product, decrement its stock and record corrective stock movement
    const snackProd = products.find(p => p.name === target.product);
    if (snackProd) {
      setProducts(prev => prev.map(p => {
        if (p.id === snackProd.id) {
          return {
            ...p,
            stock: Math.max(0, p.stock - target.quantity)
          };
        }
        return p;
      }));

      setStockMovements(prev => [
        {
          id: Date.now(),
          date: new Date().toISOString(),
          productId: snackProd.id,
          productName: snackProd.name,
          type: "sortie",
          quantity: target.quantity,
          reason: `Suppression achat #${id} (Restauration stock)`,
          user: role === "admin" ? "Administrateur" : "Gérant"
        },
        ...prev
      ]);
    }

    addLog(
      "purchase_delete", 
      `Achat supprimé : ${target.totalAmount.toLocaleString('fr-FR')} FCFA (${target.quantity}x ${target.product}) chez ${target.supplier} (Remboursé à la caisse)`,
      "console"
    );
  };

  // Caisse (Cash register) operation helpers
  const handleOpenCaisse = (balance, operator) => {
    const openingBal = parseFloat(balance) || 0;
    const openedBy = operator.trim() || (role === "admin" ? "Administrateur" : "Gérant");
    
    const newSession = {
      id: `shift-${Date.now()}`,
      dateOpen: new Date().toISOString(),
      openedBy,
      openingBalance: openingBal,
      gamesRevenue: 0,
      snackRevenue: 0,
      expensesMaintenance: 0,
      expensesDiverses: 0,
      purchases: 0,
      purchasesCash: 0,
      refunds: 0,
      paymentEspèces: 0,
      paymentMobileMoney: 0,
      paymentCarte: 0,
      transactionsCount: 0,
      movements: []
    };

    setActiveCaisseSession(newSession);
    setCaisseStatus("ouverte");

    // Sync stats.cashBalance with opening balance
    setStats(prev => ({
      ...prev,
      cashBalance: openingBal
    }));

    addLog(
      "caisse_open",
      `Caisse ouverte par ${openedBy} avec un fond de ${openingBal.toLocaleString('fr-FR')} FCFA.`,
      "console"
    );

    // Reset open form states
    setOpenCaisseBalance("");
    setOpenCaisseOperator("");
    setShowOpenCaisseModal(false);
  };

  const handleAddCaisseMovement = (type, amount, reason, operatorName) => {
    const amt = parseFloat(amount) || 0;
    if (amt <= 0) return;
    const op = operatorName.trim() || activeCaisseSession.openedBy;
    const newMovement = {
      id: Date.now(),
      type, // "entrée" or "sortie"
      amount: amt,
      reason: reason.trim(),
      operator: op,
      date: new Date().toISOString()
    };

    setActiveCaisseSession(prev => ({
      ...prev,
      movements: [...(prev.movements || []), newMovement]
    }));

    // If it's a cash movement, it also updates stats.cashBalance!
    setStats(prev => ({
      ...prev,
      cashBalance: type === "entrée" ? prev.cashBalance + amt : prev.cashBalance - amt
    }));

    addLog(
      type === "entrée" ? "caisse_in" : "caisse_out",
      `Mouvement de caisse (${type === "entrée" ? "Entrée" : "Sortie"}) de ${amt.toLocaleString('fr-FR')} FCFA par ${op}. Motif : ${reason}`,
      "console"
    );

    // Reset form states
    setMovementAmount("");
    setMovementReason("");
    setMovementOperator("");
    setShowAddMovementModal(false);
  };

  const handleCloseCaisse = (realBalance, notes, operator) => {
    if (!activeCaisseSession) return;

    const realBal = parseFloat(realBalance) || 0;
    const closedBy = operator.trim() || (role === "admin" ? "Administrateur" : "Gérant");
    
    const manualInflows = (activeCaisseSession.movements || [])
      .filter(m => m.type === "entrée")
      .reduce((sum, m) => sum + m.amount, 0);
    const manualOutflows = (activeCaisseSession.movements || [])
      .filter(m => m.type === "sortie")
      .reduce((sum, m) => sum + m.amount, 0);

    const expectedBal = activeCaisseSession.openingBalance 
      + (activeCaisseSession.paymentEspèces || 0)
      + manualInflows
      - manualOutflows
      - (activeCaisseSession.expensesMaintenance || 0)
      - (activeCaisseSession.expensesDiverses || 0)
      - (activeCaisseSession.purchasesCash || 0)
      - (activeCaisseSession.refunds || 0);
    
    const variance = realBal - expectedBal;

    const closedSession = {
      ...activeCaisseSession,
      dateClose: new Date().toISOString(),
      closedBy,
      expectedBalance: expectedBal,
      realBalance: realBal,
      variance,
      notes: notes.trim() || "Clôture de shift sans remarques.",
      status: "fermée"
    };

    setCaisseSessions(prev => [closedSession, ...prev]);
    setActiveCaisseSession(null);
    setCaisseStatus("fermée");

    // Sync stats.cashBalance to the counted real balance
    setStats(prev => ({
      ...prev,
      cashBalance: realBal
    }));

    addLog(
      "caisse_close",
      `Caisse fermée par ${closedBy}. Réel: ${realBal.toLocaleString('fr-FR')} FCFA, Attendu: ${expectedBal.toLocaleString('fr-FR')} FCFA, Écart: ${variance.toLocaleString('fr-FR')} FCFA.`,
      "console"
    );

    // Reset close form states
    setCloseCaisseRealBalance("");
    setCloseCaisseNotes("");
    setCloseCaisseOperator("");
    setShowCloseCaisseModal(false);
  };

  const handlePrintShiftReport = (session) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Le bloqueur de fenêtres pop-up empêche l'exportation. Veuillez autoriser les pop-ups.");
      return;
    }

    const dateStr = new Date(session.dateOpen).toLocaleDateString(systemSettings.currencyLocale || 'fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const timeOpen = new Date(session.dateOpen).toLocaleTimeString(systemSettings.currencyLocale || 'fr-FR');
    const timeClose = session.dateClose ? new Date(session.dateClose).toLocaleTimeString(systemSettings.currencyLocale || 'fr-FR') : "En cours";

    const totalRevenue = session.gamesRevenue + session.snackRevenue;
    
    const movements = session.movements || [];
    const manualInflows = movements.filter(m => m.type === "entrée").reduce((sum, m) => sum + m.amount, 0);
    const manualOutflows = movements.filter(m => m.type === "sortie").reduce((sum, m) => sum + m.amount, 0);

    const expMaintenance = session.expensesMaintenance || 0;
    const expDiverses = session.expensesDiverses || 0;
    const purcCash = session.purchasesCash || 0;
    const refunds = session.refunds || 0;
    
    const expectedCash = session.openingBalance 
      + (session.paymentEspèces || 0) 
      + manualInflows 
      - manualOutflows 
      - expMaintenance 
      - expDiverses 
      - purcCash 
      - refunds;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Rapport Z - Clôture de Caisse</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            color: #18181b;
          }
          .header {
            text-align: center;
            border-bottom: 2px dashed #e4e4e7;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .title {
            font-size: 24px;
            font-weight: 800;
            text-transform: uppercase;
            margin: 0;
            letter-spacing: 1px;
          }
          .subtitle {
            font-size: 14px;
            color: #71717a;
            margin-top: 5px;
          }
          .details-table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          .details-table th, .details-table td {
            padding: 10px;
            border-bottom: 1px solid #e4e4e7;
            text-align: left;
          }
          .details-table th {
            color: #71717a;
            font-size: 11px;
            text-transform: uppercase;
          }
          .amount-row {
            font-weight: bold;
          }
          .total-box {
            background-color: #f4f4f5;
            padding: 15px;
            border-radius: 8px;
            margin-top: 20px;
          }
          .variance-alert {
            font-weight: 800;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 11px;
            color: #a1a1aa;
            border-top: 1px dashed #e4e4e7;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          ${systemSettings.logoUrl ? `<img src="${systemSettings.logoUrl}" style="max-height: 70px; margin-bottom: 10px; border-radius: 8px;" />` : ''}
          <h1 class="title">${systemSettings.companyName || "GameZone"}</h1>
          <p class="subtitle">${systemSettings.companySubtitle || "PS Lounge"}</p>
          <p style="font-size: 12px; color: #18181b; font-weight: 600;">RAPPORT Z - CLÔTURE DE SHIFT</p>
          <p style="font-size: 10px; color: #71717a;">Session ID: ${session.id}</p>
        </div>

        <table class="details-table">
          <tr>
            <th>Paramètre</th>
            <th>Valeur</th>
          </tr>
          <tr>
            <td>Date d'ouverture</td>
            <td>${dateStr} à ${timeOpen}</td>
          </tr>
          <tr>
            <td>Date de fermeture</td>
            <td>${session.dateClose ? new Date(session.dateClose).toLocaleDateString(systemSettings.currencyLocale || 'fr-FR') + ' à ' + timeClose : 'En cours'}</td>
          </tr>
          <tr>
            <td>Ouvert par</td>
            <td>${session.openedBy}</td>
          </tr>
          <tr>
            <td>Fermé par</td>
            <td>${session.closedBy || 'N/A'}</td>
          </tr>
        </table>

        <h3 style="margin-top: 30px; border-bottom: 1px solid #e4e4e7; padding-bottom: 5px; font-size: 14px; text-transform: uppercase;">Répartition des Paiements Session</h3>
        <table class="details-table">
          <tr>
            <td>Ventes Espèces</td>
            <td style="text-align: right; font-weight: 600; color: #16a34a;">+${formatPrice(session.paymentEspèces || 0)}</td>
          </tr>
          <tr>
            <td>Ventes Mobile Money</td>
            <td style="text-align: right; font-weight: 600; color: #2563eb;">+${formatPrice(session.paymentMobileMoney || 0)}</td>
          </tr>
          <tr>
            <td>Ventes Carte</td>
            <td style="text-align: right; font-weight: 600; color: #0d9488;">+${formatPrice(session.paymentCarte || 0)}</td>
          </tr>
          <tr style="font-weight: bold; border-top: 1px solid #18181b;">
            <td>Total Chiffre d'Affaires Session</td>
            <td style="text-align: right; font-weight: 800;">${formatPrice(totalRevenue)}</td>
          </tr>
        </table>

        <h3 style="margin-top: 30px; border-bottom: 1px solid #e4e4e7; padding-bottom: 5px; font-size: 14px; text-transform: uppercase;">Flux de Caisse Physique (Tiroir)</h3>
        
        <table class="details-table">
          <tr>
            <td>Fond de caisse d'ouverture</td>
            <td style="text-align: right; font-weight: 600;">${formatPrice(session.openingBalance)}</td>
          </tr>
          <tr>
            <td>(+) Ventes en espèces</td>
            <td style="text-align: right; color: #16a34a;">+${formatPrice(session.paymentEspèces || 0)}</td>
          </tr>
          <tr>
            <td>(+) Entrées caisse (apports manuels)</td>
            <td style="text-align: right; color: #16a34a;">+${formatPrice(manualInflows)}</td>
          </tr>
          <tr>
            <td>(-) Dépenses Maintenance (espèces)</td>
            <td style="text-align: right; color: #dc2626;">-${formatPrice(expMaintenance)}</td>
          </tr>
          <tr>
            <td>(-) Dépenses Diverses (espèces)</td>
            <td style="text-align: right; color: #dc2626;">-${formatPrice(expDiverses)}</td>
          </tr>
          <tr>
            <td>(-) Achats en espèces</td>
            <td style="text-align: right; color: #dc2626;">-${formatPrice(purcCash)}</td>
          </tr>
          <tr>
            <td>(-) Retraits caisse (sorties manuelles)</td>
            <td style="text-align: right; color: #dc2626;">-${formatPrice(manualOutflows)}</td>
          </tr>
          <tr>
            <td>(-) Remboursements caisse (espèces)</td>
            <td style="text-align: right; color: #dc2626;">-${formatPrice(refunds)}</td>
          </tr>
        </table>

        <div class="total-box">
          <table style="width: 100%; font-size: 14px;">
            <tr style="font-weight: 600;">
              <td>Solde Espèces Théorique Attendu :</td>
              <td style="text-align: right;">${formatPrice(expectedCash)}</td>
            </tr>
            <tr style="font-weight: 800; font-size: 16px; border-top: 1px solid #e4e4e7;">
              <td style="padding-top: 10px;">Solde Espèces Réel Compté :</td>
              <td style="text-align: right; padding-top: 10px;">${session.realBalance ? formatPrice(session.realBalance) : 'En cours'}</td>
            </tr>
            ${session.dateClose ? `
            <tr style="font-size: 14px; border-top: 1px dashed #e4e4e7;">
              <td style="padding-top: 10px;">Écart de Caisse Physique :</td>
              <td style="text-align: right; padding-top: 10px; color: ${session.variance < 0 ? '#dc2626' : (session.variance > 0 ? '#d97706' : '#16a34a')};" class="variance-alert">
                ${session.variance > 0 ? '+' : ''}${formatPrice(session.variance)}
                (${session.variance === 0 ? 'Conforme' : (session.variance < 0 ? 'Déficit' : 'Surplus')})
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${movements.length > 0 ? `
          <h3 style="margin-top: 35px; border-bottom: 1px solid #e4e4e7; padding-bottom: 5px; font-size: 14px; text-transform: uppercase;">Historique des Mouvements</h3>
          <table class="details-table" style="font-size: 11px;">
            <thead>
              <tr style="font-weight: bold; background-color: #f4f4f5;">
                <td style="padding: 5px 10px;">Heure</td>
                <td style="padding: 5px 10px;">Type</td>
                <td style="padding: 5px 10px;">Motif</td>
                <td style="padding: 5px 10px;">Opérateur</td>
                <td style="padding: 5px 10px; text-align: right;">Montant</td>
              </tr>
            </thead>
            <tbody>
              ${movements.map(m => `
                <tr>
                  <td style="padding: 5px 10px;">${new Date(m.date).toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'})}</td>
                  <td style="padding: 5px 10px; font-weight: bold; color: ${m.type === 'entrée' ? '#16a34a' : '#dc2626'};">${m.type.toUpperCase()}</td>
                  <td style="padding: 5px 10px;">${m.reason}</td>
                  <td style="padding: 5px 10px;">${m.operator}</td>
                  <td style="padding: 5px 10px; text-align: right; font-weight: bold;">${m.type === 'entrée' ? '+' : '-'}${formatPrice(m.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : ''}

        ${session.notes ? `
          <div style="margin-top: 20px; border: 1px solid #e4e4e7; padding: 12px; border-radius: 6px; font-size: 12px; background-color: #fafafa;">
            <strong>Notes & Remarques :</strong><br/>
            <p style="margin: 5px 0 0 0; color: #52525b;">${session.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Imprimé le ${new Date().toLocaleDateString(systemSettings.currencyLocale || 'fr-FR')} à ${new Date().toLocaleTimeString(systemSettings.currencyLocale || 'fr-FR')}</p>
          <p>${systemSettings.companyName || "GameZone"} - Système de Gestion &bull; ${systemSettings.companySlogan || ""}</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
  };

  const handlePrintReceipt = (receipt) => {
    const printWindow = window.open("", "_blank", "width=450,height=600");
    if (!printWindow) {
      alert("Le bloqueur de fenêtres pop-up empêche l'exportation. Veuillez autoriser les pop-ups.");
      return;
    }

    const receiptId = receipt.id;
    const dateFormatted = `${currentDateTime.toLocaleDateString(systemSettings.currencyLocale || 'fr-FR')} ${receipt.date}`;
    const customer = receipt.customer || "Client Comptant";
    const type = receipt.type || "FACTURE DIRECTE";
    const paymentMethod = receipt.paymentMethod || "";
    const total = receipt.total || 0;
    const prepaid = receipt.prepaid || 0;
    const gameCost = receipt.gameCost || 0;
    const snackCost = receipt.snackCost || 0;
    const itemsList = receipt.itemsList || [];

    let itemsHtml = "";
    if (gameCost > 0) {
      itemsHtml += `
        <tr class="item-row">
          <td>🕹️ ${receipt.item || "Temps de Jeu"}</td>
          <td style="text-align: right; font-family: monospace;">${formatPrice(gameCost)}</td>
        </tr>
      `;
    }
    if (itemsList && itemsList.length > 0) {
      itemsList.forEach(item => {
        if (item && item.product) {
          itemsHtml += `
            <tr class="item-row">
              <td>${item.quantity}x ${item.product.name}</td>
              <td style="text-align: right; font-family: monospace;">${formatPrice(item.product.price * item.quantity)}</td>
            </tr>
          `;
        }
      });
    } else if (snackCost > 0) {
      itemsHtml += `
        <tr class="item-row">
          <td>Consommations Snack Bar</td>
          <td style="text-align: right; font-family: monospace;">${formatPrice(snackCost)}</td>
        </tr>
      `;
    }

    const netToPay = prepaid > 0 ? Math.abs(total - prepaid) : total;
    const netLabel = prepaid > 0 ? (total - prepaid < 0 ? "REMBOURSEMENT" : "RESTE À PAYER") : "NET À PAYER";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Facture / Reçu ${receiptId}</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #ffffff;
            color: #18181b;
            font-size: 13px;
          }
          .receipt-container {
            max-width: 320px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 1px dashed #cccccc;
            padding-bottom: 15px;
            margin-bottom: 15px;
          }
          .title {
            font-size: 18px;
            font-weight: 800;
            text-transform: uppercase;
            margin: 0;
            letter-spacing: 0.5px;
          }
          .subtitle {
            font-size: 10px;
            color: #71717a;
            margin-top: 5px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          .meta-info {
            width: 100%;
            margin-bottom: 15px;
            font-size: 10px;
            color: #52525b;
          }
          .meta-info td {
            padding: 2px 0;
          }
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          .items-table th, .items-table td {
            padding: 6px 0;
            text-align: left;
          }
          .items-table th {
            font-size: 9px;
            color: #71717a;
            text-transform: uppercase;
            border-bottom: 1px solid #e4e4e7;
          }
          .item-row td {
            border-bottom: 1px dashed #f4f4f5;
          }
          .totals-section {
            width: 100%;
            margin-top: 10px;
            font-size: 11px;
          }
          .totals-section td {
            padding: 3px 0;
          }
          .net-pay {
            font-size: 14px;
            font-weight: 800;
            border-top: 1px solid #18181b;
            padding-top: 8px;
            margin-top: 8px;
          }
          .footer {
            margin-top: 25px;
            text-align: center;
            font-size: 10px;
            color: #71717a;
            border-top: 1px dashed #cccccc;
            padding-top: 15px;
          }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="receipt-container">
          <div class="header">
            ${systemSettings.logoUrl ? '<img src="' + systemSettings.logoUrl + '" style="max-height: 50px; margin-bottom: 5px; border-radius: 4px;" />' : ''}
            <h1 class="title">${systemSettings.companyName || "GAMEZONE HUB"}</h1>
            <p class="subtitle">${systemSettings.address || "12 Rue des Gamers, Yaoundé"}</p>
            <p class="subtitle" style="font-size: 9px; text-transform: none; color: #a1a1aa; margin-top: 2px;">
              Tél: ${systemSettings.phone || "+237 6 55 11 22 33"}
            </p>
          </div>

          <table class="meta-info">
            <tr>
              <td>Nº FACTURE :</td>
              <td style="text-align: right; font-weight: bold; color: #18181b;">${receiptId}</td>
            </tr>
            <tr>
              <td>DATE :</td>
              <td style="text-align: right;">${dateFormatted}</td>
            </tr>
            <tr>
              <td>CLIENT :</td>
              <td style="text-align: right; font-weight: bold; color: #18181b;">${customer}</td>
            </tr>
            <tr>
              <td>TYPE :</td>
              <td style="text-align: right; font-weight: bold; color: #18181b; text-transform: uppercase;">${type}</td>
            </tr>
            ${paymentMethod ? '<tr><td>RÈGLEMENT :</td><td style="text-align: right; font-weight: bold; color: #18181b; text-transform: uppercase;">' + paymentMethod + '</td></tr>' : ''}
          </table>

          <table class="items-table">
            <thead>
              <tr>
                <th>Désignation</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <table class="totals-section">
            ${prepaid > 0 ? '<tr><td>Prépayé au démarrage :</td><td style="text-align: right; font-family: monospace;">' + formatPrice(prepaid) + '</td></tr>' : ''}
            <tr>
              <td>Total Prestations :</td>
              <td style="text-align: right; font-family: monospace;">${formatPrice(total)}</td>
            </tr>
            <tr class="net-pay">
              <td style="font-weight: 800;">${netLabel} :</td>
              <td style="text-align: right; font-weight: 800; font-family: monospace; font-size: 15px;">${formatPrice(netToPay)}</td>
            </tr>
          </table>

          <div class="footer">
            <p style="font-style: italic; font-weight: bold; margin: 0 0 5px 0;">Merci de votre visite à bientôt !</p>
            <p style="font-size: 8px; color: #a1a1aa; margin: 0;">Impression Directe - GameZone</p>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 500);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ─── Players CRUD Handlers ─────────────────────────────────────────────
  const resetPlayerForm = () => {
    setPlayNom("");
    setPlayTel("");
    setPlayEmail("");
  };

  const handleAddPlayer = () => {
    if (!playNom.trim()) return;
    const newPlayer = {
      id: Date.now(),
      nom: playNom.trim(),
      telephone: playTel.trim(),
      email: playEmail.trim(),
      dateInscription: new Date().toISOString(),
      totalSessions: 0,
      totalSpent: 0,
      totalTimeMinutes: 0
    };
    setPlayers(prev => [newPlayer, ...prev]);
    resetPlayerForm();
    setShowAddPlayerModal(false);
    addLog("player_add", `Joueur inscrit : ${newPlayer.nom}`, "console");
  };

  const handleEditPlayer = (id) => {
    if (!playNom.trim()) return;
    setPlayers(prev => prev.map(p => p.id === id ? {
      ...p,
      nom: playNom.trim(),
      telephone: playTel.trim(),
      email: playEmail.trim()
    } : p));
    resetPlayerForm();
    setShowEditPlayerModal(null);
    addLog("player_edit", `Profil joueur modifié : ${playNom.trim()}`, "console");
  };

  const handleDeletePlayer = (id) => {
    if (role !== "admin") return;
    const target = players.find(p => p.id === id);
    if (!target) return;
    if (!window.confirm(`Supprimer définitivement le joueur "${target.nom}" et toutes ses statistiques de fidélité ?`)) return;
    setPlayers(prev => prev.filter(p => p.id !== id));
    addLog("player_delete", `Joueur supprimé de la base : ${target.nom}`, "console");
  };

  // ─── Supplier CRUD Handlers ────────────────────────────────────────────
  const resetSupplierForm = () => {
    setSuppNom(""); setSuppTel(""); setSuppEmail("");
    setSuppAdresse(""); setSuppProduits(""); setSuppNotes("");
  };

  const handleAddSupplier = () => {
    if (!suppNom.trim()) return;
    const newSupplier = {
      id: Date.now(),
      nom: suppNom.trim(),
      telephone: suppTel.trim(),
      email: suppEmail.trim(),
      adresse: suppAdresse.trim(),
      produitsFournis: suppProduits.split(",").map(s => s.trim()).filter(Boolean),
      dateAjout: new Date().toISOString(),
      notes: suppNotes.trim()
    };
    setSuppliers(prev => [newSupplier, ...prev]);
    resetSupplierForm();
    setShowAddSupplierModal(false);
    addLog("supplier_add", `Fournisseur ajouté : ${newSupplier.nom}`, "console");
  };

  const handleEditSupplier = (id) => {
    if (!suppNom.trim()) return;
    setSuppliers(prev => prev.map(s => s.id === id ? {
      ...s,
      nom: suppNom.trim(),
      telephone: suppTel.trim(),
      email: suppEmail.trim(),
      adresse: suppAdresse.trim(),
      produitsFournis: suppProduits.split(",").map(p => p.trim()).filter(Boolean),
      notes: suppNotes.trim()
    } : s));
    resetSupplierForm();
    setShowEditSupplierModal(null);
    addLog("supplier_edit", `Fournisseur modifié : ${suppNom.trim()}`, "console");
  };

  const handleDeleteSupplier = (id) => {
    if (role !== "admin") return;
    const target = suppliers.find(s => s.id === id);
    if (!target) return;
    if (!window.confirm(`Supprimer le fournisseur "${target.nom}" ?`)) return;
    setSuppliers(prev => prev.filter(s => s.id !== id));
    addLog("supplier_delete", `Fournisseur supprimé : ${target.nom}`, "console");
  };

  // ─── Open Invoices & Mixed Payments Handlers ───────────────────────────
  const handleToggleTicketStatus = (ticketId) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        const nextStatus = t.status === "En attente" ? "En cours" : "En attente";
        addLog("ticket_status", `Ticket "${t.name}" mis en statut : ${nextStatus}`, "snack");
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  const handleMergeTickets = (sourceId, targetId) => {
    if (sourceId === targetId) return;
    const sourceTicket = tickets.find(t => t.id === sourceId);
    if (!sourceTicket) return;

    if (targetId.startsWith("console-")) {
      const consoleId = Number(targetId.replace("console-", ""));
      setConsoles(prev => prev.map(c => {
        if (c.id === consoleId && c.status === "occupée" && c.activeSession) {
          const mergedList = [...(c.activeSession.extraSnacksList || [])];
          sourceTicket.cart.forEach(sourceItem => {
            const existing = mergedList.find(x => x.product.id === sourceItem.product.id);
            if (existing) {
              existing.quantity += sourceItem.quantity;
            } else {
              mergedList.push({ ...sourceItem });
            }
          });
          const nextBill = mergedList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
          return {
            ...c,
            activeSession: {
              ...c.activeSession,
              extraSnacksList: mergedList,
              extraSnacksBill: nextBill
            }
          };
        }
        return c;
      }));

      handleDeleteTicket(sourceId);
      addLog("ticket_merge", `Ticket "${sourceTicket.name}" fusionné dans la session console ID ${consoleId}`, "snack");
      alert(`Ticket fusionné avec succès dans la console !`);
    } else {
      setTickets(prev => {
        return prev.map(t => {
          if (t.id === targetId) {
            const mergedCart = [...t.cart];
            sourceTicket.cart.forEach(sourceItem => {
              const existing = mergedCart.find(x => x.product.id === sourceItem.product.id);
              if (existing) {
                existing.quantity += sourceItem.quantity;
              } else {
                mergedCart.push({ ...sourceItem });
              }
            });
            return {
              ...t,
              cart: mergedCart,
              posCustomer: t.posCustomer || sourceTicket.posCustomer
            };
          }
          return t;
        });
      });

      handleDeleteTicket(sourceId);
      addLog("ticket_merge", `Ticket "${sourceTicket.name}" fusionné dans un autre ticket`, "snack");
      alert(`Tickets fusionnés avec succès !`);
    }
    setShowMergeModal(null);
  };

  const handleConfirmPayment = () => {
    if (!showPaymentModal) return;
    const inv = showPaymentModal;
    const total = inv.total;

    let cashUsed = 0;
    let mobileUsed = 0;

    if (paymentMethodSelected === "espèces") {
      cashUsed = total;
    } else if (paymentMethodSelected === "mobile money") {
      mobileUsed = total;
    } else if (paymentMethodSelected === "mixte") {
      const cash = Number(paymentCashAmount || 0);
      const mob = Number(paymentMobileAmount || 0);
      if (cash + mob !== total) {
        alert(`Erreur : La somme des montants saisi (${cash + mob}) n'est pas égale au total de la facture (${total}).`);
        return;
      }
      cashUsed = cash;
      mobileUsed = mob;
    }

    setStats(prev => {
      const newGamesRev = prev.gamesRevenue + inv.gameCost;
      const newSnacksRev = prev.snackRevenue + inv.snackCost;
      const newCash = prev.cashBalance + cashUsed;
      return {
        ...prev,
        gamesRevenue: newGamesRev,
        snackRevenue: newSnacksRev,
        cashBalance: newCash
      };
    });

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        gamesRevenue: prev.gamesRevenue + inv.gameCost,
        snackRevenue: prev.snackRevenue + inv.snackCost,
        paymentEspèces: (prev.paymentEspèces || 0) + cashUsed,
        paymentMobileMoney: (prev.paymentMobileMoney || 0) + mobileUsed,
        paymentCarte: (prev.paymentCarte || 0) + (total - cashUsed - mobileUsed),
        transactionsCount: (prev.transactionsCount || 0) + 1
      }));
    }

    if (inv.type === "pos") {
      setProducts(prev => {
        return prev.map(p => {
          const sold = inv.itemsList.find(x => x.product.id === p.id);
          if (sold) {
            return { ...p, stock: Math.max(0, p.stock - sold.quantity) };
          }
          return p;
        });
      });

      setStockMovements(prev => {
        const newMovements = inv.itemsList.map((cartItem, idx) => ({
          id: Date.now() + idx,
          date: new Date().toISOString(),
          productId: cartItem.product.id,
          productName: cartItem.product.name,
          type: "sortie",
          quantity: cartItem.quantity,
          reason: `Vente POS direct (${inv.customer})`,
          user: role === "admin" ? "Administrateur" : "Gérant"
        }));
        return [...newMovements, ...prev];
      });

      setTopProductsState(prev => {
        let updated = [...prev];
        inv.itemsList.forEach(cartItem => {
          const index = updated.findIndex(x => x.name === cartItem.product.name);
          if (index > -1) {
            updated[index] = {
              ...updated[index],
              quantity: updated[index].quantity + cartItem.quantity,
              revenue: updated[index].revenue + (cartItem.product.price * cartItem.quantity)
            };
          } else {
            updated.push({
              name: cartItem.product.name,
              quantity: cartItem.quantity,
              revenue: cartItem.product.price * cartItem.quantity,
              category: cartItem.product.category
            });
          }
        });
        return updated.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      });

      setDailyProductsRevenue(prev => {
        return prev.map(item => {
          const sold = inv.itemsList.find(x => x.product.name === item.name);
          if (sold) {
            return {
              ...item,
              quantity: item.quantity + sold.quantity,
              revenue: item.revenue + (sold.product.price * sold.quantity)
            };
          }
          return item;
        });
      });

      // Update player loyalty spent
      setPlayers(prev => prev.map(p => {
        if (p.nom.toLowerCase() === inv.customer.toLowerCase()) {
          return {
            ...p,
            totalSpent: (p.totalSpent || 0) + total,
            totalSessions: (p.totalSessions || 0) + 1
          };
        }
        return p;
      }));
    }

    if (inv.type === "console" && inv.consoleId) {
      setDailySessionsCount(prev => prev + 1);

      const consoleObj = consoles.find(c => c.id === inv.consoleId);
      const consoleName = consoleObj ? consoleObj.name : `Console ID ${inv.consoleId}`;

      setTopConsolesState(prev => {
        const exists = prev.find(item => item.name === consoleName);
        if (exists) {
          return prev.map(item => 
            item.name === consoleName 
              ? { ...item, revenue: item.revenue + inv.gameCost }
              : item
          ).sort((a, b) => b.revenue - a.revenue);
        } else {
          return [...prev, { name: consoleName, revenue: inv.gameCost, sessions: 0 }]
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);
        }
      });

      setDailyConsolesRevenue(prev => prev.map(item => {
        if (item.name === consoleName) {
          return {
            ...item,
            revenue: item.revenue + inv.gameCost
          };
        }
        return item;
      }));

      if (inv.itemsList && inv.itemsList.length > 0) {
        setTopProductsState(prev => {
          let updated = [...prev];
          inv.itemsList.forEach(cartItem => {
            const index = updated.findIndex(x => x.name === cartItem.product.name);
            if (index > -1) {
              updated[index] = {
                ...updated[index],
                quantity: updated[index].quantity + cartItem.quantity,
                revenue: updated[index].revenue + (cartItem.product.price * cartItem.quantity)
              };
            } else {
              updated.push({
                name: cartItem.product.name,
                quantity: cartItem.quantity,
                revenue: cartItem.product.price * cartItem.quantity,
                category: cartItem.product.category
              });
            }
          });
          return updated.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
        });

        setDailyProductsRevenue(prev => {
          return prev.map(item => {
            const sold = inv.itemsList.find(x => x.product.name === item.name);
            if (sold) {
              return {
                ...item,
                quantity: item.quantity + sold.quantity,
                revenue: item.revenue + (sold.product.price * sold.quantity)
              };
            }
            return item;
          });
        });
      }

      // Update player loyalty spent & time spent (deducting prepaid registered at session start)
      setPlayers(prev => prev.map(p => {
        if (p.nom.toLowerCase() === inv.customer.toLowerCase()) {
          const elapsedSec = consoleObj?.activeSession?.timeElapsedSeconds || 0;
          const elapsedMin = Math.round(elapsedSec / 60);
          const prepaidAmount = consoleObj?.activeSession?.prepaidAmount || 0;
          const extraSpent = Math.max(0, total - prepaidAmount);

          return {
            ...p,
            totalSpent: (p.totalSpent || 0) + extraSpent,
            totalTimeMinutes: (p.totalTimeMinutes || 0) + elapsedMin
          };
        }
        return p;
      }));

      setConsoles(prev => prev.map(c => {
        if (c.id === inv.consoleId) {
          const sessionElapsed = c.activeSession?.timeElapsedSeconds || 0;
          return {
            ...c,
            status: "libre",
            totalTimeSeconds: (c.totalTimeSeconds || 0) + sessionElapsed,
            activeSession: null
          };
        }
        return c;
      }));
    }

    const pmText = paymentMethodSelected === "mixte" ? `Mixte (Espèces: ${formatPrice(cashUsed)}, Mobile: ${formatPrice(mobileUsed)})` : paymentMethodSelected;
    addLog(
      "payment_complete",
      `Paiement reçu pour "${inv.name}". Total: ${formatPrice(total)} (Méthode: ${pmText})`,
      inv.type === "console" ? "console" : "snack"
    );

    const newCompletedSale = {
      id: `VTE-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-6)}`,
      customer: inv.customer || "Client Comptant",
      seller: role === "admin" ? "Administrateur" : "Gérant",
      total: total,
      paid: total,
      itemsList: inv.itemsList || [],
      gameCost: inv.gameCost || 0,
      snackCost: inv.snackCost || 0,
      date: new Date().toISOString(),
      status: "Terminée",
      paymentMethod: pmText,
      type: inv.type === "console" ? "console" : "pos"
    };
    setSales(prev => [newCompletedSale, ...prev]);

    setShowReceiptModal({
      id: `REC-${Date.now().toString().slice(-6)}`,
      customer: inv.customer,
      itemsList: inv.itemsList,
      gameCost: inv.gameCost,
      snackCost: inv.snackCost,
      total: total,
      date: new Date().toLocaleTimeString(),
      type: inv.type === "console" ? "Clôture Station & Snacks" : "Facture Directe",
      paymentMethod: pmText
    });

    if (inv.type === "pos") {
      handleDeleteTicket(inv.id);
    }

    setShowPaymentModal(null);
    setPaymentCashAmount("");
    setPaymentMobileAmount("");
    setPaymentMethodSelected("espèces");
  };

  const renderCaisseFermeeLock = (sectionName) => (
    <div className="glass-panel p-8 rounded-2xl border border-zinc-850 text-center space-y-6 max-w-xl mx-auto my-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg shadow-rose-950/20 animate-pulse">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-black text-rose-400 uppercase tracking-wide">Accès Suspendu (Caisse Fermée)</h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Toutes les opérations de {sectionName} sont bloquées lorsque la caisse est fermée. Veuillez d'abord procéder à l'ouverture de la caisse.
        </p>
      </div>
      <div className="pt-2">
        <button
          onClick={() => {
            const lastClosed = caisseSessions[0];
            setOpenCaisseBalance(lastClosed ? lastClosed.realBalance : "250000");
            setOpenCaisseOperator("");
            setShowOpenCaisseModal(true);
            setActiveTab("caisse");
          }}
          className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-sans rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-orange-950/20 transition-all active:scale-95 flex items-center justify-center mx-auto gap-2"
        >
          <Unlock className="w-4 h-4" />
          Aller ouvrir la Caisse
        </button>
      </div>
    </div>
  );

  const handleAddExpenseCategory = (name) => {
    if (role !== "admin") return;
    const cleanName = name.trim().toLowerCase();
    if (!cleanName || expenseCategories.includes(cleanName)) return;

    setExpenseCategories(prev => [...prev, cleanName]);
    addLog("expense_category_add", `Nouvelle catégorie de dépenses ajoutée : ${cleanName}`, "console");
  };

  const handleDeleteExpenseCategory = (name) => {
    if (role !== "admin") return;
    setExpenseCategories(prev => prev.filter(c => c !== name));
    addLog("expense_category_delete", `Catégorie de dépenses supprimée : ${name}`, "console");
  };

  const handleResetSystemSettings = () => {
    if (role !== "admin") return;
    if (confirm("Voulez-vous vraiment réinitialiser TOUS les paramètres système, tarifs consoles, catégories, modes de paiement et données produits aux valeurs d'origine ? Cette action est irréversible.")) {
      localStorage.removeItem("system_settings");
      localStorage.removeItem("system_product_categories");
      localStorage.removeItem("system_payment_methods");
      localStorage.removeItem("system_consoles");
      localStorage.removeItem("system_products");
      localStorage.removeItem("system_pos_tickets");
      window.location.reload();
    }
  };

  // Snack POS Multi-Ticket State
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem("system_pos_tickets");
    return saved ? JSON.parse(saved) : [
      { id: "default", name: "Ticket 1", cart: [], posCustomer: "", posAssociateConsoleId: "" }
    ];
  });
  const [activeTicketId, setActiveTicketId] = useState("default");
  const [selectedTicketIds, setSelectedTicketIds] = useState(["default"]);

  // Sync tickets to localStorage
  useEffect(() => {
    localStorage.setItem("system_pos_tickets", JSON.stringify(tickets));
  }, [tickets]);

  const isMultiBilling = selectedTicketIds.length > 1;
  const selectedTickets = tickets.filter(t => selectedTicketIds.includes(t.id));

  // Expose active ticket details as standard state variables for compatibility
  const activeTicket = tickets.find(t => t.id === activeTicketId) || tickets[0] || { id: "default", name: "Ticket 1", cart: [], posCustomer: "", posAssociateConsoleId: "" };
  
  const cart = (() => {
    if (!isMultiBilling) return activeTicket.cart;
    const merged = [];
    selectedTickets.forEach(ticket => {
      ticket.cart.forEach(cartItem => {
        const existing = merged.find(item => item.product.id === cartItem.product.id);
        if (existing) {
          existing.quantity += cartItem.quantity;
        } else {
          merged.push({ ...cartItem });
        }
      });
    });
    return merged;
  })();

  const posCustomer = isMultiBilling 
    ? `Facture Groupée : ${selectedTickets.map(t => t.name).join(", ")}`
    : activeTicket.posCustomer;

  const posAssociateConsoleId = isMultiBilling ? "" : activeTicket.posAssociateConsoleId;

  const setCart = (newCartVal) => {
    if (isMultiBilling) return;
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          cart: typeof newCartVal === "function" ? newCartVal(t.cart) : newCartVal
        };
      }
      return t;
    }));
  };

  const setPosCustomer = (newCustomerVal) => {
    if (isMultiBilling) return;
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          posCustomer: typeof newCustomerVal === "function" ? newCustomerVal(t.posCustomer) : newCustomerVal
        };
      }
      return t;
    }));
  };

  const setPosAssociateConsoleId = (newConsoleVal) => {
    if (isMultiBilling) return;
    setTickets(prev => prev.map(t => {
      if (t.id === activeTicketId) {
        return {
          ...t,
          posAssociateConsoleId: typeof newConsoleVal === "function" ? newConsoleVal(t.posAssociateConsoleId) : newConsoleVal
        };
      }
      return t;
    }));
  };

  const handleCreateTicket = (name = "") => {
    const id = Date.now().toString();
    const ticketName = name.trim() || `Ticket ${tickets.length + 1}`;
    const newTicket = { id, name: ticketName, cart: [], posCustomer: "", posAssociateConsoleId: "" };
    setTickets(prev => [...prev, newTicket]);
    setActiveTicketId(id);
    setSelectedTicketIds([id]);
  };

  const handleRenameTicket = (id, newName) => {
    if (!newName.trim()) return;
    setTickets(prev => prev.map(t => t.id === id ? { ...t, name: newName.trim() } : t));
  };

  const handleDeleteTicket = (id) => {
    if (tickets.length <= 1) {
      setTickets([
        { id: "default", name: "Ticket 1", cart: [], posCustomer: "", posAssociateConsoleId: "" }
      ]);
      setActiveTicketId("default");
      setSelectedTicketIds(["default"]);
      return;
    }
    const index = tickets.findIndex(t => t.id === id);
    const newTickets = tickets.filter(t => t.id !== id);
    setTickets(newTickets);
    const nextActive = newTickets[Math.max(0, index - 1)];
    setActiveTicketId(nextActive.id);
    setSelectedTicketIds(prev => {
      const filtered = prev.filter(x => x !== id);
      return filtered.length > 0 ? filtered : [nextActive.id];
    });
  };

  const handleToggleTicketSelection = (id) => {
    setSelectedTicketIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev;
        const next = prev.filter(x => x !== id);
        if (activeTicketId === id) {
          setActiveTicketId(next[0]);
        }
        return next;
      } else {
        const next = [...prev, id];
        setActiveTicketId(id);
        return next;
      }
    });
  };

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [showStartModal, setShowStartModal] = useState(null); // stores console object to start
  const [showCloseModal, setShowCloseModal] = useState(null); // stores console object to close
  const [showReceiptModal, setShowReceiptModal] = useState(null); // stores transaction receipt details
  const [showAddSnackToConsoleModal, setShowAddSnackToConsoleModal] = useState(null); // stores console object
  const [showInterruptModal, setShowInterruptModal] = useState(null); // stores console object to interrupt
  
  // Advanced Billing / Invoices Modal States
  const [showPaymentModal, setShowPaymentModal] = useState(null); // stores invoice object to pay
  const [paymentMethodSelected, setPaymentMethodSelected] = useState("espèces"); // 'espèces', 'mobile money', 'mixte'
  const [paymentCashAmount, setPaymentCashAmount] = useState("");
  const [paymentMobileAmount, setPaymentMobileAmount] = useState("");
  const [showMergeModal, setShowMergeModal] = useState(null); // stores source invoice object to merge
  const [targetMergeInvoiceId, setTargetMergeInvoiceId] = useState(""); // stores console object to interrupt
  
  // Custom rate editing state (Admin only)
  const [editingRates, setEditingRates] = useState(false);
  const [customRates, setCustomRates] = useState({
    PS5: 1500.00,
    PS4: 1000.00,
    "PC Gaming": 2000.00,
    VIP: 5000.00
  });

  // Modal forms
  const [newPlayerPseudo, setNewPlayerPseudo] = useState("");
  const [newPlayerPhone, setNewPlayerPhone] = useState("");
  const [newDurationType, setNewDurationType] = useState("unlimited"); // 'unlimited' or 'limited'
  const [newDurationHours, setNewDurationHours] = useState(1);
  const [newPrepaidAmount, setNewPrepaidAmount] = useState(0);
  const [playerSearchVal, setPlayerSearchVal] = useState("");
  const [showPlayerDropdown, setShowPlayerDropdown] = useState(false);

  // Initialize newPrepaidAmount when opening the start modal
  useEffect(() => {
    if (showStartModal) {
      setNewPrepaidAmount(showStartModal.ratePerHour);
      setNewPlayerPseudo("");
      setNewPlayerPhone("");
      setPlayerSearchVal("");
      setShowPlayerDropdown(false);
    }
  }, [showStartModal]);
  const [closeSessionHours, setCloseSessionHours] = useState(1);
  const [dailySessionsCount, setDailySessionsCount] = useState(3);
  const [dailySalesCount, setDailySalesCount] = useState(5);

  // Refs for GSAP animations
  const tabContentRef = useRef(null);

  // Page entry and Tab switching animations
  useEffect(() => {
    // Fade & slide in tab content
    gsap.fromTo(
      ".view-container",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
    );
    
    // Stagger render active list items
    gsap.fromTo(
      ".stagger-card",
      { opacity: 0, scale: 0.96, y: 15 },
      { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.04, ease: "back.out(1.2)", delay: 0.1 }
    );
  }, [activeTab]);

  // Keep players count updated in stats when consoles change
  useEffect(() => {
    const playersCount = consoles.filter(c => c.status === "occupée").length;
    setStats(prev => ({
      ...prev,
      playersPresent: playersCount
    }));
  }, [consoles]);

  // Real-time session ticking every second
  useEffect(() => {
    const sessionTicker = setInterval(() => {
      setConsoles(prev => prev.map(c => {
        if (c.status === "occupée" && c.activeSession) {
          const newElapsed = c.activeSession.timeElapsedSeconds + 1;
          
          // Calculate live additional game amount due
          const prepaid = c.activeSession.prepaidAmount || 0;
          let nextAmount = 0;
          if (c.activeSession.durationType === "unlimited") {
            // No hourly billing for unlimited sessions
            nextAmount = 0;
          } else {
            // For limited, they prepaid full forfait, so additional due is 0
            nextAmount = 0;
          }

          return {
            ...c,
            activeSession: {
              ...c.activeSession,
              timeElapsedSeconds: newElapsed,
              totalAmountDue: nextAmount
            }
          };
        }
        return c;
      }));
    }, 1000);

    return () => clearInterval(sessionTicker);
  }, []);

  // Format seconds to HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };

  // Log activity helper
  const addLog = (type, message, category) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const newEntry = {
      id: Date.now(),
      type,
      message,
      time: timeStr,
      date: dateStr,
      category
    };
    setActivityLog(prev => [newEntry, ...prev.slice(0, 19)]);
  };

  // Start a new console session
  const handleStartSession = (consoleObj) => {
    if (!newPlayerPseudo.trim() || !newPlayerPhone.trim()) return;

    const durationMinutes = newDurationType === "limited" ? newDurationHours * 60 : 0;
    const fullName = newPlayerPseudo.trim();
    const gameCost = newDurationType === "limited"
      ? consoleObj.ratePerHour * newDurationHours
      : Number(newPrepaidAmount || 0);

    // Auto register new player or update existing profile
    setPlayers(prev => {
      const exists = prev.some(p => p.nom.toLowerCase() === fullName.toLowerCase());
      if (exists) {
        return prev.map(p => p.nom.toLowerCase() === fullName.toLowerCase() ? {
          ...p,
          totalSessions: (p.totalSessions || 0) + 1,
          totalSpent: (p.totalSpent || 0) + gameCost,
          totalTimeMinutes: (p.totalTimeMinutes || 0) + durationMinutes
        } : p);
      } else {
        return [{
          id: Date.now(),
          nom: fullName,
          telephone: newPlayerPhone.trim(),
          email: "",
          dateInscription: new Date().toISOString(),
          totalSessions: 1,
          totalSpent: gameCost,
          totalTimeMinutes: durationMinutes
        }, ...prev];
      }
    });
    
    // Update daily revenue stats immediately since payment is made BEFORE playing
    setStats(prev => ({
      ...prev,
      gamesRevenue: prev.gamesRevenue + gameCost,
      cashBalance: prev.cashBalance + gameCost
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        gamesRevenue: prev.gamesRevenue + gameCost,
        paymentEspèces: (prev.paymentEspèces || 0) + gameCost,
        transactionsCount: (prev.transactionsCount || 0) + 1
      }));
    }

    setConsoles(prev => prev.map(c => {
      if (c.id === consoleObj.id) {
        return {
          ...c,
          status: "occupée",
          totalSessions: (c.totalSessions || 0) + 1,
          totalRevenue: (c.totalRevenue || 0) + gameCost,
          activeSession: {
            player: fullName,
            firstName: fullName,
            lastName: "",
            phone: newPlayerPhone.trim(),
            startTime: new Date().toISOString(),
            durationType: newDurationType,
            durationMinutes: durationMinutes,
            timeElapsedSeconds: 0,
            prepaidAmount: gameCost,
            totalAmountDue: 0,
            extraSnacksBill: 0,
            extraSnacksList: []
          }
        };
      }
      return c;
    }));

    // Update detailed daily consoles stats
    setDailyConsolesRevenue(prev => prev.map(item => {
      if (item.name === consoleObj.name) {
        return {
          ...item,
          revenue: item.revenue + gameCost,
          sessions: item.sessions + 1
        };
      }
      return item;
    }));

    // Update top consoles metrics
    setTopConsolesState(prev => {
      const exists = prev.find(item => item.name === consoleObj.name);
      if (exists) {
        return prev.map(item => 
          item.name === consoleObj.name 
            ? { ...item, revenue: item.revenue + gameCost, sessions: item.sessions + 1 }
            : item
        ).sort((a, b) => b.revenue - a.revenue);
      } else {
        return [...prev, { name: consoleObj.name, revenue: gameCost, sessions: 1 }]
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
      }
    });

    addLog(
      "console_start", 
      `Session démarrée et prépayée (${gameCost.toLocaleString('fr-FR')} FCFA) sur ${consoleObj.name} pour ${fullName} (${newDurationType === 'unlimited' ? 'Temps libre' : newDurationHours + 'h00'})`, 
      "console"
    );

    // Show upfront payment invoice
    setShowReceiptModal({
      id: `FAC-${Date.now().toString().slice(-6)}`,
      customer: fullName,
      item: consoleObj.name,
      gameCost: gameCost,
      snackCost: 0,
      total: gameCost,
      date: new Date().toLocaleTimeString(),
      type: "Forfait Prépayé (Démarrage)"
    });

    // Reset forms and close modal
    setNewPlayerPseudo("");
    setNewPlayerPhone("");
    setNewDurationType("unlimited");
    setNewDurationHours(1);
    setShowStartModal(null);
  };

  // Cancel session completely (refund)
  const handleCancelSession = (consoleId, playerRef, consoleName, prepaidAmount) => {
    // Refund the upfront payment
    setStats(prev => ({
      ...prev,
      gamesRevenue: prev.gamesRevenue - prepaidAmount,
      cashBalance: prev.cashBalance - prepaidAmount
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        refunds: prev.refunds + prepaidAmount
      }));
    }

    setDailyConsolesRevenue(prev => prev.map(item => {
      if (item.name === consoleName) {
        return {
          ...item,
          revenue: Math.max(0, item.revenue - prepaidAmount),
          sessions: Math.max(0, item.sessions - 1)
        };
      }
      return item;
    }));

    setTopConsolesState(prev => {
      const exists = prev.find(item => item.name === consoleName);
      if (exists) {
        return prev.map(item => 
          item.name === consoleName 
            ? { ...item, revenue: Math.max(0, item.revenue - prepaidAmount), sessions: Math.max(0, item.sessions - 1) }
            : item
        ).sort((a, b) => b.revenue - a.revenue);
      }
      return prev;
    });

    setConsoles(prev => prev.map(c => {
      if (c.id === consoleId) {
        return {
          ...c,
          status: "libre",
          activeSession: null,
          totalSessions: Math.max(0, (c.totalSessions || 0) - 1),
          totalRevenue: Math.max(0, (c.totalRevenue || 0) - prepaidAmount)
        };
      }
      return c;
    }));

    addLog(
      "console_stop", 
      `Session annulée avec remboursement de ${prepaidAmount.toLocaleString('fr-FR')} FCFA sur ${consoleName} pour ${playerRef}`, 
      "console"
    );

    setShowInterruptModal(null);
  };

  // Interrupt and charge prorata (adjust upfront payment)
  const handleInterruptProrata = (consoleId, elapsedSeconds, finalSnackAmount, playerRef, consoleName, ratePerHour, prepaidAmount, durationType = "unlimited") => {
    const elapsedHours = elapsedSeconds / 3600;
    const finalGameAmount = durationType === "limited"
      ? Math.round(elapsedHours * ratePerHour)
      : prepaidAmount; // No hourly prorata refund for unlimited sessions since pricing is arbitrary
    
    // Adjust stats since prepaidAmount was already added at the start.
    const gameAdjustment = finalGameAmount - prepaidAmount;
    const cashAdjustment = gameAdjustment + finalSnackAmount;

    setStats(prev => ({
      ...prev,
      gamesRevenue: prev.gamesRevenue + gameAdjustment,
      snackRevenue: prev.snackRevenue + finalSnackAmount,
      cashBalance: prev.cashBalance + cashAdjustment
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        gamesRevenue: prev.gamesRevenue + (gameAdjustment > 0 ? gameAdjustment : 0),
        snackRevenue: prev.snackRevenue + finalSnackAmount,
        refunds: prev.refunds + (gameAdjustment < 0 ? Math.abs(gameAdjustment) : 0)
      }));
    }

    setDailySessionsCount(prev => prev + 1);

    setTopConsolesState(prev => {
      const exists = prev.find(item => item.name === consoleName);
      if (exists) {
        return prev.map(item => 
          item.name === consoleName 
            ? { ...item, revenue: item.revenue + gameAdjustment }
            : item
        ).sort((a, b) => b.revenue - a.revenue);
      } else {
        return [...prev, { name: consoleName, revenue: finalGameAmount, sessions: 1 }]
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
      }
    });

    setDailyConsolesRevenue(prev => prev.map(item => {
      if (item.name === consoleName) {
        return {
          ...item,
          revenue: item.revenue + gameAdjustment
        };
      }
      return item;
    }));

    const extraSnacks = showInterruptModal?.activeSession?.extraSnacksList || [];
    if (extraSnacks.length > 0) {
      setTopProductsState(prev => {
        let updated = [...prev];
        extraSnacks.forEach(cartItem => {
          const index = updated.findIndex(x => x.name === cartItem.product.name);
          if (index > -1) {
            updated[index] = {
              ...updated[index],
              quantity: updated[index].quantity + cartItem.quantity,
              revenue: updated[index].revenue + (cartItem.product.price * cartItem.quantity)
            };
          } else {
            updated.push({
              name: cartItem.product.name,
              quantity: cartItem.quantity,
              revenue: cartItem.product.price * cartItem.quantity,
              category: cartItem.product.category
            });
          }
        });
        return updated.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      });

      setDailyProductsRevenue(prev => {
        return prev.map(item => {
          const sold = extraSnacks.find(x => x.product.name === item.name);
          if (sold) {
            return {
              ...item,
              quantity: item.quantity + sold.quantity,
              revenue: item.revenue + (sold.product.price * sold.quantity)
            };
          }
          return item;
        });
      });
    }

    setConsoles(prev => prev.map(c => {
      if (c.id === consoleId) {
        return {
          ...c,
          status: "libre",
          activeSession: null,
          totalTimeSeconds: (c.totalTimeSeconds || 0) + elapsedSeconds,
          totalRevenue: (c.totalRevenue || 0) + gameAdjustment
        };
      }
      return c;
    }));

    addLog(
      "console_stop", 
      `Session interrompue au prorata sur ${consoleName} par ${playerRef}. Consommé: ${finalGameAmount.toLocaleString('fr-FR')} FCFA (Ajustement: ${gameAdjustment.toLocaleString('fr-FR')} FCFA, Snacks: ${finalSnackAmount.toLocaleString('fr-FR')} FCFA)`, 
      "console"
    );

    setShowReceiptModal({
      id: `FAC-${Date.now().toString().slice(-6)}`,
      customer: playerRef,
      item: consoleName,
      gameCost: finalGameAmount,
      snackCost: finalSnackAmount,
      total: finalGameAmount + finalSnackAmount,
      prepaid: prepaidAmount,
      date: new Date().toLocaleTimeString(),
      type: "Interruption Session (Prorata)"
    });

    setShowInterruptModal(null);
  };

  // Cloturer session (stop game session)
  const handleCloseSessionRequest = (consoleObj) => {
    setShowCloseModal(consoleObj);
    if (consoleObj.activeSession?.durationType === "limited") {
      setCloseSessionHours(consoleObj.activeSession.durationMinutes / 60);
    } else {
      setCloseSessionHours(1); // Default to 1 hour
    }
  };

  const handleConfirmCloseSession = (consoleId, finalGameAmount, finalSnackAmount, playerRef, consoleName, fullGameCost = 0, prepaidAmount = 0) => {
    const totalRevenue = finalGameAmount + finalSnackAmount;
    setDailySessionsCount(prev => prev + 1);
    
    // Update dashboard states
    setStats(prev => {
      const newGamesRev = prev.gamesRevenue + finalGameAmount;
      const newSnacksRev = prev.snackRevenue + finalSnackAmount;
      const newCash = prev.cashBalance + totalRevenue;
      return {
        ...prev,
        gamesRevenue: newGamesRev,
        snackRevenue: newSnacksRev,
        cashBalance: newCash
      };
    });

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        gamesRevenue: prev.gamesRevenue + finalGameAmount,
        snackRevenue: prev.snackRevenue + finalSnackAmount,
        paymentEspèces: (prev.paymentEspèces || 0) + totalRevenue,
        transactionsCount: (prev.transactionsCount || 0) + 1
      }));
    }

    // Update Top Consoles revenue chart (sessions count is already incremented at start)
    setTopConsolesState(prev => {
      const exists = prev.find(item => item.name === consoleName);
      if (exists) {
        return prev.map(item => 
          item.name === consoleName 
            ? { ...item, revenue: item.revenue + finalGameAmount }
            : item
        ).sort((a, b) => b.revenue - a.revenue);
      } else {
        return [...prev, { name: consoleName, revenue: finalGameAmount, sessions: 0 }]
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
      }
    });

    // Update detailed daily consoles stats
    setDailyConsolesRevenue(prev => prev.map(item => {
      if (item.name === consoleName) {
        return {
          ...item,
          revenue: item.revenue + finalGameAmount
        };
      }
      return item;
    }));

    // Update product stats with closed session's snacks
    const extraSnacks = showCloseModal?.activeSession?.extraSnacksList || [];
    if (extraSnacks.length > 0) {
      setTopProductsState(prev => {
        let updated = [...prev];
        extraSnacks.forEach(cartItem => {
          const index = updated.findIndex(x => x.name === cartItem.product.name);
          if (index > -1) {
            updated[index] = {
              ...updated[index],
              quantity: updated[index].quantity + cartItem.quantity,
              revenue: updated[index].revenue + (cartItem.product.price * cartItem.quantity)
            };
          } else {
            updated.push({
              name: cartItem.product.name,
              quantity: cartItem.quantity,
              revenue: cartItem.product.price * cartItem.quantity,
              category: cartItem.product.category
            });
          }
        });
        return updated.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
      });

      setDailyProductsRevenue(prev => {
        return prev.map(item => {
          const sold = extraSnacks.find(x => x.product.name === item.name);
          if (sold) {
            return {
              ...item,
              quantity: item.quantity + sold.quantity,
              revenue: item.revenue + (sold.product.price * sold.quantity)
            };
          }
          return item;
        });
      });
    }

    // Reset console status & accumulate totalTimeSeconds
    setConsoles(prev => prev.map(c => {
      if (c.id === consoleId) {
        const sessionElapsed = c.activeSession?.timeElapsedSeconds || 0;
        return {
          ...c,
          status: "libre",
          totalTimeSeconds: (c.totalTimeSeconds || 0) + sessionElapsed,
          activeSession: null
        };
      }
      return c;
    }));

    addLog(
      "console_stop", 
      `Session clôturée sur ${consoleName} par ${playerRef}. Facturé: ${totalRevenue.toLocaleString('fr-FR')} FCFA (Jeux: ${finalGameAmount.toLocaleString('fr-FR')} FCFA, Snack: ${finalSnackAmount.toLocaleString('fr-FR')} FCFA)`, 
      "console"
    );

    // Show custom receipt popup
    setShowReceiptModal({
      id: `FAC-${Date.now().toString().slice(-6)}`,
      customer: playerRef,
      item: consoleName,
      gameCost: fullGameCost > 0 ? fullGameCost : finalGameAmount,
      snackCost: finalSnackAmount,
      total: (fullGameCost > 0 ? fullGameCost : finalGameAmount) + finalSnackAmount,
      prepaid: prepaidAmount,
      date: new Date().toLocaleTimeString(),
      type: "Console + Snack"
    });

    setShowCloseModal(null);
  };

  const exportDailyReportExcel = () => {
    const isWeekly = reportSubTab === "hebdomadaire";
    const isMonthly = reportSubTab === "mensuel";
    const reportTitle = isWeekly ? "RAPPORT HEBDOMADAIRE" : isMonthly ? "RAPPORT MENSUEL" : "RAPPORT JOURNALIER";
    const dateStr = currentDateTime.toLocaleDateString('fr-FR');
    
    const totalSessions = dailySessionsCount + consoles.filter(c => c.status === "occupée").length;
    const totalGamesRev = stats.gamesRevenue;
    const totalSnacksRev = stats.snackRevenue;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) + purchases.reduce((sum, p) => sum + p.totalAmount, 0);

    let finalSessions = totalSessions;
    let finalGames = totalGamesRev;
    let finalSnacks = totalSnacksRev;
    let finalExpenses = totalExpenses;

    if (isWeekly) {
      const last7DaysSessions = caisseSessions.filter(s => {
        const diffTime = Math.abs(new Date() - new Date(s.dateOpen));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });
      finalSessions = last7DaysSessions.length * 12 + totalSessions;
      finalGames = last7DaysSessions.reduce((sum, s) => sum + (s.gamesRevenue || 0), 0) + totalGamesRev;
      finalSnacks = last7DaysSessions.reduce((sum, s) => sum + (s.snackRevenue || 0), 0) + totalSnacksRev;
      finalExpenses = last7DaysSessions.reduce((sum, s) => sum + (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0), 0) + totalExpenses;
    } else if (isMonthly) {
      const last30DaysSessions = caisseSessions.filter(s => {
        const diffTime = Math.abs(new Date() - new Date(s.dateOpen));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
      finalSessions = last30DaysSessions.length * 15 + totalSessions;
      finalGames = last30DaysSessions.reduce((sum, s) => sum + (s.gamesRevenue || 0), 0) + totalGamesRev;
      finalSnacks = last30DaysSessions.reduce((sum, s) => sum + (s.snackRevenue || 0), 0) + totalSnacksRev;
      finalExpenses = last30DaysSessions.reduce((sum, s) => sum + (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0), 0) + totalExpenses;
    }
    
    const profit = finalGames + finalSnacks - finalExpenses;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += `${reportTitle} - GAMEZONE\r\n`;
    csvContent += `Date;${dateStr}\r\n\r\n`;
    csvContent += "Indicateur;Valeur\r\n";
    csvContent += `Joueurs (Sessions);${finalSessions}\r\n`;
    csvContent += `Revenus Jeux (${systemSettings.currency});${finalGames}\r\n`;
    csvContent += `Revenus Snack (${systemSettings.currency});${finalSnacks}\r\n`;
    csvContent += `Depenses (${systemSettings.currency});${finalExpenses}\r\n`;
    csvContent += `Benefice (${systemSettings.currency});${profit}\r\n\r\n`;

    if (!isWeekly && !isMonthly) {
      csvContent += "DETAIL DES CONSOLES\r\n";
      csvContent += "Console;Type;Sessions;Revenus\r\n";
      dailyConsolesRevenue.forEach(c => {
        csvContent += `${c.name};${c.type};${c.sessions};${c.revenue}\r\n`;
      });
      csvContent += "\r\n";

      csvContent += "DETAIL DES VENTES SNACK\r\n";
      csvContent += "Produit;Categorie;Quantite;Revenus\r\n";
      dailyProductsRevenue.filter(p => p.quantity > 0).forEach(p => {
        csvContent += `${p.name};${p.category};${p.quantity};${p.revenue}\r\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportTitle.replace(/\s+/g, "_")}_${dateStr.replace(/\//g, "-")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportDailyReportPDF = () => {
    const isWeekly = reportSubTab === "hebdomadaire";
    const isMonthly = reportSubTab === "mensuel";
    const reportTitle = isWeekly ? "Rapport Hebdomadaire" : isMonthly ? "Rapport Mensuel" : "Rapport Journalier";

    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) {
      alert("Le bloqueur de fenêtres pop-up empêche l'exportation. Veuillez autoriser les pop-ups.");
      return;
    }

    const dateStr = currentDateTime.toLocaleDateString(systemSettings.currencyLocale || 'fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = currentDateTime.toLocaleTimeString(systemSettings.currencyLocale || 'fr-FR');

    const totalSessions = dailySessionsCount + consoles.filter(c => c.status === "occupée").length;
    const totalGamesRev = stats.gamesRevenue;
    const totalSnacksRev = stats.snackRevenue;
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) + purchases.reduce((sum, p) => sum + p.totalAmount, 0);

    let finalSessions = totalSessions;
    let finalGames = totalGamesRev;
    let finalSnacks = totalSnacksRev;
    let finalExpenses = totalExpenses;

    if (isWeekly) {
      const last7DaysSessions = caisseSessions.filter(s => {
        const diffTime = Math.abs(new Date() - new Date(s.dateOpen));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 7;
      });
      finalSessions = last7DaysSessions.length * 12 + totalSessions;
      finalGames = last7DaysSessions.reduce((sum, s) => sum + (s.gamesRevenue || 0), 0) + totalGamesRev;
      finalSnacks = last7DaysSessions.reduce((sum, s) => sum + (s.snackRevenue || 0), 0) + totalSnacksRev;
      finalExpenses = last7DaysSessions.reduce((sum, s) => sum + (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0), 0) + totalExpenses;
    } else if (isMonthly) {
      const last30DaysSessions = caisseSessions.filter(s => {
        const diffTime = Math.abs(new Date() - new Date(s.dateOpen));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30;
      });
      finalSessions = last30DaysSessions.length * 15 + totalSessions;
      finalGames = last30DaysSessions.reduce((sum, s) => sum + (s.gamesRevenue || 0), 0) + totalGamesRev;
      finalSnacks = last30DaysSessions.reduce((sum, s) => sum + (s.snackRevenue || 0), 0) + totalSnacksRev;
      finalExpenses = last30DaysSessions.reduce((sum, s) => sum + (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0), 0) + totalExpenses;
    }

    const grandTotal = finalGames + finalSnacks;
    const profit = grandTotal - finalExpenses;

    let tablesHtml = "";

    if (!isWeekly && !isMonthly) {
      const consolesHtml = dailyConsolesRevenue
        .map(c => `
          <tr style="border-bottom: 1px solid #e4e4e7;">
            <td style="padding: 12px; font-weight: 600; color: #18181b;">${c.name}</td>
            <td style="padding: 12px; color: #71717a; text-transform: uppercase; font-size: 11px; font-weight: 700;">${c.type}</td>
            <td style="padding: 12px; text-align: center; color: #18181b;">${c.sessions}</td>
            <td style="padding: 12px; text-align: right; font-weight: 700; font-family: monospace; color: #18181b;">${formatPrice(c.revenue)}</td>
          </tr>
        `).join("");

      const snacksHtml = dailyProductsRevenue
        .filter(p => p.quantity > 0)
        .map(p => `
          <tr style="border-bottom: 1px solid #e4e4e7;">
            <td style="padding: 12px; font-weight: 600; color: #18181b;">${p.name}</td>
            <td style="padding: 12px; color: #71717a; text-transform: capitalize; font-size: 11px; font-weight: 700;">${p.category}</td>
            <td style="padding: 12px; text-align: center; color: #18181b;">${p.quantity}</td>
            <td style="padding: 12px; text-align: right; font-weight: 700; font-family: monospace; color: #18181b;">${formatPrice(p.revenue)}</td>
          </tr>
        `).join("") || `
          <tr>
            <td colspan="4" style="padding: 24px; text-align: center; color: #71717a; font-style: italic;">Aucune vente de snack-bar aujourd'hui.</td>
          </tr>
        `;

      tablesHtml = `
        <h3 class="section-title">🎮 Bilan des Consoles de Jeux</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 40%;">Nom de la console</th>
              <th style="width: 20%;">Modèle</th>
              <th style="width: 15%; text-align: center;">Nombre de sessions</th>
              <th style="width: 25%; text-align: right;">Total Généré</th>
            </tr>
          </thead>
          <tbody>
            ${consolesHtml}
          </tbody>
        </table>

        <h3 class="section-title">🥤 Ventes du Snack-Bar</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 40%;">Produit</th>
              <th style="width: 20%;">Catégorie</th>
              <th style="width: 15%; text-align: center;">Quantité vendue</th>
              <th style="width: 25%; text-align: right;">Total Généré</th>
            </tr>
          </thead>
          <tbody>
            ${snacksHtml}
          </tbody>
        </table>
      `;
    } else {
      tablesHtml = `
        <div style="margin-top: 50px; padding: 30px; border-radius: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; text-align: center;">
          <h3 style="margin: 0 0 10px 0; color: #334155; font-size: 16px; font-weight: 750;">Rapport d'Activité Périodique Consolidé</h3>
          <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: 500; line-height: 1.6;">
            Ce document récapitule les chiffres d'affaires consolidés de votre espace sur les ${isWeekly ? '7 derniers jours' : '30 derniers jours'}. Les revenus snacks, revenus jeux, dépenses de fonctionnement et bénéfices nets présentés ci-dessus reflètent les écritures de caisses enregistrées et clôturées dans le système.
          </p>
        </div>
      `;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle} - ${systemSettings.companyName || "GameZone"}</title>
        <meta charset="utf-8">
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Outfit', sans-serif;
            margin: 0;
            padding: 40px;
            background-color: #ffffff;
            color: #18181b;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 3px solid #18181b;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .brand-title {
            font-size: 28px;
            font-weight: 800;
            letter-spacing: -1px;
            margin: 0;
            color: #18181b;
          }
          .brand-subtitle {
            font-size: 10px;
            color: #71717a;
            text-transform: uppercase;
            font-weight: 700;
            letter-spacing: 2px;
            margin: 4px 0 0 0;
          }
          .report-meta {
            text-align: right;
            font-size: 12px;
            color: #52525b;
            line-height: 1.5;
          }
          .section-title {
            font-size: 16px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 1px;
            border-bottom: 2px solid #e4e4e7;
            padding-bottom: 8px;
            margin-top: 40px;
            margin-bottom: 15px;
            color: #18181b;
          }
          .grid-stats {
            display: grid;
            grid-template-cols: repeat(5, 1fr);
            gap: 15px;
            margin-bottom: 30px;
          }
          .card-stat {
            border: 1px solid #e4e4e7;
            border-radius: 12px;
            padding: 14px;
            background-color: #fafafa;
          }
          .card-label {
            font-size: 9px;
            font-weight: 700;
            text-transform: uppercase;
            color: #71717a;
            letter-spacing: 1px;
          }
          .card-value {
            font-size: 16px;
            font-weight: 800;
            margin-top: 6px;
            font-family: monospace;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
          }
          th {
            background-color: #f4f4f5;
            color: #71717a;
            text-transform: uppercase;
            font-size: 10px;
            font-weight: 800;
            padding: 12px;
            text-align: left;
            border-bottom: 2px solid #e4e4e7;
          }
          .signature-area {
            margin-top: 80px;
            display: flex;
            justify-content: space-between;
          }
          .sig-box {
            width: 200px;
            border-top: 1px solid #a1a1aa;
            text-align: center;
            padding-top: 8px;
            font-size: 12px;
            color: #71717a;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div style="display: flex; align-items: center; gap: 15px;">
            ${systemSettings.logoUrl ? `<img src="${systemSettings.logoUrl}" style="max-height: 55px; border-radius: 6px;" />` : ''}
            <div>
              <h1 class="brand-title">${systemSettings.companyName || "GAMEZONE"}</h1>
              <p class="brand-subtitle">${reportTitle} d'Activité</p>
            </div>
          </div>
          <div class="report-meta">
            <div><strong>Date :</strong> ${dateStr}</div>
            <div><strong>Heure :</strong> ${timeStr}</div>
            <div><strong>Généré par :</strong> Administrateur</div>
          </div>
        </div>

        <div class="grid-stats">
          <div class="card-stat">
            <div class="card-label">Joueurs</div>
            <div class="card-value" style="color: #7c3aed;">${finalSessions}</div>
          </div>
          <div class="card-stat">
            <div class="card-label">Revenus Jeux</div>
            <div class="card-value" style="color: #0891b2;">${formatPrice(finalGames)}</div>
          </div>
          <div class="card-stat">
            <div class="card-label">Revenus Snacks</div>
            <div class="card-value" style="color: #d97706;">${formatPrice(finalSnacks)}</div>
          </div>
          <div class="card-stat">
            <div class="card-label">Dépenses</div>
            <div class="card-value" style="color: #dc2626;">${formatPrice(finalExpenses)}</div>
          </div>
          <div class="card-stat" style="background-color: #ecfdf5; border-color: #a7f3d0;">
            <div class="card-label" style="color: #059669;">Bénéfice Net</div>
            <div class="card-value" style="color: #059669;">${formatPrice(profit)}</div>
          </div>
        </div>

        ${tablesHtml}

        <div class="signature-area">
          <div class="sig-box">Visa Gérant / Caisse</div>
          <div class="sig-box">Signature Direction</div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Toggle Maintenance Status
  const handleToggleMaintenance = (consoleId) => {
    if (role !== "admin") return;
    setConsoles(prev => prev.map(c => {
      if (c.id === consoleId) {
        let nextStatus = "libre";
        if (c.status === "libre") nextStatus = "maintenance";
        else if (c.status === "maintenance") nextStatus = "libre";
        
        // Log action
        addLog(
          "console_maintenance",
          `Status de ${c.name} modifié : ${nextStatus.toUpperCase()}`,
          "console"
        );

        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Update rates (Admin custom rates)
  const handleUpdateRates = () => {
    setConsoles(prev => prev.map(c => {
      if (customRates[c.type]) {
        return { ...c, ratePerHour: customRates[c.type] };
      }
      return c;
    }));
    setEditingRates(false);
    addLog("system_update", "Tarifs horaires des consoles mis à jour par l'administrateur", "console");
  };

  // POS Add to Cart
  const handleAddToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    // POS Cart micro-animation feedback
    gsap.fromTo(
      ".cart-badge",
      { scale: 0.8, rotate: -15 },
      { scale: 1, rotate: 0, duration: 0.3, ease: "back.out(2)" }
    );
  };

  // Adjust cart items
  const handleUpdateCartQty = (productId, amount) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const nextQty = item.quantity + amount;
          return nextQty > 0 ? { ...item, quantity: nextQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  // Calculate Cart metrics
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartTax = cartSubtotal * 0.10; // 10% VAT
  const cartTotal = cartSubtotal; // Included in price in European style, or subtotal directly

  // Checkout POS cart
  const handlePOSCheckout = () => {
    const activeCart = isMultiBilling ? cart : cart; // both are combined or single thanks to our getter override
    if (activeCart.length === 0) return;

    // Option 1: Associate with active console session (disabled in multi-billing)
    if (posAssociateConsoleId && !isMultiBilling) {
      const consoleId = Number(posAssociateConsoleId);
      setConsoles(prev => prev.map(c => {
        if (c.id === consoleId && c.status === "occupée" && c.activeSession) {
          const extraList = [...(c.activeSession.extraSnacksList || [])];
          activeCart.forEach(cartItem => {
            const existing = extraList.find(x => x.product.id === cartItem.product.id);
            if (existing) {
              existing.quantity += cartItem.quantity;
            } else {
              extraList.push({ ...cartItem });
            }
          });

          const nextExtraBill = extraList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
          
          return {
            ...c,
            activeSession: {
              ...c.activeSession,
              extraSnacksList: extraList,
              extraSnacksBill: nextExtraBill
            }
          };
        }
        return c;
      }));

      // Update product stocks
      setProducts(prev => {
        return prev.map(p => {
          const sold = activeCart.find(x => x.product.id === p.id);
          if (sold) {
            return { ...p, stock: Math.max(0, p.stock - sold.quantity) };
          }
          return p;
        });
      });

      // Record stock movements
      const activeConsole = consoles.find(c => c.id === consoleId);
      setStockMovements(prev => {
        const newMovements = activeCart.map((cartItem, idx) => ({
          id: Date.now() + idx,
          date: new Date().toISOString(),
          productId: cartItem.product.id,
          productName: cartItem.product.name,
          type: "sortie",
          quantity: cartItem.quantity,
          reason: `Commande Session Console - ${activeConsole?.name || 'Console'} (${activeConsole?.activeSession?.player || 'Joueur'})`,
          user: role === "admin" ? "Administrateur" : "Gérant"
        }));
        return [...newMovements, ...prev];
      });

      const activeConsoleObj = consoles.find(c => c.id === consoleId);
      addLog(
        "pos_session_bill",
        `Ajout de ${activeCart.length} article(s) à la facture de ${activeConsoleObj?.activeSession?.player || 'Joueur'} sur ${activeConsoleObj?.name} (Total snack: +${formatPrice(cartTotal)})`,
        "snack"
      );

      // Reset cart and settings
      setCart([]);
      setPosCustomer("");
      setPosAssociateConsoleId("");

      alert(`Articles ajoutés avec succès à la console.`);
      return;
    }

    // Option 2: Direct Sale
    // Update snack revenues
    setStats(prev => {
      const newSnackRev = prev.snackRevenue + cartTotal;
      const newCash = prev.cashBalance + cartTotal;
      return {
        ...prev,
        snackRevenue: newSnackRev,
        cashBalance: newCash
      };
    });

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        snackRevenue: prev.snackRevenue + cartTotal,
        paymentEspèces: (prev.paymentEspèces || 0) + cartTotal,
        transactionsCount: (prev.transactionsCount || 0) + 1
      }));
    }

    // Update product stocks
    setProducts(prev => {
      return prev.map(p => {
        const sold = activeCart.find(x => x.product.id === p.id);
        if (sold) {
          return { ...p, stock: Math.max(0, p.stock - sold.quantity) };
        }
        return p;
      });
    });

    // Record stock movements
    const clientRef = posCustomer.trim() || "Client Comptant";
    setStockMovements(prev => {
      const newMovements = activeCart.map((cartItem, idx) => ({
        id: Date.now() + idx,
        date: new Date().toISOString(),
        productId: cartItem.product.id,
        productName: cartItem.product.name,
        type: "sortie",
        quantity: cartItem.quantity,
        reason: `Vente POS direct (${clientRef})`,
        user: role === "admin" ? "Administrateur" : "Gérant"
      }));
      return [...newMovements, ...prev];
    });

    // Update Top Snack items metrics
    setTopProductsState(prev => {
      let updated = [...prev];
      activeCart.forEach(cartItem => {
        const index = updated.findIndex(x => x.name === cartItem.product.name);
        if (index > -1) {
          updated[index] = {
            ...updated[index],
            quantity: updated[index].quantity + cartItem.quantity,
            revenue: updated[index].revenue + (cartItem.product.price * cartItem.quantity)
          };
        } else {
          updated.push({
            name: cartItem.product.name,
            quantity: cartItem.quantity,
            revenue: cartItem.product.price * cartItem.quantity,
            category: cartItem.product.category
          });
        }
      });
      return updated.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
    });

    // Update detailed daily products stats
    setDailyProductsRevenue(prev => {
      return prev.map(item => {
        const sold = activeCart.find(x => x.product.name === item.name);
        if (sold) {
          return {
            ...item,
            quantity: item.quantity + sold.quantity,
            revenue: item.revenue + (sold.product.price * sold.quantity)
          };
        }
        return item;
      });
    });

    addLog(
      "pos_sale", 
      `Vente Snack Bar validée pour ${clientRef}. Total : ${formatPrice(cartTotal)}`, 
      "snack"
    );

    const newCompletedSale = {
      id: `VTE-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Date.now().toString().slice(-6)}`,
      customer: clientRef,
      seller: role === "admin" ? "Administrateur" : "Gérant",
      total: cartTotal,
      paid: cartTotal,
      itemsList: [...activeCart],
      gameCost: 0,
      snackCost: cartTotal,
      date: new Date().toISOString(),
      status: "Terminée",
      paymentMethod: "espèces",
      type: "pos"
    };
    setSales(prev => [newCompletedSale, ...prev]);

    // Save details for showing the invoice popup
    setShowReceiptModal({
      id: `REC-${Date.now().toString().slice(-6)}`,
      customer: clientRef,
      itemsList: [...activeCart],
      gameCost: 0,
      snackCost: cartTotal,
      total: cartTotal,
      date: new Date().toLocaleTimeString(),
      type: isMultiBilling ? "Facture Groupée" : "Vente Directe Snack"
    });

    // Reset Cart or checked tickets
    if (isMultiBilling) {
      setTickets(prev => {
        const remaining = prev.filter(t => !selectedTicketIds.includes(t.id));
        if (remaining.length === 0) {
          return [{ id: "default", name: "Ticket 1", cart: [], posCustomer: "", posAssociateConsoleId: "" }];
        }
        return remaining;
      });
      setSelectedTicketIds(["default"]);
      setActiveTicketId("default");
    } else {
      setCart([]);
      setPosCustomer("");
      setPosAssociateConsoleId("");
    }
  };

  // Traffic Simulator - extremely visual for client demo
  const triggerSimulatedEvent = () => {
    const events = [
      // 1. New player arrives
      () => {
        const freeConsoles = consoles.filter(c => c.status === "libre");
        if (freeConsoles.length === 0) return "Toutes les consoles sont occupées";
        
        const randomConsole = freeConsoles[Math.floor(Math.random() * freeConsoles.length)];
        const firstNames = ["Thomas", "Sarah", "Dylan", "Fouad", "Mélanie", "Rayan", "Clara", "Sofiane", "Karim", "Yassine"];
        const lastNames = ["Dupont", "Martin", "Dubois", "Lefebvre", "Moreau", "Laurent", "Girard", "Zidane", "Belhadj"];
        const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)] + " (Simulé)";
        const randomPhone = "06 " + Math.floor(10000000 + Math.random() * 90000000).toString().replace(/(\d{2})/g, '$1 ').trim();
        const fullName = `${randomFirstName} ${randomLastName}`;

        const durTypes = ["unlimited", "limited"];
        const durType = durTypes[Math.floor(Math.random() * durTypes.length)];
        const durHours = Math.floor(Math.random() * 3) + 1; // 1-3h
        
        setConsoles(prev => prev.map(c => {
          if (c.id === randomConsole.id) {
            return {
              ...c,
              status: "occupée",
              activeSession: {
                player: fullName,
                firstName: randomFirstName,
                lastName: randomLastName,
                phone: randomPhone,
                startTime: new Date().toISOString(),
                durationType: durType,
                durationMinutes: durType === "limited" ? durHours * 60 : 0,
                timeElapsedSeconds: 0,
                totalAmountDue: 0.00,
                extraSnacksBill: 0.00,
                extraSnacksList: []
              }
            };
          }
          return c;
        }));

        addLog(
          "console_start",
          `[SIMULATION] ${fullName} s'installe sur ${randomConsole.name} (${durType === 'unlimited' ? 'Temps libre' : durHours + 'h'})`,
          "console"
        );
        return `Nouveau joueur ${fullName} installé sur ${randomConsole.name}`;
      },
      
      // 2. Player orders snack
      () => {
        const occupiedConsoles = consoles.filter(c => c.status === "occupée");
        if (occupiedConsoles.length === 0) {
          // No occupied console, simulate a direct snack POS sale
          const randProd = products[Math.floor(Math.random() * products.length)];
          const qty = Math.floor(Math.random() * 2) + 1;
          const cost = randProd.price * qty;
          
          setStats(prev => ({
            ...prev,
            snackRevenue: prev.snackRevenue + cost,
            cashBalance: prev.cashBalance + cost
          }));

          setTopProductsState(prev => {
            let updated = [...prev];
            const idx = updated.findIndex(x => x.name === randProd.name);
            if (idx > -1) {
              updated[idx] = { ...updated[idx], quantity: updated[idx].quantity + qty, revenue: updated[idx].revenue + cost };
            } else {
              updated.push({ name: randProd.name, quantity: qty, revenue: cost, category: randProd.category });
            }
            return updated.sort((a, b) => b.revenue - a.revenue).slice(0, 5);
          });

          // Update detailed daily products stats
          setDailyProductsRevenue(prev => {
            return prev.map(item => {
              if (item.name === randProd.name) {
                return {
                  ...item,
                  quantity: item.quantity + qty,
                  revenue: item.revenue + cost
                };
              }
              return item;
            });
          });

          // Update stock and record stock movements in simulation
          setProducts(prev => prev.map(p => p.id === randProd.id ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
          setStockMovements(prev => [
            {
              id: Date.now(),
              date: new Date().toISOString(),
              productId: randProd.id,
              productName: randProd.name,
              type: "sortie",
              quantity: qty,
              reason: "Vente POS direct [SIMULATION]",
              user: "Gérant"
            },
            ...prev
          ]);

          addLog(
            "pos_sale",
            `[SIMULATION] Client Comptant achète ${qty}x ${randProd.name} (${cost.toLocaleString('fr-FR')} FCFA)`,
            "snack"
          );
          return `Snack vendu au comptoir : ${qty}x ${randProd.name}`;
        }

        // Add snack item to a random playing session
        const randomConsole = occupiedConsoles[Math.floor(Math.random() * occupiedConsoles.length)];
        const randProd = products[Math.floor(Math.random() * products.length)];
        const qty = Math.floor(Math.random() * 2) + 1;

        setConsoles(prev => prev.map(c => {
          if (c.id === randomConsole.id) {
            const extraList = [...(c.activeSession.extraSnacksList || [])];
            const existing = extraList.find(x => x.product.id === randProd.id);
            if (existing) {
              existing.quantity += qty;
            } else {
              extraList.push({ product: randProd, quantity: qty });
            }
            const nextBill = extraList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
            return {
              ...c,
              activeSession: {
                ...c.activeSession,
                extraSnacksList: extraList,
                extraSnacksBill: nextBill
              }
            };
          }
          return c;
        }));

        // Update product stock and record movement in simulation
        setProducts(prev => prev.map(p => p.id === randProd.id ? { ...p, stock: Math.max(0, p.stock - qty) } : p));
        setStockMovements(prev => [
          {
            id: Date.now(),
            date: new Date().toISOString(),
            productId: randProd.id,
            productName: randProd.name,
            type: "sortie",
            quantity: qty,
            reason: `Commande Session Console [SIMULATION] - ${randomConsole.name}`,
            user: "Gérant"
          },
          ...prev
        ]);

        addLog(
          "pos_session_bill",
          `[SIMULATION] ${randomConsole.activeSession.player} sur ${randomConsole.name} commande ${qty}x ${randProd.name} (+${(randProd.price * qty).toLocaleString('fr-FR')} FCFA)`,
          "snack"
        );
        return `Snack ajouté à la session de ${randomConsole.activeSession.player}`;
      },

      // 3. Put console in maintenance or release it
      () => {
        if (role !== "admin") return "Le mode Administrateur est requis pour simuler la maintenance";
        const freeConsoles = consoles.filter(c => c.status === "libre");
        const maintConsoles = consoles.filter(c => c.status === "maintenance");
        
        if (maintConsoles.length > 0 && Math.random() > 0.5) {
          // Reactivate one
          const rc = maintConsoles[0];
          setConsoles(prev => prev.map(c => c.id === rc.id ? { ...c, status: "libre" } : c));
          addLog("console_maintenance", `[SIMULATION] Fin de maintenance pour ${rc.name}. Remis en service`, "console");
          return `Console ${rc.name} remise en service`;
        } else if (freeConsoles.length > 0) {
          // Break one
          const rc = freeConsoles[0];
          setConsoles(prev => prev.map(c => c.id === rc.id ? { ...c, status: "maintenance" } : c));
          addLog("console_maintenance", `[SIMULATION] Panne détectée sur ${rc.name}. Mis en maintenance`, "console");
          return `Console ${rc.name} mise en maintenance`;
        }
        return "Pas de console disponible pour simuler un changement de maintenance";
      }
    ];

    const randomEventFn = events[Math.floor(Math.random() * events.length)];
    const feedback = randomEventFn();
    setToastText(feedback);
    
    // Play sound/visual bounce on event simulation
    gsap.fromTo(
      ".sim-btn",
      { scale: 0.9, backgroundColor: "#db2777" },
      { scale: 1, backgroundColor: "#ec4899", duration: 0.4, ease: "bounce.out" }
    );
    
    // Quick notification animation on the dashboard
    gsap.fromTo(
      ".notification-toast",
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
        setTimeout(() => {
          gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
        }, 3000);
      }}
    );
  };

  // Filtered snack products for POS
  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex h-screen w-full bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 h-full glass-panel flex flex-col justify-between border-r border-zinc-800/60 z-20">
        <div className="flex-1 flex flex-col min-h-0">
          {/* Logo Brand */}
          <div className="p-3 flex items-center gap-3 border-b border-zinc-800/40 shrink-0">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-zinc-800 shadow-lg relative group flex-shrink-0">
              <img src={systemSettings.logoUrl || "/logo.jpg"} alt={`${systemSettings.companyName || "HOUSEPUB"} Logo`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base font-black tracking-tight graffiti-tag italic truncate">
                {systemSettings.companyName || "HOUSEPUB"}
              </h1>
              <p className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase truncate">
                {systemSettings.companySubtitle || "PS LOUNGE"}
              </p>
              <p className="text-[8px] text-zinc-500 font-bold italic truncate">
                {systemSettings.companySlogan || '"La Maison du Bonheur"'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto min-h-0">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Tableau de Bord
            </button>

            <button
              onClick={() => setActiveTab("consoles")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "consoles"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Gamepad2 className="w-4 h-4" />
              Gestion Consoles
              {consoles.filter(c => c.status === "occupée").length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {consoles.filter(c => c.status === "occupée").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("snack")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "snack"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <GlassWater className="w-4 h-4" />
                Point de Vente POS
              </div>
              {cart.length > 0 && (
                <span className="cart-badge bg-amber-500 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("stocks")}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "stocks"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                Gestion des Stocks
              </div>
              {products.filter(p => p.stock <= p.minThreshold).length > 0 && (
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[9px] font-bold px-2.5 py-0.5 rounded-full animate-pulse">
                  {products.filter(p => p.stock <= p.minThreshold).length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("expenses")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "expenses"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <TrendingDown className="w-4 h-4 text-rose-500" />
              Gestion Dépenses
            </button>

            <button
              onClick={() => setActiveTab("purchases")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "purchases"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <ShoppingCart className="w-4 h-4 text-emerald-500" />
              Gestion Achats
            </button>

            <button
              onClick={() => setActiveTab("fournisseurs")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "fournisseurs"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Building2 className="w-4 h-4 text-teal-400" />
              Fournisseurs
              <span className="ml-auto bg-teal-900/60 text-teal-400 border border-teal-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                {suppliers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("players")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "players"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <User className="w-4 h-4 text-fuchsia-400" />
              Gestion Joueurs
              <span className="ml-auto bg-fuchsia-900/60 text-fuchsia-400 border border-fuchsia-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                {players.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("dailyReport")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "dailyReport"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              Rapport Journalier
            </button>

            <button
              onClick={() => setActiveTab("comptabilite")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "comptabilite"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Coins className="w-4 h-4 text-emerald-400" />
              Comptabilité & Stock
            </button>

            <button
              onClick={() => setActiveTab("salesHistory")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "salesHistory"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <History className="w-4 h-4 text-pink-400" />
              Historique des Ventes
            </button>

            <button
              onClick={() => setActiveTab("invoices")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "invoices"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              Factures en cours
              <span className="ml-auto bg-indigo-900/60 text-indigo-400 border border-indigo-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                {tickets.length + consoles.filter(c => c.status === "occupée").length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("caisse")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "caisse"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Wallet className="w-4 h-4 text-amber-500" />
              Gestion Caisse
            </button>

            {role === "admin" && (
              <button
                onClick={() => setActiveTab("settings")}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === "settings"
                    ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
                }`}
              >
                <Sliders className="w-4 h-4 text-violet-400" />
                Paramètres Système
              </button>
            )}
          </nav>
        </div>

        {/* Access Rights Switcher (Admin vs Gérant) */}
        <div className="p-4 border-t border-zinc-800/40 bg-zinc-950/50 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Accès Actuel</span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 ${
              role === "admin" ? "bg-purple-950/60 text-purple-300 border border-purple-500/30" : "bg-zinc-900 text-zinc-400"
            }`}>
              <ShieldCheck className="w-3 h-3" />
              {role === "admin" ? "Administrateur" : "Gérant"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-900 rounded-xl">
            <button
              onClick={() => {
                setRole("admin");
                addLog("system_role", "Changement d'accès : Administrateur", "console");
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                role === "admin"
                  ? "bg-zinc-800 text-violet-300 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => {
                setRole("gerant");
                addLog("system_role", "Changement d'accès : Gérant / Manager", "console");
              }}
              className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                role === "gerant"
                  ? "bg-zinc-800 text-amber-300 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Gérant
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col h-full bg-zinc-950 bg-graffiti-wall overflow-hidden relative z-10">
        
        {/* Background Logo Watermark (Filigrane) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden select-none">
          <img 
            src={systemSettings.logoUrl || "/logo.jpg"} 
            alt="Watermark Logo" 
            className="w-[45%] max-w-[550px] aspect-square opacity-[0.03] filter blur-[0.5px] transform rotate-[-8deg] pointer-events-none" 
          />
        </div>

        {/* Background Decorative Gradient Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>

        {/* Ambient Neon Spray Paint / Graffiti Background Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-blue-600/10 blur-[130px] pointer-events-none z-0 animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-[550px] h-[550px] rounded-full bg-rose-600/10 blur-[160px] pointer-events-none z-0 animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/3 w-80 h-80 rounded-full bg-purple-600/5 blur-[110px] pointer-events-none z-0"></div>

        {/* HEADER */}
        <header className="h-20 w-full glass-panel border-b border-zinc-800/60 flex items-center justify-between px-8 relative z-20 graffiti-drip-gradient">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-extrabold tracking-wider text-white uppercase italic flex items-center gap-2">
              <span className="text-blue-500 font-black">⚡</span>
              {activeTab === "dashboard" ? "Tableau de Bord" : activeTab === "consoles" ? "Hub Stations PS" : activeTab === "snack" ? "Snack Bar POS" : activeTab === "stocks" ? "Gestion des Stocks" : activeTab === "expenses" ? "Gestion des Dépenses" : activeTab === "purchases" ? "Gestion des Achats" : activeTab === "fournisseurs" ? "Gestion des Fournisseurs" : activeTab === "settings" ? "Paramètres Système" : activeTab === "invoices" ? "Factures en cours" : activeTab === "players" ? "Gestion Joueurs" : activeTab === "dailyReport" ? "Rapport Journalier" : activeTab === "comptabilite" ? "Comptabilité & Stock" : activeTab === "salesHistory" ? "Historique des Ventes" : "Gestion de Caisse"}
            </h2>
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></div>
            <span className="text-xs text-zinc-400 font-medium hidden md:inline">Caisse connectée</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Date/Time Display */}
            <div className="hidden lg:flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-4 py-2 rounded-xl">
              <Calendar className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-xs font-semibold text-zinc-300">
                {currentDateTime.toLocaleDateString('fr-FR', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
              <div className="w-px h-4 bg-zinc-700"></div>
              <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
              <span className="text-xs font-mono font-bold text-white tabular-nums">
                {currentDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>



            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-zinc-200">Terminal #01</p>
                <p className="text-[10px] text-zinc-500 font-medium">{role === 'admin' ? 'Administrateur' : 'Gérant'}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-zinc-850 border border-zinc-700/50 flex items-center justify-center">
                <User className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
          </div>
        </header>

        {/* VIEW MAIN CONTENT CONTAINER */}
        <div ref={tabContentRef} className="flex-1 overflow-y-auto p-8 relative z-10">
          
          {/* SIMULATION NOTIFICATION TOAST */}
          <div className="notification-toast opacity-0 pointer-events-none fixed top-24 right-8 bg-zinc-900 border border-purple-500/40 text-purple-200 text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 z-50">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{toastText}</span>
          </div>

          <div className="view-container">

            {/* ==================== VUE 1 : DASHBOARD ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 graffiti-spray-blue">
                <div>
                  <span className="sticker-badge bg-blue-600 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block">Tableau de Bord</span>
                </div>

                {/* Notification / Alert Banners */}
                {((systemSettings.alertUnclosedCaisse && caisseStatus === "ouverte") || 
                  (systemSettings.alertConsoleMaintenance && consoles.some(c => c.status === "maintenance"))) && (
                  <div className="space-y-4">
                    {/* Caisse Non Fermée Alert */}
                    {systemSettings.alertUnclosedCaisse && caisseStatus === "ouverte" && (
                      <div className="glass-panel p-4 rounded-xl border border-amber-500/25 bg-amber-500/5 flex items-center justify-between text-xs animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                            <Unlock className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-white uppercase block tracking-wider">Alerte : Session Caisse Active</span>
                            <span className="text-zinc-400">La caisse de shift est actuellement ouverte et n'a pas encore été clôturée.</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab("caisse")} 
                          className="py-1.5 px-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg uppercase tracking-wider text-[10px] active:scale-95 transition-all"
                        >
                          Voir la caisse
                        </button>
                      </div>
                    )}

                    {/* Maintenance Console Alert */}
                    {systemSettings.alertConsoleMaintenance && consoles.some(c => c.status === "maintenance") && (
                      <div className="glass-panel p-4 rounded-xl border border-red-500/25 bg-red-500/5 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 animate-bounce">
                            <Gamepad2 className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <span className="font-extrabold text-white uppercase block tracking-wider">Alerte : Stations en Maintenance</span>
                            <span className="text-zinc-400">
                              {consoles.filter(c => c.status === "maintenance").length} station(s) de jeu hors-service : {" "}
                              <span className="text-zinc-200 font-bold">{consoles.filter(c => c.status === "maintenance").map(c => c.name).join(", ")}</span>
                            </span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveTab("consoles")} 
                          className="py-1.5 px-3 bg-red-500 hover:bg-red-400 text-white font-extrabold rounded-lg uppercase tracking-wider text-[10px] active:scale-95 transition-all"
                        >
                          Gérer les stations
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* 4 Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {/* Players present */}
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-violet-600/5 blur-xl"></div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Joueurs Présents</p>
                      <h3 className="text-4xl font-extrabold text-white tracking-tight">
                        {stats.playersPresent}
                      </h3>
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                        {consoles.filter(c => c.status === "libre").length} postes libres
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-violet-950/80 border border-violet-500/20 flex items-center justify-center">
                      <UserCheck className="w-6 h-6 text-violet-400" />
                    </div>
                  </div>

                  {/* Games revenue today */}
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-cyan-600/5 blur-xl"></div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Revenus Jeux (Jour)</p>
                      <h3 className="text-4xl font-extrabold text-white tracking-tight">
                        {stats.gamesRevenue.toLocaleString('fr-FR')} FCFA
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                        Aujourd'hui
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/20 flex items-center justify-center">
                      <Gamepad2 className="w-6 h-6 text-cyan-400" />
                    </div>
                  </div>

                  {/* Snack revenue today */}
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-600/5 blur-xl"></div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Revenus Snack (Jour)</p>
                      <h3 className="text-4xl font-extrabold text-white tracking-tight">
                        {stats.snackRevenue.toLocaleString('fr-FR')} FCFA
                      </h3>
                      <p className="text-[10px] text-zinc-400 font-semibold flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                        Aujourd'hui
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-950/80 border border-amber-500/20 flex items-center justify-center">
                      <GlassWater className="w-6 h-6 text-amber-400" />
                    </div>
                  </div>

                  {/* Total cash balance */}
                  <div className="glass-panel p-6 rounded-2xl relative overflow-hidden flex items-center justify-between shadow-md border-zinc-800">
                    <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-purple-600/5 blur-xl"></div>
                    <div className="space-y-1 w-full">
                      <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Solde de Caisse Actuel</p>
                      
                      {role === "admin" ? (
                        <>
                          <h3 className="text-4xl font-extrabold text-white tracking-tight">
                            {stats.cashBalance.toLocaleString('fr-FR')} FCFA
                          </h3>
                          <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            Caisse équilibrée
                          </p>
                        </>
                      ) : (
                        <div className="py-2 px-3 bg-zinc-900/80 border border-zinc-800 rounded-xl flex items-center gap-2 mt-1">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          <span className="text-xs text-zinc-400 font-bold select-none">
                            Masqué (Admin Requis)
                          </span>
                        </div>
                      )}
                    </div>
                    {role === "admin" && (
                      <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/20 flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-purple-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Alert Panels: Out of Stock & Low Stock */}
                {(systemSettings.alertOutOfStock || systemSettings.alertLowStock) && (
                  <div className={`grid grid-cols-1 ${systemSettings.alertOutOfStock && systemSettings.alertLowStock ? "lg:grid-cols-2" : ""} gap-6`}>
                    {/* Panel: Rupture de Stock */}
                    {systemSettings.alertOutOfStock && (
                      <div className="glass-panel p-6 rounded-2xl border border-red-900/20 shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-red-950/40 border border-red-500/20 flex items-center justify-center">
                              <AlertCircle className="w-4.5 h-4.5 text-red-400" />
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                              Rupture de Stock
                            </h4>
                          </div>
                          <span className="text-[10px] bg-red-950/60 border border-red-500/30 text-red-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {products.filter(p => p.stock === 0).length} produit(s)
                          </span>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                          {products.filter(p => p.stock === 0).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2.5 bg-zinc-950/60 border border-zinc-900 rounded-xl hover:bg-zinc-900/40 transition-all">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{p.image}</span>
                                <div>
                                  <span className="text-xs font-extrabold text-white block">{p.name}</span>
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">{p.category}</span>
                                </div>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-950/30 border border-red-500/10 px-2 py-0.5 rounded">
                                Rupture
                              </span>
                            </div>
                          ))}

                          {products.filter(p => p.stock === 0).length === 0 && (
                            <div className="py-8 text-center text-zinc-500 text-xs italic flex flex-col items-center justify-center gap-1.5">
                              <span className="text-xl">✅</span>
                              <span>Aucun produit en rupture. Inventaire impeccable !</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Panel: Seuil Bas */}
                    {systemSettings.alertLowStock && (
                      <div className="glass-panel p-6 rounded-2xl border border-amber-900/20 shadow-lg space-y-4">
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/20 flex items-center justify-center">
                              <AlertTriangle className="w-4.5 h-4.5 text-amber-400" />
                            </div>
                            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                              Seuil Bas (Alerte Stock)
                            </h4>
                          </div>
                          <span className="text-[10px] bg-amber-950/60 border border-amber-500/30 text-amber-400 font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                            {products.filter(p => p.stock > 0 && p.stock <= p.minThreshold).length} produit(s)
                          </span>
                        </div>

                        <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                          {products.filter(p => p.stock > 0 && p.stock <= p.minThreshold).map(p => (
                            <div key={p.id} className="flex items-center justify-between p-2.5 bg-zinc-950/60 border border-zinc-900 rounded-xl hover:bg-zinc-900/40 transition-all">
                              <div className="flex items-center gap-2.5">
                                <span className="text-xl">{p.image}</span>
                                <div>
                                  <span className="text-xs font-extrabold text-white block">{p.name}</span>
                                  <span className="text-[9px] text-zinc-500 font-semibold">
                                    Stock actuel : <strong className="text-white font-mono">{p.stock}</strong> &bull; Seuil min : <span className="font-mono">{p.minThreshold}</span>
                                  </span>
                                </div>
                              </div>
                              <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/30 border border-amber-500/10 px-2 py-0.5 rounded">
                                Seuil Bas
                              </span>
                            </div>
                          ))}

                          {products.filter(p => p.stock > 0 && p.stock <= p.minThreshold).length === 0 && (
                            <div className="py-8 text-center text-zinc-500 text-xs italic flex flex-col items-center justify-center gap-1.5">
                              <span className="text-xl">👍</span>
                              <span>Aucun produit sous le seuil d'alerte.</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dashboard Charts & Top Performers */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  
                  {/* Top 5 Rentable Consoles */}
                  <div className="glass-panel p-6 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Gamepad2 className="w-4.5 h-4.5 text-violet-400" />
                        Top 5 Consoles Rentables (Historique)
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-semibold">Trier par chiffre d'affaires</span>
                    </div>

                    <div className="space-y-4">
                      {topConsolesState.map((c, index) => {
                        const maxVal = topConsolesState[0]?.revenue || 1;
                        const percentage = (c.revenue / maxVal) * 100;
                        return (
                          <div key={index} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-zinc-300 flex items-center gap-1.5">
                                <span className="text-zinc-500 text-[10px] font-bold">#{index+1}</span>
                                {c.name}
                              </span>
                              <div className="space-x-2 text-zinc-400">
                                <span>{c.sessions} session{c.sessions > 1 ? 's' : ''}</span>
                                <span className="font-bold text-violet-300">{c.revenue.toLocaleString('fr-FR')} FCFA</span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top 5 Snack Products */}
                  <div className="glass-panel p-6 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <GlassWater className="w-4.5 h-4.5 text-amber-400" />
                        Top 5 Produits Snack Vendus
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-semibold">Trier par chiffre d'affaires</span>
                    </div>

                    <div className="space-y-4">
                      {topProductsState.map((p, index) => {
                        const maxVal = topProductsState[0]?.revenue || 1;
                        const percentage = (p.revenue / maxVal) * 100;
                        return (
                          <div key={index} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold">
                              <span className="text-zinc-300 flex items-center gap-1.5">
                                <span className="text-zinc-500 text-[10px] font-bold">#{index+1}</span>
                                {p.name}
                              </span>
                              <div className="space-x-2 text-zinc-400">
                                <span>{p.quantity} vendus</span>
                                <span className="font-bold text-amber-300">{p.revenue.toLocaleString('fr-FR')} FCFA</span>
                              </div>
                            </div>
                            <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-amber-600 to-orange-500 rounded-full transition-all duration-1000"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Live Activity Feed */}
                <div className="glass-panel p-6 rounded-2xl shadow-md space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Clock className="w-4.5 h-4.5 text-pink-400" />
                      Journal d'activité en direct
                    </h4>
                    <span className="text-[10px] text-zinc-500 font-semibold">Horodaté automatiquement</span>
                  </div>

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
                    {activityLog.map((log) => (
                      <div key={log.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/40 text-xs stagger-card">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <span className={`w-2 h-2 shrink-0 rounded-full ${
                            log.category === "console" ? "bg-violet-500" : "bg-amber-500"
                          }`}></span>
                          <span className="text-zinc-300 font-medium truncate">{log.message}</span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {log.date && <span className="text-zinc-600 text-[10px] font-medium hidden xl:inline">{log.date}</span>}
                          <span className="text-zinc-400 text-[11px] font-mono font-bold">{log.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* ===== BILAN JOURNALIER ===== */}
                <div className="glass-panel p-6 rounded-2xl shadow-md space-y-5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <BarChart3 className="w-4.5 h-4.5 text-emerald-400" />
                      Bilan Journalier —
                      <span className="text-emerald-400 font-mono normal-case text-sm">
                        {currentDateTime.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </h4>
                    {role === "admin" && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setShowDetailedReport(!showDetailedReport)}
                          className={`flex items-center gap-2 border text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95 ${
                            showDetailedReport 
                              ? "bg-cyan-600/20 hover:bg-cyan-600/30 border-cyan-500/30 text-cyan-300"
                              : "bg-zinc-800/40 hover:bg-zinc-800/60 border-zinc-700/30 text-zinc-300"
                          }`}
                        >
                          {showDetailedReport ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              Masquer les Détails
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              Voir les Détails
                            </>
                          )}
                        </button>
                        <button
                          onClick={exportDailyReportPDF}
                          className="flex items-center gap-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-violet-300 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          Exporter le Rapport PDF
                        </button>
                        <button
                          onClick={() => {
                            setShowZReportModal(true);
                            gsap.fromTo(".zreport-modal", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" });
                          }}
                          className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 text-emerald-300 text-xs font-bold px-4 py-2 rounded-xl transition-all active:scale-95"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Clôture de Caisse (Z)
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: "Revenus Jeux", value: formatPrice(stats.gamesRevenue), color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "🎮" },
                      { label: "Revenus Snack", value: formatPrice(stats.snackRevenue), color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "🥤" },
                      { label: "Total du Jour", value: formatPrice(stats.gamesRevenue + stats.snackRevenue), color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "💰" },
                      { label: "Solde Caisse", value: role === "admin" ? formatPrice(stats.cashBalance) : "Admin requis", color: role === "admin" ? "text-emerald-400" : "text-zinc-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "🏦" }
                    ].map((item, i) => (
                      <div key={i} className={`${item.bg} border ${item.border} rounded-xl p-4 flex flex-col gap-1.5`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{item.label}</span>
                          <span className="text-lg">{item.icon}</span>
                        </div>
                        <span className={`text-lg font-extrabold font-mono ${item.color}`}>{item.value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Breakdown bars */}
                  <div className="space-y-3">
                    <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Répartition des Recettes</p>
                    {[
                      { label: "Jeux Vidéo", value: stats.gamesRevenue, total: stats.gamesRevenue + stats.snackRevenue, color: "from-violet-600 to-cyan-500" },
                      { label: "Snack Bar", value: stats.snackRevenue, total: stats.gamesRevenue + stats.snackRevenue, color: "from-amber-500 to-orange-500" }
                    ].map((bar, i) => {
                      const pct = bar.total > 0 ? (bar.value / bar.total) * 100 : 0;
                      return (
                        <div key={i} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-zinc-400">{bar.label}</span>
                            <span className="text-white font-mono">{Math.round(bar.value).toLocaleString('fr-FR')} FCFA <span className="text-zinc-500">({pct.toFixed(1)}%)</span></span>
                          </div>
                          <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${bar.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Toggleable Detailed Report Activities */}
                  {role === "admin" && showDetailedReport && (
                    <div className="border-t border-zinc-800/80 pt-4 mt-2 space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        
                        {/* Consoles detailed stats */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="text-sm">🎮</span>
                            Détail des Consoles
                          </h5>
                          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/30 max-h-[300px] overflow-y-auto pr-1">
                            {dailyConsolesRevenue.map((c, i) => {
                              const pct = stats.gamesRevenue > 0 ? (c.revenue / stats.gamesRevenue) * 100 : 0;
                              return (
                                <div key={i} className="p-3 flex flex-col gap-1.5 hover:bg-zinc-900/20 transition-colors">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <span className="text-xs font-bold text-white block">{c.name}</span>
                                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide">{c.type}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-xs font-bold font-mono text-cyan-400 block">
                                        {c.revenue.toLocaleString('fr-FR')} FCFA
                                      </span>
                                      <span className="text-[9px] text-zinc-400 block">
                                        {c.sessions} session{c.sessions > 1 ? 's' : ''}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full" 
                                      style={{ width: `${pct}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Snack products detailed stats */}
                        <div className="space-y-3">
                          <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                            <span className="text-sm">🥤</span>
                            Détail des Ventes Snack
                          </h5>
                          <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-xl divide-y divide-zinc-800/30 max-h-[300px] overflow-y-auto pr-1">
                            {dailyProductsRevenue.filter(p => p.quantity > 0).length > 0 ? (
                              dailyProductsRevenue.filter(p => p.quantity > 0).map((p, i) => {
                                const pct = stats.snackRevenue > 0 ? (p.revenue / stats.snackRevenue) * 100 : 0;
                                return (
                                  <div key={i} className="p-3 flex flex-col gap-1.5 hover:bg-zinc-900/20 transition-colors">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <span className="text-xs font-bold text-white block">{p.name}</span>
                                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide">{p.category}</span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-xs font-bold font-mono text-amber-400 block">
                                          {p.revenue.toLocaleString('fr-FR')} FCFA
                                        </span>
                                        <span className="text-[9px] text-zinc-400 block">
                                          Quantité : {p.quantity}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                                      <div 
                                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 rounded-full" 
                                        style={{ width: `${pct}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <div className="p-8 text-center text-xs text-zinc-500 italic bg-zinc-950/20 rounded-xl border border-zinc-800/30">
                                Aucune vente de snack-bar aujourd'hui.
                              </div>
                            )}
                          </div>
                        </div>

                      </div>
                    </div>
                  )}

                  <div className="h-px bg-zinc-800 my-4"></div>

                  {/* Sessions summary */}
                  <div className="flex flex-wrap gap-4 pt-2 border-t border-zinc-800">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                      <span className="text-zinc-400">Sessions jeu : </span>
                      <span className="font-bold text-white">{dailySessionsCount + consoles.filter(c => c.status === 'occupée').length} session(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      <span className="text-zinc-400">Ventes snack : </span>
                      <span className="font-bold text-white">{dailySalesCount} transaction(s)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span className="text-zinc-400">Postes actifs : </span>
                      <span className="font-bold text-white">{consoles.filter(c => c.status === 'occupée').length} / {consoles.length}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs ml-auto">
                      <span className="text-zinc-500 font-medium">Dernière mise à jour :</span>
                      <span className="font-mono font-bold text-emerald-400">
                        {currentDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ==================== VUE 2 : GESTION DES CONSOLES ==================== */}
            {activeTab === "consoles" && (
              <div className="space-y-6 graffiti-spray-red">
                <div>
                  <span className="sticker-badge-red bg-rose-600 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block">Live Stations PS</span>
                </div>

                {caisseStatus === "fermée" ? (
                  renderCaisseFermeeLock("Gestion des Consoles")
                ) : (
                  <>

                {/* Console Grid – grouped by Zone */}
                {zones.map(zone => {
                  const zoneConsoles = consoles.filter(c => c.zone === zone);
                  if (zoneConsoles.length === 0) return null;

                  const zoneColors = {
                    A: { border: "border-sky-500/30", text: "text-sky-400", bg: "bg-sky-950/30", dot: "bg-sky-400" },
                    B: { border: "border-violet-500/30", text: "text-violet-400", bg: "bg-violet-950/30", dot: "bg-violet-400" },
                    C: { border: "border-rose-500/30", text: "text-rose-400", bg: "bg-rose-950/30", dot: "bg-rose-400" }
                  }[zone] || { border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-950/30", dot: "bg-emerald-400" };

                  return (
                    <div key={zone} className="space-y-3">
                      {/* Zone separator */}
                      <div className={`flex items-center gap-3 px-1`}>
                        <div className={`w-2 h-2 rounded-full ${zoneColors.dot} shadow-lg animate-pulse`} />
                        <span className={`text-[11px] font-black uppercase tracking-[0.2em] ${zoneColors.text}`}>
                          Zone {zone}
                        </span>
                        <div className={`flex-1 h-px ${zoneColors.bg} border-t ${zoneColors.border}`} />
                        <span className="text-[9px] text-zinc-600 font-semibold">{zoneConsoles.length} poste{zoneConsoles.length > 1 ? 's' : ''}</span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {zoneConsoles.map((c) => {
                    const isOccupied = c.status === "occupée";
                    const isMaintenance = c.status === "maintenance";
                    const isLibre = c.status === "libre";

                    const remainingSeconds = isOccupied && c.activeSession?.durationType === "limited"
                      ? Math.max(0, (c.activeSession.durationMinutes * 60) - c.activeSession.timeElapsedSeconds)
                      : 0;
                    
                    let bgStatusClass = "glow-active-green";
                    let cardBorderClass = "border-emerald-500/20";
                    let statusLabel = "Disponible";
                    let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";

                    if (isOccupied) {
                      bgStatusClass = "glow-active-red";
                      cardBorderClass = "border-rose-500/20";
                      statusLabel = "En cours";
                      badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/30";
                    } else if (isMaintenance) {
                      bgStatusClass = "glow-active-orange";
                      cardBorderClass = "border-orange-500/20";
                      statusLabel = "Maintenance";
                      badgeColor = "bg-orange-500/10 text-orange-400 border-orange-500/30";
                    }

                    // Club logo data
                    const club = clubLogos[c.name];
                    const clubColor = club?.color || "#6CABDD";

                    return (
                      <div 
                        key={c.id} 
                        className={`glass-panel rounded-2xl border p-5 relative overflow-hidden transition-all duration-300 stagger-card flex flex-col justify-between min-h-[280px] ${cardBorderClass} ${
                          isLibre ? "hover:border-emerald-500/40" : isOccupied ? "hover:border-rose-500/40" : ""
                        }`}
                        style={{ boxShadow: isOccupied ? `0 0 0 1px ${clubColor}22` : undefined }}
                      >
                        {/* Club color top accent stripe */}
                        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl" style={{ background: `linear-gradient(90deg, ${clubColor}99, transparent)` }} />

                        {/* Top Meta info */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">
                              {c.type}
                            </span>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border ${badgeColor}`}>
                              {statusLabel}
                            </span>
                          </div>

                          {/* Stadium name + club logo / custom image */}
                          <div className="flex items-center gap-3 mt-3">
                            {(c.image || club?.logo) && (
                              <div className="w-11 h-11 rounded-xl flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-1 shadow-md">
                                <img
                                  src={c.image || club.logo}
                                  alt={c.name}
                                  className="w-9 h-9 object-contain rounded-lg"
                                  onError={(e) => { e.target.style.display='none'; }}
                                />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <h4 className="text-[13px] font-black text-white leading-tight uppercase tracking-wide truncate" title={c.name}>{c.name}</h4>
                              {club && <p className="text-[10px] font-semibold mt-0.5" style={{ color: `${clubColor}cc` }}>{club.club}</p>}
                            </div>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-medium mt-1">Tarif : {c.ratePerHour.toLocaleString('fr-FR')} FCFA/heure</p>
                        </div>

                        {/* Middle detailed state */}
                        <div className="my-4 py-2 border-t border-b border-zinc-900/60 flex-1 flex flex-col justify-center">
                          {isOccupied && c.activeSession ? (
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 font-medium">Joueur :</span>
                                <span className="text-zinc-200 font-bold max-w-[120px] truncate" title={c.activeSession.player}>{c.activeSession.player}</span>
                              </div>
                              {c.activeSession.phone && (
                                <div className="flex items-center justify-between text-xs">
                                  <span className="text-zinc-500 font-medium">Téléphone :</span>
                                  <span className="text-zinc-300 font-mono font-medium">{c.activeSession.phone}</span>
                                </div>
                              )}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 font-medium">Type session :</span>
                                <span className="text-zinc-300 font-semibold">
                                  {c.activeSession.durationType === "limited" 
                                    ? `Forfait (${Math.round(c.activeSession.durationMinutes / 60)}h)`
                                    : "Temps Libre"}
                                </span>
                              </div>
                              
                              {/* Real-time Ticking Timer */}
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 font-medium">
                                  {c.activeSession.durationType === "limited" ? "Temps restant :" : "Temps écoulé :"}
                                </span>
                                <span className={`font-bold font-mono ${
                                  c.activeSession.durationType === "limited"
                                    ? (remainingSeconds === 0 ? "text-rose-500 animate-pulse text-[11px]" : "text-emerald-400")
                                    : "text-cyan-400"
                                }`}>
                                  {c.activeSession.durationType === "limited"
                                    ? (remainingSeconds === 0 ? "Temps écoulé !" : formatTime(remainingSeconds))
                                    : formatTime(c.activeSession.timeElapsedSeconds)}
                                </span>
                              </div>

                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 font-medium">Déjà payé :</span>
                                <span className="text-emerald-400 font-bold font-mono">
                                  {(c.activeSession.prepaidAmount || 0).toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-zinc-500 font-medium">Solde jeu dû :</span>
                                <span className="text-rose-400 font-bold font-mono">
                                  {c.activeSession.totalAmountDue.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                              
                              {/* Extra snacks cost preview if any */}
                              {c.activeSession.extraSnacksBill > 0 && (
                                <div className="flex items-center justify-between text-[11px]">
                                  <span className="text-zinc-500 font-medium">Consos (Snack) :</span>
                                  <span className="text-amber-400 font-semibold font-mono">+{c.activeSession.extraSnacksBill.toLocaleString('fr-FR')} FCFA</span>
                                </div>
                              )}
                            </div>
                          ) : isMaintenance ? (
                            <div className="flex items-center justify-center gap-2 text-zinc-500">
                              <AlertTriangle className="w-5 h-5 text-orange-500/50" />
                              <span className="text-xs font-semibold italic">Hors-service</span>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center text-zinc-600">
                              <span className="text-xs font-bold uppercase tracking-wider">Prêt à Démarrer</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions */}
                        <div className="flex items-center justify-between gap-2 mt-auto w-full">
                          
                          {/* Maintenance toggle for Admin on free/maint consoles */}
                          {role === "admin" && !isOccupied && (
                            <button
                              onClick={() => handleToggleMaintenance(c.id)}
                              className={`p-2 rounded-lg text-zinc-500 hover:text-zinc-300 border transition-all ${
                                isMaintenance 
                                  ? "bg-orange-950/20 border-orange-500/30 text-orange-400 hover:bg-orange-950/40"
                                  : "bg-zinc-900 border-zinc-800 hover:bg-zinc-800"
                              }`}
                              title={isMaintenance ? "Remettre en service" : "Mettre en maintenance"}
                            >
                              <Settings className="w-4 h-4" />
                            </button>
                          )}

                          {isLibre && (
                            <button
                              onClick={() => setShowStartModal(c)}
                              className="flex-1 py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-950/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              Démarrer Session
                            </button>
                          )}

                          {isOccupied && (
                            <div className="flex flex-col gap-2 w-full">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setShowAddSnackToConsoleModal(c)}
                                  className="flex-1 py-1.5 px-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                                  title="Ajouter des boissons/snacks à cette session"
                                >
                                  <Plus className="w-3.5 h-3.5 text-violet-400" />
                                  Snack
                                </button>
                                <button
                                  onClick={() => setShowInterruptModal(c)}
                                  className="flex-1 py-1.5 px-2.5 bg-zinc-900 border border-zinc-800 hover:bg-orange-950/40 hover:border-orange-500/30 text-zinc-300 hover:text-orange-400 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-1"
                                  title="Interrompre ou annuler cette session"
                                >
                                  <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                                  Arrêter la session
                                </button>
                              </div>
                              <button
                                onClick={() => handleCloseSessionRequest(c)}
                                className="w-full py-2 px-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-950/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Clôturer & Régler
                              </button>
                            </div>
                          )}

                          {isMaintenance && !isOccupied && role !== "admin" && (
                            <div className="w-full text-center text-xs text-zinc-600 font-semibold py-2">
                              Maintenance en cours
                            </div>
                          )}
                        </div>

                        {/* ─── Console Statistics Strip ─── */}
                        <div className="absolute bottom-0 left-0 right-0 border-t border-zinc-900/60 px-5 py-2 flex items-center justify-between gap-2 bg-black/10">
                          <div className="flex items-center gap-1 text-[9px] text-zinc-500">
                            <Activity className="w-3 h-3 text-emerald-500/70" />
                            <span className="font-bold text-zinc-400">{c.totalSessions || 0}</span>
                            <span>session{(c.totalSessions || 0) !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-zinc-500">
                            <Trophy className="w-3 h-3 text-amber-500/70" />
                            <span className="font-bold text-amber-400 font-mono">{((c.totalRevenue || 0) / 1000).toFixed(0)}k</span>
                            <span>FCFA</span>
                          </div>
                          <div className="flex items-center gap-1 text-[9px] text-zinc-500">
                            <Timer className="w-3 h-3 text-cyan-500/70" />
                            <span className="font-bold text-cyan-400 font-mono">
                              {Math.floor((c.totalTimeSeconds || 0) / 3600)}h{Math.floor(((c.totalTimeSeconds || 0) % 3600) / 60).toString().padStart(2, '0')}
                            </span>
                          </div>
                        </div>

                        {/* Status Ambient Glow */}
                        <div className={`absolute top-0 right-0 w-12 h-1.5 rounded-bl-lg ${bgStatusClass}`}></div>
                      </div>
                    );
                  })}
                      </div>
                    </div>
                  );
                })}

                  </>
                )}
              </div>
            )}


            {/* ==================== VUE 3 : POINT DE VENTE (POS) ==================== */}
            {activeTab === "snack" && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start graffiti-spray-blue">
                <div className="xl:col-span-12">
                  <span className="sticker-badge bg-zinc-900 text-amber-400 font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block">Comptoir POS Bar</span>
                </div>

                {caisseStatus === "fermée" ? (
                  <div className="xl:col-span-12">
                    {renderCaisseFermeeLock("Point de Vente POS")}
                  </div>
                ) : (
                  <>
                  
                  {/* Tickets/Commandes Selector Strip */}
                  <div className="xl:col-span-12 space-y-4 mb-2">
                    <div className="flex flex-wrap items-center gap-2 p-3 bg-zinc-950/40 rounded-2xl border border-zinc-900 shadow-inner">
                      <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-2">Commandes actives :</div>
                      
                      {tickets.map(ticket => {
                        const isActive = ticket.id === activeTicketId;
                        return (
                          <div 
                            key={ticket.id}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                              isActive 
                                ? "bg-gradient-to-r from-amber-600 to-yellow-600 text-black border-amber-400 shadow-md scale-[1.02]" 
                                : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800"
                            }`}
                          >
                            <input 
                              type="checkbox"
                              checked={selectedTicketIds.includes(ticket.id)}
                              onChange={() => handleToggleTicketSelection(ticket.id)}
                              className={`w-3 h-3 rounded bg-zinc-950/60 border-zinc-800 focus:ring-0 cursor-pointer ${isActive ? "text-black accent-black" : "text-violet-500 accent-violet-600"}`}
                              onClick={(e) => e.stopPropagation()}
                              title="Sélectionner pour facture groupée"
                            />
                            <button 
                              type="button"
                              onClick={() => {
                                setActiveTicketId(ticket.id);
                                setSelectedTicketIds([ticket.id]);
                              }}
                              className="text-left select-none focus:outline-none flex items-center gap-1.5"
                            >
                              <span>{ticket.name}</span>
                              {ticket.cart.length > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] ${isActive ? "bg-black text-amber-500" : "bg-zinc-800 text-zinc-400"}`}>
                                  {ticket.cart.reduce((sum, it) => sum + it.quantity, 0)}
                                </span>
                              )}
                            </button>
                            
                            {/* Rename button */}
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newName = prompt("Modifier le nom de la commande :", ticket.name);
                                if (newName) handleRenameTicket(ticket.id, newName);
                              }}
                              className={`p-0.5 rounded hover:bg-black/10 transition-colors ${isActive ? "text-black/60 hover:text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                              title="Renommer"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>

                            {/* Close/Delete button */}
                            <button 
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (ticket.cart.length === 0 || confirm("Supprimer cette commande et vider son panier ?")) {
                                  handleDeleteTicket(ticket.id);
                                }
                              }}
                              className={`p-0.5 rounded hover:bg-black/10 transition-colors ${isActive ? "text-black/60 hover:text-black" : "text-zinc-500 hover:text-zinc-300"}`}
                              title="Fermer"
                            >
                              ✖
                            </button>
                          </div>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => handleCreateTicket()}
                        className="py-1.5 px-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold border border-dashed border-zinc-700 hover:border-zinc-500 transition-all flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Nouvelle commande</span>
                      </button>
                    </div>
                  </div>
                  
                  {/* Left: Product List (8 columns) */}
                  <div className="xl:col-span-8 space-y-6">
                  
                  {/* Category Filter Capsules & Search */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800/80">
                    
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      {[
                        { id: "all", label: "Tous", emoji: "🍽️" },
                        ...productCategories
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`py-2 px-4 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                            selectedCategory === cat.id
                              ? "bg-violet-600 text-white shadow-md shadow-violet-900/20"
                              : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-850"
                          }`}
                        >
                          <span>{cat.emoji}</span>
                          <span>{cat.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Search bar */}
                    <div className="relative w-full md:w-64">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Rechercher un produit..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 transition-all"
                      />
                    </div>
                  </div>

                  {/* Grid of Clickable Products */}
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filteredProducts.map(p => (
                      <button
                        key={p.id}
                        onClick={() => handleAddToCart(p)}
                        className="glass-panel p-4 rounded-2xl flex flex-col justify-between items-start text-left hover:border-violet-500/40 hover:bg-zinc-900/40 active:scale-[0.98] transition-all stagger-card group h-[140px] relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start w-full">
                          <span className="text-3xl filter drop-shadow">{p.image}</span>
                          <span className="text-[10px] bg-zinc-900 text-zinc-500 px-2 py-0.5 rounded-full font-bold group-hover:bg-violet-950 group-hover:text-violet-300 transition-colors">
                            {p.category.toUpperCase()}
                          </span>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-xs font-bold text-zinc-200 line-clamp-1 group-hover:text-white transition-colors">{p.name}</h4>
                          <div className="flex justify-between items-center w-full mt-2">
                            <span className="text-sm font-extrabold text-white">{p.price.toLocaleString('fr-FR')} FCFA</span>
                            <span className="text-[9px] text-zinc-500 font-semibold">Stock: {p.stock}</span>
                          </div>
                        </div>

                        {/* Interactive Plus indicator */}
                        <div className="absolute right-3 bottom-3 w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-violet-600 group-hover:border-violet-500 text-zinc-400 group-hover:text-white transition-all">
                          <Plus className="w-3.5 h-3.5" />
                        </div>
                      </button>
                    ))}

                    {filteredProducts.length === 0 && (
                      <div className="col-span-full py-12 text-center text-zinc-500 text-xs italic">
                        Aucun produit ne correspond aux filtres actuels.
                      </div>
                    )}
                  </div>

                </div>

                {/* Right: Ticket Summary POS (4 columns) */}
                <div className="xl:col-span-4 glass-panel rounded-2xl border border-zinc-800 flex flex-col h-[650px] sticky top-8 shadow-xl">
                  
                  {/* Ticket Header */}
                  <div className="p-5 border-b border-zinc-850 flex items-center justify-between bg-zinc-900/30 rounded-t-2xl">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-5 h-5 text-violet-400" />
                      <h4 className="text-sm font-bold text-white tracking-wide uppercase">Ticket de Caisse</h4>
                    </div>
                    {cart.length > 0 && (
                      <button 
                        onClick={() => setCart([])}
                        className="text-[10px] text-zinc-500 hover:text-rose-400 font-bold uppercase transition-all"
                      >
                        Vider
                      </button>
                    )}
                  </div>

                  {/* Customer Reference Input */}
                  <div className="p-4 border-b border-zinc-850 bg-zinc-900/20 space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nom / Référence Client</label>
                      <input 
                        type="text"
                        placeholder="Ex: Table 4, Sofiane..."
                        value={posCustomer}
                        onChange={(e) => setPosCustomer(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs font-semibold text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Associer à une Console Active</label>
                      <select
                        value={posAssociateConsoleId}
                        onChange={(e) => setPosAssociateConsoleId(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                      >
                        <option value="">-- Vente Directe Comptoir --</option>
                        {consoles.filter(c => c.status === "occupée").map(c => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.activeSession?.player})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isMultiBilling && (
                      <div className="p-3 bg-violet-950/40 border border-violet-500/20 text-violet-300 rounded-xl text-[10px] font-semibold leading-relaxed flex items-start gap-2 animate-fade-in">
                        <span className="text-xs">⚠️</span>
                        <div>
                          <p className="font-bold text-white mb-0.5">Mode Facture Cumulative</p>
                          <p>Vous facturez {selectedTicketIds.length} tickets ensemble. Pour modifier les articles ou associer à une console, décochez les autres tickets.</p>
                        </div>
                      </div>
                    )}

                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-850/60 rounded-xl text-xs">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">{item.product.image}</span>
                            <span className="font-bold text-white truncate block">{item.product.name}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">{formatPrice(item.product.price)} / u</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Qty counter */}
                          <div className="flex items-center gap-1 bg-zinc-950 rounded-lg p-0.5 border border-zinc-850">
                            <button 
                              onClick={() => handleUpdateCartQty(item.product.id, -1)}
                              disabled={isMultiBilling}
                              className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white transition-all disabled:opacity-40 disabled:hover:text-zinc-400"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-[11px] font-extrabold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateCartQty(item.product.id, 1)}
                              disabled={isMultiBilling}
                              className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white transition-all disabled:opacity-40 disabled:hover:text-zinc-400"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete */}
                          <button 
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            disabled={isMultiBilling}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-all disabled:opacity-40 disabled:hover:text-zinc-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {cart.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-center text-zinc-600 py-12">
                        <ShoppingBag className="w-12 h-12 mb-2 opacity-20" />
                        <span className="text-xs font-semibold">Le panier est vide</span>
                        <span className="text-[10px] mt-1">Cliquez sur les produits à gauche pour les ajouter.</span>
                      </div>
                    )}
                  </div>

                  {/* Ticket Footer (Taxes & Totals) */}
                  <div className="p-5 border-t border-zinc-850 bg-zinc-900/30 rounded-b-2xl space-y-4">
                    <div className="space-y-1.5 text-xs text-zinc-400">
                      <div className="flex justify-between text-base font-extrabold text-white">
                        <span>Montant Total</span>
                        <span className="text-violet-400">{formatPrice(cartTotal)}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (posAssociateConsoleId) {
                          handlePOSCheckout();
                        } else {
                          setPaymentMethodSelected("espèces");
                          setPaymentCashAmount(cartTotal);
                          setPaymentMobileAmount("");
                          setShowPaymentModal({
                            type: "pos",
                            id: isMultiBilling ? `group-${Date.now()}` : activeTicket.id,
                            name: isMultiBilling ? `Facture Groupée (${selectedTickets.map(t => t.name).join(", ")})` : activeTicket.name,
                            customer: posCustomer || "Client Comptant",
                            gameCost: 0,
                            snackCost: cartTotal,
                            total: cartTotal,
                            itemsList: [...cart]
                          });
                        }
                      }}
                      disabled={cart.length === 0}
                      className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold shadow-lg shadow-violet-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4.5 h-4.5" />
                      {isMultiBilling ? `Encaisser la Facture Totale (${selectedTicketIds.length} tickets)` : posAssociateConsoleId ? "Associer la facture à la Console" : "Encaisser & Imprimer"}
                    </button>
                  </div>

                </div>

                  </>
                )}
              </div>
            )}


            {/* ==================== VUE 4 : GESTION DES STOCKS ==================== */}
            {activeTab === "stocks" && (
              <div className="space-y-6 graffiti-spray-blue">
                <div>
                  <span className="sticker-badge-blue bg-blue-700 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block">Suivi Inventaire Stock</span>
                </div>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Total des articles</span>
                    <span className="text-xl font-extrabold text-white">{products.length} produits</span>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Valeur Stock (Prix d'Achat)</span>
                    <span className="text-xl font-extrabold text-cyan-400 font-mono">
                      {products.reduce((acc, p) => acc + ((p.purchasePrice || 0) * p.stock), 0).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Valeur Stock (Prix de Vente)</span>
                    <span className="text-xl font-extrabold text-emerald-400 font-mono">
                      {products.reduce((acc, p) => acc + (p.price * p.stock), 0).toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>
                  <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-amber-500/5 blur-xl"></div>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Alertes Stock Faible</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xl font-extrabold ${products.filter(p => p.stock <= p.minThreshold).length > 0 ? "text-amber-400 font-bold animate-pulse" : "text-zinc-400"}`}>
                        {products.filter(p => p.stock <= p.minThreshold).length} produit(s)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub-tab selection and actions */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-900 p-4 rounded-2xl border border-zinc-800/80">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setStockSubTab("inventory")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                        stockSubTab === "inventory"
                          ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                          : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                      }`}
                    >
                      <Package className="w-3.5 h-3.5" />
                      Inventaire Complet
                    </button>
                    <button
                      onClick={() => setStockSubTab("movements")}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 active:scale-95 ${
                        stockSubTab === "movements"
                          ? "bg-violet-600/20 text-violet-300 border border-violet-500/30"
                          : "bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800/80"
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      Historique des Mouvements
                    </button>
                  </div>

                  {/* Actions for active sub tab */}
                  {stockSubTab === "inventory" && (
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                      <div className="relative w-full sm:w-48">
                        <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-zinc-500" />
                        <input
                          type="text"
                          placeholder="Rechercher..."
                          value={stockSearchQuery}
                          onChange={(e) => setStockSearchQuery(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                        />
                      </div>
                      <select
                        value={stockCategoryFilter}
                        onChange={(e) => setStockCategoryFilter(e.target.value)}
                        className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-violet-500"
                      >
                        <option value="all">Toutes catégories</option>
                        {productCategories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                      </select>
                      {role === "admin" && (
                        <button
                          onClick={openAddProductModal}
                          className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Ajouter un Produit
                        </button>
                      )}
                    </div>
                  )}

                  {stockSubTab === "movements" && (
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                      <select
                        value={stockMovementTypeFilter}
                        onChange={(e) => setStockMovementTypeFilter(e.target.value)}
                        className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-violet-500"
                      >
                        <option value="all">Tous les types</option>
                        <option value="entrée">Entrée (Stock +)</option>
                        <option value="sortie">Sortie (Vente)</option>
                        <option value="casse">Casse / Perte accidentelle</option>
                        <option value="perte">Perte / Écart d'inventaire</option>
                        <option value="consommation">Consommation interne</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Sub Tab Views */}
                {stockSubTab === "inventory" ? (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-zinc-950/40">
                            <th className="p-4">Produit</th>
                            <th className="p-4">Catégorie</th>
                            <th className="p-4 text-right">Prix Achat</th>
                            <th className="p-4 text-right">Prix Vente</th>
                            <th className="p-4 text-right">Marge (Marge %)</th>
                            <th className="p-4 text-center">Niveau de Stock</th>
                            <th className="p-4 text-center">Seuil Min</th>
                            <th className="p-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50 text-xs text-zinc-300">
                          {products
                            .filter(p => {
                              const matchesSearch = p.name.toLowerCase().includes(stockSearchQuery.toLowerCase());
                              const matchesCat = stockCategoryFilter === "all" || p.category === stockCategoryFilter;
                              return matchesSearch && matchesCat;
                            })
                            .map((p) => {
                              const purchase = p.purchasePrice || 0;
                              const margin = p.price - purchase;
                              const marginPct = p.price > 0 ? (margin / p.price) * 100 : 0;
                              const isLow = p.stock <= p.minThreshold;
                              const isOutOfStock = p.stock === 0;

                              return (
                                <tr key={p.id} className="hover:bg-zinc-850/40 transition-colors">
                                  <td className="p-4 flex items-center gap-3">
                                    <span className="text-xl w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800/80 flex items-center justify-center">{p.image}</span>
                                    <div>
                                      <span className="font-bold text-white block">{p.name}</span>
                                      <span className="text-[10px] text-zinc-500 font-semibold uppercase">ID: {p.id}</span>
                                    </div>
                                  </td>
                                  <td className="p-4">
                                    <span className="px-2 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400 capitalize font-medium">{p.category}</span>
                                  </td>
                                  <td className="p-4 text-right font-mono text-zinc-400">
                                    {p.category === 'chicha' ? '—' : `${purchase.toLocaleString('fr-FR')} FCFA`}
                                  </td>
                                  <td className="p-4 text-right font-mono text-white font-semibold">{p.price.toLocaleString('fr-FR')} FCFA</td>
                                  <td className="p-4 text-right font-mono">
                                    <span className="text-emerald-400 font-semibold block">{margin.toLocaleString('fr-FR')} FCFA</span>
                                    <span className="text-[9px] text-zinc-500">({marginPct.toFixed(0)}%)</span>
                                  </td>
                                  <td className="p-4">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                      <span className={`font-bold font-mono text-sm ${isOutOfStock ? "text-rose-500" : isLow ? "text-amber-500" : "text-emerald-400"}`}>
                                        {p.stock} unités
                                      </span>
                                      {isOutOfStock ? (
                                        <span className="px-1.5 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-bold rounded uppercase tracking-wider animate-pulse">Rupture</span>
                                      ) : isLow ? (
                                        <span className="px-1.5 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold rounded uppercase tracking-wider">Faible</span>
                                      ) : (
                                        <span className="px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded uppercase tracking-wider">OK</span>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-4 text-center font-mono text-zinc-500 font-semibold">{p.minThreshold}</td>
                                  <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1.5 items-center">
                                      <button
                                        type="button"
                                        onClick={() => setShowViewProductModal(p)}
                                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                      >
                                        👁️ Voir
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => openAdjustStockModal(p)}
                                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                      >
                                        ⚖️ Ajuster
                                      </button>
                                      {role === "admin" && (
                                        <>
                                          <button
                                            type="button"
                                            onClick={() => openEditProductModal(p)}
                                            className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                          >
                                            ✏️ Modifier
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteProduct(p.id)}
                                            className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-rose-500 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                          >
                                            🗑️ Supprimer
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left">
                        <thead>
                          <tr className="border-b border-zinc-800 text-[10px] text-zinc-500 uppercase tracking-widest font-bold bg-zinc-950/40">
                            <th className="p-4">Date & Heure</th>
                            <th className="p-4">Produit</th>
                            <th className="p-4 text-center">Type</th>
                            <th className="p-4 text-center">Quantité</th>
                            <th className="p-4">Motif / Commentaire</th>
                            <th className="p-4">Opérateur</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/50 text-xs text-zinc-300">
                          {stockMovements
                            .filter(m => stockMovementTypeFilter === "all" || m.type === stockMovementTypeFilter)
                            .map((m) => {
                              const date = new Date(m.date);
                              const isAddition = m.type === "entrée";
                              const typeColors = {
                                entrée: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
                                sortie: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
                                casse: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
                                perte: "bg-red-500/10 text-red-400 border border-red-500/20",
                                consommation: "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              };

                              return (
                                <tr key={m.id} className="hover:bg-zinc-850/40 transition-colors">
                                  <td className="p-4 text-zinc-400 font-semibold">
                                    {date.toLocaleDateString('fr-FR')} à {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="p-4">
                                    <span className="font-bold text-white">{m.productName}</span>
                                    <span className="text-[10px] text-zinc-500 block">ID Produit: {m.productId}</span>
                                  </td>
                                  <td className="p-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${typeColors[m.type] || "bg-zinc-800 text-zinc-400"}`}>
                                      {m.type}
                                    </span>
                                  </td>
                                  <td className={`p-4 text-center font-mono font-bold text-sm ${isAddition ? "text-emerald-400" : "text-rose-400"}`}>
                                    {isAddition ? `+${m.quantity}` : `-${m.quantity}`}
                                  </td>
                                  <td className="p-4 text-zinc-300 font-medium">{m.reason}</td>
                                  <td className="p-4">
                                    <span className="px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded-lg border border-zinc-800 text-[10px] font-semibold">{m.user}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          {stockMovements.filter(m => stockMovementTypeFilter === "all" || m.type === stockMovementTypeFilter).length === 0 && (
                            <tr>
                              <td colSpan="6" className="p-8 text-center text-zinc-500 italic">Aucun mouvement de stock correspondant.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              </div>
            )}


            {/* ==================== VUE 5 : GESTION DES DEPENSES ==================== */}
            {activeTab === "expenses" && (
              <div className="space-y-6 graffiti-spray-red">
                <div>
                  <span className="sticker-badge-red bg-rose-950/60 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block">Journal des Débits & Dépenses</span>
                </div>

                {caisseStatus === "fermée" ? (
                  renderCaisseFermeeLock("Gestion des Dépenses")
                ) : (
                  <>
                
                {/* Stats & Actions Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto flex-1">
                    {/* Stat: Cash Balance */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Solde de Caisse Actuel</span>
                      <span className="text-xl font-extrabold text-emerald-400 font-mono">
                        {stats.cashBalance.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Stat: Today's Expenses */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-rose-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Dépenses du Jour</span>
                      <span className="text-xl font-extrabold text-rose-400 font-mono">
                        {expenses
                          .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
                          .reduce((sum, e) => sum + e.amount, 0)
                          .toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Stat: Weekly Expenses */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-rose-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Dépenses de la Semaine</span>
                      <span className="text-xl font-extrabold text-rose-300 font-mono">
                        {expenses
                          .filter(e => new Date(e.date).getTime() >= (Date.now() - 7 * 24 * 3600 * 1000))
                          .reduce((sum, e) => sum + e.amount, 0)
                          .toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                    {role === "admin" && (
                      <button
                        onClick={() => setShowManageCategoriesModal(true)}
                        className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Gérer Catégories
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setExpenseAmount("");
                        setExpenseCategory(expenseCategories[0] || "électricité");
                        setExpenseDescription("");
                        setExpenseResponsible(role === "admin" ? "Administrateur" : "Gérant");
                        // Format current local date-time to YYYY-MM-DDTHH:MM
                        const now = new Date();
                        const offset = now.getTimezoneOffset() * 60000;
                        const localISOTime = (new Date(now - offset)).toISOString().slice(0, 16);
                        setExpenseDate(localISOTime);
                        setShowAddExpenseModal(true);
                      }}
                      className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/20 active:scale-95 transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Saisir une Dépense
                    </button>
                  </div>
                </div>

                {/* Main Content Layout Grid */}
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                  
                  {/* Left Column: Expense History & Filters (2 cols span) */}
                  <div className="xl:col-span-2 glass-panel p-6 rounded-2xl shadow-md space-y-6 flex flex-col min-h-[500px]">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <History className="w-4.5 h-4.5 text-rose-500" />
                          Historique des Dépenses
                        </h4>
                        <p className="text-[10px] text-zinc-500">Liste des mouvements de débit de caisse</p>
                      </div>

                      {/* Filters */}
                      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                        {/* Search Input */}
                        <div className="relative flex-1 sm:flex-initial">
                          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                          <input
                            type="text"
                            placeholder="Rechercher description..."
                            value={expenseSearchQuery}
                            onChange={(e) => setExpenseSearchQuery(e.target.value)}
                            className="bg-zinc-950 border border-zinc-850 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-rose-500 w-full sm:w-48"
                          />
                        </div>

                        {/* Category Filter */}
                        <select
                          value={expenseCategoryFilter}
                          onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                          className="bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-300 focus:outline-none focus:border-rose-500"
                        >
                          <option value="all">Toutes Catégories</option>
                          {expenseCategories.map((c, i) => (
                            <option key={i} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Table View */}
                    <div className="flex-1 overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-850 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            <th className="p-4">Date & Heure</th>
                            <th className="p-4">Catégorie</th>
                            <th className="p-4 text-right">Montant</th>
                            <th className="p-4">Motif / Description</th>
                            <th className="p-4">Responsable</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {expenses
                            .filter(e => {
                              const matchesSearch = e.description.toLowerCase().includes(expenseSearchQuery.toLowerCase()) ||
                                                    e.responsible.toLowerCase().includes(expenseSearchQuery.toLowerCase());
                              const matchesCat = expenseCategoryFilter === "all" || e.category === expenseCategoryFilter;
                              return matchesSearch && matchesCat;
                            })
                            .map((e) => {
                              const date = new Date(e.date);
                              return (
                                <tr key={e.id} className="border-b border-zinc-850/40 hover:bg-zinc-900/20 transition-colors">
                                  <td className="p-4 text-xs text-zinc-400 font-semibold font-mono">
                                    {date.toLocaleDateString('fr-FR')} {date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </td>
                                  <td className="p-4 text-xs font-bold text-white capitalize">
                                    <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-300">
                                      {e.category}
                                    </span>
                                  </td>
                                  <td className="p-4 text-right font-mono font-extrabold text-sm text-rose-400">
                                    {e.amount.toLocaleString('fr-FR')} FCFA
                                  </td>
                                  <td className="p-4 text-xs text-zinc-300 font-medium">
                                    {e.description}
                                  </td>
                                  <td className="p-4 text-xs text-zinc-400">
                                    {e.responsible}
                                  </td>
                                  <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => setShowViewExpenseModal(e)}
                                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                      >
                                        👁️ Voir
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowEditExpenseModal(e);
                                          setEditExpenseAmount(e.amount);
                                          setEditExpenseCategory(e.category);
                                          setEditExpenseDescription(e.description);
                                          setEditExpenseResponsible(e.responsible);
                                          setEditExpenseDate(e.date ? e.date.substring(0, 16) : new Date().toISOString().substring(0, 16));
                                        }}
                                        disabled={role !== "admin"}
                                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                                      >
                                        ✏️ Modifier
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (confirm(`Voulez-vous vraiment supprimer cette dépense de ${e.amount.toLocaleString('fr-FR')} FCFA ? Le solde de caisse sera réajusté.`)) {
                                            handleDeleteExpense(e.id);
                                          }
                                        }}
                                        disabled={role !== "admin"}
                                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-rose-500 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                                      >
                                        🗑️ Supprimer
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}

                          {expenses.filter(e => {
                            const matchesSearch = e.description.toLowerCase().includes(expenseSearchQuery.toLowerCase()) ||
                                                  e.responsible.toLowerCase().includes(expenseSearchQuery.toLowerCase());
                            const matchesCat = expenseCategoryFilter === "all" || e.category === expenseCategoryFilter;
                            return matchesSearch && matchesCat;
                          }).length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-8 text-center text-zinc-500 italic text-xs">
                                Aucune dépense enregistrée.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Column: Category Breakdown Chart */}
                  <div className="glass-panel p-6 rounded-2xl shadow-md space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 className="w-4.5 h-4.5 text-rose-500" />
                        Répartition par Catégorie
                      </h4>
                      <span className="text-[10px] text-zinc-500 font-semibold">Analyse des coûts</span>
                    </div>

                    <div className="space-y-5">
                      {(() => {
                        // Calculate sums per category
                        const categorySums = expenseCategories.map(cat => {
                          const sum = expenses
                            .filter(e => e.category === cat)
                            .reduce((acc, e) => acc + e.amount, 0);
                          return { category: cat, sum };
                        }).sort((a, b) => b.sum - a.sum);

                        const maxCategorySum = Math.max(...categorySums.map(x => x.sum), 1);
                        const totalAllExpenses = categorySums.reduce((acc, x) => acc + x.sum, 0);

                        return (
                          <>
                            {categorySums.map((item, index) => {
                              const percentage = (item.sum / maxCategorySum) * 100;
                              const shareOfTotal = totalAllExpenses > 0 ? (item.sum / totalAllExpenses) * 100 : 0;
                              
                              if (item.sum === 0) return null; // Don't clutter with empty categories

                              return (
                                <div key={index} className="space-y-1.5">
                                  <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-zinc-300 capitalize flex items-center gap-1.5">
                                      <span className="text-zinc-500 text-[10px] font-bold">#{index+1}</span>
                                      {item.category}
                                    </span>
                                    <div className="space-x-2 text-zinc-400 font-mono">
                                      <span className="text-[10px] text-zinc-500 font-semibold">({shareOfTotal.toFixed(0)}%)</span>
                                      <span className="font-extrabold text-rose-300">{item.sum.toLocaleString('fr-FR')} FCFA</span>
                                    </div>
                                  </div>
                                  <div className="w-full h-2.5 bg-zinc-900/60 rounded-full overflow-hidden border border-zinc-950">
                                    <div 
                                      className="h-full bg-gradient-to-r from-rose-600 to-pink-500 rounded-full transition-all duration-1000"
                                      style={{ width: `${percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              );
                            })}
                            
                            {totalAllExpenses === 0 && (
                              <div className="text-center py-12 text-zinc-500 italic text-xs">
                                Aucune donnée à afficher pour le moment
                              </div>
                            )}

                            {totalAllExpenses > 0 && (
                              <div className="pt-4 border-t border-zinc-850 flex justify-between items-center text-xs font-bold">
                                <span className="text-zinc-400">Total Dépenses Cumulées</span>
                                <span className="text-rose-400 font-mono text-sm">{totalAllExpenses.toLocaleString('fr-FR')} FCFA</span>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>

                </div>

                  </>
                )}
              </div>
            )}


            {/* ==================== VUE 6 : GESTION DES ACHATS ==================== */}
            {activeTab === "purchases" && (
              <div className="space-y-6 graffiti-spray-green">
                <div>
                  <span className="sticker-badge bg-emerald-950/60 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block font-sans">Journal des Achats & Approvisionnements</span>
                </div>

                {caisseStatus === "fermée" ? (
                  renderCaisseFermeeLock("Gestion des Achats")
                ) : (
                  <>
                
                {/* Stats & Actions Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full lg:w-auto flex-1">
                    {/* Stat: Cash Balance */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-emerald-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Solde de Caisse Actuel</span>
                      <span className="text-xl font-extrabold text-emerald-400 font-mono">
                        {stats.cashBalance.toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Stat: Today's Purchases */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-cyan-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Achats du Jour</span>
                      <span className="text-xl font-extrabold text-cyan-400 font-mono">
                        {purchases
                          .filter(p => new Date(p.date).toDateString() === new Date().toDateString())
                          .reduce((sum, p) => sum + p.totalAmount, 0)
                          .toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Stat: Weekly Purchases */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-blue-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Achats de la Semaine</span>
                      <span className="text-xl font-extrabold text-blue-300 font-mono">
                        {purchases
                          .filter(p => new Date(p.date).getTime() >= (Date.now() - 7 * 24 * 3600 * 1000))
                          .reduce((sum, p) => sum + p.totalAmount, 0)
                          .toLocaleString('fr-FR')} FCFA
                      </span>
                    </div>

                    {/* Stat: Transaction Count */}
                    <div className="glass-panel p-4 rounded-2xl flex flex-col gap-1.5 shadow-md border border-zinc-800/40 relative overflow-hidden">
                      <div className="absolute -right-6 -bottom-6 w-16 h-16 rounded-full bg-violet-500/5 blur-xl"></div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Transactions d'Achats</span>
                      <span className="text-xl font-extrabold text-violet-400 font-mono">
                        {purchases.length}
                      </span>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-3 shrink-0 w-full lg:w-auto justify-end">
                    <button 
                      onClick={() => {
                        setPurchaseSupplier("");
                        setPurchaseIsCustomSupplier(false);
                        setPurchaseCustomSupplierName("");
                        setPurchaseProduct("Autre");
                        setPurchaseCustomProductName("");
                        setPurchaseQuantity(1);
                        setPurchaseUnitPrice("");
                        setPurchaseTotalAmount("");
                        setPurchasePaymentMethod("espèces");
                        setPurchaseResponsible("");
                        setPurchaseDate(new Date().toISOString().substring(0, 16));
                        setShowAddPurchaseModal(true);
                      }}
                      className="py-2.5 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Enregistrer un Achat
                    </button>
                  </div>
                </div>

                {/* Filters & History Table Panel */}
                <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4">
                  {/* Search and Filters */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative w-full md:w-80">
                      <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Rechercher fournisseur ou produit..."
                        value={purchaseSearchQuery}
                        onChange={(e) => setPurchaseSearchQuery(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Mode Paiement:</span>
                      <select 
                        value={purchaseFilterPaymentMethod}
                        onChange={(e) => setPurchaseFilterPaymentMethod(e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      >
                        <option value="all">Tous</option>
                        {paymentMethods.map(method => (
                          <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Purchases History Table */}
                  <div className="overflow-x-auto border border-zinc-855 rounded-xl">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-zinc-900/40 border-b border-zinc-850 text-zinc-400 font-bold uppercase tracking-wider">
                          <th className="p-4">Date</th>
                          <th className="p-4">Fournisseur</th>
                          <th className="p-4">Produit</th>
                          <th className="p-4 text-center">Qté</th>
                          <th className="p-4 text-right">P.U.</th>
                          <th className="p-4 text-right">Montant Total</th>
                          <th className="p-4">Mode</th>
                          <th className="p-4">Responsable</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-900/60">
                        {purchases
                          .filter(p => {
                            const matchQuery = 
                              p.supplier.toLowerCase().includes(purchaseSearchQuery.toLowerCase()) ||
                              p.product.toLowerCase().includes(purchaseSearchQuery.toLowerCase());
                            const matchMethod = purchaseFilterPaymentMethod === "all" || p.paymentMethod.toLowerCase() === purchaseFilterPaymentMethod;
                            return matchQuery && matchMethod;
                          })
                          .map((p) => {
                            const dateObj = new Date(p.date);
                            const formattedDate = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }) + " " + dateObj.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
                            return (
                              <tr key={p.id} className="hover:bg-zinc-900/30 transition-all font-semibold text-zinc-100">
                                <td className="p-4 font-mono text-zinc-400 font-medium">{formattedDate}</td>
                                <td className="p-4">{p.supplier}</td>
                                <td className="p-4 font-bold text-white flex items-center gap-1.5">
                                  <span>📦</span> {p.product}
                                </td>
                                <td className="p-4 text-center font-mono text-cyan-400">{p.quantity}</td>
                                <td className="p-4 text-right font-mono text-zinc-300">{p.unitPrice.toLocaleString('fr-FR')} FCFA</td>
                                <td className="p-4 text-right font-mono font-extrabold text-emerald-400">{p.totalAmount.toLocaleString('fr-FR')} FCFA</td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 rounded-lg border border-emerald-500/20 text-[9.5px] uppercase font-bold tracking-wider">{p.paymentMethod}</span>
                                </td>
                                <td className="p-4">
                                  <span className="px-2 py-0.5 bg-zinc-950 text-zinc-400 rounded-lg border border-zinc-800 text-[10px] font-semibold">{p.responsible}</span>
                                </td>
                                <td className="p-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button 
                                      type="button"
                                      onClick={() => setShowViewPurchaseModal(p)}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                      title="Voir les détails"
                                    >
                                      👁️ Voir
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        const supplierExists = suppliers.some(s => s.nom === p.supplier);
                                        if (supplierExists) {
                                          setPurchaseSupplier(p.supplier);
                                          setPurchaseIsCustomSupplier(false);
                                          setPurchaseCustomSupplierName("");
                                        } else {
                                          setPurchaseSupplier("NEW_SUPPLIER");
                                          setPurchaseIsCustomSupplier(true);
                                          setPurchaseCustomSupplierName(p.supplier);
                                        }
                                        const matched = products.find(x => x.name === p.product);
                                        if (matched) {
                                          setPurchaseProduct(p.product);
                                          setPurchaseCustomProductName("");
                                        } else {
                                          setPurchaseProduct("Autre");
                                          setPurchaseCustomProductName(p.product);
                                        }
                                        setPurchaseQuantity(p.quantity);
                                        setPurchaseUnitPrice(p.unitPrice);
                                        setPurchaseTotalAmount(p.totalAmount);
                                        setPurchasePaymentMethod(p.paymentMethod);
                                        setPurchaseResponsible(p.responsible);
                                        setPurchaseDate(new Date(p.date).toISOString().substring(0, 16));
                                        setShowEditPurchaseModal(p);
                                      }}
                                      disabled={role !== "admin"}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                                      title="Modifier cet achat"
                                    >
                                      ✏️ Modifier
                                    </button>
                                    <button 
                                      type="button"
                                      onClick={() => {
                                        if (confirm(`Voulez-vous vraiment supprimer cet achat de ${p.quantity}x "${p.product}" de chez "${p.supplier}" ?`)) {
                                          handleDeletePurchase(p.id);
                                        }
                                      }}
                                      disabled={role !== "admin"}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-rose-500 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                                      title="Supprimer cet achat"
                                    >
                                      🗑️ Supprimer
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        {purchases.filter(p => {
                          const matchQuery = 
                            p.supplier.toLowerCase().includes(purchaseSearchQuery.toLowerCase()) ||
                            p.product.toLowerCase().includes(purchaseSearchQuery.toLowerCase());
                          const matchMethod = purchaseFilterPaymentMethod === "all" || p.paymentMethod.toLowerCase() === purchaseFilterPaymentMethod;
                          return matchQuery && matchMethod;
                        }).length === 0 && (
                          <tr>
                            <td colSpan={9} className="p-8 text-center text-zinc-500 italic">Aucun achat enregistré.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                  </>
                )}
              </div>
            )}

            {/* ==================== VUE : GESTION FOURNISSEURS ==================== */}
            {activeTab === "fournisseurs" && (() => {
              const filteredSuppliers = suppliers.filter(s =>
                s.nom.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                s.telephone.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                s.email.toLowerCase().includes(supplierSearch.toLowerCase()) ||
                (s.produitsFournis || []).join(" ").toLowerCase().includes(supplierSearch.toLowerCase())
              );
              return (
              <div className="space-y-6 graffiti-spray-blue">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <span className="sticker-badge bg-teal-950/80 text-teal-300 font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block border border-teal-500/20">
                      Répertoire Fournisseurs
                    </span>
                    <p className="text-xs text-zinc-500 mt-1.5 font-medium">{suppliers.length} fournisseur(s) enregistré(s)</p>
                  </div>
                  <button
                    onClick={() => { resetSupplierForm(); setShowAddSupplierModal(true); }}
                    className="flex items-center gap-2 py-2.5 px-5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-teal-950/20 active:scale-95 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter Fournisseur
                  </button>
                </div>

                {/* Search bar */}
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, tél, email ou produit…"
                    value={supplierSearch}
                    onChange={e => setSupplierSearch(e.target.value)}
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-medium placeholder-zinc-600 transition-colors"
                  />
                </div>

                {/* Supplier Cards Grid */}
                {filteredSuppliers.length === 0 ? (
                  <div className="glass-panel p-12 rounded-2xl border border-zinc-850 text-center space-y-3">
                    <Building2 className="w-10 h-10 text-zinc-700 mx-auto" />
                    <p className="text-sm text-zinc-500 font-semibold">Aucun fournisseur trouvé</p>
                    <p className="text-xs text-zinc-600">{supplierSearch ? "Modifiez votre recherche." : "Ajoutez votre premier fournisseur."}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredSuppliers.map((supp) => (
                      <div key={supp.id} className="glass-panel rounded-2xl border border-zinc-800/60 p-5 space-y-4 relative overflow-hidden hover:border-teal-500/20 transition-all duration-200 group">
                        {/* Top accent */}
                        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500/50 to-transparent rounded-t-2xl" />

                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-950/50 border border-teal-500/20 flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-5 h-5 text-teal-400" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-black text-white truncate" title={supp.nom}>{supp.nom}</h4>
                              <p className="text-[10px] text-zinc-500 font-medium">
                                Ajouté le {new Date(supp.dateAjout).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setShowSupplierDetailModal(supp)}
                              className="p-1 px-2 text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                              title="Voir"
                            >
                              👁️ Voir
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setSuppNom(supp.nom); setSuppTel(supp.telephone);
                                setSuppEmail(supp.email); setSuppAdresse(supp.adresse);
                                setSuppProduits((supp.produitsFournis || []).join(", "));
                                setSuppNotes(supp.notes || "");
                                setShowEditSupplierModal(supp);
                              }}
                              disabled={role !== "admin"}
                              className="p-1 px-2 text-amber-500 bg-zinc-900 hover:bg-zinc-800 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                              title="Modifier"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSupplier(supp.id)}
                              disabled={role !== "admin"}
                              className="p-1 px-2 text-rose-500 bg-zinc-900 hover:bg-zinc-800 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                              title="Supprimer"
                            >
                              🗑️ Supprimer
                            </button>
                          </div>
                        </div>

                        {/* Contact details */}
                        <div className="space-y-2">
                          {supp.telephone && (
                            <div className="flex items-center gap-2 text-xs">
                              <Phone className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                              <span className="text-zinc-300 font-mono">{supp.telephone}</span>
                            </div>
                          )}
                          {supp.email && (
                            <div className="flex items-center gap-2 text-xs">
                              <Mail className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                              <span className="text-zinc-400 truncate">{supp.email}</span>
                            </div>
                          )}
                          {supp.adresse && (
                            <div className="flex items-center gap-2 text-xs">
                              <MapPin className="w-3.5 h-3.5 text-zinc-500 flex-shrink-0" />
                              <span className="text-zinc-400">{supp.adresse}</span>
                            </div>
                          )}
                        </div>

                        {/* Produits fournis */}
                        {supp.produitsFournis && supp.produitsFournis.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Produits fournis :</span>
                            <div className="flex flex-wrap gap-1.5">
                              {supp.produitsFournis.slice(0, 4).map((p, i) => (
                                <span key={i} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-medium">
                                  {p}
                                </span>
                              ))}
                              {supp.produitsFournis.length > 4 && (
                                <span className="text-[10px] bg-teal-950/50 border border-teal-500/20 text-teal-400 px-2 py-0.5 rounded-md font-bold">
                                  +{supp.produitsFournis.length - 4} autres
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {supp.notes && (
                          <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-lg p-2.5">
                            <p className="text-[10px] text-zinc-500 italic leading-relaxed">{supp.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              );
            })()}

            {/* ==================== VUE : GESTION DES JOUEURS ==================== */}
            {activeTab === "players" && (() => {
              const filteredPlayers = players.filter(p =>
                p.nom.toLowerCase().includes(playerSearch.toLowerCase()) ||
                (p.telephone && p.telephone.includes(playerSearch)) ||
                (p.email && p.email.toLowerCase().includes(playerSearch.toLowerCase()))
              );

              const getPlayerActiveConsole = (playerNom) => {
                return consoles.find(c => 
                  c.status === "occupée" && 
                  c.activeSession && 
                  c.activeSession.player.toLowerCase().includes(playerNom.toLowerCase())
                );
              };

              return (
                <div className="space-y-6 animate-fade-in pb-12">
                  <div>
                    <span className="sticker-badge bg-zinc-900 text-fuchsia-400 font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block font-sans">
                      Base de Données Joueurs / Fidélité
                    </span>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1.5 shadow-md">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Joueurs Inscrits</span>
                      <span className="text-xl font-extrabold text-fuchsia-400">{players.length} membres</span>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1.5 shadow-md">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Joueurs Actifs en Salle</span>
                      <span className="text-xl font-extrabold text-white">
                        {consoles.filter(c => c.status === "occupée" && c.activeSession).length} en jeu
                      </span>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1.5 shadow-md">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Fidélité cumulée</span>
                      <span className="text-xl font-extrabold text-emerald-400 font-mono">
                        {formatPrice(players.reduce((sum, p) => sum + (p.totalSpent || 0), 0))}
                      </span>
                    </div>
                  </div>

                  {/* Search bar + New player action */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                    <div className="relative w-full md:w-80">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                        <Search className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Rechercher un joueur..."
                        value={playerSearch}
                        onChange={(e) => setPlayerSearch(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-fuchsia-500 transition-all font-semibold"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        resetPlayerForm();
                        setShowAddPlayerModal(true);
                      }}
                      className="py-2.5 px-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-fuchsia-900/20 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Nouveau joueur</span>
                    </button>
                  </div>

                  {/* Players list Table */}
                  <div className="glass-panel rounded-2xl border border-zinc-850 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                            <th className="p-4">Nom du Joueur</th>
                            <th className="p-4">Console</th>
                            <th className="p-4">Temps</th>
                            <th className="p-4">Montant</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {filteredPlayers.map((p, idx) => {
                            const activeConsole = getPlayerActiveConsole(p.nom);
                            
                            let consoleName = "Aucune";
                            let tempsText = `${Math.floor((p.totalTimeMinutes || 0) / 60)}h`;
                            let montantText = formatPrice(p.totalSpent || 0);

                            if (activeConsole && activeConsole.activeSession) {
                              consoleName = activeConsole.name.split(" ")[0];
                              
                              const elapsedSec = activeConsole.activeSession.timeElapsedSeconds || 0;
                              const hrs = Math.max(1, Math.round(elapsedSec / 3605));
                              tempsText = `${hrs}h`;
                              montantText = formatPrice(activeConsole.activeSession.totalAmountDue + (activeConsole.activeSession.extraSnacksBill || 0));
                            }

                            return (
                              <tr key={p.id} className="hover:bg-zinc-900/20 transition-all font-medium">
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-zinc-950/60 border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-fuchsia-400 uppercase">
                                      {p.nom.slice(0, 2)}
                                    </div>
                                    <div>
                                      <span className="text-white font-bold block">{p.nom}</span>
                                      <span className="text-[9px] text-zinc-500 block font-mono">{p.telephone || "Sans téléphone"}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  {activeConsole ? (
                                    <span className="px-2 py-1 bg-cyan-950/50 text-cyan-400 border border-cyan-800/30 rounded-lg font-black uppercase text-[10px]">
                                      🎮 {consoleName}
                                    </span>
                                  ) : (
                                    <span className="text-zinc-500 italic">Aucune</span>
                                  )}
                                </td>
                                <td className="p-4 font-mono font-bold text-zinc-300">
                                  {tempsText}
                                </td>
                                <td className="p-4 font-mono font-extrabold text-emerald-400 text-sm">
                                  {montantText}
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setShowViewPlayerModal(p)}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                    >
                                      👁️ Voir
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPlayNom(p.nom);
                                        setPlayTel(p.telephone || "");
                                        setPlayEmail(p.email || "");
                                        setShowEditPlayerModal(p);
                                      }}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-amber-500 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                    >
                                      ✏️ Modifier
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeletePlayer(p.id)}
                                      disabled={role !== "admin"}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-rose-500 rounded-lg font-bold text-[10px] border border-zinc-800 disabled:opacity-30 transition-colors"
                                    >
                                      🗑️ Supprimer
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {filteredPlayers.length === 0 && (
                            <tr>
                              <td colSpan="5" className="p-8 text-center text-zinc-500 italic">
                                Aucun joueur trouvé.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ==================== VUE : RAPPORTS D'ACTIVITÉ ==================== */}
            {activeTab === "dailyReport" && (() => {
              const totalSessions = dailySessionsCount + consoles.filter(c => c.status === "occupée").length;
              const totalGamesRev = stats.gamesRevenue;
              const totalSnacksRev = stats.snackRevenue;
              const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0) + purchases.reduce((sum, p) => sum + p.totalAmount, 0);
              const netProfit = totalGamesRev + totalSnacksRev - totalExpenses;

              // Weekly calculations
              const last7DaysSessions = caisseSessions.filter(s => {
                const diffTime = Math.abs(new Date() - new Date(s.dateOpen));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              });
              const weeklySessions = last7DaysSessions.length * 12 + totalSessions;
              const weeklyGamesRev = last7DaysSessions.reduce((sum, s) => sum + (s.gamesRevenue || 0), 0) + totalGamesRev;
              const weeklySnacksRev = last7DaysSessions.reduce((sum, s) => sum + (s.snackRevenue || 0), 0) + totalSnacksRev;
              const weeklyExpenses = last7DaysSessions.reduce((sum, s) => sum + (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0), 0) + totalExpenses;
              const weeklyProfit = weeklyGamesRev + weeklySnacksRev - weeklyExpenses;

              // Monthly calculations
              const last30DaysSessions = caisseSessions.filter(s => {
                const diffTime = Math.abs(new Date() - new Date(s.dateOpen));
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 30;
              });
              const monthlySessions = last30DaysSessions.length * 15 + totalSessions;
              const monthlyGamesRev = last30DaysSessions.reduce((sum, s) => sum + (s.gamesRevenue || 0), 0) + totalGamesRev;
              const monthlySnacksRev = last30DaysSessions.reduce((sum, s) => sum + (s.snackRevenue || 0), 0) + totalSnacksRev;
              const monthlyExpenses = last30DaysSessions.reduce((sum, s) => sum + (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0), 0) + totalExpenses;
              const monthlyProfit = monthlyGamesRev + monthlySnacksRev - monthlyExpenses;

              // Select active stats
              const reportTitle = reportSubTab === "hebdomadaire" ? "RAPPORT HEBDOMADAIRE" : reportSubTab === "mensuel" ? "RAPPORT MENSUEL" : "RAPPORT JOURNALIER";
              const reportDesc = reportSubTab === "hebdomadaire" ? "Bilan d'activité consolidé des 7 derniers jours" : reportSubTab === "mensuel" ? "Bilan d'activité consolidé des 30 derniers jours" : "Bilan d'activité consolidé pour la journée";
              const displaySessions = reportSubTab === "hebdomadaire" ? weeklySessions : reportSubTab === "mensuel" ? monthlySessions : totalSessions;
              const displayGamesRev = reportSubTab === "hebdomadaire" ? weeklyGamesRev : reportSubTab === "mensuel" ? monthlyGamesRev : totalGamesRev;
              const displaySnacksRev = reportSubTab === "hebdomadaire" ? weeklySnacksRev : reportSubTab === "mensuel" ? monthlySnacksRev : totalSnacksRev;
              const displayExpenses = reportSubTab === "hebdomadaire" ? weeklyExpenses : reportSubTab === "mensuel" ? monthlyExpenses : totalExpenses;
              const displayProfit = reportSubTab === "hebdomadaire" ? weeklyProfit : reportSubTab === "mensuel" ? monthlyProfit : netProfit;

              // Graphs calculations
              const totalRev = displayGamesRev + displaySnacksRev;
              const donutRadius = 38;
              const donutCircumference = 2 * Math.PI * donutRadius; // ~238.76
              const gamesShare = totalRev > 0 ? displayGamesRev / totalRev : 0.6;
              const snacksShare = totalRev > 0 ? displaySnacksRev / totalRev : 0.4;
              const dashGames = gamesShare * donutCircumference;
              const dashSnacks = snacksShare * donutCircumference;

              // Trend history calculations
              const trendHistory = [...caisseSessions]
                .slice(0, 5)
                .reverse()
                .map((s, idx) => {
                  const rev = (s.gamesRevenue || 0) + (s.snackRevenue || 0);
                  const exp = (s.expensesMaintenance || 0) + (s.expensesDiverses || 0) + (s.purchases || 0);
                  const prof = rev - exp;
                  const dateObj = new Date(s.dateClose || s.dateOpen);
                  const label = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
                  return { label, revenue: rev, profit: prof, expenses: exp };
                });

              // Fallback padding if we don't have enough history
              if (trendHistory.length < 5) {
                const pad = [
                  { label: "01 Juin", revenue: 120000, profit: 80000, expenses: 40000 },
                  { label: "02 Juin", revenue: 180000, profit: 120000, expenses: 60000 },
                  { label: "03 Juin", revenue: 150000, profit: 90000, expenses: 60000 },
                  { label: "04 Juin", revenue: 220000, profit: 150000, expenses: 70000 },
                  { label: "05 Juin", revenue: 260000, profit: 180000, expenses: 80000 }
                ];
                trendHistory.unshift(...pad.slice(0, 5 - trendHistory.length));
              }

              // Append current shift to trendHistory
              trendHistory.push({
                label: "En cours",
                revenue: totalRev,
                profit: displayProfit,
                expenses: displayExpenses
              });

              // Limit to last 6 points
              const activeTrendPoints = trendHistory.slice(-6);

              const maxTrendVal = Math.max(
                ...activeTrendPoints.map(d => Math.max(d.revenue, d.profit, d.expenses, 100000))
              ) * 1.15;

              // Generate line coordinates
              const pointsRevenue = activeTrendPoints.map((d, idx) => {
                const x = 35 + idx * 50;
                const y = 90 - (d.revenue / maxTrendVal) * 70;
                return { x, y, val: d.revenue, label: d.label };
              });

              const pointsProfit = activeTrendPoints.map((d, idx) => {
                const x = 35 + idx * 50;
                const y = 90 - (d.profit / maxTrendVal) * 70;
                return { x, y, val: d.profit, label: d.label };
              });

              const pathRevenueD = pointsRevenue.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              const pathProfitD = pointsProfit.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
              
              const areaRevenueD = pointsRevenue.length > 0 
                ? `M ${pointsRevenue[0].x} 90 L ${pointsRevenue.map(p => `${p.x} ${p.y}`).join(' L ')} L ${pointsRevenue[pointsRevenue.length - 1].x} 90 Z`
                : '';

              const areaProfitD = pointsProfit.length > 0 
                ? `M ${pointsProfit[0].x} 90 L ${pointsProfit.map(p => `${p.x} ${p.y}`).join(' L ')} L ${pointsProfit[pointsProfit.length - 1].x} 90 Z`
                : '';

              return (
                <div className="space-y-6 animate-fade-in pb-12 max-w-4xl mx-auto font-sans">
                  
                  {/* Period Switcher Sub-Tabs */}
                  <div className="flex justify-center border-b border-zinc-850 pb-2">
                    <div className="flex p-1 bg-zinc-900/60 rounded-xl border border-zinc-850/80">
                      <button
                        onClick={() => setReportSubTab("journalier")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          reportSubTab === "journalier" ? "bg-amber-600 text-black shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        Journalier
                      </button>
                      <button
                        onClick={() => setReportSubTab("hebdomadaire")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          reportSubTab === "hebdomadaire" ? "bg-amber-600 text-black shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        Hebdomadaire
                      </button>
                      <button
                        onClick={() => setReportSubTab("mensuel")}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                          reportSubTab === "mensuel" ? "bg-amber-600 text-black shadow-lg" : "text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        Mensuel
                      </button>
                    </div>
                  </div>

                  {/* Grille des Rapports Graphiques */}
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    
                    {/* Graphique Donut - Répartition des Revenus (2/5 cols) */}
                    <div className="glass-panel p-5 rounded-3xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between col-span-1 lg:col-span-2 min-h-[260px]">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="space-y-1">
                        <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block">Répartition du CA</span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Jeux vs Snacks</h4>
                      </div>

                      <div className="relative flex items-center justify-center py-2">
                        <svg width="130" height="130" viewBox="0 0 100 100" className="transform -rotate-90">
                          {/* Background Track */}
                          <circle cx="50" cy="50" r={donutRadius} fill="none" stroke="#18181b" strokeWidth="8" />
                          {totalRev > 0 ? (
                            <>
                              {/* Games segment */}
                              <circle 
                                cx="50" 
                                cy="50" 
                                r={donutRadius} 
                                fill="none" 
                                stroke="#22d3ee" 
                                strokeWidth="8" 
                                strokeDasharray={`${dashGames} ${donutCircumference}`}
                                strokeDashoffset={0}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                              />
                              {/* Snacks segment */}
                              <circle 
                                cx="50" 
                                cy="50" 
                                r={donutRadius} 
                                fill="none" 
                                stroke="#f43f5e" 
                                strokeWidth="8" 
                                strokeDasharray={`${dashSnacks} ${donutCircumference}`}
                                strokeDashoffset={-dashGames}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                              />
                            </>
                          ) : (
                            <circle cx="50" cy="50" r={donutRadius} fill="none" stroke="#27272a" strokeWidth="8" strokeDasharray="3 3" />
                          )}
                        </svg>

                        {/* Centered Stats */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                          <span className="text-[14px] font-black font-mono text-white">
                            {totalRev > 0 ? `${Math.round(gamesShare * 100)}%` : "N/A"}
                          </span>
                          <span className="text-[8px] text-zinc-500 font-bold uppercase tracking-wider">
                            Part Jeux
                          </span>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="flex justify-around items-center pt-2 border-t border-zinc-800/60 text-[10px]">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span>
                          <div>
                            <p className="text-[9px] text-zinc-500 font-semibold uppercase leading-none">Jeux</p>
                            <p className="font-bold text-white font-mono">{displayGamesRev.toLocaleString('fr-FR')} F</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <div>
                            <p className="text-[9px] text-zinc-500 font-semibold uppercase leading-none">Snack</p>
                            <p className="font-bold text-white font-mono">{displaySnacksRev.toLocaleString('fr-FR')} F</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Graphique d'Évolution - Tendances (3/5 cols) */}
                    <div className="glass-panel p-5 rounded-3xl border border-zinc-850 relative overflow-hidden flex flex-col justify-between col-span-1 lg:col-span-3 min-h-[260px]">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider block">Évolution financière</span>
                          <h4 className="text-xs font-bold text-white uppercase tracking-wider">CA vs Bénéfices par Shift</h4>
                        </div>
                        <div className="flex items-center gap-3 text-[9px] font-bold text-zinc-500 uppercase">
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-cyan-400"></span>
                            <span>CA</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded bg-emerald-400"></span>
                            <span>Bénéfice</span>
                          </div>
                        </div>
                      </div>

                      {/* SVG Line Chart */}
                      <div className="w-full relative h-[130px] mt-2">
                        <svg className="w-full h-full overflow-visible" viewBox="0 0 300 110">
                          {/* Grid horizontal lines */}
                          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => {
                            const y = 20 + p * 70;
                            return (
                              <line 
                                key={i}
                                x1="20" 
                                y1={y} 
                                x2="290" 
                                y2={y} 
                                stroke="#18181b" 
                                strokeWidth="1" 
                                strokeDasharray="4 4" 
                              />
                            );
                          })}

                          {/* Gradient Definitions */}
                          <defs>
                            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#34d399" stopOpacity="0.2" />
                              <stop offset="100%" stopColor="#34d399" stopOpacity="0" />
                            </linearGradient>
                          </defs>

                          {/* Area backgrounds */}
                          <path d={areaRevenueD} fill="url(#cyanGrad)" className="transition-all duration-500" />
                          <path d={areaProfitD} fill="url(#emeraldGrad)" className="transition-all duration-500" />

                          {/* Line paths */}
                          <path 
                            d={pathRevenueD} 
                            fill="none" 
                            stroke="#22d3ee" 
                            strokeWidth="2" 
                            className="transition-all duration-500" 
                          />
                          <path 
                            d={pathProfitD} 
                            fill="none" 
                            stroke="#34d399" 
                            strokeWidth="2" 
                            className="transition-all duration-500" 
                          />

                          {/* Dots & labels for points */}
                          {pointsRevenue.map((p, idx) => (
                            <g key={`rev-${idx}`} className="group/dot">
                              <circle 
                                cx={p.x} 
                                cy={p.y} 
                                r="3" 
                                fill="#09090b" 
                                stroke="#22d3ee" 
                                strokeWidth="1.5" 
                              />
                            </g>
                          ))}

                          {pointsProfit.map((p, idx) => (
                            <g key={`prof-${idx}`} className="group/pdot">
                              <circle 
                                cx={p.x} 
                                cy={p.y} 
                                r="3" 
                                fill="#09090b" 
                                stroke="#34d399" 
                                strokeWidth="1.5" 
                              />
                              
                              {/* X Axis Labels */}
                              <text
                                x={p.x}
                                y="105"
                                fill="#71717a"
                                fontSize="7"
                                fontWeight="bold"
                                textAnchor="middle"
                                className="uppercase tracking-wider"
                              >
                                {p.label}
                              </text>
                            </g>
                          ))}
                        </svg>
                      </div>
                    </div>

                  </div>

                  {/* Glassmorphic Report Card */}
                  <div className="glass-panel rounded-3xl border border-zinc-850 p-6 md:p-8 relative overflow-hidden space-y-6 shadow-2xl">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>

                    {/* Report Title & Info */}
                    <div className="border-b border-zinc-800 pb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h3 className="text-xl font-black text-white tracking-wide uppercase italic">{reportTitle}</h3>
                        <p className="text-xs text-zinc-500 font-semibold mt-0.5">
                          {reportDesc} ({currentDateTime.toLocaleDateString('fr-FR')})
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-400 font-bold text-xs bg-zinc-950 px-3 py-1.5 rounded-xl border border-zinc-900">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span>Caisse Active</span>
                      </div>
                    </div>

                    {/* Indicators list */}
                    <div className="divide-y divide-zinc-900">
                      
                      {/* Joueurs Row */}
                      <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-violet-950/40 border border-violet-500/20 flex items-center justify-center text-violet-400 animate-fade-in">
                            <Users className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Joueurs</span>
                            <span className="text-[10px] text-zinc-500 block">Total des sessions lancées sur la période</span>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-violet-400 font-mono pr-2">{displaySessions}</span>
                      </div>

                      {/* Games Revenue Row */}
                      <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-950/40 border border-cyan-500/20 flex items-center justify-center text-cyan-400 animate-fade-in">
                            <Gamepad2 className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Revenus Jeux</span>
                            <span className="text-[10px] text-zinc-500 block">Recettes générées par le pôle jeux vidéo</span>
                          </div>
                        </div>
                        <span className="text-xl font-extrabold text-cyan-400 font-mono pr-2">{formatPrice(displayGamesRev)}</span>
                      </div>

                      {/* Snacks Revenue Row */}
                      <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-pink-950/40 border border-pink-500/20 flex items-center justify-center text-pink-400 animate-fade-in">
                            <GlassWater className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Revenus Snack</span>
                            <span className="text-[10px] text-zinc-500 block">Recettes du bar et consommations de snacks</span>
                          </div>
                        </div>
                        <span className="text-xl font-extrabold text-pink-400 font-mono pr-2">{formatPrice(displaySnacksRev)}</span>
                      </div>

                      {/* Expenses Row */}
                      <div className="py-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-950/40 border border-rose-500/20 flex items-center justify-center text-rose-400 animate-fade-in">
                            <TrendingDown className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-white block">Dépenses</span>
                            <span className="text-[10px] text-zinc-500 block">Dépenses opérationnelles + achats de marchandises</span>
                          </div>
                        </div>
                        <span className="text-xl font-extrabold text-rose-400 font-mono pr-2">{formatPrice(displayExpenses)}</span>
                      </div>

                      {/* Net Profit Row */}
                      <div className="py-5 flex items-center justify-between gap-4 border-t border-zinc-800">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-950/40 border border-emerald-500/20 flex items-center justify-center text-emerald-400 animate-fade-in">
                            <TrendingUp className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="text-base font-black text-white block uppercase tracking-wide">Bénéfice</span>
                            <span className="text-[10px] text-zinc-500 block">Solde net d'exploitation sur la période</span>
                          </div>
                        </div>
                        <span className="text-2xl font-black text-emerald-400 font-mono pr-2">{formatPrice(displayProfit)}</span>
                      </div>

                    </div>

                    {/* Action buttons */}
                    <div className="border-t border-zinc-800 pt-6 grid grid-cols-3 gap-4">
                      <button
                        type="button"
                        onClick={exportDailyReportPDF}
                        className="py-3 px-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-rose-500" />
                        <span>Export PDF</span>
                      </button>

                      <button
                        type="button"
                        onClick={exportDailyReportExcel}
                        className="py-3 px-4 bg-zinc-950 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                      >
                        <FileText className="w-4 h-4 text-emerald-500" />
                        <span>Export Excel</span>
                      </button>

                      <button
                        type="button"
                        onClick={exportDailyReportPDF}
                        className="py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 text-center flex items-center justify-center gap-2"
                      >
                        <Printer className="w-4 h-4" />
                        <span>Imprimer</span>
                      </button>
                    </div>

                  </div>

                </div>
              );
            })()}

            {activeTab === "comptabilite" && (
              <ComptabiliteView
                sales={sales}
                expenses={expenses}
                purchases={purchases}
                products={products}
                formatPrice={formatPrice}
                comptaStartDate={comptaStartDate}
                comptaEndDate={comptaEndDate}
                setComptaStartDate={setComptaStartDate}
                setComptaEndDate={setComptaEndDate}
                comptaCategoryFilter={comptaCategoryFilter}
                setComptaCategoryFilter={setComptaCategoryFilter}
                comptaSearchQuery={comptaSearchQuery}
                setComptaSearchQuery={setComptaSearchQuery}
                comptaSellerFilter={comptaSellerFilter}
                setComptaSellerFilter={setComptaSellerFilter}
                comptaPeriodFilterToggled={comptaPeriodFilterToggled}
                setComptaPeriodFilterToggled={setComptaPeriodFilterToggled}
                comptaExpandedSaleId={comptaExpandedSaleId}
                setComptaExpandedSaleId={setComptaExpandedSaleId}
                setShowCancelSaleModal={setShowCancelSaleModal}
                setShowReceiptModal={setShowReceiptModal}
              />
            )}

            {activeTab === "salesHistory" && (
              <SalesHistoryView
                sales={sales}
                formatPrice={formatPrice}
                salesHistStartDate={salesHistStartDate}
                salesHistEndDate={salesHistEndDate}
                setSalesHistStartDate={setSalesHistStartDate}
                setSalesHistEndDate={setSalesHistEndDate}
                salesHistFilterTab={salesHistFilterTab}
                setSalesHistFilterTab={setSalesHistFilterTab}
                salesHistShowFilters={salesHistShowFilters}
                setSalesHistShowFilters={setSalesHistShowFilters}
                salesHistSearchQuery={salesHistSearchQuery}
                setSalesHistSearchQuery={setSalesHistSearchQuery}
                salesHistSellerFilter={salesHistSellerFilter}
                setSalesHistSellerFilter={setSalesHistSellerFilter}
                salesHistPaymentFilter={salesHistPaymentFilter}
                setSalesHistPaymentFilter={setSalesHistPaymentFilter}
                setShowCancelSaleModal={setShowCancelSaleModal}
                setShowReceiptModal={setShowReceiptModal}
              />
            )}

            {/* ==================== VUE : FACTURES EN COURS ==================== */}
            {activeTab === "invoices" && (() => {

              const posInvoices = tickets.map(t => ({
                type: "pos",
                id: t.id,
                name: t.name || `Ticket #${t.id.slice(-4)}`,
                customer: t.posCustomer || t.name,
                status: t.status || "En cours",
                gameCost: 0,
                snackCost: t.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
                total: t.cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
                itemsList: t.cart,
                consoleId: null,
                dateCreated: t.dateCreated || new Date().toISOString()
              }));

              const consoleInvoices = consoles.filter(c => c.status === "occupée" && c.activeSession).map(c => {
                const s = c.activeSession;
                const gameCost = s.totalAmountDue || 0;
                const snackCost = s.extraSnacksBill || 0;
                return {
                  type: "console",
                  id: `console-${c.id}`,
                  name: `${c.name} (${s.player})`,
                  customer: s.player,
                  status: "En cours",
                  gameCost: gameCost,
                  snackCost: snackCost,
                  total: gameCost + snackCost,
                  itemsList: s.extraSnacksList || [],
                  consoleId: c.id,
                  dateCreated: s.startTime
                };
              });

              const allInvoices = [...posInvoices, ...consoleInvoices];
              const totalOpenAmount = allInvoices.reduce((sum, inv) => sum + inv.total, 0);

              return (
                <div className="space-y-6 animate-fade-in pb-12">
                  <div>
                    <span className="sticker-badge bg-zinc-900 text-indigo-400 font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block font-sans">
                      Suivi des factures de la salle
                    </span>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1.5 shadow-md">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Montant total en attente</span>
                      <span className="text-xl font-extrabold text-indigo-400 font-mono">{formatPrice(totalOpenAmount)}</span>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1.5 shadow-md">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Tickets comptoir ouverts</span>
                      <span className="text-xl font-extrabold text-white">{posInvoices.length} ouverts</span>
                    </div>
                    <div className="glass-panel p-5 rounded-2xl flex flex-col gap-1.5 shadow-md">
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Sessions de jeux actives</span>
                      <span className="text-xl font-extrabold text-white">{consoleInvoices.length} en cours</span>
                    </div>
                  </div>

                  {/* Actions & Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
                    <div className="text-xs font-bold text-zinc-300">
                      Liste des factures actives ({allInvoices.length})
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCreateTicket()}
                      className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-900/20 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ouvrir une nouvelle facture</span>
                    </button>
                  </div>

                  {/* Invoices List Table */}
                  <div className="glass-panel rounded-2xl border border-zinc-850 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-zinc-900/50 border-b border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                            <th className="p-4">N° Facture</th>
                            <th className="p-4">Client / Destination</th>
                            <th className="p-4">Détails Prestations</th>
                            <th className="p-4 text-right">Montant</th>
                            <th className="p-4 text-center">Statut</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900">
                          {allInvoices.map((inv, idx) => {
                            const isConsole = inv.type === "console";
                            return (
                              <tr key={idx} className="hover:bg-zinc-900/20 transition-all font-medium">
                                <td className="p-4 font-mono font-bold text-zinc-400">
                                  {isConsole ? `🕹️ ${inv.name.split(" ")[0]}` : `🧾 ${inv.name}`}
                                </td>
                                <td className="p-4">
                                  <span className="text-white font-bold block">{inv.customer || "Client Comptant"}</span>
                                  {isConsole && (
                                    <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Console active</span>
                                  )}
                                </td>
                                <td className="p-4 max-w-xs">
                                  <div className="space-y-1">
                                    {isConsole && (
                                      <div className="text-[10px] text-cyan-400 font-semibold">
                                        🎮 Session de Jeu active ({formatPrice(inv.gameCost)})
                                      </div>
                                    )}
                                    {inv.itemsList && inv.itemsList.length > 0 ? (
                                      <div className="text-[10px] text-zinc-400">
                                        {inv.itemsList.map((it, i) => `${it.quantity}x ${it.product.name}`).join(", ")}
                                      </div>
                                    ) : (
                                      !isConsole && <span className="text-zinc-600 italic">Aucune consommation</span>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4 text-right font-mono font-extrabold text-white text-sm">
                                  {formatPrice(inv.total)}
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                    inv.status === "En attente" 
                                      ? "bg-amber-950/60 text-amber-400 border border-amber-500/20" 
                                      : "bg-emerald-950/60 text-emerald-400 border border-emerald-500/20"
                                  }`}>
                                    {inv.status}
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isConsole) {
                                          setActiveTab("consoles");
                                        } else {
                                          setActiveTicketId(inv.id);
                                          setSelectedTicketIds([inv.id]);
                                          setActiveTab("snack");
                                        }
                                      }}
                                      className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                                      title="Modifier / Ajouter des articles"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    {!isConsole && (
                                      <button
                                        type="button"
                                        onClick={() => handleToggleTicketStatus(inv.id)}
                                        className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                        title={inv.status === "En attente" ? "Reprendre" : "Mettre en attente"}
                                      >
                                        {inv.status === "En attente" ? (
                                          <Play className="w-3.5 h-3.5" />
                                        ) : (
                                          <Clock className="w-3.5 h-3.5" />
                                        )}
                                      </button>
                                    )}

                                    {!isConsole && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setShowMergeModal(inv);
                                          setTargetMergeInvoiceId("");
                                        }}
                                        className="p-1.5 text-zinc-400 hover:text-indigo-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                        title="Fusionner avec une autre facture"
                                      >
                                        <Users className="w-3.5 h-3.5" />
                                      </button>
                                    )}

                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (isConsole) {
                                          const consoleObj = consoles.find(c => c.id === inv.consoleId);
                                          if (consoleObj) setShowInterruptModal(consoleObj);
                                        } else {
                                          if (confirm(`Voulez-vous vraiment annuler et vider la facture "${inv.name}" ?`)) {
                                            handleDeleteTicket(inv.id);
                                          }
                                        }
                                      }}
                                      className="p-1.5 text-zinc-400 hover:text-rose-400 hover:bg-zinc-800 rounded-lg transition-colors"
                                      title="Annuler la facture"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setPaymentMethodSelected("espèces");
                                        setPaymentCashAmount(inv.total);
                                        setPaymentMobileAmount("");
                                        setShowPaymentModal(inv);
                                      }}
                                      className="py-1 px-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[10px] shadow-sm flex items-center gap-1 active:scale-95 transition-all"
                                      title="Encaisser"
                                    >
                                      <Check className="w-3 h-3" />
                                      <span>Régler</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}

                          {allInvoices.length === 0 && (
                            <tr>
                              <td colSpan="6" className="p-8 text-center text-zinc-500 italic">
                                Aucune facture en cours dans l'établissement.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* ==================== VUE : PARAMÈTRES SYSTÈME ==================== */}
            {activeTab === "settings" && role === "admin" && (
              <div className="space-y-8 animate-fade-in pb-12">
                <div>
                  <span className="sticker-badge bg-zinc-900 text-violet-400 font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block font-sans">
                    Panneau de Configuration Admin
                  </span>
                </div>

                {/* 2x2 Grid for general configurations */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Card 1: Informations Entreprise */}
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                      <Building2 className="w-5 h-5 text-violet-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Informations Entreprise</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Nom de l'entreprise :</label>
                        <input 
                          type="text" 
                          value={systemSettings.companyName}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, companyName: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Sous-titre / En-tête :</label>
                        <input 
                          type="text" 
                          value={systemSettings.companySubtitle}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, companySubtitle: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Slogan :</label>
                        <input 
                          type="text" 
                          value={systemSettings.companySlogan}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, companySlogan: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase block">URL du Logo (Image) :</label>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden flex-shrink-0 flex items-center justify-center">
                            <img 
                              src={systemSettings.logoUrl || "/logo.jpg"} 
                              alt="Logo" 
                              className="w-full h-full object-cover" 
                              onError={(e) => { e.target.src = "/logo.jpg"; }}
                            />
                          </div>
                          <input 
                            type="text" 
                            value={systemSettings.logoUrl}
                            onChange={(e) => setSystemSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Téléphone :</label>
                        <input 
                          type="text" 
                          value={systemSettings.phone}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Email :</label>
                        <input 
                          type="text" 
                          value={systemSettings.email}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, email: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Adresse :</label>
                      <input 
                        type="text" 
                        value={systemSettings.address}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, address: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                      />
                    </div>
                  </div>

                  {/* Card 2: Devise & Paramètres Métiers */}
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-5">
                    <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                      <Coins className="w-5 h-5 text-amber-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Devise & Seuils</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Symbole Devise (ex: FCFA) :</label>
                        <input 
                          type="text" 
                          value={systemSettings.currency}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, currency: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-bold"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-400 uppercase">Format Locale (ex: fr-FR) :</label>
                        <input 
                          type="text" 
                          value={systemSettings.currencyLocale}
                          onChange={(e) => setSystemSettings(prev => ({ ...prev, currencyLocale: e.target.value }))}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase">Seuil d'alerte stock par défaut :</label>
                      <input 
                        type="number" 
                        min="0"
                        value={systemSettings.defaultStockThreshold}
                        onChange={(e) => setSystemSettings(prev => ({ ...prev, defaultStockThreshold: Math.max(0, Number(e.target.value)) }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-bold font-mono"
                      />
                      <p className="text-[10px] text-zinc-500 italic">Ce seuil sera appliqué automatiquement lors de la création de nouvelles fiches produits.</p>
                    </div>

                    <div className="pt-2 border-t border-zinc-900 flex justify-between gap-4">
                      <button
                        type="button"
                        onClick={handleResetSystemSettings}
                        className="py-2.5 px-4 bg-rose-950/40 hover:bg-rose-950/80 text-rose-400 hover:text-white rounded-xl text-xs font-bold border border-rose-900/30 flex items-center gap-1.5 transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Réinitialiser aux valeurs d'origine</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          alert("Paramètres système sauvegardés et appliqués avec succès !");
                        }}
                        className="py-2.5 px-5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-950/20 active:scale-95 transition-all flex items-center gap-1.5"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Enregistrer les paramètres</span>
                      </button>
                    </div>
                  </div>

                  {/* Card 3: NOTIFICATIONS & ALERTES */}
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                      <Bell className="w-5 h-5 text-purple-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Notifications & Alertes</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Checkboxes List */}
                      <div className="space-y-4">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Options de Notification</span>
                        
                        <div className="space-y-3.5">
                          {/* Stock Faible */}
                          <label className="flex items-center gap-3.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox"
                                checked={tempAlertLowStock}
                                onChange={(e) => setTempAlertLowStock(e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${tempAlertLowStock ? "bg-purple-600 border-purple-400 text-black" : "bg-zinc-950 border-zinc-800"}`}>
                                {tempAlertLowStock && <Check className="w-3.5 h-3.5 text-black" />}
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              ⚠️ Stock Faible
                            </div>
                          </label>

                          {/* Rupture Stock */}
                          <label className="flex items-center gap-3.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox"
                                checked={tempAlertOutOfStock}
                                onChange={(e) => setTempAlertOutOfStock(e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${tempAlertOutOfStock ? "bg-purple-600 border-purple-400 text-black" : "bg-zinc-950 border-zinc-800"}`}>
                                {tempAlertOutOfStock && <Check className="w-3.5 h-3.5 text-black" />}
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              🚫 Rupture Stock
                            </div>
                          </label>

                          {/* Dépense Importante */}
                          <label className="flex items-center gap-3.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox"
                                checked={tempAlertHighExpense}
                                onChange={(e) => setTempAlertHighExpense(e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${tempAlertHighExpense ? "bg-purple-600 border-purple-400 text-black" : "bg-zinc-950 border-zinc-800"}`}>
                                {tempAlertHighExpense && <Check className="w-3.5 h-3.5 text-black" />}
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              💰 Dépense Importante
                            </div>
                          </label>

                          {/* Caisse Non Fermée */}
                          <label className="flex items-center gap-3.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox"
                                checked={tempAlertUnclosedCaisse}
                                onChange={(e) => setTempAlertUnclosedCaisse(e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${tempAlertUnclosedCaisse ? "bg-purple-600 border-purple-400 text-black" : "bg-zinc-950 border-zinc-800"}`}>
                                {tempAlertUnclosedCaisse && <Check className="w-3.5 h-3.5 text-black" />}
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              🔓 Caisse Non Fermée
                            </div>
                          </label>

                          {/* Maintenance Console */}
                          <label className="flex items-center gap-3.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="checkbox"
                                checked={tempAlertConsoleMaintenance}
                                onChange={(e) => setTempAlertConsoleMaintenance(e.target.checked)}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 border rounded-lg transition-all flex items-center justify-center ${tempAlertConsoleMaintenance ? "bg-purple-600 border-purple-400 text-black" : "bg-zinc-950 border-zinc-800"}`}>
                                {tempAlertConsoleMaintenance && <Check className="w-3.5 h-3.5 text-black" />}
                              </div>
                            </div>
                            <div className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              🛠️ Maintenance Console
                            </div>
                          </label>
                        </div>
                      </div>

                      {/* Threshold Config */}
                      <div className="space-y-4 flex flex-col justify-between">
                        <div>
                          <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-2">
                            Montant alerte dépense (FCFA)
                          </label>
                          <div className="relative rounded-xl bg-zinc-950 border border-zinc-800 px-3 py-2.5 flex items-center focus-within:border-purple-500 transition-all">
                            <input 
                              type="number"
                              min="0"
                              step="1000"
                              value={tempHighExpenseThreshold}
                              onChange={(e) => setTempHighExpenseThreshold(Math.max(0, Number(e.target.value)))}
                              className="w-full bg-transparent text-sm text-white focus:outline-none font-bold font-mono"
                            />
                            <span className="text-xs text-zinc-400 font-extrabold select-none pl-2">
                              FCFA
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-500 italic mt-2">
                            Une alerte de dépenses importantes sera générée pour toute dépense supérieure ou égale à ce montant.
                          </p>
                        </div>

                        {/* Save Button */}
                        <div className="pt-4 flex justify-end">
                          <button
                            type="button"
                            onClick={() => {
                              setSystemSettings(prev => ({
                                ...prev,
                                alertLowStock: tempAlertLowStock,
                                alertOutOfStock: tempAlertOutOfStock,
                                alertHighExpense: tempAlertHighExpense,
                                alertUnclosedCaisse: tempAlertUnclosedCaisse,
                                alertConsoleMaintenance: tempAlertConsoleMaintenance,
                                highExpenseThreshold: tempHighExpenseThreshold,
                              }));
                              
                              addLog(
                                "settings_update",
                                `Paramètres d'alertes mis à jour : Stock Bas (${tempAlertLowStock ? "ON" : "OFF"}), Rupture (${tempAlertOutOfStock ? "ON" : "OFF"}), Dépenses (${tempAlertHighExpense ? "ON" : "OFF"}, Seuil: ${tempHighExpenseThreshold} FCFA), Caisse (${tempAlertUnclosedCaisse ? "ON" : "OFF"}), Maintenance (${tempAlertConsoleMaintenance ? "ON" : "OFF"})`,
                                "console"
                              );

                              // Trigger GSAP notification toast
                              setToastText("Paramètres d'alertes enregistrés avec succès !");
                              gsap.fromTo(
                                ".notification-toast",
                                { opacity: 0, y: -20 },
                                { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
                                  setTimeout(() => {
                                    gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
                                  }, 3500);
                                }}
                              );
                            }}
                            className="py-2.5 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black shadow-lg shadow-indigo-950/20 active:scale-95 transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 text-white" />
                            <span>ENREGISTRER</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 4: PERSONNALISATION */}
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl"></div>
                    <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                      <Sliders className="w-5 h-5 text-purple-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">PERSONNALISATION</h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase block mb-2">Thème :</span>
                        
                        <div className="flex gap-6 items-center">
                          {/* Sombre */}
                          <label className="flex items-center gap-2.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="radio" 
                                name="theme-selection"
                                checked={systemSettings.theme === "sombre" || !systemSettings.theme}
                                onChange={() => {
                                  setSystemSettings(prev => ({ ...prev, theme: "sombre" }));
                                  addLog("theme_change", "Thème configuré sur Sombre", "console");
                                }}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                                (systemSettings.theme === "sombre" || !systemSettings.theme) 
                                  ? "border-purple-600" 
                                  : "border-zinc-800"
                              }`}>
                                {(systemSettings.theme === "sombre" || !systemSettings.theme) && (
                                  <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              🌑 Sombre
                            </span>
                          </label>

                          {/* Clair */}
                          <label className="flex items-center gap-2.5 group cursor-pointer select-none">
                            <div className="relative flex items-center justify-center">
                              <input 
                                type="radio" 
                                name="theme-selection"
                                checked={systemSettings.theme === "clair"}
                                onChange={() => {
                                  setSystemSettings(prev => ({ ...prev, theme: "clair" }));
                                  addLog("theme_change", "Thème configuré sur Clair", "console");
                                }}
                                className="sr-only"
                              />
                              <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
                                systemSettings.theme === "clair" 
                                  ? "border-purple-600" 
                                  : "border-zinc-800"
                              }`}>
                                {systemSettings.theme === "clair" && (
                                  <div className="w-2.5 h-2.5 bg-purple-600 rounded-full"></div>
                                )}
                              </div>
                            </div>
                            <span className="text-xs font-semibold text-zinc-300 group-hover:text-white transition-colors">
                              ☀️ Clair
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Section 2: Tarifs Consoles */}
                <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-850 pb-3">
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="w-5 h-5 text-blue-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tarification Horaire des Stations / Consoles</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const zoneName = prompt("Saisissez le nom de la nouvelle zone (ex: D, VIP, Zone D) :");
                          if (zoneName && zoneName.trim()) {
                            const trimmed = zoneName.trim().toUpperCase();
                            if (zones.includes(trimmed)) {
                              alert("Cette zone existe déjà !");
                              return;
                            }
                            setZones(prev => [...prev, trimmed]);
                            addLog("settings_update", `Nouvelle zone ajoutée : Zone ${trimmed}`, "console");
                            
                            setToastText(`Zone ${trimmed} ajoutée avec succès !`);
                            gsap.fromTo(
                              ".notification-toast",
                              { opacity: 0, y: -20 },
                              { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
                                  setTimeout(() => {
                                    gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
                                  }, 3500);
                              }}
                            );
                          }
                        }}
                        className="flex items-center gap-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold px-3 py-1.5 rounded-lg border border-zinc-700/40 transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-emerald-400" />
                        Ajouter une Zone
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddConsoleZone(zones[0] || "A");
                          setShowAddConsoleModal(true);
                        }}
                        className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all active:scale-95 cursor-pointer"
                      >
                        <Plus className="w-3 h-3 text-white" />
                        Nouvelle Console
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {consoles.map(consoleObj => (
                      <div key={consoleObj.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4 space-y-3 relative overflow-hidden flex flex-col justify-between min-h-[140px]">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center overflow-hidden flex-shrink-0">
                              {consoleObj.image ? (
                                <img src={consoleObj.image} className="w-full h-full object-cover" alt="" />
                              ) : (
                                <Gamepad2 className="w-5 h-5 text-zinc-650" />
                              )}
                            </div>
                            <div className="space-y-0.5">
                              <h4 className="text-xs font-extrabold text-white">{consoleObj.name}</h4>
                              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{consoleObj.type} • Zone {consoleObj.zone}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 z-10">
                            <button
                              type="button"
                              onClick={() => {
                                setEditConsoleName(consoleObj.name);
                                setEditConsoleZone(consoleObj.zone);
                                setEditConsoleType(consoleObj.type);
                                setEditConsoleRate(consoleObj.ratePerHour);
                                setEditConsoleImage(consoleObj.image || "");
                                setShowEditConsoleModal(consoleObj);
                              }}
                              className="text-zinc-600 hover:text-blue-400 transition-colors p-1 cursor-pointer"
                              title="Modifier la console"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Voulez-vous vraiment supprimer la console ${consoleObj.name} ?`)) {
                                  setConsoles(prev => prev.filter(c => c.id !== consoleObj.id));
                                  addLog("settings_update", `Console supprimée : ${consoleObj.name}`, "console");
                                  
                                  setToastText(`Console ${consoleObj.name} supprimée !`);
                                  gsap.fromTo(
                                    ".notification-toast",
                                    { opacity: 0, y: -20 },
                                    { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
                                      setTimeout(() => {
                                        gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 });
                                      }, 3500);
                                    }}
                                  );
                                }
                              }}
                              className="text-zinc-600 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                              title="Supprimer la console"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-zinc-900/60 flex items-center justify-between text-[11px]">
                          <span className="text-zinc-500 font-semibold uppercase tracking-wider text-[9px]">Tarif Horaire :</span>
                          <span className="font-mono font-bold text-white bg-zinc-900 px-2 py-1 rounded-lg border border-zinc-800">{consoleObj.ratePerHour.toLocaleString('fr-FR')} {systemSettings.currency}/h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section 3: Catégories & Modes de Paiement editors */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Category editor */}
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                      <Tag className="w-5 h-5 text-teal-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Catégories de Produits Snack</h3>
                    </div>

                    <div className="space-y-3">
                      {/* List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {productCategories.map(cat => (
                          <div key={cat.id} className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                            <div className="flex items-center gap-2">
                              <span className="text-base">{cat.emoji}</span>
                              <span className="text-xs font-bold text-zinc-300 capitalize">{cat.label}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  const nextName = prompt("Nouveau nom pour la catégorie :", cat.label);
                                  if (nextName && nextName.trim()) {
                                    setProductCategories(prev => prev.map(c => c.id === cat.id ? { ...c, label: nextName.trim() } : c));
                                    addLog("category_rename", `Catégorie ${cat.label} renommée en ${nextName.trim()}`, "snack");
                                  }
                                }}
                                className="p-1 text-zinc-500 hover:text-zinc-300 rounded hover:bg-zinc-900"
                                title="Modifier"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (confirm(`Supprimer la catégorie "${cat.label}" ?`)) {
                                    setProductCategories(prev => prev.filter(c => c.id !== cat.id));
                                    addLog("category_delete", `Catégorie ${cat.label} supprimée`, "snack");
                                  }
                                }}
                                className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-900"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Add category form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const label = e.target.label.value.trim();
                          const emoji = e.target.emoji.value.trim() || "📦";
                          if (!label) return;
                          const id = label.toLowerCase().replace(/[^a-z0-9]/g, "-");
                          if (productCategories.find(c => c.id === id)) {
                            alert("Cette catégorie existe déjà !");
                            return;
                          }
                          setProductCategories(prev => [...prev, { id, label, emoji }]);
                          addLog("category_add", `Nouvelle catégorie ajoutée : ${label}`, "snack");
                          e.target.reset();
                        }}
                        className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex gap-2.5 items-end"
                      >
                        <div className="w-16 space-y-1">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase block">Emoji :</label>
                          <input 
                            name="emoji" 
                            type="text" 
                            placeholder="🍿" 
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-center focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase block">Nom Catégorie :</label>
                          <input 
                            name="label" 
                            type="text" 
                            placeholder="Ex: Chocolats" 
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-teal-500"
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="bg-teal-600 hover:bg-teal-500 text-white rounded-lg p-2 font-bold transition-all shadow-md active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>

                    </div>
                  </div>

                  {/* Payment method editor */}
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-800/80 space-y-4">
                    <div className="flex items-center gap-2 border-b border-zinc-850 pb-3">
                      <CreditCard className="w-5 h-5 text-cyan-400" />
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">Modes de Paiement</h3>
                    </div>

                    <div className="space-y-3">
                      {/* List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        {paymentMethods.map(method => (
                          <div key={method} className="flex items-center justify-between p-2.5 bg-zinc-950 border border-zinc-900 rounded-xl">
                            <span className="text-xs font-bold text-zinc-300 capitalize">{method}</span>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Supprimer le mode de paiement "${method}" ?`)) {
                                  setPaymentMethods(prev => prev.filter(m => m !== method));
                                  addLog("payment_method_delete", `Mode de paiement supprimé : ${method}`, "snack");
                                }
                              }}
                              className="p-1 text-zinc-500 hover:text-rose-400 rounded hover:bg-zinc-900"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Add payment method form */}
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          const val = e.target.methodName.value.trim().toLowerCase();
                          if (!val) return;
                          if (paymentMethods.includes(val)) {
                            alert("Ce mode de paiement existe déjà !");
                            return;
                          }
                          setPaymentMethods(prev => [...prev, val]);
                          addLog("payment_method_add", `Nouveau mode de paiement ajouté : ${val}`, "snack");
                          e.target.reset();
                        }}
                        className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-900 flex gap-2.5 items-end"
                      >
                        <div className="flex-1 space-y-1">
                          <label className="text-[9px] font-bold text-zinc-500 uppercase block">Mode de paiement :</label>
                          <input 
                            name="methodName" 
                            type="text" 
                            placeholder="Ex: Orange Money" 
                            required
                            className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <button 
                          type="submit" 
                          className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg p-2 font-bold transition-all shadow-md active:scale-95"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </form>

                    </div>
                  </div>

                </div>

              </div>
            )}

            {activeTab === "caisse" && (
              <div className="space-y-6 graffiti-spray-purple">
                <div>
                  <span className="sticker-badge bg-amber-950/60 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block font-sans">
                    Gestion de Caisse & Shifts
                  </span>
                </div>

                {/* Sub-tabs toggle bar */}
                <div className="flex gap-2 border-b border-zinc-800 pb-px">
                  <button
                    onClick={() => setCaisseSubTab("suivi")}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                      caisseSubTab === "suivi" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Suivi Caisse Direct
                  </button>
                  <button
                    onClick={() => setCaisseSubTab("historique")}
                    className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 border-b-2 ${
                      caisseSubTab === "historique" ? "border-amber-500 text-amber-400" : "border-transparent text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Historique des Shifts
                  </button>
                </div>

                {/* Content based on sub-tab */}
                {caisseSubTab === "suivi" ? (
                  caisseStatus === "fermée" ? (
                    /* Cash Register CLOSED state view */
                    <div className="glass-panel p-8 rounded-2xl border border-zinc-850 text-center space-y-6 max-w-xl mx-auto my-8 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full blur-2xl"></div>
                      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-full flex items-center justify-center mx-auto text-2xl shadow-lg shadow-rose-950/20 animate-bounce">
                        <Lock className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-rose-400 uppercase tracking-wide">La Caisse est Fermée</h3>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Toutes les transactions (lancements de consoles, ventes de snacks, enregistrement de dépenses ou d'achats) sont suspendues tant que la caisse n'est pas ouverte.
                        </p>
                      </div>

                      <div className="pt-2">
                        <button
                          onClick={() => {
                            // Pre-fill opening balance with the last closed session's real balance
                            const lastClosed = caisseSessions[0];
                            setOpenCaisseBalance(lastClosed ? lastClosed.realBalance : "250000");
                            setOpenCaisseOperator("");
                            setShowOpenCaisseModal(true);
                          }}
                          className="py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-orange-950/20 active:scale-95 transition-all inline-flex items-center gap-2"
                        >
                          <Unlock className="w-4 h-4" />
                          Ouvrir la Caisse (Nouveau Shift)
                        </button>
                      </div>

                      {caisseSessions.length > 0 && (
                        <div className="border-t border-zinc-900 pt-4 text-left">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2">Dernière clôture enregistrée :</span>
                          <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 flex justify-between items-center text-xs">
                            <div>
                              <p className="text-zinc-400 font-semibold">Par : <span className="text-white font-bold">{caisseSessions[0].closedBy}</span></p>
                              <p className="text-[10px] text-zinc-500">{new Date(caisseSessions[0].dateClose).toLocaleDateString('fr-FR')} à {new Date(caisseSessions[0].dateClose).toLocaleTimeString('fr-FR')}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-zinc-500 font-medium">Solde réel clôturé</p>
                              <p className="font-bold text-emerald-400 font-mono text-sm">{caisseSessions[0].realBalance.toLocaleString('fr-FR')} FCFA</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Cash Register OPEN state view */
                    <div className="space-y-6 animate-fade-in">
                      {/* Top Action Buttons (Mouvement / Fermer Caisse) */}
                      <div className="flex gap-4">
                        <button
                          type="button"
                          onClick={() => {
                            setMovementType("entrée");
                            setMovementAmount("");
                            setMovementReason("");
                            setMovementOperator(activeCaisseSession.openedBy || "");
                            setShowAddMovementModal(true);
                          }}
                          className="py-2.5 px-5 bg-zinc-950 border border-zinc-850 hover:bg-zinc-900 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-2 transition-all active:scale-[0.98]"
                        >
                          <span className="text-emerald-400 font-extrabold text-base leading-none">+</span>
                          Mouvement
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCloseCaisseRealBalance("");
                            setCloseCaisseNotes("");
                            setCloseCaisseOperator(activeCaisseSession.openedBy || "");
                            setShowCloseCaisseModal(true);
                          }}
                          className="py-2.5 px-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-black tracking-wider uppercase shadow-lg shadow-rose-950/20 flex items-center gap-2 transition-all active:scale-[0.98]"
                        >
                          <LogOut className="w-4 h-4" />
                          Fermer la caisse
                        </button>
                      </div>

                      {/* Cash Register State Banner */}
                      <div className="flex justify-between items-center bg-emerald-950/20 border border-emerald-500/30 p-5 rounded-2xl relative overflow-hidden shadow-inner">
                        <div className="flex items-center gap-4">
                          {/* Glowing pulsing dot */}
                          <div className="relative flex h-3.5 w-3.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                              Caisse OUVERTE
                            </h3>
                            <p className="text-[11px] text-zinc-450 mt-1">
                              Caissier: <span className="text-white font-bold">{activeCaisseSession.openedBy}</span>
                              <span className="mx-2 text-zinc-650">•</span>
                              Durée {getSessionDuration()}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            // Manual tick trigger
                            setCaisseTimerTick(t => t + 1);
                          }}
                          className="p-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl border border-zinc-850 transition-colors"
                          title="Rafraîchir la durée"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Metrics 4 Grid */}
                      {(() => {
                        const opening = activeCaisseSession.openingBalance || 0;
                        const jeux = activeCaisseSession.gamesRevenue || 0;
                        const snack = activeCaisseSession.snackRevenue || 0;
                        const totalSales = jeux + snack;
                        const transactions = activeCaisseSession.transactionsCount || 0;
                        
                        const manualInflows = (activeCaisseSession.movements || [])
                          .filter(m => m.type === "entrée")
                          .reduce((sum, m) => sum + m.amount, 0);
                        const manualOutflows = (activeCaisseSession.movements || [])
                          .filter(m => m.type === "sortie")
                          .reduce((sum, m) => sum + m.amount, 0);
                          
                        const expMaintenance = activeCaisseSession.expensesMaintenance || 0;
                        const expDiverses = activeCaisseSession.expensesDiverses || 0;
                        const purcCash = activeCaisseSession.purchasesCash || 0;
                        const refunds = activeCaisseSession.refunds || 0;
                        
                        // expected cash balance
                        const expectedCash = opening + (activeCaisseSession.paymentEspèces || 0) + manualInflows - manualOutflows - expMaintenance - expDiverses - purcCash - refunds;

                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* 1. VENTES SESSION */}
                              <div className="glass-panel p-4 rounded-2xl border border-zinc-850 flex items-center justify-between shadow-md relative overflow-hidden">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Ventes Session</span>
                                  <span className="text-base font-extrabold text-white font-mono">
                                    {totalSales.toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                                <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center">
                                  <ShoppingCart className="w-5 h-5" />
                                </div>
                              </div>

                              {/* 2. TRANSACTIONS */}
                              <div className="glass-panel p-4 rounded-2xl border border-zinc-850 flex items-center justify-between shadow-md relative overflow-hidden">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Transactions</span>
                                  <span className="text-base font-extrabold text-white font-mono">
                                    {transactions}
                                  </span>
                                </div>
                                <div className="w-10 h-10 bg-violet-500/10 text-violet-400 border border-violet-500/20 rounded-xl flex items-center justify-center">
                                  <TrendingUp className="w-5 h-5" />
                                </div>
                              </div>

                              {/* 3. FOND INITIAL */}
                              <div className="glass-panel p-4 rounded-2xl border border-zinc-850 flex items-center justify-between shadow-md relative overflow-hidden">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Fond Initial</span>
                                  <span className="text-base font-extrabold text-white font-mono">
                                    {opening.toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                                <div className="w-10 h-10 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center">
                                  <DollarSign className="w-5 h-5" />
                                </div>
                              </div>

                              {/* 4. DUREE */}
                              <div className="glass-panel p-4 rounded-2xl border border-zinc-850 flex items-center justify-between shadow-md relative overflow-hidden">
                                <div className="space-y-1">
                                  <span className="text-[10px] text-zinc-550 font-bold uppercase tracking-wider block">Durée</span>
                                  <span className="text-base font-extrabold text-white font-mono">
                                    {getSessionDuration()}
                                  </span>
                                </div>
                                <div className="w-10 h-10 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                                  <Clock className="w-5 h-5" />
                                </div>
                              </div>
                            </div>

                            {/* Section: Répartition des Paiements */}
                            <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4">
                              <h4 className="text-xs font-black text-white uppercase tracking-wider">Répartition des paiements</h4>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex justify-between items-center">
                                  <span className="text-xs text-zinc-400 font-semibold">Espèces</span>
                                  <span className="text-sm font-black text-emerald-400 font-mono">
                                    {(activeCaisseSession.paymentEspèces || 0).toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex justify-between items-center">
                                  <span className="text-xs text-zinc-400 font-semibold">Mobile Money</span>
                                  <span className="text-sm font-black text-blue-400 font-mono">
                                    {(activeCaisseSession.paymentMobileMoney || 0).toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                                <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 flex justify-between items-center">
                                  <span className="text-xs text-zinc-400 font-semibold">Carte</span>
                                  <span className="text-sm font-black text-teal-400 font-mono">
                                    {(activeCaisseSession.paymentCarte || 0).toLocaleString('fr-FR')} FCFA
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Situation Théorique and Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Left Column: Situation Théorique (2 cols span) */}
                              <div className="lg:col-span-2 bg-amber-500/[0.03] border border-amber-500/20 p-6 rounded-2xl space-y-4">
                                <h4 className="text-xs font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                                  Situation théorique
                                </h4>
                                <div className="space-y-3.5 text-xs">
                                  <div className="flex justify-between items-center text-zinc-400">
                                    <span>Fond initial :</span>
                                    <span className="font-mono text-zinc-300 font-bold">{opening.toLocaleString('fr-FR')} FCFA</span>
                                  </div>
                                  <div className="flex justify-between items-center text-zinc-400">
                                    <span>+ Ventes espèces :</span>
                                    <span className="font-mono text-emerald-400 font-bold">+{ (activeCaisseSession.paymentEspèces || 0).toLocaleString('fr-FR') } FCFA</span>
                                  </div>
                                  <div className="flex justify-between items-center text-zinc-400">
                                    <span>+ Entrées (apports) :</span>
                                    <span className="font-mono text-emerald-400 font-bold">+{ manualInflows.toLocaleString('fr-FR') } FCFA</span>
                                  </div>
                                  <div className="flex justify-between items-center text-zinc-450 border-b border-zinc-900 pb-2">
                                    <span>- Sorties (retraits manuels / charges shift) :</span>
                                    <span className="font-mono text-rose-400 font-bold">
                                      -{ (manualOutflows + expMaintenance + expDiverses + purcCash + refunds).toLocaleString('fr-FR') } FCFA
                                    </span>
                                  </div>
                                  <div className="pt-2 flex justify-between items-center text-sm font-black text-amber-400">
                                    <span>Caisse attendue (tiroir caisse) :</span>
                                    <span className="font-mono text-base">{expectedCash.toLocaleString('fr-FR')} FCFA</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right Column: Shift details */}
                              <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4 flex flex-col justify-between">
                                <div className="space-y-4">
                                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">📋 Renseignements Shift</h4>
                                  <ul className="space-y-3 text-xs text-zinc-400 font-medium">
                                    <li className="flex justify-between border-b border-zinc-900 pb-2">
                                      <span>Identifiant :</span>
                                      <span className="text-white font-mono font-bold">{activeCaisseSession.id}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-zinc-900 pb-2">
                                      <span>Début Shift :</span>
                                      <span className="text-white font-bold">{new Date(activeCaisseSession.dateOpen).toLocaleTimeString('fr-FR')}</span>
                                    </li>
                                    <li className="flex justify-between border-b border-zinc-900 pb-2">
                                      <span>Opérateur :</span>
                                      <span className="text-white font-bold">{activeCaisseSession.openedBy}</span>
                                    </li>
                                  </ul>
                                </div>
                                <div className="pt-4 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handlePrintShiftReport(activeCaisseSession)}
                                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                  >
                                    <Printer className="w-4.5 h-4.5" />
                                    Imprimer Ticket d'État
                                  </button>
                                </div>
                              </div>
                            </div>

                            {/* Section: Historique des mouvements récents de la session */}
                            <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4">
                              <div className="flex justify-between items-center">
                                <h4 className="text-xs font-black text-white uppercase tracking-wider">Mouvements de Caisse récents</h4>
                                <span className="text-[10px] text-zinc-550 font-bold font-mono">
                                  {(activeCaisseSession.movements || []).length} mouvement(s)
                                </span>
                              </div>
                              
                              {(activeCaisseSession.movements || []).length === 0 ? (
                                <p className="text-xs text-zinc-500 italic text-center py-4">Aucun mouvement saisi durant ce shift.</p>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse text-xs">
                                    <thead>
                                      <tr className="border-b border-zinc-900 text-[10px] text-zinc-500 uppercase font-bold tracking-wider">
                                        <th className="py-2.5">Heure</th>
                                        <th className="py-2.5">Type</th>
                                        <th className="py-2.5">Motif</th>
                                        <th className="py-2.5">Responsable</th>
                                        <th className="py-2.5 text-right">Montant</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {activeCaisseSession.movements.map((mov, idx) => (
                                        <tr key={idx} className="border-b border-zinc-900/40 hover:bg-zinc-950/20 text-zinc-300 font-medium">
                                          <td className="py-2.5 font-mono">{new Date(mov.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</td>
                                          <td className="py-2.5">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                              mov.type === "entrée" ? "bg-emerald-950/40 text-emerald-400 border border-emerald-500/20" : "bg-rose-950/40 text-rose-400 border border-rose-500/20"
                                            }`}>
                                              {mov.type}
                                            </span>
                                          </td>
                                          <td className="py-2.5">{mov.reason}</td>
                                          <td className="py-2.5">{mov.operator}</td>
                                          <td className={`py-2.5 text-right font-bold font-mono ${mov.type === "entrée" ? "text-emerald-400" : "text-rose-400"}`}>
                                            {mov.type === "entrée" ? "+" : "-"}{mov.amount.toLocaleString('fr-FR')} FCFA
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )
                ) : (
                  /* History sub-tab view */
                  <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4">
                    <div className="flex justify-between items-center pb-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">📜 Historique des shifts clôturés</h4>
                      <span className="text-[10px] bg-zinc-900 px-3 py-1 rounded-xl text-zinc-400 font-semibold border border-zinc-800">
                        {caisseSessions.length} Shift(s) au total
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-zinc-850 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                            <th className="p-4">Période Shift</th>
                            <th className="p-4">Gérants</th>
                            <th className="p-4 text-right">Ouverture</th>
                            <th className="p-4 text-right">Recettes (+J / +S)</th>
                            <th className="p-4 text-right">Dépenses (-D / -A)</th>
                            <th className="p-4 text-right">Solde Théorique</th>
                            <th className="p-4 text-right">Solde Réel</th>
                            <th className="p-4 text-center">Écart</th>
                            <th className="p-4 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {caisseSessions.map((session, idx) => {
                            const isOk = session.variance === 0;
                            const isNegative = session.variance < 0;

                            return (
                              <tr key={idx} className="border-b border-zinc-900/60 hover:bg-zinc-950/40 text-xs text-zinc-300 font-medium">
                                <td className="p-4 space-y-0.5">
                                  <p className="text-white font-bold">{new Date(session.dateOpen).toLocaleDateString('fr-FR')}</p>
                                  <p className="text-[9px] text-zinc-500">
                                    {new Date(session.dateOpen).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ➡️ {new Date(session.dateClose).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                  </p>
                                </td>
                                <td className="p-4 space-y-0.5">
                                  <p className="text-zinc-300">Open: <span className="text-white font-bold">{session.openedBy}</span></p>
                                  <p className="text-zinc-400">Close: <span className="text-white font-bold">{session.closedBy}</span></p>
                                </td>
                                <td className="p-4 text-right font-mono text-zinc-400">
                                  {session.openingBalance.toLocaleString('fr-FR')} FCFA
                                </td>
                                <td className="p-4 text-right font-mono text-emerald-400 space-y-0.5">
                                  <p>🎮 {session.gamesRevenue.toLocaleString('fr-FR')}</p>
                                  <p className="text-[10px] text-emerald-500/80">🥤 {session.snackRevenue.toLocaleString('fr-FR')}</p>
                                </td>
                                <td className="p-4 text-right font-mono text-rose-400 space-y-0.5">
                                  <p>💸 {session.expenses.toLocaleString('fr-FR')}</p>
                                  <p className="text-[10px] text-rose-500/80">🛒 {session.purchases.toLocaleString('fr-FR')}</p>
                                </td>
                                <td className="p-4 text-right font-mono text-zinc-400">
                                  {session.expectedBalance.toLocaleString('fr-FR')} FCFA
                                </td>
                                <td className="p-4 text-right font-mono text-white font-bold">
                                  {session.realBalance.toLocaleString('fr-FR')} FCFA
                                </td>
                                <td className="p-4 text-center">
                                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                                    isOk 
                                      ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30" 
                                      : isNegative
                                        ? "bg-rose-950/60 text-rose-400 border-rose-500/30 font-bold tracking-tight shadow-md shadow-rose-950/20"
                                        : "bg-amber-950/60 text-amber-400 border-amber-500/30 font-bold tracking-tight shadow-md shadow-amber-950/20"
                                  }`}>
                                    {isOk ? (
                                      "Conforme"
                                    ) : (
                                      `${session.variance > 0 ? '+' : ''}${session.variance.toLocaleString('fr-FR')} FCFA`
                                    )}
                                  </span>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="flex items-center justify-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setShowViewShiftModal(session)}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                    >
                                      👁️ Voir
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handlePrintShiftReport(session)}
                                      className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-cyan-400 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                      title="Imprimer"
                                    >
                                      🖨️ Imprimer
                                    </button>
                                    {role === "admin" && (
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteCaisseSession(session.id)}
                                        className="p-1 px-2.5 bg-zinc-900 hover:bg-zinc-800 text-rose-500 rounded-lg font-bold text-[10px] border border-zinc-800 transition-colors"
                                      >
                                        🗑️ Supprimer
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </main>


      {/* ==================== MODALS & POPUPS ==================== */}

      {/* Modale Ouverture de Caisse */}
      {showOpenCaisseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Ouverture de Caisse</h3>
              </div>
              <button 
                onClick={() => setShowOpenCaisseModal(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleOpenCaisse(openCaisseBalance, openCaisseOperator);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Fond de caisse d'ouverture (FCFA)</label>
                <input 
                  type="number"
                  required
                  placeholder="Ex: 250000"
                  value={openCaisseBalance}
                  onChange={(e) => setOpenCaisseBalance(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Opérateur de Caisse</label>
                <input 
                  type="text"
                  required
                  placeholder="Nom de l'opérateur"
                  value={openCaisseOperator}
                  onChange={(e) => setOpenCaisseOperator(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowOpenCaisseModal(false)}
                  className="flex-1 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-orange-950/20 active:scale-95 transition-all"
                >
                  Ouvrir la Caisse
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Nouveau Mouvement de Caisse */}
      {showAddMovementModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">💰</span>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Saisir un Mouvement</h3>
              </div>
              <button 
                onClick={() => setShowAddMovementModal(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleAddCaisseMovement(movementType, movementAmount, movementReason, movementOperator);
              }}
              className="space-y-4"
            >
              {/* Type toggle */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Type de flux</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMovementType("entrée")}
                    className={`py-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      movementType === "entrée"
                        ? "bg-emerald-950/30 border-emerald-500/50 text-emerald-400 shadow-inner font-extrabold"
                        : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    📥 Entrée (Apport)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMovementType("sortie")}
                    className={`py-2.5 rounded-xl border text-center text-xs font-bold transition-all ${
                      movementType === "sortie"
                        ? "bg-rose-950/30 border-rose-500/50 text-rose-400 shadow-inner font-extrabold"
                        : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    📤 Sortie (Retrait / Charge)
                  </button>
                </div>
              </div>

              {/* Amount input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Montant du mouvement (FCFA)</label>
                <input 
                  type="number"
                  required
                  placeholder="Ex: 5000"
                  value={movementAmount}
                  onChange={(e) => setMovementAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Motif input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Motif / Description</label>
                <input 
                  type="text"
                  required
                  placeholder="Ex: Apport monnaie matin, Achat ampoule bar..."
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Responsible/Operator input */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Responsable de l'opération</label>
                <input 
                  type="text"
                  required
                  placeholder="Nom du responsable"
                  value={movementOperator}
                  onChange={(e) => setMovementOperator(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddMovementModal(false)}
                  className="flex-1 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black rounded-xl text-xs font-extrabold tracking-wider uppercase shadow-lg shadow-orange-950/20 active:scale-95 transition-all"
                >
                  Valider
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modale Fermeture de Caisse */}
      {showCloseCaisseModal && activeCaisseSession && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-4 animate-scale-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-rose-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-wider">Clôture de Caisse (Rapport Z)</h3>
              </div>
              <button 
                onClick={() => setShowCloseCaisseModal(false)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Shift financial details */}
            <div className="bg-zinc-950/60 p-4 rounded-xl border border-zinc-900 space-y-2 text-xs">
              <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-2 border-b border-zinc-900 pb-1">Bilan Théorique du Shift</h4>
              <div className="flex justify-between">
                <span className="text-zinc-400">Fond d'Ouverture :</span>
                <span className="font-mono text-zinc-300">{activeCaisseSession.openingBalance.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>(+) Jeux (revenus joueurs) :</span>
                <span className="font-mono">+{activeCaisseSession.gamesRevenue.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-emerald-400">
                <span>(+) Snack (ventes snack) :</span>
                <span className="font-mono">+{activeCaisseSession.snackRevenue.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) Achats stocks :</span>
                <span className="font-mono">-{activeCaisseSession.purchases.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) Dépenses Diverses :</span>
                <span className="font-mono">-{activeCaisseSession.expensesDiverses.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) Maintenance :</span>
                <span className="font-mono">-{activeCaisseSession.expensesMaintenance.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>(-) Remboursements :</span>
                <span className="font-mono">-{activeCaisseSession.refunds.toLocaleString('fr-FR')} FCFA</span>
              </div>
              
              {(() => {
                const expected = activeCaisseSession.openingBalance 
                  + activeCaisseSession.gamesRevenue 
                  + activeCaisseSession.snackRevenue 
                  - activeCaisseSession.purchases
                  - activeCaisseSession.expensesDiverses
                  - activeCaisseSession.expensesMaintenance
                  - activeCaisseSession.refunds;
                
                const real = parseFloat(closeCaisseRealBalance || 0);
                const variance = real - expected;

                return (
                  <>
                    <div className="flex justify-between font-bold text-cyan-400 border-t border-zinc-900 pt-2 mt-2 text-sm">
                      <span>Solde Attendu :</span>
                      <span className="font-mono">{expected.toLocaleString('fr-FR')} FCFA</span>
                    </div>

                    <div className="flex justify-between font-bold border-t border-zinc-900 pt-2 text-xs">
                      <span className="text-zinc-300">Écart de Caisse calculé :</span>
                      {closeCaisseRealBalance ? (
                        <span className={`font-mono text-sm ${variance === 0 ? 'text-emerald-400' : variance < 0 ? 'text-rose-400' : 'text-amber-400'}`}>
                          {variance > 0 ? '+' : ''}{variance.toLocaleString('fr-FR')} FCFA
                          <span className="text-[10px] ml-1.5 font-bold uppercase">
                            ({variance === 0 ? 'Conforme' : variance < 0 ? 'Déficit' : 'Surplus'})
                          </span>
                        </span>
                      ) : (
                        <span className="text-zinc-500 italic">Saisir le solde réel</span>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleCloseCaisse(closeCaisseRealBalance, closeCaisseNotes, closeCaisseOperator);
              }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Solde Réel Compté (FCFA)</label>
                <input 
                  type="number"
                  required
                  placeholder="Saisir le montant en caisse"
                  value={closeCaisseRealBalance}
                  onChange={(e) => setCloseCaisseRealBalance(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Fermé par (Opérateur clôture)</label>
                <input 
                  type="text"
                  required
                  placeholder="Nom du responsable"
                  value={closeCaisseOperator}
                  onChange={(e) => setCloseCaisseOperator(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Remarques & Écarts de Caisse (Optionnel)</label>
                <textarea 
                  placeholder="Détails sur l'écart de caisse ou observations..."
                  rows="2"
                  value={closeCaisseNotes}
                  onChange={(e) => setCloseCaisseNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowCloseCaisseModal(false)}
                  className="flex-1 py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-lg shadow-rose-950/20 active:scale-95 transition-all"
                >
                  Valider la Fermeture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Modal Démarrer Session Console */}
      {showStartModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Lancer une session</h3>
              </div>
              <button 
                onClick={() => setShowStartModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            {/* Console summary */}
            <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800 flex items-center justify-between text-xs">
              <div>
                <p className="font-bold text-white">{showStartModal.name}</p>
                <p className="text-[10px] text-zinc-400 uppercase font-semibold">{showStartModal.type}</p>
              </div>
              <span className="font-bold text-emerald-400">{showStartModal.ratePerHour.toLocaleString('fr-FR')} FCFA/h</span>
            </div>

            {/* Prepaid Info Badge */}
            <div className="p-3 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Paiement d'avance requis</p>
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Le client doit régler la session avant de jouer. Un forfait d'une heure minimum est perçu pour les sessions libres.
                </p>
              </div>
            </div>

            {/* Forms */}
            <div className="space-y-4">
              
              {/* Recherche Joueur Existant */}
              <div className="relative">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                  🔍 Rechercher un joueur existant (Optionnel) :
                </label>
                <input 
                  type="text"
                  placeholder="Saisir un nom ou téléphone..."
                  value={playerSearchVal}
                  onChange={(e) => {
                    setPlayerSearchVal(e.target.value);
                    setShowPlayerDropdown(true);
                  }}
                  onFocus={() => setShowPlayerDropdown(true)}
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                />
                {playerSearchVal && (
                  <button
                    type="button"
                    onClick={() => {
                      setPlayerSearchVal("");
                      setShowPlayerDropdown(false);
                      setNewPlayerPseudo("");
                      setNewPlayerPhone("");
                    }}
                    className="absolute right-3.5 top-[27px] text-zinc-500 hover:text-zinc-300 text-xs font-bold cursor-pointer"
                  >
                    ✕
                  </button>
                )}
                
                {showPlayerDropdown && playerSearchVal.trim().length > 0 && (() => {
                  const filtered = players.filter(p => {
                    const search = playerSearchVal.toLowerCase();
                    const pNom = (p.nom || "").toLowerCase();
                    const pPhone = (p.phone || p.telephone || "").toLowerCase();
                    return pNom.includes(search) || pPhone.includes(search);
                  });

                  if (filtered.length === 0) return null;

                  return (
                    <div className="absolute left-0 right-0 mt-1 bg-zinc-950/95 border border-zinc-800 rounded-xl shadow-xl z-30 max-h-40 overflow-y-auto divide-y divide-zinc-900/60 backdrop-blur-md">
                      {filtered.map(p => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setNewPlayerPseudo(p.nom || "");
                            setNewPlayerPhone(p.phone || p.telephone || "");
                            setPlayerSearchVal(p.nom || "");
                            setShowPlayerDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-zinc-900 text-xs text-zinc-300 hover:text-white flex items-center justify-between transition-colors font-medium cursor-pointer"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400">👤</span>
                            <span>{p.nom}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 font-mono">{p.phone || p.telephone}</span>
                        </button>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Pseudo (Surnom)</label>
                <input 
                  type="text"
                  placeholder="Ex: Sofiane"
                  value={newPlayerPseudo}
                  onChange={(e) => setNewPlayerPseudo(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Numéro de Téléphone</label>
                <input 
                  type="tel"
                  placeholder="Ex: 06 12 34 56 78"
                  value={newPlayerPhone}
                  onChange={(e) => setNewPlayerPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1.5">Mode de Facturation</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewDurationType("unlimited")}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      newDurationType === "unlimited"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    Temps libre (Illimité)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewDurationType("limited")}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${
                      newDurationType === "limited"
                        ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/50"
                        : "bg-zinc-900 text-zinc-400 border-zinc-800"
                    }`}
                  >
                    Temps Limité (Forfait)
                  </button>
                </div>
              </div>

              {newDurationType === "unlimited" ? (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Montant Prépayé Libre (FCFA)</label>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    placeholder="Saisir le montant paid d'avance"
                    value={newPrepaidAmount}
                    onChange={(e) => setNewPrepaidAmount(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs font-bold text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <p className="text-[9px] text-zinc-500 mt-1 italic">
                    Saisissez le montant arbitraire payé d'avance par le client pour cette session libre.
                  </p>
                </div>
              ) : (
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Durée (Heures)</label>
                  <select
                    value={newDurationHours}
                    onChange={(e) => setNewDurationHours(Number(e.target.value))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value={1}>1 Heure ({showStartModal.ratePerHour.toLocaleString('fr-FR')} FCFA)</option>
                    <option value={2}>2 Heures ({(showStartModal.ratePerHour * 2).toLocaleString('fr-FR')} FCFA)</option>
                    <option value={3}>3 Heures ({(showStartModal.ratePerHour * 3).toLocaleString('fr-FR')} FCFA)</option>
                    <option value={4}>4 Heures ({(showStartModal.ratePerHour * 4).toLocaleString('fr-FR')} FCFA)</option>
                  </select>
                </div>
              )}
            </div>

            {/* CTAs */}
            {(() => {
              const amountToPay = newDurationType === "limited"
                ? showStartModal.ratePerHour * newDurationHours
                : Number(newPrepaidAmount || 0);
              return (
                <div className="flex items-center gap-3 pt-2">
                  <button 
                    onClick={() => setShowStartModal(null)}
                    className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => handleStartSession(showStartModal)}
                    disabled={!newPlayerPseudo.trim() || !newPlayerPhone.trim()}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/20 active:scale-[0.98] transition-all"
                  >
                    Encaisser {amountToPay.toLocaleString('fr-FR')} FCFA & Démarrer
                  </button>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* Modal Interrompre / Annuler Session */}
      {showInterruptModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                <h3 className="text-base font-bold text-white">Interrompre la session</h3>
              </div>
              <button 
                onClick={() => setShowInterruptModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            {/* Session details */}
            <div className="p-3.5 bg-zinc-900/80 rounded-xl border border-zinc-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Poste :</span>
                <span className="text-white font-bold">{showInterruptModal.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Joueur :</span>
                <span className="text-white font-bold">{showInterruptModal.activeSession?.player}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-medium">Temps écoulé :</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {formatTime(showInterruptModal.activeSession?.timeElapsedSeconds || 0)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/30 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Option A : Annuler la session (Rembourser)</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Annule complètement la session de jeu en cours. Rembourse le forfait prépayé de <strong>{(showInterruptModal.activeSession?.prepaidAmount || 0).toLocaleString('fr-FR')} FCFA</strong>. La console redeviendra libre.
                </p>
                <button
                  onClick={() => handleCancelSession(
                    showInterruptModal.id, 
                    showInterruptModal.activeSession?.player || "Joueur",
                    showInterruptModal.name,
                    showInterruptModal.activeSession?.prepaidAmount || 0
                  )}
                  className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-rose-950/20"
                >
                  Annuler la session et rembourser
                </button>
              </div>

              <div className="rounded-xl border border-zinc-800 p-4 bg-zinc-900/30 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Option B : Clôturer au prorata</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed">
                  Arrête la session de jeu et calcule la différence entre la somme déjà prépayée au démarrage et le coût du temps réellement joué au prorata.
                </p>
                
                {/* Cost breakdown */}
                {(() => {
                  const isUnlimited = showInterruptModal.activeSession?.durationType === "unlimited";
                  const elapsedSeconds = showInterruptModal.activeSession?.timeElapsedSeconds || 0;
                  const elapsedHours = elapsedSeconds / 3600;
                  const prepaid = showInterruptModal.activeSession?.prepaidAmount || 0;
                  const prorataGameCost = isUnlimited ? prepaid : Math.round(elapsedHours * showInterruptModal.ratePerHour);
                  const snackCost = showInterruptModal.activeSession?.extraSnacksBill || 0;
                  const cashAdjustment = (prorataGameCost - prepaid) + snackCost;

                  return (
                    <>
                      <div className="space-y-1.5 text-xs border-t border-zinc-850 pt-2.5">
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">Prépayé au démarrage :</span>
                          <span className="text-white font-bold font-mono">{prepaid.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">{isUnlimited ? "Jeu réel (Temps libre) :" : `Jeu réel (${formatTime(elapsedSeconds)}) :`}</span>
                          <span className="text-white font-bold font-mono">{prorataGameCost.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-zinc-500 font-medium">Consos snack :</span>
                          <span className="text-white font-bold font-mono">{snackCost.toLocaleString('fr-FR')} FCFA</span>
                        </div>
                        {cashAdjustment < 0 ? (
                          <div className="flex justify-between border-t border-zinc-850 pt-1.5 text-emerald-400 font-bold">
                            <span>Remboursement client :</span>
                            <span className="font-mono">{Math.abs(cashAdjustment).toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        ) : (
                          <div className="flex justify-between border-t border-zinc-850 pt-1.5 text-rose-400 font-bold">
                            <span>Solde à payer :</span>
                            <span className="font-mono">{cashAdjustment.toLocaleString('fr-FR')} FCFA</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleInterruptProrata(
                          showInterruptModal.id,
                          elapsedSeconds,
                          snackCost,
                          showInterruptModal.activeSession?.player || "Joueur",
                          showInterruptModal.name,
                          showInterruptModal.ratePerHour,
                          prepaid,
                          showInterruptModal.activeSession?.durationType || "unlimited"
                        )}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-950/20"
                      >
                        {cashAdjustment < 0 
                          ? `Rembourser ${Math.abs(cashAdjustment).toLocaleString('fr-FR')} FCFA & Libérer` 
                          : `Encaisser solde ${cashAdjustment.toLocaleString('fr-FR')} FCFA & Libérer`}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            <button 
              onClick={() => setShowInterruptModal(null)}
              className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
            >
              Fermer
            </button>

          </div>
        </div>
      )}

      {/* 2. Modal Clôturer Session / Encaissement Facture */}
      {showCloseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-rose-400" />
                <h3 className="text-base font-bold text-white">Facturation & Clôture</h3>
              </div>
              <button 
                onClick={() => setShowCloseModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            {/* Session Summary */}
            {(() => {
              const prepaid = showCloseModal.activeSession?.prepaidAmount || 0;
              const gameCost = showCloseModal.activeSession?.durationType === "limited" 
                ? Math.round((showCloseModal.activeSession.durationMinutes / 60) * showCloseModal.ratePerHour)
                : prepaid; // For unlimited, the game cost is exactly the prepaid amount (no hourly billing)
              const gameCostDue = Math.max(0, gameCost - prepaid);
              const snackCost = showCloseModal.activeSession?.extraSnacksBill || 0;
              const totalCost = gameCostDue + snackCost;
              
              return (
                <div className="space-y-4">
                  <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-855 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Poste :</span>
                      <span className="text-white font-bold">{showCloseModal.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Joueur :</span>
                      <span className="text-white font-bold">{showCloseModal.activeSession?.player}</span>
                    </div>
                    {showCloseModal.activeSession?.phone && (
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Téléphone :</span>
                        <span className="text-white font-mono font-semibold">{showCloseModal.activeSession.phone}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Type de Session :</span>
                      <span className="text-white font-semibold">
                        {showCloseModal.activeSession?.durationType === "limited" ? "Forfait" : "Temps Libre"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400">Tarif horaire :</span>
                      <span className="text-white font-semibold">{showCloseModal.ratePerHour.toLocaleString('fr-FR')} FCFA/h</span>
                    </div>
                    {prepaid > 0 && (
                      <div className="flex justify-between text-emerald-400 font-semibold border-t border-zinc-850 pt-1.5 mt-1.5">
                        <span>Déjà payé (Prépayé) :</span>
                        <span>-{prepaid.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    )}
                  </div>

                  {/* Info block for unlimited prepaid session */}
                  {showCloseModal.activeSession?.durationType === "unlimited" && (
                    <div className="p-3 bg-zinc-900/40 border border-zinc-855 rounded-xl flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Session Temps Libre</p>
                        <p className="text-[10px] text-zinc-400 leading-normal">
                          Cette session a été prépayée pour un montant libre de <span className="text-white font-bold">{prepaid.toLocaleString('fr-FR')} FCFA</span>. Aucun frais horaire supplémentaire n'est appliqué pour le jeu.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bill Details Breakdowns */}
                  <div className="space-y-2.5">
                    <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">Détails des prestations</h4>
                    
                    {/* Games part */}
                    <div className="flex justify-between items-center text-xs p-3 bg-zinc-900/30 border border-zinc-850 rounded-xl">
                      <span className="text-zinc-300 font-semibold flex items-center gap-1.5">
                        🎮 Temps de jeu ({showCloseModal.activeSession?.durationType === "limited" ? showCloseModal.activeSession.durationMinutes / 60 : closeSessionHours}h)
                      </span>
                      <span className="text-white font-extrabold font-mono">
                        {gameCostDue > 0 ? `${gameCostDue.toLocaleString('fr-FR')} FCFA` : "Déjà réglé (Prépayé)"}
                      </span>
                    </div>

                    {/* Extra F&B Snack list */}
                    {showCloseModal.activeSession?.extraSnacksList && showCloseModal.activeSession.extraSnacksList.length > 0 ? (
                      <div className="p-3 bg-zinc-900/30 border border-zinc-850 rounded-xl space-y-2">
                        <div className="flex justify-between items-center text-xs text-zinc-400 pb-1.5 border-b border-zinc-850">
                          <span>🥤 Consommations Snack</span>
                          <span className="font-extrabold font-mono text-amber-400">
                            {snackCost.toLocaleString('fr-FR')} FCFA
                          </span>
                        </div>
                        
                        <div className="space-y-1 max-h-[80px] overflow-y-auto pr-1">
                          {showCloseModal.activeSession.extraSnacksList.map((snackItem, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[10px] text-zinc-400">
                              <span>{snackItem.quantity}x {snackItem.product.name}</span>
                              <span>{(snackItem.product.price * snackItem.quantity).toLocaleString('fr-FR')} FCFA</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-[11px] p-3 text-zinc-500 italic bg-zinc-900/10 border border-zinc-900 rounded-xl text-center">
                        Aucune consommation de snack bar sur cette session.
                      </div>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="p-4 bg-gradient-to-r from-rose-950/20 to-pink-950/20 border border-rose-500/20 rounded-xl flex justify-between items-center">
                    <span className="text-xs font-bold text-white uppercase">Montant Reste à Payer</span>
                    <span className="text-lg font-black text-rose-400 font-mono">
                      {totalCost.toLocaleString('fr-FR')} FCFA
                    </span>
                  </div>

                  {/* CTAs */}
                  <div className="flex items-center gap-3 pt-2">
                    <button 
                      type="button"
                      onClick={() => setShowCloseModal(null)}
                      className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
                    >
                      Retour
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        setShowCloseModal(null);
                        setPaymentMethodSelected("espèces");
                        setPaymentCashAmount(totalCost);
                        setPaymentMobileAmount("");
                        setShowPaymentModal({
                          type: "console",
                          id: `console-${showCloseModal.id}`,
                          name: `${showCloseModal.name} (${showCloseModal.activeSession?.player || "Joueur"})`,
                          customer: showCloseModal.activeSession?.player || "Joueur",
                          gameCost: gameCostDue,
                          snackCost: snackCost,
                          total: totalCost,
                          itemsList: showCloseModal.activeSession?.extraSnacksList || [],
                          consoleId: showCloseModal.id
                        });
                      }}
                      className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/20 active:scale-95 transition-all"
                    >
                      {totalCost > 0 ? "Sélect. Paiement & Clôturer" : "Clôturer & Libérer"}
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

      {/* 3. Modal Add Snack directly to a Playing Console */}
      {showAddSnackToConsoleModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Ajouter des Consommations</h3>
                  <p className="text-[10px] text-zinc-400">Pour : {showAddSnackToConsoleModal.activeSession?.player} sur {showAddSnackToConsoleModal.name}</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAddSnackToConsoleModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            {/* Quick selectors grid */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1">
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Sélectionnez un produit à ajouter</p>
              
              <div className="grid grid-cols-2 gap-3">
                {products.map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => {
                      // Instantly add 1 to console session and alert
                      setConsoles(prev => prev.map(c => {
                        if (c.id === showAddSnackToConsoleModal.id && c.activeSession) {
                          const extraList = [...(c.activeSession.extraSnacksList || [])];
                          const existing = extraList.find(x => x.product.id === prod.id);
                          if (existing) {
                            existing.quantity += 1;
                          } else {
                            extraList.push({ product: prod, quantity: 1 });
                          }
                          const nextBill = extraList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                          return {
                            ...c,
                            activeSession: {
                              ...c.activeSession,
                              extraSnacksList: extraList,
                              extraSnacksBill: nextBill
                            }
                          };
                        }
                        return c;
                      }));

                      // Deduct stock and record stock movement
                      setProducts(prev => prev.map(p => p.id === prod.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p));
                      setStockMovements(prev => [
                        {
                          id: Date.now(),
                          date: new Date().toISOString(),
                          productId: prod.id,
                          productName: prod.name,
                          type: "sortie",
                          quantity: 1,
                          reason: `Consommation Console - ${showAddSnackToConsoleModal.name} (${showAddSnackToConsoleModal.activeSession?.player || 'Joueur'})`,
                          user: role === "admin" ? "Administrateur" : "Gérant"
                        },
                        ...prev
                      ]);

                      // Update local temporary reference state so view updates
                      setShowAddSnackToConsoleModal(prev => {
                        const extraList = [...(prev.activeSession.extraSnacksList || [])];
                        const existing = extraList.find(x => x.product.id === prod.id);
                        if (existing) {
                          existing.quantity += 1;
                        } else {
                          extraList.push({ product: prod, quantity: 1 });
                        }
                        const nextBill = extraList.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
                        return {
                          ...prev,
                          activeSession: {
                            ...prev.activeSession,
                            extraSnacksList: extraList,
                            extraSnacksBill: nextBill
                          }
                        };
                      });

                      addLog(
                        "pos_session_bill",
                        `Ajout de 1x ${prod.name} à la session de ${showAddSnackToConsoleModal.activeSession?.player} sur ${showAddSnackToConsoleModal.name}`,
                        "snack"
                      );
                    }}
                    className="p-3 bg-zinc-900 hover:bg-zinc-850 rounded-xl border border-zinc-800 hover:border-violet-500/40 text-left flex justify-between items-center text-xs group transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{prod.image}</span>
                      <div>
                        <p className="font-bold text-white group-hover:text-violet-300 transition-all">{prod.name}</p>
                        <p className="text-[10px] text-zinc-500">{prod.price.toLocaleString('fr-FR')} FCFA</p>
                      </div>
                    </div>
                    <span className="w-6 h-6 rounded-lg bg-zinc-950 group-hover:bg-violet-600 text-zinc-500 group-hover:text-white flex items-center justify-center font-bold text-xs transition-all">+</span>
                  </button>
                ))}
              </div>
            </div>

            {/* List of current snacks billed to console */}
            <div className="p-4 bg-zinc-900/60 rounded-xl border border-zinc-850">
              <h5 className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">Déjà facturés sur cette session</h5>
              {showAddSnackToConsoleModal.activeSession?.extraSnacksList && showAddSnackToConsoleModal.activeSession.extraSnacksList.length > 0 ? (
                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                  {showAddSnackToConsoleModal.activeSession.extraSnacksList.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs text-zinc-300">
                      <span>{item.quantity}x {item.product.name}</span>
                      <span className="font-mono text-zinc-400">{(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                    </div>
                  ))}
                  <div className="h-px bg-zinc-800 my-2"></div>
                  <div className="flex justify-between items-center text-xs font-bold text-white">
                    <span>Total Snack Billed</span>
                    <span className="text-amber-400 font-mono">{showAddSnackToConsoleModal.activeSession.extraSnacksBill.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-zinc-500 italic text-center py-2">Aucun article ajouté pour le moment</p>
              )}
            </div>

            <button
              onClick={() => setShowAddSnackToConsoleModal(null)}
              className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-950/20 active:scale-95 transition-all text-center"
            >
              Fermer
            </button>

          </div>
        </div>
      )}

      {/* Modal : Fusionner Factures */}
      {showMergeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-indigo-900/40 p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-black text-white">Fusionner les Factures</h3>
              </div>
              <button onClick={() => setShowMergeModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-zinc-400">
                Vous allez fusionner le ticket <strong className="text-white">"{showMergeModal.name}"</strong> (de {showMergeModal.customer || "Client Direct"}, montant : {formatPrice(showMergeModal.total)}) dans une autre facture en cours ou console active.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Sélectionner la facture de destination :</label>
                <select
                  value={targetMergeInvoiceId}
                  onChange={(e) => setTargetMergeInvoiceId(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 font-semibold"
                >
                  <option value="">-- Choisir une Facture --</option>
                  {tickets.filter(t => t.id !== showMergeModal.id).map(t => (
                    <option key={t.id} value={t.id}>
                      🧾 Ticket: {t.name} ({t.posCustomer || "Comptant"})
                    </option>
                  ))}
                  {consoles.filter(c => c.status === "occupée" && c.activeSession).map(c => (
                    <option key={c.id} value={`console-${c.id}`}>
                      🕹️ Console: {c.name} ({c.activeSession.player})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setShowMergeModal(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleMergeTickets(showMergeModal.id, targetMergeInvoiceId)}
                disabled={!targetMergeInvoiceId}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Confirmer la Fusion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal : Paiement Facture (avec support Paiement Mixte) */}
      {showPaymentModal && (() => {
        const total = showPaymentModal.total;
        const cashVal = Number(paymentCashAmount || 0);
        const mobileVal = Number(paymentMobileAmount || 0);
        const difference = total - (cashVal + mobileVal);
        const isMixedValid = paymentMethodSelected !== "mixte" || difference === 0;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-lg rounded-2xl border border-emerald-900/40 p-6 space-y-5 animate-scale-up">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Check className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Règlement de la Facture</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold">{showPaymentModal.name}</p>
                  </div>
                </div>
                <button onClick={() => setShowPaymentModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="bg-zinc-950/80 rounded-xl p-4 border border-zinc-900 space-y-3">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Récapitulatif des prestations :</div>
                
                <div className="space-y-1.5 text-xs text-zinc-300">
                  {showPaymentModal.gameCost > 0 && (
                    <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                      <span>🕹️ Session de Jeu</span>
                      <span className="font-mono font-bold text-white">{formatPrice(showPaymentModal.gameCost)}</span>
                    </div>
                  )}
                  {showPaymentModal.itemsList && showPaymentModal.itemsList.length > 0 && (
                    <div className="space-y-1">
                      {showPaymentModal.itemsList.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-zinc-400">
                          <span>{item.quantity}x {item.product.name}</span>
                          <span className="font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm font-black text-white pt-2.5 border-t border-zinc-900">
                  <span>TOTAL À PAYER :</span>
                  <span className="font-mono text-emerald-400 text-base">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-bold text-zinc-500 uppercase block">Mode de règlement :</label>
                
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "espèces", label: "Espèces", desc: "Tiroir caisse" },
                    { id: "mobile money", label: "Mobile Money", desc: "Orange, Wave, MTN" },
                    { id: "mixte", label: "Paiement Mixte", desc: "Espèces + Mobile" }
                  ].map(pm => {
                    const isSelected = paymentMethodSelected === pm.id;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => {
                          setPaymentMethodSelected(pm.id);
                          if (pm.id === "espèces") {
                            setPaymentCashAmount(total);
                            setPaymentMobileAmount("");
                          } else if (pm.id === "mobile money") {
                            setPaymentCashAmount("");
                            setPaymentMobileAmount(total);
                          } else {
                            setPaymentCashAmount("");
                            setPaymentMobileAmount("");
                          }
                        }}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1 transition-all ${
                          isSelected 
                            ? "bg-emerald-950/30 border-emerald-500/50 text-white shadow-inner" 
                            : "bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200"
                        }`}
                      >
                        <span className="text-xs font-bold capitalize">{pm.label}</span>
                        <span className="text-[9px] text-zinc-500 font-semibold">{pm.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {paymentMethodSelected === "mixte" && (
                <div className="p-4 bg-zinc-950 border border-zinc-900 rounded-xl space-y-4 animate-fade-in">
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-zinc-900 pb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse"></span>
                    <span>Ventilation des montants</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Part Espèces ({systemSettings.currency}) :</label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="Ex: 1500"
                        value={paymentCashAmount}
                        onChange={(e) => setPaymentCashAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-zinc-500 uppercase block">Part Mobile Money ({systemSettings.currency}) :</label>
                      <input 
                        type="number" 
                        min="0"
                        placeholder="Ex: 2000"
                        value={paymentMobileAmount}
                        onChange={(e) => setPaymentMobileAmount(Math.max(0, Number(e.target.value)))}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold font-mono focus:outline-none focus:border-violet-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 font-semibold">
                    <span>Total Saisi : <strong className="text-white font-mono">{formatPrice(cashVal + mobileVal)}</strong></span>
                    {difference > 0 ? (
                      <span className="text-rose-400">Reste à ventiler : {formatPrice(difference)}</span>
                    ) : difference < 0 ? (
                      <span className="text-amber-400">Surplus : {formatPrice(Math.abs(difference))}</span>
                    ) : (
                      <span className="text-emerald-400 flex items-center gap-1">✅ Ventilation correcte !</span>
                    )}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end border-t border-zinc-800 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPaymentModal(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={!isMixedValid}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold shadow-md active:scale-95 transition-all flex items-center gap-1"
                >
                  <Check className="w-4 h-4" />
                  <span>Encaisser {formatPrice(total)}</span>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 4. Modal Reçu de Vente / Facture imprimable client */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white text-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6 relative overflow-hidden flex flex-col items-center">
            
            {/* Simulated Receipt paper layout */}
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mb-2"></div>
            
            <div className="text-center space-y-1">
              {systemSettings.logoUrl && <img src={systemSettings.logoUrl} className="max-h-12 mx-auto mb-1 rounded" alt="Logo" />}
              <h3 className="font-extrabold text-lg tracking-tight uppercase">{systemSettings.companyName || "GAMEZONE HUB"}</h3>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">{systemSettings.address || "12 Rue des Gamers, Yaoundé"}</p>
              <p className="text-[9px] text-zinc-400">Tél : {systemSettings.phone || "+237 6 55 11 22 33"} | Email : {systemSettings.email || ""}</p>
            </div>

            <div className="w-full border-t border-dashed border-zinc-300 my-2"></div>

            {/* Invoice Meta */}
            <div className="w-full space-y-1 text-[10px] text-zinc-600">
              <div className="flex justify-between">
                <span>Nº FACTURE :</span>
                <span className="font-bold text-zinc-900">{showReceiptModal.id}</span>
              </div>
              <div className="flex justify-between">
                <span>DATE :</span>
                <span>{currentDateTime.toLocaleDateString(systemSettings.currencyLocale || 'fr-FR')} {showReceiptModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENT :</span>
                <span className="font-bold text-zinc-900">{showReceiptModal.customer}</span>
              </div>
              <div className="flex justify-between">
                <span>TYPE :</span>
                <span className="font-bold text-zinc-900 uppercase">{showReceiptModal.type}</span>
              </div>
              {showReceiptModal.paymentMethod && (
                <div className="flex justify-between">
                  <span>RÈGLEMENT :</span>
                  <span className="font-bold text-zinc-900 uppercase">{showReceiptModal.paymentMethod}</span>
                </div>
              )}
            </div>

            <div className="w-full border-t border-dashed border-zinc-300 my-2"></div>

            {/* Items table */}
            <div className="w-full text-xs space-y-2">
              <div className="flex justify-between text-[10px] text-zinc-500 font-bold uppercase pb-1 border-b border-zinc-200">
                <span>Désignation</span>
                <span>Total</span>
              </div>

              {/* If single console purchase */}
              {showReceiptModal.gameCost > 0 && (
                <div className="flex justify-between py-1">
                  <div>
                    <span className="font-bold">{showReceiptModal.item}</span>
                    <span className="text-[9px] text-zinc-500 block">Session Temps de Jeu</span>
                  </div>
                  <span className="font-bold font-mono">{formatPrice(showReceiptModal.gameCost)}</span>
                </div>
              )}

              {/* If snack items direct checkout or associated */}
              {showReceiptModal.itemsList ? (
                showReceiptModal.itemsList.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <div>
                      <span>{item.quantity}x {item.product.name}</span>
                    </div>
                    <span className="font-bold font-mono">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))
              ) : showReceiptModal.snackCost > 0 ? (
                <div className="flex justify-between py-1">
                  <span>Consommations Snack Bar</span>
                  <span className="font-bold font-mono">{formatPrice(showReceiptModal.snackCost)}</span>
                </div>
              ) : null}
            </div>

            <div className="w-full border-t border-dashed border-zinc-300 my-2"></div>

            {/* Grand Total Receipt */}
            <div className="w-full space-y-1">
              {showReceiptModal.prepaid > 0 && (
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Prépayé au démarrage :</span>
                  <span>{formatPrice(showReceiptModal.prepaid)}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-zinc-600">
                <span>Total Prestations :</span>
                <span>{formatPrice(showReceiptModal.total)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-200">
                <span>
                  {showReceiptModal.prepaid > 0 
                    ? (showReceiptModal.total - showReceiptModal.prepaid < 0 ? "REMBOURSEMENT :" : "RESTE À PAYER :") 
                    : "NET À PAYER :"}
                </span>
                <span className="font-mono text-lg">
                  {showReceiptModal.prepaid > 0 
                    ? formatPrice(Math.abs(showReceiptModal.total - showReceiptModal.prepaid))
                    : formatPrice(showReceiptModal.total)}
                </span>
              </div>
            </div>

            <div className="w-full border-t border-dashed border-zinc-300 my-2"></div>

            <div className="text-center space-y-2">
              <p className="text-[10px] font-bold tracking-tight italic">Merci de votre visite à bientôt !</p>
              <div className="py-2.5 px-6 bg-emerald-100 text-emerald-800 rounded-xl text-[11px] font-bold flex items-center gap-1.5 justify-center">
                <Check className="w-4 h-4" />
                Paiement Reçu avec Succès
              </div>
            </div>

            <div className="w-full flex gap-3 mt-4">
              <button
                onClick={() => handlePrintReceipt(showReceiptModal)}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-900/20 active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Imprimer
              </button>
              <button
                onClick={() => setShowReceiptModal(null)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all text-center"
              >
                Fermer & Retour
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ===== JOUEURS MODALS ===== */}
      {showAddPlayerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-fuchsia-900/40 p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-fuchsia-950/50 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                  <User className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-black text-white font-sans">Nouveau Joueur</h3>
              </div>
              <button onClick={() => setShowAddPlayerModal(false)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Pseudo :</label>
                <input 
                  type="text" 
                  value={playNom}
                  onChange={(e) => setPlayNom(e.target.value)}
                  placeholder="Ex: Kevin"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Téléphone :</label>
                <input 
                  type="text" 
                  value={playTel}
                  onChange={(e) => setPlayTel(e.target.value)}
                  placeholder="Ex: +237..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setShowAddPlayerModal(false)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleAddPlayer}
                disabled={!playNom.trim()}
                className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Créer le Joueur
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditPlayerModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-fuchsia-900/40 p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-fuchsia-950/50 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400">
                  <Edit3 className="w-4.5 h-4.5" />
                </div>
                <h3 className="text-base font-black text-white font-sans">Modifier le Joueur</h3>
              </div>
              <button onClick={() => setShowEditPlayerModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Pseudo :</label>
                <input 
                  type="text" 
                  value={playNom}
                  onChange={(e) => setPlayNom(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Téléphone :</label>
                <input 
                  type="text" 
                  value={playTel}
                  onChange={(e) => setPlayTel(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-fuchsia-500 font-mono"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={() => setShowEditPlayerModal(null)}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleEditPlayer(showEditPlayerModal.id)}
                disabled={!playNom.trim()}
                className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Enregistrer les Modifications
              </button>
            </div>
          </div>
        </div>
      )}

      {showViewPlayerModal && (() => {
        const p = showViewPlayerModal;
        const activeConsole = consoles.find(c => 
          c.status === "occupée" && 
          c.activeSession && 
          c.activeSession.player.toLowerCase().includes(p.nom.toLowerCase())
        );

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-lg rounded-2xl border border-fuchsia-900/40 p-6 space-y-6 animate-scale-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fuchsia-600 to-indigo-600 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-fuchsia-950/30 uppercase">
                    {p.nom.slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">{p.nom}</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold">
                      Inscrit le : {new Date(p.dateInscription).toLocaleDateString(systemSettings.currencyLocale || 'fr-FR')}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowViewPlayerModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="grid grid-cols-1 gap-4 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Numéro de Téléphone</span>
                  <span className="text-white font-bold font-mono">{p.telephone || "Non renseigné"}</span>
                </div>
              </div>

              {activeConsole ? (
                <div className="bg-cyan-950/20 border border-cyan-500/20 rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-ping"></span>
                      En Jeu Actuellement
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 text-[9px] font-bold font-mono border border-cyan-800/30 uppercase">
                      {activeConsole.name}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                    <div>
                      <span className="text-[9px] text-zinc-500 block">Temps écoulé :</span>
                      <strong className="text-white font-mono text-sm">
                        {Math.max(1, Math.round(activeConsole.activeSession.timeElapsedSeconds / 3600))}h
                      </strong>
                    </div>
                    <div>
                      <span className="text-[9px] text-zinc-500 block">Facture actuelle :</span>
                      <strong className="text-emerald-400 font-mono text-sm">
                        {formatPrice(activeConsole.activeSession.totalAmountDue + (activeConsole.activeSession.extraSnacksBill || 0))}
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-3 text-center text-xs text-zinc-500 italic">
                  Hors ligne (aucun jeu en cours)
                </div>
              )}

              <div className="space-y-2.5">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-1.5">Statistiques de Fidélité</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 block font-bold">Sessions</span>
                    <strong className="text-white text-base block mt-0.5">{p.totalSessions || 0}</strong>
                  </div>
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 block font-bold">Temps Total</span>
                    <strong className="text-white text-base block mt-0.5 font-mono">
                      {Math.floor((p.totalTimeMinutes || 0) / 60)}h
                    </strong>
                  </div>
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                    <span className="text-[9px] text-zinc-500 block font-bold">Dépenses</span>
                    <strong className="text-emerald-400 text-sm block mt-1 font-mono">
                      {formatPrice(p.totalSpent || 0)}
                    </strong>
                  </div>
                </div>
              </div>

            </div>
          </div>
        );
      })()}

      {/* ===== DETAILED VIEW AND EDIT MODALS (CRUD ACTIONS) ===== */}

      {showViewProductModal && (() => {
        const p = showViewProductModal;
        const purchase = p.purchasePrice || 0;
        const margin = p.price - purchase;
        const marginPct = p.price > 0 ? (margin / p.price) * 100 : 0;
        const isLow = p.stock <= p.minThreshold;
        const isOutOfStock = p.stock === 0;
        const productMovements = stockMovements.filter(m => m.productId === p.id);

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-lg rounded-2xl border border-violet-900/40 p-6 space-y-5 animate-scale-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl shadow-lg">
                    {p.image || "📦"}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">{p.name}</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">
                      ID: {p.id} • Catégorie: <span className="text-violet-400 capitalize">{p.category}</span>
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowViewProductModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Prix d'Achat</span>
                  <span className="text-zinc-300 font-bold font-mono">{p.category === 'chicha' ? '—' : formatPrice(purchase)}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Prix de Vente</span>
                  <span className="text-white font-bold font-mono">{formatPrice(p.price)}</span>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Marge</span>
                  <span className="text-emerald-400 font-bold font-mono">{formatPrice(margin)} <span className="text-[9px] text-zinc-500 font-normal">({marginPct.toFixed(0)}%)</span></span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Stock Actuel</span>
                    <strong className="text-white text-sm font-mono">{p.stock} unités</strong>
                  </div>
                  <div>
                    {isOutOfStock ? (
                      <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[8px] font-bold rounded uppercase tracking-wider animate-pulse">Rupture</span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[8px] font-bold rounded uppercase tracking-wider">Faible</span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold rounded uppercase tracking-wider">OK</span>
                    )}
                  </div>
                </div>
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Seuil d'Alerte Minimum</span>
                  <span className="text-zinc-400 font-bold font-mono">{p.minThreshold} unités</span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-900 pb-1.5 flex justify-between">
                  <span>Historique des mouvements</span>
                  <span>{productMovements.length} logs</span>
                </h4>
                <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 text-[11px]">
                  {productMovements.length === 0 ? (
                    <p className="text-zinc-500 italic text-center py-4">Aucun mouvement enregistré pour ce produit.</p>
                  ) : (
                    productMovements.map((m) => {
                      const mDate = new Date(m.date);
                      return (
                        <div key={m.id} className="bg-zinc-950/30 border border-zinc-900 rounded-lg p-2 flex justify-between items-center">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${
                                m.type === 'entrée' 
                                  ? 'bg-emerald-950/50 text-emerald-400 border border-emerald-500/20' 
                                  : 'bg-rose-950/50 text-rose-400 border border-rose-500/20'
                              }`}>
                                {m.type}
                              </span>
                              <span className="text-white font-bold font-mono">{m.quantity} u.</span>
                              <span className="text-zinc-500">• {m.reason}</span>
                            </div>
                            <span className="text-[9px] text-zinc-500 font-mono">
                              {mDate.toLocaleDateString('fr-FR')} {mDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-[9px] text-zinc-400 bg-zinc-950 border border-zinc-900 px-1.5 py-0.5 rounded font-semibold">{m.user}</span>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowViewProductModal(null)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showViewExpenseModal && (() => {
        const e = showViewExpenseModal;
        const eDate = new Date(e.date);

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-rose-900/40 p-6 space-y-5 animate-scale-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-start justify-between border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-950/30 border border-rose-500/20 flex items-center justify-center text-lg text-rose-400">
                    💸
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">Détail de la Dépense</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">
                      ID: {e.id}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowViewExpenseModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Catégorie</span>
                    <span className="text-white font-bold capitalize">{e.category}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Responsable</span>
                    <span className="text-zinc-300 font-semibold">{e.responsible}</span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Montant</span>
                    <strong className="text-rose-400 text-base font-mono">{formatPrice(e.amount)}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Date & Heure</span>
                    <span className="text-zinc-300 font-semibold font-mono">
                      {eDate.toLocaleDateString('fr-FR')} {eDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Motif / Description</span>
                  <p className="text-zinc-200 leading-relaxed font-medium whitespace-pre-wrap">{e.description || "Aucune description fournie."}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowViewExpenseModal(null)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showEditExpenseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-amber-900/40 p-6 space-y-5 animate-scale-up relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl"></div>
            
            <div className="flex items-start justify-between border-b border-zinc-850 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-950/30 border border-amber-500/20 flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                </div>
                <h3 className="text-base font-black text-white">Modifier la Dépense</h3>
              </div>
              <button onClick={() => setShowEditExpenseModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Montant *</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={editExpenseAmount}
                    onChange={(e) => setEditExpenseAmount(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-3.5 pr-16 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono font-bold"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-zinc-500 font-black">FCFA</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Catégorie *</label>
                  <select
                    value={editExpenseCategory}
                    onChange={(e) => setEditExpenseCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-amber-500 font-semibold"
                  >
                    {expenseCategories.map((c, i) => (
                      <option key={i} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Responsable</label>
                  <input
                    type="text"
                    value={editExpenseResponsible}
                    onChange={(e) => setEditExpenseResponsible(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Date & Heure de la dépense *</label>
                <input
                  type="datetime-local"
                  required
                  value={editExpenseDate}
                  onChange={(e) => setEditExpenseDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Description / Motif *</label>
                <textarea
                  rows={3}
                  required
                  value={editExpenseDescription}
                  onChange={(e) => setEditExpenseDescription(e.target.value)}
                  placeholder="Expliquez à quoi a servi cette dépense..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditExpenseModal(null)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleEditExpense(
                      showEditExpenseModal.id,
                      editExpenseAmount,
                      editExpenseCategory,
                      editExpenseDescription,
                      editExpenseResponsible,
                      editExpenseDate
                    );
                    setShowEditExpenseModal(null);
                  }}
                  disabled={!editExpenseAmount || !editExpenseDescription.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showViewPurchaseModal && (() => {
        const p = showViewPurchaseModal;
        const pDate = new Date(p.date);

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-850 p-6 space-y-5 animate-scale-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-start justify-between border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-850 flex items-center justify-center text-lg">
                    📦
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">Détail de l'Achat</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">
                      ID: {p.id}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowViewPurchaseModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="space-y-3.5 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Fournisseur</span>
                    <span className="text-white font-bold block truncate">{p.supplier}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Responsable</span>
                    <span className="text-zinc-300 font-semibold block truncate">{p.responsible}</span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Produit</span>
                    <span className="text-white font-bold block truncate">{p.product}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Quantité</span>
                    <span className="text-cyan-400 font-bold font-mono">{p.quantity} unités</span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Prix Unitaire</span>
                    <span className="text-zinc-300 font-bold font-mono">{formatPrice(p.unitPrice)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Montant Total</span>
                    <strong className="text-emerald-400 text-base font-mono">{formatPrice(p.totalAmount)}</strong>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Mode de Paiement</span>
                    <span className="px-2 py-0.5 bg-emerald-950/20 text-emerald-400 rounded border border-emerald-500/20 text-[9px] uppercase font-bold tracking-wider inline-block mt-0.5">{p.paymentMethod}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Date & Heure</span>
                    <span className="text-zinc-300 font-semibold font-mono">
                      {pDate.toLocaleDateString('fr-FR')} {pDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowViewPurchaseModal(null)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showSupplierDetailModal && (() => {
        const supp = showSupplierDetailModal;
        const addDate = new Date(supp.dateAjout);

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-md rounded-2xl border border-teal-900/40 p-6 space-y-5 animate-scale-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-start justify-between border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-950/30 border border-teal-500/20 flex items-center justify-center text-lg text-teal-400">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">{supp.nom}</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold">
                      Ajouté le : {addDate.toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowSupplierDetailModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 space-y-2">
                  {supp.telephone && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Téléphone</span>
                      <span className="text-white font-bold font-mono">{supp.telephone}</span>
                    </div>
                  )}
                  {supp.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Adresse Email</span>
                      <span className="text-zinc-300 font-semibold block truncate">{supp.email}</span>
                    </div>
                  )}
                  {supp.adresse && (
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Adresse Physique</span>
                      <span className="text-zinc-300 font-semibold block truncate">{supp.adresse}</span>
                    </div>
                  )}
                </div>

                {supp.produitsFournis && supp.produitsFournis.length > 0 && (
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 space-y-1.5">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Produits Fournis</span>
                    <div className="flex flex-wrap gap-1.5">
                      {supp.produitsFournis.map((p, i) => (
                        <span key={i} className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md font-medium">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Notes / Remarques</span>
                  <p className="text-zinc-300 italic leading-relaxed whitespace-pre-wrap">{supp.notes || "Aucune note disponible."}</p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSupplierDetailModal(null)}
                  className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showViewShiftModal && (() => {
        const s = showViewShiftModal;
        const dOpen = new Date(s.dateOpen);
        const dClose = new Date(s.dateClose);
        const durationMs = dClose - dOpen;
        const durationHours = Math.floor(durationMs / 3600000);
        const durationMinutes = Math.floor((durationMs % 3600000) / 60000);
        const isOk = s.variance === 0;
        const isNegative = s.variance < 0;

        return (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-panel w-full max-w-lg rounded-2xl border border-zinc-850 p-6 space-y-5 animate-scale-up relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex items-start justify-between border-b border-zinc-850 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center text-lg text-cyan-400">
                    📜
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white leading-tight">Détails du Shift Clôturé</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase">
                      ID: {s.id}
                    </p>
                  </div>
                </div>
                <button onClick={() => setShowViewShiftModal(null)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
              </div>

              <div className="space-y-4 text-xs">
                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Période du Shift</span>
                    <span className="text-white font-bold block">{dOpen.toLocaleDateString('fr-FR')}</span>
                    <span className="text-[10px] text-zinc-400 block font-mono mt-0.5">
                      {dOpen.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} ➡️ {dClose.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono">({durationHours}h {durationMinutes}m)</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Opérateurs</span>
                    <p className="text-zinc-300 font-medium">Ouvert par : <strong className="text-white">{s.openedBy}</strong></p>
                    <p className="text-zinc-300 font-medium">Clôturé par : <strong className="text-white">{s.closedBy}</strong></p>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 space-y-2.5">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block border-b border-zinc-900 pb-1.5">Flux Financiers du Shift</span>
                  
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Fond de caisse initial :</span>
                      <span className="font-mono text-zinc-300">{formatPrice(s.openingBalance)}</span>
                    </div>
                    <div className="flex justify-between items-center text-zinc-400">
                      <span>Total Remboursements :</span>
                      <span className="font-mono text-zinc-300">{formatPrice(s.refunds || 0)}</span>
                    </div>

                    <div className="flex justify-between items-center text-emerald-400 border-t border-zinc-900/50 pt-1.5">
                      <span>Revenus Sessions Console :</span>
                      <span className="font-mono font-bold">+{formatPrice(s.gamesRevenue)}</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-400 border-t border-zinc-900/50 pt-1.5">
                      <span>Revenus Snack / POS :</span>
                      <span className="font-mono font-bold">+{formatPrice(s.snackRevenue)}</span>
                    </div>

                    <div className="flex justify-between items-center text-rose-400 border-t border-zinc-900/50 pt-1.5">
                      <span>Dépenses Diverses / Maintenance :</span>
                      <span className="font-mono font-bold">-{formatPrice(s.expenses)}</span>
                    </div>
                    <div className="flex justify-between items-center text-rose-400 border-t border-zinc-900/50 pt-1.5">
                      <span>Achats Fournisseurs :</span>
                      <span className="font-mono font-bold">-{formatPrice(s.purchases)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900 grid grid-cols-3 gap-3 items-center">
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Solde Théorique</span>
                    <strong className="text-zinc-300 font-mono text-xs">{formatPrice(s.expectedBalance)}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Solde Physique Réel</span>
                    <strong className="text-white font-mono text-sm">{formatPrice(s.realBalance)}</strong>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-0.5">Écart de Caisse</span>
                    <span className={`inline-block text-[10px] font-black px-2 py-0.5 rounded-full border mt-0.5 ${
                      isOk 
                        ? "bg-emerald-950/60 text-emerald-400 border-emerald-500/30" 
                        : isNegative
                          ? "bg-rose-950/60 text-rose-400 border-rose-500/30"
                          : "bg-amber-950/60 text-amber-400 border-amber-500/30"
                    }`}>
                      {isOk ? "Conforme" : `${s.variance > 0 ? '+' : ''}${formatPrice(s.variance)}`}
                    </span>
                  </div>
                </div>

                <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-900">
                  <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Remarques / Notes du Shift</span>
                  <p className="text-zinc-300 italic leading-relaxed whitespace-pre-wrap">{s.notes || "Aucune note écrite par le gérant."}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handlePrintShiftReport(s)}
                  className="flex-1 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-cyan-400 hover:text-cyan-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  🖨️ Imprimer
                </button>
                <button
                  type="button"
                  onClick={() => setShowViewShiftModal(null)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-xl text-xs font-bold transition-all text-center"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        );
      })()}


      {/* ===== FOURNISSEURS MODALS ===== */}

      {/* Modal : Ajouter Fournisseur */}
      {showAddSupplierModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-teal-900/40 shadow-2xl shadow-teal-950/20 p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-950/50 border border-teal-500/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-teal-400" />
                </div>
                <h3 className="text-base font-black text-white">Ajouter un Fournisseur</h3>
              </div>
              <button onClick={() => setShowAddSupplierModal(false)} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Nom */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nom du fournisseur *</label>
                <input
                  type="text" required autoFocus
                  placeholder="Ex: Grossiste Boissons SARL"
                  value={suppNom} onChange={e => setSuppNom(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-semibold"
                />
              </div>

              {/* Téléphone + Email */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Téléphone
                  </label>
                  <input
                    type="tel"
                    placeholder="+237 6 00 00 00 00"
                    value={suppTel} onChange={e => setSuppTel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input
                    type="email"
                    placeholder="fournisseur@mail.com"
                    value={suppEmail} onChange={e => setSuppEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Adresse */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Adresse
                </label>
                <input
                  type="text"
                  placeholder="Ex: Rue du Commerce, Yaoundé Centre"
                  value={suppAdresse} onChange={e => setSuppAdresse(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Produits fournis */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Produits fournis (séparés par des virgules)</label>
                <textarea
                  rows={2}
                  placeholder="Ex: Coca-Cola, Fanta, Malta, Red Bull…"
                  value={suppProduits} onChange={e => setSuppProduits(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Informations complémentaires, conditions de livraison…"
                  value={suppNotes} onChange={e => setSuppNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddSupplierModal(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddSupplier}
                  disabled={!suppNom.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white rounded-xl text-xs font-extrabold shadow-lg shadow-teal-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5" />
                  Ajouter Fournisseur
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal : Modifier Fournisseur */}
      {showEditSupplierModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-blue-900/40 shadow-2xl shadow-blue-950/20 p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-950/50 border border-blue-500/20 flex items-center justify-center">
                  <Edit3 className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-base font-black text-white">Modifier Fournisseur</h3>
              </div>
              <button onClick={() => { setShowEditSupplierModal(null); resetSupplierForm(); }} className="text-zinc-500 hover:text-zinc-300 text-sm font-bold">✖</button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nom du fournisseur *</label>
                <input
                  type="text" required autoFocus
                  value={suppNom} onChange={e => setSuppNom(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Téléphone
                  </label>
                  <input
                    type="tel"
                    value={suppTel} onChange={e => setSuppTel(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <input
                    type="email"
                    value={suppEmail} onChange={e => setSuppEmail(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Adresse
                </label>
                <input
                  type="text"
                  value={suppAdresse} onChange={e => setSuppAdresse(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Produits fournis (séparés par des virgules)</label>
                <textarea
                  rows={2}
                  value={suppProduits} onChange={e => setSuppProduits(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={suppNotes} onChange={e => setSuppNotes(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowEditSupplierModal(null); resetSupplierForm(); }}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => handleEditSupplier(showEditSupplierModal.id)}
                  disabled={!suppNom.trim()}
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-extrabold shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-3.5 h-3.5" />
                  Sauvegarder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== PURCHASES MANAGEMENT MODALS ===== */}

      {/* 5. Modal Enregistrer un Achat */}
      {showAddPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white font-sans">Enregistrer un Achat</h3>
              </div>
              <button 
                onClick={() => setShowAddPurchaseModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const finalProd = purchaseProduct === "Autre" ? purchaseCustomProductName : purchaseProduct;
              const finalSupplier = purchaseIsCustomSupplier ? purchaseCustomSupplierName : purchaseSupplier;
              handleAddPurchase(
                finalSupplier,
                finalProd,
                purchaseQuantity,
                purchaseUnitPrice,
                purchaseTotalAmount,
                purchasePaymentMethod,
                purchaseResponsible,
                purchaseDate
              );
              setShowAddPurchaseModal(false);
            }} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Fournisseur</label>
                  <select 
                    value={purchaseSupplier}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPurchaseSupplier(val);
                      if (val === "NEW_SUPPLIER") {
                        setPurchaseIsCustomSupplier(true);
                      } else {
                        setPurchaseIsCustomSupplier(false);
                      }
                    }}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="">Sélectionner</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.nom}>{s.nom}</option>
                    ))}
                    <option value="NEW_SUPPLIER">➕ Autre / Nouveau</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Mode de Paiement</label>
                  <select 
                    value={purchasePaymentMethod}
                    onChange={(e) => setPurchasePaymentMethod(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {purchaseIsCustomSupplier && (
                <div className="animate-fade-in">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nom du Nouveau Fournisseur</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Grossiste Boissons"
                    value={purchaseCustomSupplierName}
                    onChange={(e) => setPurchaseCustomSupplierName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Produit</label>
                <select 
                  value={purchaseProduct}
                  onChange={(e) => setPurchaseProduct(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="Autre">Autre / Achat Divers</option>
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name} (Achat: {p.purchasePrice} FCFA)</option>
                  ))}
                </select>
                {purchaseProduct !== "Autre" && (
                  <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5 animate-pulse">
                    <span>➡️</span> Augmentation automatique du stock snack (+{purchaseQuantity})
                  </p>
                )}
              </div>

              {purchaseProduct === "Autre" && (
                <div className="animate-fade-in">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nom du Produit / Matériel</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Manette PS5 DualSense"
                    value={purchaseCustomProductName}
                    onChange={(e) => setPurchaseCustomProductName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Quantité</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">P.U. (FCFA)</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={purchaseUnitPrice}
                    onChange={(e) => setPurchaseUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Montant Total</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={purchaseTotalAmount}
                    onChange={(e) => setPurchaseTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Date d'achat</label>
                  <input 
                    type="datetime-local"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Responsable</label>
                  <input 
                    type="text"
                    placeholder={role === "admin" ? "Administrateur" : "Gérant"}
                    value={purchaseResponsible}
                    onChange={(e) => setPurchaseResponsible(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {Number(purchaseTotalAmount || 0) > stats.cashBalance && (
                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl flex items-start gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-400 leading-normal font-semibold">
                    Attention : Le montant de cet achat ({Number(purchaseTotalAmount).toLocaleString('fr-FR')} FCFA) dépasse le solde disponible en caisse ({stats.cashBalance.toLocaleString('fr-FR')} FCFA).
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowAddPurchaseModal(false)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl font-bold transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-950/20 transition-all"
                >
                  Enregistrer l'Achat
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* 6. Modal Modifier un Achat */}
      {showEditPurchaseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-5 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white font-sans">Modifier l'Achat</h3>
              </div>
              <button 
                onClick={() => setShowEditPurchaseModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const finalProd = purchaseProduct === "Autre" ? purchaseCustomProductName : purchaseProduct;
              const finalSupplier = purchaseIsCustomSupplier ? purchaseCustomSupplierName : purchaseSupplier;
              handleEditPurchase(
                showEditPurchaseModal.id,
                finalSupplier,
                finalProd,
                purchaseQuantity,
                purchaseUnitPrice,
                purchaseTotalAmount,
                purchasePaymentMethod,
                purchaseResponsible,
                purchaseDate
              );
              setShowEditPurchaseModal(null);
            }} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Fournisseur</label>
                  <select 
                    value={purchaseSupplier}
                    onChange={(e) => {
                      const val = e.target.value;
                      setPurchaseSupplier(val);
                      if (val === "NEW_SUPPLIER") {
                        setPurchaseIsCustomSupplier(true);
                      } else {
                        setPurchaseIsCustomSupplier(false);
                      }
                    }}
                    required
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-350 focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    <option value="">Sélectionner</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.nom}>{s.nom}</option>
                    ))}
                    <option value="NEW_SUPPLIER">➕ Autre / Nouveau</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Mode de Paiement</label>
                  <select 
                    value={purchasePaymentMethod}
                    onChange={(e) => setPurchasePaymentMethod(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 font-semibold"
                  >
                    {paymentMethods.map(method => (
                      <option key={method} value={method}>{method.charAt(0).toUpperCase() + method.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              {purchaseIsCustomSupplier && (
                <div className="animate-fade-in">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nom du Nouveau Fournisseur</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Grossiste Boissons"
                    value={purchaseCustomSupplierName}
                    onChange={(e) => setPurchaseCustomSupplierName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Produit</label>
                <select 
                  value={purchaseProduct}
                  onChange={(e) => setPurchaseProduct(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-zinc-300 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="Autre">Autre / Achat Divers</option>
                  {products.map(p => (
                    <option key={p.id} value={p.name}>{p.name} (Achat: {p.purchasePrice} FCFA)</option>
                  ))}
                </select>
                {purchaseProduct !== "Autre" && (
                  <p className="text-[10px] text-emerald-400 font-bold mt-1.5 flex items-center gap-1.5 animate-pulse">
                    <span>➡️</span> Ajustement automatique du stock snack (+{purchaseQuantity})
                  </p>
                )}
              </div>

              {purchaseProduct === "Autre" && (
                <div className="animate-fade-in">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Nom du Produit / Matériel</label>
                  <input 
                    type="text"
                    required
                    placeholder="Ex: Manette PS5 DualSense"
                    value={purchaseCustomProductName}
                    onChange={(e) => setPurchaseCustomProductName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Quantité</label>
                  <input 
                    type="number"
                    min="1"
                    required
                    value={purchaseQuantity}
                    onChange={(e) => setPurchaseQuantity(parseInt(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">P.U. (FCFA)</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={purchaseUnitPrice}
                    onChange={(e) => setPurchaseUnitPrice(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Montant Total</label>
                  <input 
                    type="number"
                    min="0"
                    required
                    value={purchaseTotalAmount}
                    onChange={(e) => setPurchaseTotalAmount(parseFloat(e.target.value) || 0)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-400 focus:outline-none focus:border-emerald-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Date d'achat</label>
                  <input 
                    type="datetime-local"
                    required
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Responsable</label>
                  <input 
                    type="text"
                    placeholder="Responsable"
                    value={purchaseResponsible}
                    onChange={(e) => setPurchaseResponsible(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-semibold"
                  />
                </div>
              </div>

              {Number(purchaseTotalAmount || 0) - showEditPurchaseModal.totalAmount > stats.cashBalance && (
                <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-xl flex items-start gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-400 leading-normal font-semibold">
                    Attention : La hausse du montant de cet achat dépasse le solde disponible en caisse ({stats.cashBalance.toLocaleString('fr-FR')} FCFA).
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowEditPurchaseModal(null)}
                  className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl font-bold transition-all"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl font-bold shadow-lg shadow-violet-950/20 transition-all"
                >
                  Enregistrer les modifications
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ===== STOCK MANAGEMENT MODALS ===== */}

      {/* Modal Ajuster le Stock */}
      {showAdjustStockModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Ajuster le stock</h3>
              </div>
              <button 
                onClick={() => setShowAdjustStockModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-zinc-950 rounded-xl flex items-center gap-3 border border-zinc-850">
                <span className="text-2xl">{showAdjustStockModal.image}</span>
                <div>
                  <span className="font-bold text-white block">{showAdjustStockModal.name}</span>
                  <span className="text-zinc-400 text-xs">Stock actuel : <strong>{showAdjustStockModal.stock}</strong></span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Type de Mouvement :</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                >
                  <option value="entrée">Entrée (Approvisionnement / Stock +)</option>
                  <option value="sortie">Sortie (Stock -)</option>
                  <option value="casse">Casse (Stock -)</option>
                  <option value="perte">Perte / Vol (Stock -)</option>
                  <option value="consommation">Consommation interne (Offert/Staff / Stock -)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Quantité :</label>
                <input
                  type="number"
                  min="1"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Motif / Commentaire :</label>
                <textarea
                  placeholder="Saisissez la raison de l'ajustement..."
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 h-20 resize-none font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setShowAdjustStockModal(null)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  handleStockAdjustment(showAdjustStockModal.id, adjustType, adjustQty, adjustReason);
                  setShowAdjustStockModal(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-950/20 active:scale-95 transition-all"
              >
                Valider l'ajustement
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Modifier le Produit (Stock) */}
      {showEditProductModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Configurer le produit</h3>
              </div>
              <button 
                onClick={() => setShowEditProductModal(null)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="col-span-3 space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Nom du produit :</label>
                  <input
                    type="text"
                    value={editProdName}
                    onChange={(e) => setEditProdName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block text-center">Icône :</label>
                  <input
                    type="text"
                    value={editProdImage}
                    onChange={(e) => setEditProdImage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-center text-white focus:outline-none focus:border-violet-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Catégorie :</label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setEditProdCategory(newCat);
                      if (newCat === "chicha") {
                        setEditProdPurchasePrice(0);
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                  >
                    {productCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Seuil d'alerte min :</label>
                  <input
                    type="number"
                    min="0"
                    value={editProdMinThreshold}
                    onChange={(e) => setEditProdMinThreshold(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {editProdCategory !== "chicha" ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block">Prix d'achat (FCFA) :</label>
                    <input
                      type="number"
                      min="0"
                      value={editProdPurchasePrice}
                      onChange={(e) => setEditProdPurchasePrice(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block">Prix d'achat (FCFA) :</label>
                    <div className="w-full bg-zinc-950/40 border border-zinc-900 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-zinc-650 select-none flex items-center h-[38px]">
                      Non applicable
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Prix de vente (FCFA) :</label>
                  <input
                    type="number"
                    min="0"
                    value={editProdPrice}
                    onChange={(e) => setEditProdPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setShowEditProductModal(null)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                onClick={() => {
                  handleUpdateProductSettings(
                    showEditProductModal.id, 
                    editProdName, 
                    editProdCategory, 
                    editProdPurchasePrice, 
                    editProdPrice, 
                    editProdMinThreshold,
                    editProdImage
                  );
                  setShowEditProductModal(null);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-950/20 active:scale-95 transition-all"
              >
                Enregistrer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Ajouter un Nouveau Produit */}
      {showAddProductModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Nouveau Produit Snack-Bar</h3>
              </div>
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-3 items-end">
                <div className="col-span-3 space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Nom du produit :</label>
                  <input
                    type="text"
                    placeholder="ex: Fanta Citron 33cl"
                    value={addProdName}
                    onChange={(e) => setAddProdName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block text-center">Icône :</label>
                  <input
                    type="text"
                    placeholder="🥤"
                    value={addProdImage}
                    onChange={(e) => setAddProdImage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-center text-white focus:outline-none focus:border-violet-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Catégorie :</label>
                  <select
                    value={addProdCategory}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setAddProdCategory(newCat);
                      if (newCat === "chicha") {
                        setAddProdPurchasePrice(0);
                      }
                    }}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                  >
                    {productCategories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Seuil d'alerte min :</label>
                  <input
                    type="number"
                    min="0"
                    value={addProdMinThreshold}
                    onChange={(e) => setAddProdMinThreshold(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Stock initial :</label>
                  <input
                    type="number"
                    min="0"
                    value={addProdInitialStock}
                    onChange={(e) => setAddProdInitialStock(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
                {addProdCategory !== "chicha" ? (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block">Prix Achat :</label>
                    <input
                      type="number"
                      min="0"
                      value={addProdPurchasePrice}
                      onChange={(e) => setAddProdPurchasePrice(Math.max(0, Number(e.target.value)))}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase block">Prix Achat :</label>
                    <div className="w-full bg-zinc-950/40 border border-zinc-900 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-zinc-650 select-none flex items-center h-[38px]">
                      N/A
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Prix Vente :</label>
                  <input
                    type="number"
                    min="0"
                    value={addProdPrice}
                    onChange={(e) => setAddProdPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-violet-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setShowAddProductModal(false)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                disabled={!addProdName.trim()}
                onClick={() => {
                  handleAddProduct({
                    name: addProdName,
                    category: addProdCategory,
                    image: addProdImage,
                    price: addProdPrice,
                    purchasePrice: addProdPurchasePrice,
                    initialStock: addProdInitialStock,
                    minThreshold: addProdMinThreshold
                  });
                  setShowAddProductModal(false);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-violet-950/20 active:scale-95 transition-all"
              >
                Ajouter le produit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Saisir une Dépense */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-500" />
                <h3 className="text-base font-bold text-white">Saisir une Dépense</h3>
              </div>
              <button 
                onClick={() => setShowAddExpenseModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Montant (FCFA) *</label>
                <input
                  type="number"
                  min="0"
                  placeholder="Ex: 15000"
                  value={expenseAmount}
                  onChange={(e) => setExpenseAmount(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-rose-500"
                />
                {Number(expenseAmount) > stats.cashBalance && (
                  <p className="text-[10px] text-amber-500 mt-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Attention : dépasse le solde de caisse ({stats.cashBalance.toLocaleString('fr-FR')} FCFA).</span>
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Catégorie *</label>
                <select
                  value={expenseCategory}
                  onChange={(e) => setExpenseCategory(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-rose-500 capitalize"
                >
                  {expenseCategories.map((c, i) => (
                    <option key={i} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Motif / Description *</label>
                <input
                  type="text"
                  placeholder="Ex: Recharge compteur électricité"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Responsible */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Responsable</label>
                <input
                  type="text"
                  placeholder="Nom du responsable"
                  value={expenseResponsible}
                  onChange={(e) => setExpenseResponsible(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Date */}
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Date & Heure</label>
                <input
                  type="datetime-local"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500 font-mono font-semibold"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => setShowAddExpenseModal(false)}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                disabled={!expenseAmount || Number(expenseAmount) <= 0 || !expenseDescription.trim()}
                onClick={() => {
                  handleAddExpense(
                    expenseAmount,
                    expenseCategory,
                    expenseDescription,
                    expenseResponsible,
                    expenseDate
                  );
                  setShowAddExpenseModal(false);
                }}
                className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 disabled:from-zinc-850 disabled:to-zinc-850 disabled:text-zinc-650 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/20 active:scale-95 transition-all"
              >
                Enregistrer la dépense
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Gérer les Catégories */}
      {showManageCategoriesModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">Gérer les Catégories</h3>
              </div>
              <button 
                onClick={() => setShowManageCategoriesModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            {/* List of categories */}
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase block">Catégories existantes</label>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {expenseCategories.map((c, i) => (
                  <div key={i} className="flex justify-between items-center p-2.5 bg-zinc-900/60 border border-zinc-850 rounded-xl">
                    <span className="text-xs text-white capitalize font-semibold">{c}</span>
                    <button
                      onClick={() => {
                        if (confirm(`Voulez-vous vraiment supprimer la catégorie "${c}" ? (Les dépenses existantes de cette catégorie ne seront pas affectées)`)) {
                          handleDeleteExpenseCategory(c);
                        }
                      }}
                      className="p-1 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 rounded transition-all"
                      title="Supprimer la catégorie"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {expenseCategories.length === 0 && (
                  <p className="text-xs text-zinc-500 italic py-2 text-center">Aucune catégorie de dépense.</p>
                )}
              </div>
            </div>

            {/* Add new category form */}
            <div className="pt-4 border-t border-zinc-850 space-y-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase block">Ajouter une catégorie</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ex: Publicité"
                  id="new-expense-category-input"
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-500 font-semibold"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const input = document.getElementById("new-expense-category-input");
                      if (input && input.value.trim()) {
                        handleAddExpenseCategory(input.value);
                        input.value = "";
                      }
                    }
                  }}
                />
                <button
                  onClick={() => {
                    const input = document.getElementById("new-expense-category-input");
                    if (input && input.value.trim()) {
                      handleAddExpenseCategory(input.value);
                      input.value = "";
                    }
                  }}
                  className="px-3.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => setShowManageCategoriesModal(false)}
                className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all text-center"
              >
                Fermer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===== MODAL CLÔTURE DE CAISSE (Z-REPORT) ===== */}
      {showZReportModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="zreport-modal bg-zinc-950 border border-zinc-800 w-full max-w-lg rounded-2xl shadow-2xl shadow-emerald-950/30 overflow-hidden">
            
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-900/40 to-teal-900/20 border-b border-emerald-800/30 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white tracking-tight">Rapport de Clôture de Caisse</h3>
                    <p className="text-xs text-emerald-400 font-semibold">Z-Report — Fin de journée</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-zinc-300">GAMEZONE HUB</p>
                  <p className="text-[10px] text-zinc-500">Terminal #01</p>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-4 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{currentDateTime.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span className="font-mono font-bold text-white">{currentDateTime.toLocaleTimeString('fr-FR')}</span>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              
              {/* Revenue breakdown */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Détail des recettes</p>
                {[
                  { label: "Revenus Jeux Vidéo", value: stats.gamesRevenue, color: "text-cyan-400", icon: "🎮", sessions: `${dailySessionsCount + consoles.filter(c => c.status === 'occupée').length} session(s)` },
                  { label: "Revenus Snack Bar", value: stats.snackRevenue, color: "text-amber-400", icon: "🥤", sessions: `${dailySalesCount} vente(s)` },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{row.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-zinc-200">{row.label}</p>
                        <p className="text-[10px] text-zinc-500">{row.sessions}</p>
                      </div>
                    </div>
                    <span className={`text-base font-extrabold font-mono ${row.color}`}>{row.value.toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="h-px bg-zinc-800"></div>

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-semibold">Total des recettes du jour</span>
                  <span className="font-extrabold text-white font-mono text-base">{(stats.gamesRevenue + stats.snackRevenue).toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400 font-semibold">Total des dépenses du jour</span>
                  <span className="font-extrabold text-rose-400 font-mono text-base">
                    {expenses
                      .filter(e => new Date(e.date).toDateString() === new Date().toDateString())
                      .reduce((sum, e) => sum + e.amount, 0)
                      .toLocaleString('fr-FR')} FCFA
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-900/20 border border-emerald-500/25">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-bold text-emerald-300">Solde de caisse final</span>
                  </div>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">{stats.cashBalance.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              {/* Status indicators */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Postes actifs", value: `${consoles.filter(c => c.status === 'occupée').length}`, note: "non clôturés" },
                  { label: "En maintenance", value: `${consoles.filter(c => c.status === 'maintenance').length}`, note: "postes" },
                  { label: "Libres", value: `${consoles.filter(c => c.status === 'libre').length}`, note: "disponibles" }
                ].map((s, i) => (
                  <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-center">
                    <p className="text-xl font-extrabold text-white">{s.value}</p>
                    <p className="text-[10px] text-zinc-400 font-semibold">{s.label}</p>
                    <p className="text-[9px] text-zinc-600">{s.note}</p>
                  </div>
                ))}
              </div>

              {consoles.filter(c => c.status === 'occupée').length > 0 && (
                <div className="flex items-center gap-2 p-3 bg-amber-900/20 border border-amber-500/30 rounded-xl">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-[11px] text-amber-300 font-semibold">
                    {consoles.filter(c => c.status === 'occupée').length} session(s) encore en cours. Clôturez-les avant de fermer la caisse.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowZReportModal(false)}
                  className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    addLog("system_role", `Clôture de caisse (Z-Report) imprimée — Total journée : ${(stats.gamesRevenue + stats.snackRevenue).toLocaleString('fr-FR')} FCFA | Caisse : ${stats.cashBalance.toLocaleString('fr-FR')} FCFA`, "console");
                    setShowZReportModal(false);
                    gsap.fromTo(".notification-toast", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", onComplete: () => {
                      setTimeout(() => gsap.to(".notification-toast", { opacity: 0, y: -20, duration: 0.3 }), 3500);
                    }});
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Printer className="w-4 h-4" />
                  Imprimer le Rapport
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Ajouter une Nouvelle Console */}
      {showAddConsoleModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Nouvelle Station / Console</h3>
              </div>
              <button 
                onClick={() => {
                  setShowAddConsoleModal(false);
                  setAddConsoleName("");
                  setAddConsoleImage("");
                }}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Nom de la station :</label>
                <input
                  type="text"
                  placeholder="ex: STADE VELODROME"
                  value={addConsoleName}
                  onChange={(e) => setAddConsoleName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Zone :</label>
                  <select
                    value={addConsoleZone}
                    onChange={(e) => setAddConsoleZone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    {zones.map(z => (
                      <option key={z} value={z}>Zone {z}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Type :</label>
                  <select
                    value={addConsoleType}
                    onChange={(e) => setAddConsoleType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="PS5">PS5</option>
                    <option value="PS4">PS4</option>
                    <option value="PC Gaming">PC Gaming</option>
                    <option value="Xbox Series">Xbox Series</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Tarif Horaire (FCFA/h) :</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={addConsoleRate}
                  onChange={(e) => setAddConsoleRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Image de profil de la console :</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {addConsoleImage ? (
                      <img src={addConsoleImage} className="w-full h-full object-cover" alt="Prévisualisation" />
                    ) : (
                      <span className="text-zinc-600 text-xs">Aucune</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], setAddConsoleImage)}
                      className="hidden" 
                      id="add-console-file-input"
                    />
                    <label 
                      htmlFor="add-console-file-input"
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg border border-zinc-700/40 cursor-pointer transition-all inline-block select-none"
                    >
                      Choisir un fichier
                    </label>
                    {addConsoleImage && (
                      <button
                        type="button"
                        onClick={() => setAddConsoleImage("")}
                        className="text-[10px] text-rose-400 font-bold ml-3 hover:underline cursor-pointer"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowAddConsoleModal(false);
                  setAddConsoleName("");
                  setAddConsoleImage("");
                }}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                disabled={!addConsoleName.trim()}
                onClick={handleAddConsole}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/20 active:scale-95 transition-all"
              >
                Ajouter la station
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Modifier une Console Existante */}
      {showEditConsoleModal && role === "admin" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-zinc-800 shadow-2xl p-6 space-y-6 animate-scale-up">
            
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-400" />
                <h3 className="text-base font-bold text-white">Modifier la Station / Console</h3>
              </div>
              <button 
                onClick={() => {
                  setShowEditConsoleModal(null);
                }}
                className="text-zinc-500 hover:text-zinc-300 text-sm font-bold"
              >
                ✖
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Nom de la station :</label>
                <input
                  type="text"
                  placeholder="ex: STADE VELODROME"
                  value={editConsoleName}
                  onChange={(e) => setEditConsoleName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-blue-500 uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Zone :</label>
                  <select
                    value={editConsoleZone}
                    onChange={(e) => setEditConsoleZone(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    {zones.map(z => (
                      <option key={z} value={z}>Zone {z}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Type :</label>
                  <select
                    value={editConsoleType}
                    onChange={(e) => setEditConsoleType(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="PS5">PS5</option>
                    <option value="PS4">PS4</option>
                    <option value="PC Gaming">PC Gaming</option>
                    <option value="Xbox Series">Xbox Series</option>
                    <option value="Nintendo Switch">Nintendo Switch</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Tarif Horaire (FCFA/h) :</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={editConsoleRate}
                  onChange={(e) => setEditConsoleRate(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono font-bold text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Image de profil de la console :</label>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center flex-shrink-0">
                    {editConsoleImage ? (
                      <img src={editConsoleImage} className="w-full h-full object-cover" alt="Prévisualisation" />
                    ) : (
                      <span className="text-zinc-650 text-xs">Aucune</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e.target.files[0], setEditConsoleImage)}
                      className="hidden" 
                      id="edit-console-file-input"
                    />
                    <label 
                      htmlFor="edit-console-file-input"
                      className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] font-bold rounded-lg border border-zinc-700/40 cursor-pointer transition-all inline-block select-none"
                    >
                      Choisir un fichier
                    </label>
                    {editConsoleImage && (
                      <button
                        type="button"
                        onClick={() => setEditConsoleImage("")}
                        className="text-[10px] text-rose-400 font-bold ml-3 hover:underline cursor-pointer"
                      >
                        Effacer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                onClick={() => {
                  setShowEditConsoleModal(null);
                }}
                className="flex-1 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-zinc-200 rounded-xl text-xs font-bold transition-all"
              >
                Annuler
              </button>
              <button 
                disabled={!editConsoleName.trim()}
                onClick={() => handleUpdateConsole(showEditConsoleModal.id)}
                className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-950/20 active:scale-95 transition-all"
              >
                Enregistrer
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========== MODAL ANNULATION VENTE ========== */}
      {showCancelSaleModal && (
        <CancelSaleModal
          sale={showCancelSaleModal}
          onClose={() => setShowCancelSaleModal(null)}
          onConfirm={(id, reason, custom, returnStock) => {
            handleCancelSale(id, reason, custom, returnStock);
            setShowCancelSaleModal(null);
          }}
        />
      )}

    </div>
  );
}
