// Mock data for GameZone & Snack Bar management system in FCFA

// Football club logo URLs mapped to console/zone
export const clubLogos = {
  // Zone A
  "ETIHAD CAMPUS":         { logo: "https://upload.wikimedia.org/wikipedia/en/e/eb/Manchester_City_FC_badge.svg",           club: "Manchester City",    color: "#6CABDD", zone: "A" },
  "ALLIANZ ARENA":         { logo: "https://upload.wikimedia.org/wikipedia/commons/1/1f/FC_Bayern_M%C3%BCnchen_logo_%28sRGB%29.svg", club: "FC Bayern München",  color: "#DC052D", zone: "A" },
  "PARC DES PRINCES":      { logo: "https://upload.wikimedia.org/wikipedia/en/a/a7/Paris_Saint-Germain_F.C..svg",           club: "Paris Saint-Germain", color: "#004170", zone: "A" },
  // Zone B
  "SANTIAGO BERNABÉU":     { logo: "https://upload.wikimedia.org/wikipedia/en/5/56/Real_Madrid_CF.svg",                    club: "Real Madrid CF",     color: "#FEBE10", zone: "B" },
  "CAMP NOU":              { logo: "https://upload.wikimedia.org/wikipedia/en/4/47/FC_Barcelona_%28crest%29.svg",           club: "FC Barcelona",       color: "#A50044", zone: "B" },
  // Zone C
  "CIVITAS METROPOLITANO": { logo: "https://upload.wikimedia.org/wikipedia/en/f/f4/Atletico_Madrid_2017_logo.svg",         club: "Atlético de Madrid", color: "#2A3B8F", zone: "C" },
  "ÉMIRATS DE LONDRES":    { logo: "https://upload.wikimedia.org/wikipedia/en/5/53/Arsenal_FC.svg",                        club: "Arsenal FC",         color: "#EF0107", zone: "C" },
};

