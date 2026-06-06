// Mock data for GameZone & Snack Bar management system in FCFA

export const initialConsoles = [
  {
    id: 1,
    name: "PS5 - Zone A #1",
    type: "PS5",
    status: "occupée",
    ratePerHour: 1500.00,
    activeSession: {
      player: "Sofiane Zidane",
      firstName: "Sofiane",
      lastName: "Zidane",
      phone: "06 12 34 56 78",
      startTime: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45 mins ago
      durationType: "limited",
      durationMinutes: 120, // 2 hours
      timeElapsedSeconds: 45 * 60,
      totalAmountDue: 1125.00 // 0.75 hour * 1500 FCFA = 1125 FCFA
    }
  },
  {
    id: 2,
    name: "PS5 - Zone A #2",
    type: "PS5",
    status: "libre",
    ratePerHour: 1500.00,
    activeSession: null
  },
  {
    id: 3,
    name: "PS5 - Zone A #3",
    type: "PS5",
    status: "maintenance",
    ratePerHour: 1500.00,
    activeSession: null
  },
  {
    id: 4,
    name: "PS4 - Retro Zone #1",
    type: "PS4",
    status: "occupée",
    ratePerHour: 1000.00,
    activeSession: {
      player: "Karim Belhadj",
      firstName: "Karim",
      lastName: "Belhadj",
      phone: "06 98 76 54 32",
      startTime: new Date(Date.now() - 90 * 60 * 1000).toISOString(), // 90 mins ago
      durationType: "unlimited",
      durationMinutes: 0,
      timeElapsedSeconds: 90 * 60,
      totalAmountDue: 1500.00 // 1.5 hours * 1000 FCFA = 1500 FCFA
    }
  },
  {
    id: 5,
    name: "PC Gaming - Station #1",
    type: "PC Gaming",
    status: "libre",
    ratePerHour: 2000.00,
    activeSession: null
  },
  {
    id: 6,
    name: "PC Gaming - Station #2",
    type: "PC Gaming",
    status: "occupée",
    ratePerHour: 2000.00,
    activeSession: {
      player: "Lucas Martin",
      firstName: "Lucas",
      lastName: "Martin",
      phone: "07 11 22 33 44",
      startTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 mins ago
      durationType: "limited",
      durationMinutes: 60, // 1 hour
      timeElapsedSeconds: 15 * 60,
      totalAmountDue: 500.00 // 0.25 hour * 2000 FCFA = 500 FCFA
    }
  },
  {
    id: 7,
    name: "VIP Salon Rouge",
    type: "VIP",
    status: "occupée",
    ratePerHour: 5000.00,
    activeSession: {
      player: "Amine El Amrani",
      firstName: "Amine",
      lastName: "El Amrani",
      phone: "06 55 44 33 22",
      startTime: new Date(Date.now() - 180 * 60 * 1000).toISOString(), // 3 hours ago
      durationType: "unlimited",
      durationMinutes: 0,
      timeElapsedSeconds: 180 * 60,
      totalAmountDue: 15000.00 // 3 hours * 5000 FCFA = 15000 FCFA
    }
  },
  {
    id: 8,
    name: "VIP Salon Bleu",
    type: "VIP",
    status: "libre",
    ratePerHour: 5000.00,
    activeSession: null
  }
];

export const snackProducts = [
  // Cannettes (Boissons)
  { id: 101, name: "Beaufort (Cannette)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 56, minThreshold: 10 },
  { id: 102, name: "Chill (Cannette)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍋", stock: 14, minThreshold: 5 },
  { id: 103, name: "Heineken (Cannette)", price: 1500.00, purchasePrice: 900.00, category: "boissons", image: "🍺", stock: 15, minThreshold: 5 },
  { id: 104, name: "Malta (Cannette)", price: 1000.00, purchasePrice: 500.00, category: "boissons", image: "🥤", stock: 52, minThreshold: 10 },
  { id: 105, name: "33 Export (Cannette)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 32, minThreshold: 10 },
  { id: 106, name: "Fanta (Cannette)", price: 1000.00, purchasePrice: 500.00, category: "boissons", image: "🍊", stock: 18, minThreshold: 5 },
  { id: 107, name: "Red Bull (Cannette)", price: 2000.00, purchasePrice: 1200.00, category: "boissons", image: "⚡", stock: 49, minThreshold: 10 },
  { id: 108, name: "Castel (Cannette)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 16, minThreshold: 5 },
  { id: 109, name: "Booster (Cannette)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "⚡", stock: 13, minThreshold: 5 },
  { id: 110, name: "Coca-Cola (Cannette)", price: 1000.00, purchasePrice: 500.00, category: "boissons", image: "🥤", stock: 22, minThreshold: 5 },
  { id: 111, name: "Eau Minérale (Cannette)", price: 500.00, purchasePrice: 200.00, category: "eau", image: "💧", stock: 5, minThreshold: 2 },

  // Bouteilles (Boissons)
  { id: 112, name: "Castel (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 2, minThreshold: 2 },
  { id: 113, name: "33 Export (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 70, minThreshold: 15 },
  { id: 114, name: "Doppel (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 9, minThreshold: 3 },
  { id: 115, name: "Beaufort Ordinaire (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 48, minThreshold: 10 },
  { id: 116, name: "Kadji (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 25, minThreshold: 5 },
  { id: 117, name: "Booster (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "⚡", stock: 26, minThreshold: 5 },
  { id: 118, name: "Beaufort Light (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 8, minThreshold: 3 },
  { id: 119, name: "Mutzig (Bouteille)", price: 1000.00, purchasePrice: 600.00, category: "boissons", image: "🍺", stock: 16, minThreshold: 5 },
  { id: 120, name: "Guinness PG (Bouteille)", price: 1500.00, purchasePrice: 900.00, category: "boissons", image: "🍺", stock: 80, minThreshold: 15 },
  { id: 121, name: "Guinness GG (Bouteille)", price: 2000.00, purchasePrice: 1200.00, category: "boissons", image: "🍺", stock: 2, minThreshold: 2 },
  { id: 122, name: "Jus de fruits (Bouteille)", price: 1000.00, purchasePrice: 500.00, category: "boissons", image: "🧃", stock: 13, minThreshold: 5 },

  // Whisky (Whisky / Alcool)
  { id: 123, name: "Bouteille Black Label", price: 50000.00, purchasePrice: 25000.00, category: "whisky", image: "🍾", stock: 7, minThreshold: 2 },
  { id: 124, name: "Bouteille Chivas", price: 60000.00, purchasePrice: 30000.00, category: "whisky", image: "🍾", stock: 6, minThreshold: 2 },
  { id: 125, name: "Bouteille Monkey Shoulder", price: 55000.00, purchasePrice: 28000.00, category: "whisky", image: "🍾", stock: 1, minThreshold: 1 },
  { id: 126, name: "Bouteille Havana Club", price: 40000.00, purchasePrice: 20000.00, category: "whisky", image: "🍾", stock: 4, minThreshold: 1 },

  // Chichas
  { id: 127, name: "Chicha Double Pomme", price: 10000.00, purchasePrice: 2500.00, category: "chicha", image: "💨", stock: 99, minThreshold: 5 },
  { id: 128, name: "Chicha Menthe-Myrtille", price: 10000.00, purchasePrice: 2500.00, category: "chicha", image: "🫐", stock: 99, minThreshold: 5 },
  { id: 129, name: "Chicha Love 66", price: 12000.00, purchasePrice: 3000.00, category: "chicha", image: "❤️", stock: 99, minThreshold: 5 },
  { id: 130, name: "Chicha Hawai", price: 12000.00, purchasePrice: 3000.00, category: "chicha", image: "🍍", stock: 99, minThreshold: 5 }
];

export const initialStats = {
  playersPresent: 4,
  gamesRevenue: 120000.00,
  snackRevenue: 180000.00,
  cashBalance: 500000.00
};

export const initialTopConsoles = [
  { name: "VIP Salon Rouge", revenue: 240000, sessions: 4 },
  { name: "PS5 - Zone A #1", revenue: 120000, sessions: 9 },
  { name: "PC Gaming - Station #1", revenue: 90000, sessions: 12 },
  { name: "PS5 - Zone A #2", revenue: 75000, sessions: 6 },
  { name: "PS4 - Retro Zone #1", revenue: 45000, sessions: 8 }
];

export const initialTopProducts = [
  { name: "Chicha Double Pomme", quantity: 18, revenue: 180000, category: "chicha" },
  { name: "Red Bull (Cannette)", quantity: 34, revenue: 68000, category: "boissons" },
  { name: "Coca-Cola (Cannette)", quantity: 48, revenue: 48000, category: "boissons" },
  { name: "Bouteille Black Label", quantity: 2, revenue: 100000, category: "whisky" },
  { name: "Chicha Love 66", quantity: 5, revenue: 60000, category: "chicha" }
];

export const initialActivityLog = [
  { id: 1, type: "console_start", message: "Session démarrée sur VIP Salon Rouge pour Amine El Amrani (Illimité)", time: "Il y a 3 heures", category: "console" },
  { id: 2, type: "pos_sale", message: "Vente de 2x Red Bull, 1x Chicha Double Pomme (Total: 14 000 FCFA)", time: "Il y a 1 heure", category: "snack" },
  { id: 3, type: "console_start", message: "Session démarrée sur PS5 - Zone A #1 pour Sofiane Zidane (2h00)", time: "Il y a 45 minutes", category: "console" },
  { id: 4, type: "console_stop", message: "Session clôturée sur PS5 - Zone A #2 par Karim (Facturé: 8 000 FCFA)", time: "Il y a 20 minutes", category: "console" },
  { id: 5, type: "console_start", message: "Session démarrée sur PC Gaming #2 pour Lucas Martin (1h00)", time: "Il y a 15 minutes", category: "console" }
];

export const initialStockMovements = [
  { id: 1, date: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), productId: 101, productName: "Coca-Cola 33cl", type: "entrée", quantity: 50, reason: "Approvisionnement hebdomadaire", user: "Administrateur" },
  { id: 2, date: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(), productId: 102, productName: "Red Bull 250ml", type: "entrée", quantity: 24, reason: "Approvisionnement hebdomadaire", user: "Administrateur" },
  { id: 3, date: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(), productId: 101, productName: "Coca-Cola 33cl", type: "sortie", quantity: 5, reason: "Vente POS direct", user: "Gérant" },
  { id: 4, date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(), productId: 112, productName: "Verre Jack Daniel's", type: "casse", quantity: 1, reason: "Bouteille glissée lors du service", user: "Gérant" },
  { id: 5, date: new Date(Date.now() - 1.5 * 3600 * 1000).toISOString(), productId: 103, productName: "Orangina 33cl", type: "consommation", quantity: 2, reason: "Offert au personnel (staff)", user: "Administrateur" },
  { id: 6, date: new Date(Date.now() - 1 * 3600 * 1000).toISOString(), productId: 108, productName: "Chicha Double Pomme", type: "sortie", quantity: 1, reason: "Consommation Session VIP Salon Rouge", user: "Gérant" }
];

export const defaultExpenseCategories = [
  "électricité",
  "internet",
  "salaires",
  "maintenance",
  "transport",
  "autres"
];

export const initialExpenses = [
  { id: 1, date: new Date(Date.now() - 5 * 3600 * 1000).toISOString(), category: "électricité", amount: 25000, description: "Recharge compteur électricité prépayé", responsible: "Sofiane" },
  { id: 2, date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), category: "internet", amount: 15000, description: "Abonnement fibre mensuel", responsible: "Zidane" },
  { id: 3, date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), category: "maintenance", amount: 8000, description: "Achat pâte thermique et nettoyage PC Station #1", responsible: "Gérant" }
];

export const initialPurchases = [
  { id: 1, date: new Date(Date.now() - 6 * 3600 * 1000).toISOString(), supplier: "Grossiste Boissons SARL", product: "Coca-Cola (Cannette)", quantity: 50, unitPrice: 500, totalAmount: 25000, paymentMethod: "espèces", responsible: "Sofiane" },
  { id: 2, date: new Date(Date.now() - 30 * 3600 * 1000).toISOString(), supplier: "Tech Distribution", product: "Autre - Manette PS5 DualSense", quantity: 2, unitPrice: 45000, totalAmount: 90000, paymentMethod: "espèces", responsible: "Zidane" }
];

export const initialCaisseSessions = [
  {
    id: "shift-1",
    dateOpen: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    dateClose: new Date(Date.now() - 20 * 3600 * 1000).toISOString(),
    openedBy: "Zidane",
    closedBy: "Zidane",
    openingBalance: 200000,
    gamesRevenue: 95000,
    snackRevenue: 120000,
    expenses: 15000,
    purchases: 90000,
    expectedBalance: 310000,
    realBalance: 310000,
    variance: 0,
    notes: "Clôture conforme. R.A.S. Toutes les consoles éteintes.",
    status: "fermée"
  },
  {
    id: "shift-2",
    dateOpen: new Date(Date.now() - 52 * 3600 * 1000).toISOString(),
    dateClose: new Date(Date.now() - 44 * 3600 * 1000).toISOString(),
    openedBy: "Sofiane",
    closedBy: "Sofiane",
    openingBalance: 150000,
    gamesRevenue: 150000,
    snackRevenue: 175000,
    expenses: 8000,
    purchases: 0,
    expectedBalance: 467000,
    realBalance: 465000,
    variance: -2000,
    notes: "Écart de -2 000 FCFA. Manque suspecté sur canette chill.",
    status: "fermée"
  }
];