export const initialConsoles = [
  // ─── Zone A ─────────────────────────────────────────────────────────────
  {
    id: 1,
    name: "ETIHAD CAMPUS",
    zone: "A",
    type: "PS5",
    status: "libre",
    ratePerHour: 1500.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
    activeSession: null
  },
  {
    id: 2,
    name: "ALLIANZ ARENA",
    zone: "A",
    type: "PS5",
    status: "libre",
    ratePerHour: 1500.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
    activeSession: null
  },
  {
    id: 3,
    name: "PARC DES PRINCES",
    zone: "A",
    type: "PS5",
    status: "libre",
    ratePerHour: 1500.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
    activeSession: null
  },
  // ─── Zone B ─────────────────────────────────────────────────────────────
  {
    id: 4,
    name: "SANTIAGO BERNABÉU",
    zone: "B",
    type: "PS4",
    status: "libre",
    ratePerHour: 1000.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
    activeSession: null
  },
  {
    id: 5,
    name: "CAMP NOU",
    zone: "B",
    type: "PS4",
    status: "libre",
    ratePerHour: 1000.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
    activeSession: null
  },
  // ─── Zone C ─────────────────────────────────────────────────────────────
  {
    id: 6,
    name: "CIVITAS METROPOLITANO",
    zone: "C",
    type: "PC Gaming",
    status: "libre",
    ratePerHour: 2000.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
    activeSession: null
  },
  {
    id: 7,
    name: "ÉMIRATS DE LONDRES",
    zone: "C",
    type: "PC Gaming",
    status: "libre",
    ratePerHour: 2000.00,
    totalSessions: 0,
    totalRevenue: 0,
    totalTimeSeconds: 0,
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
  { id: 127, name: "Chicha Double Pomme", price: 10000.00, purchasePrice: 0, category: "chicha", image: "💨", stock: 99, minThreshold: 5 },
  { id: 128, name: "Chicha Menthe-Myrtille", price: 10000.00, purchasePrice: 0, category: "chicha", image: "🫐", stock: 99, minThreshold: 5 },
  { id: 129, name: "Chicha Love 66", price: 12000.00, purchasePrice: 0, category: "chicha", image: "❤️", stock: 99, minThreshold: 5 },
  { id: 130, name: "Chicha Hawai", price: 12000.00, purchasePrice: 0, category: "chicha", image: "🍍", stock: 99, minThreshold: 5 }
];

export const initialStats = {
  playersPresent: 0,
  gamesRevenue: 0.00,
  snackRevenue: 0.00,
  cashBalance: 0.00,
  mobileBalance: 0.00
};

export const initialTopConsoles = [];

export const initialTopProducts = [];

export const initialActivityLog = [];

export const initialStockMovements = [];

export const defaultExpenseCategories = [
  "électricité",
  "internet",
  "salaires",
  "maintenance",
  "transport",
  "autres"
];

export const initialExpenses = [];

export const initialPurchases = [];

export const initialCaisseSessions = [];

export const initialSuppliers = [
  {
    id: 1,
    nom: "Grossiste Boissons SARL",
    telephone: "+237 6 55 11 22 33",
    email: "contact@grossisteboissons.cm",
    adresse: "Rue du Commerce, Yaound\u00e9 Centre",
    produitsFournis: ["Coca-Cola (Cannette)", "Fanta (Cannette)", "Malta (Cannette)", "Red Bull (Cannette)"],
    dateAjout: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    notes: "Livraison 2x/semaine."
  },
  {
    id: 2,
    nom: "Tech Distribution CM",
    telephone: "+237 6 77 88 99 00",
    email: "sales@techdistr.cm",
    adresse: "Quartier Hippodrome, Douala",
    produitsFournis: ["Manette PS5 DualSense", "C\u00e2ble HDMI", "Casque Gaming"],
    dateAjout: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    notes: "Garantie 6 mois."
  },
  {
    id: 3,
    nom: "Brasseries du Cameroun",
    telephone: "+237 6 22 33 44 55",
    email: "pro@brasseries-cm.cm",
    adresse: "Zone Industrielle, Douala Port",
    produitsFournis: ["Beaufort (Cannette)", "33 Export (Bouteille)", "Castel (Bouteille)"],
    dateAjout: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    notes: "Paiement diff\u00e9r\u00e9 30 jours."
  },
  {
    id: 4,
    nom: "Chicha & Co Premium",
    telephone: "+237 6 99 00 11 22",
    email: "chicha.premium@gmail.com",
    adresse: "Av. Kennedy, Yaound\u00e9",
    produitsFournis: ["Chicha Double Pomme", "Chicha Menthe-Myrtille", "Chicha Love 66"],
    dateAjout: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    notes: "Contact: Serge."
  }
];

export const initialPlayers = [
  {
    id: 1,
    nom: "Kevin Nguemo",
    telephone: "+237 6 99 88 77 66",
    email: "kevin.nguemo@gmail.com",
    dateInscription: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  },
  {
    id: 2,
    nom: "Marc Etoa",
    telephone: "+237 6 55 44 33 22",
    email: "marc.etoa@yahoo.fr",
    dateInscription: new Date(Date.now() - 45 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  },
  {
    id: 3,
    nom: "Junior Tchakounté",
    telephone: "+237 6 77 66 55 44",
    email: "junior.tchako@outlook.com",
    dateInscription: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  },
  {
    id: 4,
    nom: "Sofiane Zidane",
    telephone: "06 12 34 56 78",
    email: "sofiane.zidane@gmail.com",
    dateInscription: new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  },
  {
    id: 5,
    nom: "Karim Belhadj",
    telephone: "06 98 76 54 32",
    email: "karim.belhadj@yahoo.fr",
    dateInscription: new Date(Date.now() - 75 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  },
  {
    id: 6,
    nom: "Amine El Amrani",
    telephone: "06 55 44 33 22",
    email: "amine.amrani@gmail.com",
    dateInscription: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  },
  {
    id: 7,
    nom: "Lucas Martin",
    telephone: "07 11 22 33 44",
    email: "lucas.martin@hotmail.com",
    dateInscription: new Date(Date.now() - 100 * 24 * 3600 * 1000).toISOString(),
    totalSessions: 0,
    totalSpent: 0,
    totalTimeMinutes: 0
  }
];
