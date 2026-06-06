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
  Settings, 
  Plus, 
  Minus, 
  Trash2, 
  Sparkles, 
  AlertTriangle, 
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
  Trophy
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
  initialSuppliers
} from "./mockData";

export default function App() {
  // App states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [role, setRole] = useState("admin"); // 'admin' or 'gerant'
  const [consoles, setConsoles] = useState(initialConsoles);
  const [products, setProducts] = useState(snackProducts);
  const [stats, setStats] = useState(initialStats);
  const [topConsolesState, setTopConsolesState] = useState(initialTopConsoles);
  const [topProductsState, setTopProductsState] = useState(initialTopProducts);
  const [activityLog, setActivityLog] = useState(initialActivityLog);

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

  // Add Product Form State
  const [addProdName, setAddProdName] = useState("");
  const [addProdCategory, setAddProdCategory] = useState("boissons");
  const [addProdImage, setAddProdImage] = useState("🥤");
  const [addProdPurchasePrice, setAddProdPurchasePrice] = useState(0);
  const [addProdPrice, setAddProdPrice] = useState(0);
  const [addProdInitialStock, setAddProdInitialStock] = useState(0);
  const [addProdMinThreshold, setAddProdMinThreshold] = useState(5);

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
    id: "shift-initial",
    dateOpen: new Date(Date.now() - 4 * 3600 * 1000).toISOString(), // 4 hours ago
    openedBy: "Sofiane",
    openingBalance: 250000.00,
    gamesRevenue: 120000.00,
    snackRevenue: 180000.00,
    expensesMaintenance: 8000.00,
    expensesDiverses: 17000.00,
    purchases: 25000.00,
    refunds: 0
  });
  const [caisseSubTab, setCaisseSubTab] = useState("suivi"); // 'suivi' or 'historique'
  const [showOpenCaisseModal, setShowOpenCaisseModal] = useState(false);
  const [showCloseCaisseModal, setShowCloseCaisseModal] = useState(false);

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

  const handleUpdateProductSettings = (productId, name, category, purchasePrice, price, minThreshold) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          name,
          category,
          purchasePrice: Number(purchasePrice),
          price: Number(price),
          minThreshold: Number(minThreshold)
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
      setActiveCaisseSession(prev => ({
        ...prev,
        expenses: prev.expenses + amt
      }));
    }

    addLog(
      "expense_add", 
      `Dépense enregistrée : ${amt.toLocaleString('fr-FR')} FCFA (${category}) - ${description.slice(0, 30)}`,
      "console"
    );
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
      setActiveCaisseSession(prev => ({
        ...prev,
        expenses: Math.max(0, prev.expenses - target.amount)
      }));
    }

    addLog(
      "expense_delete", 
      `Dépense supprimée : ${target.amount.toLocaleString('fr-FR')} FCFA (${target.category}) - ${target.description.slice(0, 30)} (Remboursé à la caisse)`,
      "console"
    );
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
      setActiveCaisseSession(prev => ({
        ...prev,
        purchases: prev.purchases + total
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
      setActiveCaisseSession(prev => ({
        ...prev,
        purchases: Math.max(0, prev.purchases - oldPurchase.totalAmount + total)
      }));
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
      setActiveCaisseSession(prev => ({
        ...prev,
        purchases: Math.max(0, prev.purchases - target.totalAmount)
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
      refunds: 0
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

  const handleCloseCaisse = (realBalance, notes, operator) => {
    if (!activeCaisseSession) return;

    const realBal = parseFloat(realBalance) || 0;
    const closedBy = operator.trim() || (role === "admin" ? "Administrateur" : "Gérant");
    
    const expectedBal = activeCaisseSession.openingBalance 
      + activeCaisseSession.gamesRevenue 
      + activeCaisseSession.snackRevenue 
      - activeCaisseSession.expensesMaintenance
      - activeCaisseSession.expensesDiverses
      - activeCaisseSession.purchases
      - activeCaisseSession.refunds;
    
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

    const dateStr = new Date(session.dateOpen).toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const timeOpen = new Date(session.dateOpen).toLocaleTimeString('fr-FR');
    const timeClose = session.dateClose ? new Date(session.dateClose).toLocaleTimeString('fr-FR') : "En cours";

    const totalRevenue = session.gamesRevenue + session.snackRevenue;
    const totalExpenses = session.expenses + session.purchases;

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
          <h1 class="title">GameZone & Snack Bar</h1>
          <p class="subtitle">RAPPORT Z - CLÔTURE DE SHIFT</p>
          <p style="font-size: 12px; color: #18181b; font-weight: 600;">Session ID: ${session.id}</p>
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
            <td>${session.dateClose ? new Date(session.dateClose).toLocaleDateString('fr-FR') + ' à ' + timeClose : 'En cours'}</td>
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

        <h3 style="margin-top: 30px; border-bottom: 1px solid #e4e4e7; padding-bottom: 5px; font-size: 14px; text-transform: uppercase;">Flux de Caisse</h3>
        <table class="details-table">
          <tr>
            <td>Fond d'ouverture</td>
            <td style="text-align: right; font-weight: 600;">${session.openingBalance.toLocaleString('fr-FR')} FCFA</td>
          </tr>
          <tr>
            <td>(+) Recettes Jeux (Consoles)</td>
            <td style="text-align: right; color: #16a34a;">+${session.gamesRevenue.toLocaleString('fr-FR')} FCFA</td>
          </tr>
          <tr>
            <td>(+) Recettes Snack Bar</td>
            <td style="text-align: right; color: #16a34a;">+${session.snackRevenue.toLocaleString('fr-FR')} FCFA</td>
          </tr>
          <tr>
            <td>(-) Dépenses directes (Shift)</td>
            <td style="text-align: right; color: #dc2626;">-${session.expenses.toLocaleString('fr-FR')} FCFA</td>
          </tr>
          <tr>
            <td>(-) Achats Stocks (Shift)</td>
            <td style="text-align: right; color: #dc2626;">-${session.purchases.toLocaleString('fr-FR')} FCFA</td>
          </tr>
        </table>

        <div class="total-box">
          <table style="width: 100%; font-size: 14px;">
            <tr style="font-weight: 600;">
              <td>Solde Théorique Attendu :</td>
              <td style="text-align: right;">${(session.openingBalance + totalRevenue - totalExpenses).toLocaleString('fr-FR')} FCFA</td>
            </tr>
            <tr style="font-weight: 800; font-size: 16px; border-top: 1px solid #e4e4e7;">
              <td style="padding-top: 10px;">Fond de Caisse Réel Compté :</td>
              <td style="text-align: right; padding-top: 10px;">${session.realBalance?.toLocaleString('fr-FR') || 'En cours'} FCFA</td>
            </tr>
            ${session.dateClose ? `
            <tr style="font-size: 14px; border-top: 1px dashed #e4e4e7;">
              <td style="padding-top: 10px;">Écart de Caisse :</td>
              <td style="text-align: right; padding-top: 10px; color: ${session.variance < 0 ? '#dc2626' : (session.variance > 0 ? '#d97706' : '#16a34a')};" class="variance-alert">
                ${session.variance > 0 ? '+' : ''}${session.variance.toLocaleString('fr-FR')} FCFA
                (${session.variance === 0 ? 'Conforme' : (session.variance < 0 ? 'Déficit' : 'Surplus')})
              </td>
            </tr>
            ` : ''}
          </table>
        </div>

        ${session.notes ? `
          <div style="margin-top: 20px; border: 1px solid #e4e4e7; padding: 12px; border-radius: 6px; font-size: 12px; background-color: #fafafa;">
            <strong>Notes & Remarques :</strong><br/>
            <p style="margin: 5px 0 0 0; color: #52525b;">${session.notes}</p>
          </div>
        ` : ''}

        <div class="footer">
          <p>Imprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</p>
          <p>GameZone - Système de Gestion Pro &bull; Version Graffiti Premium</p>
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
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

  // Snack POS State
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [posCustomer, setPosCustomer] = useState("");
  const [posAssociateConsoleId, setPosAssociateConsoleId] = useState("");

  // Modals state
  const [showStartModal, setShowStartModal] = useState(null); // stores console object to start
  const [showCloseModal, setShowCloseModal] = useState(null); // stores console object to close
  const [showReceiptModal, setShowReceiptModal] = useState(null); // stores transaction receipt details
  const [showAddSnackToConsoleModal, setShowAddSnackToConsoleModal] = useState(null); // stores console object
  const [showInterruptModal, setShowInterruptModal] = useState(null); // stores console object to interrupt
  
  // Custom rate editing state (Admin only)
  const [editingRates, setEditingRates] = useState(false);
  const [customRates, setCustomRates] = useState({
    PS5: 1500.00,
    PS4: 1000.00,
    "PC Gaming": 2000.00,
    VIP: 5000.00
  });

  // Modal forms
  const [newPlayerFirstName, setNewPlayerFirstName] = useState("");
  const [newPlayerLastName, setNewPlayerLastName] = useState("");
  const [newPlayerPhone, setNewPlayerPhone] = useState("");
  const [newDurationType, setNewDurationType] = useState("unlimited"); // 'unlimited' or 'limited'
  const [newDurationHours, setNewDurationHours] = useState(1);
  const [newPrepaidAmount, setNewPrepaidAmount] = useState(0);

  // Initialize newPrepaidAmount when opening the start modal
  useEffect(() => {
    if (showStartModal) {
      setNewPrepaidAmount(showStartModal.ratePerHour);
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
    if (!newPlayerFirstName.trim() || !newPlayerLastName.trim() || !newPlayerPhone.trim()) return;

    const durationMinutes = newDurationType === "limited" ? newDurationHours * 60 : 0;
    const fullName = `${newPlayerFirstName.trim()} ${newPlayerLastName.trim().toUpperCase()}`;
    const gameCost = newDurationType === "limited"
      ? consoleObj.ratePerHour * newDurationHours
      : Number(newPrepaidAmount || 0);
    
    // Update daily revenue stats immediately since payment is made BEFORE playing
    setStats(prev => ({
      ...prev,
      gamesRevenue: prev.gamesRevenue + gameCost,
      cashBalance: prev.cashBalance + gameCost
    }));

    if (caisseStatus === "ouverte") {
      setActiveCaisseSession(prev => ({
        ...prev,
        gamesRevenue: prev.gamesRevenue + gameCost
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
            firstName: newPlayerFirstName.trim(),
            lastName: newPlayerLastName.trim(),
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
    setNewPlayerFirstName("");
    setNewPlayerLastName("");
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
        snackRevenue: prev.snackRevenue + finalSnackAmount
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

  const exportDailyReportPDF = () => {
    const printWindow = window.open("", "_blank", "width=900,height=800");
    if (!printWindow) {
      alert("Le bloqueur de fenêtres pop-up empêche l'exportation. Veuillez autoriser les pop-ups.");
      return;
    }

    const dateStr = currentDateTime.toLocaleDateString('fr-FR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
    const timeStr = currentDateTime.toLocaleTimeString('fr-FR');

    const totalGames = stats.gamesRevenue;
    const totalSnacks = stats.snackRevenue;
    const grandTotal = totalGames + totalSnacks;
    const cash = stats.cashBalance;

    const consolesHtml = dailyConsolesRevenue
      .map(c => `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 12px; font-weight: 600; color: #18181b;">${c.name}</td>
          <td style="padding: 12px; color: #71717a; text-transform: uppercase; font-size: 11px; font-weight: 700;">${c.type}</td>
          <td style="padding: 12px; text-align: center; color: #18181b;">${c.sessions}</td>
          <td style="padding: 12px; text-align: right; font-weight: 700; font-family: monospace; color: #18181b;">${c.revenue.toLocaleString('fr-FR')} FCFA</td>
        </tr>
      `).join("");

    const snacksHtml = dailyProductsRevenue
      .filter(p => p.quantity > 0)
      .map(p => `
        <tr style="border-bottom: 1px solid #e4e4e7;">
          <td style="padding: 12px; font-weight: 600; color: #18181b;">${p.name}</td>
          <td style="padding: 12px; color: #71717a; text-transform: capitalize; font-size: 11px; font-weight: 700;">${p.category}</td>
          <td style="padding: 12px; text-align: center; color: #18181b;">${p.quantity}</td>
          <td style="padding: 12px; text-align: right; font-weight: 700; font-family: monospace; color: #18181b;">${p.revenue.toLocaleString('fr-FR')} FCFA</td>
        </tr>
      `).join("") || `
        <tr>
          <td colspan="4" style="padding: 24px; text-align: center; color: #71717a; font-style: italic;">Aucune vente de snack-bar aujourd'hui.</td>
        </tr>
      `;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Bilan Journalier - GameZone</title>
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
            grid-template-cols: repeat(4, 1fr);
            gap: 20px;
            margin-bottom: 30px;
          }
          .card-stat {
            border: 1px solid #e4e4e7;
            border-radius: 12px;
            padding: 16px;
            background-color: #fafafa;
          }
          .card-label {
            font-size: 10px;
            font-weight: 700;
            text-transform: uppercase;
            color: #71717a;
            letter-spacing: 1px;
          }
          .card-value {
            font-size: 20px;
            font-weight: 800;
            margin-top: 8px;
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
          <div>
            <h1 class="brand-title">GAMEZONE</h1>
            <p class="brand-subtitle">Rapport Journalier d'Activité</p>
          </div>
          <div class="report-meta">
            <div><strong>Date :</strong> ${dateStr}</div>
            <div><strong>Heure :</strong> ${timeStr}</div>
            <div><strong>Généré par :</strong> Administrateur</div>
          </div>
        </div>

        <div class="grid-stats">
          <div class="card-stat">
            <div class="card-label">Revenus Jeux</div>
            <div class="card-value" style="color: #0891b2;">${totalGames.toLocaleString('fr-FR')} FCFA</div>
          </div>
          <div class="card-stat">
            <div class="card-label">Revenus Snacks</div>
            <div class="card-value" style="color: #d97706;">${totalSnacks.toLocaleString('fr-FR')} FCFA</div>
          </div>
          <div class="card-stat" style="background-color: #faf5ff; border-color: #e9d5ff;">
            <div class="card-label" style="color: #7c3aed;">Total du Jour</div>
            <div class="card-value" style="color: #7c3aed;">${grandTotal.toLocaleString('fr-FR')} FCFA</div>
          </div>
          <div class="card-stat" style="background-color: #ecfdf5; border-color: #a7f3d0;">
            <div class="card-label" style="color: #059669;">Solde de Caisse</div>
            <div class="card-value" style="color: #059669;">${cash.toLocaleString('fr-FR')} FCFA</div>
          </div>
        </div>

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
    if (cart.length === 0) return;

    // Option 1: Associate with active console session
    if (posAssociateConsoleId) {
      const consoleId = Number(posAssociateConsoleId);
      setConsoles(prev => prev.map(c => {
        if (c.id === consoleId && c.status === "occupée" && c.activeSession) {
          const extraList = [...(c.activeSession.extraSnacksList || [])];
          cart.forEach(cartItem => {
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
          const sold = cart.find(x => x.product.id === p.id);
          if (sold) {
            return { ...p, stock: Math.max(0, p.stock - sold.quantity) };
          }
          return p;
        });
      });

      // Record stock movements
      const activeConsole = consoles.find(c => c.id === consoleId);
      setStockMovements(prev => {
        const newMovements = cart.map((cartItem, idx) => ({
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
        `Ajout de ${cart.length} article(s) à la facture de ${activeConsoleObj?.activeSession?.player || 'Joueur'} sur ${activeConsoleObj?.name} (Total snack: +${cartTotal.toLocaleString('fr-FR')} FCFA)`,
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
        snackRevenue: prev.snackRevenue + cartTotal
      }));
    }

    // Update product stocks
    setProducts(prev => {
      return prev.map(p => {
        const sold = cart.find(x => x.product.id === p.id);
        if (sold) {
          return { ...p, stock: Math.max(0, p.stock - sold.quantity) };
        }
        return p;
      });
    });

    // Record stock movements
    const clientRef = posCustomer.trim() || "Client Comptant";
    setStockMovements(prev => {
      const newMovements = cart.map((cartItem, idx) => ({
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
      cart.forEach(cartItem => {
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
        const sold = cart.find(x => x.product.name === item.name);
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
      `Vente Snack Bar validée pour ${clientRef}. Total : ${cartTotal.toLocaleString('fr-FR')} FCFA`, 
      "snack"
    );

    // Save details for showing the invoice popup
    setShowReceiptModal({
      id: `REC-${Date.now().toString().slice(-6)}`,
      customer: clientRef,
      itemsList: [...cart],
      gameCost: 0,
      snackCost: cartTotal,
      total: cartTotal,
      date: new Date().toLocaleTimeString(),
      type: "Vente Directe Snack"
    });

    // Reset Cart
    setCart([]);
    setPosCustomer("");
    setPosAssociateConsoleId("");
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
        <div>
          {/* Logo Brand */}
          <div className="p-4 flex flex-col items-center justify-center border-b border-zinc-800/40 gap-2">
            <div className="w-24 h-24 rounded-2xl overflow-hidden border border-zinc-800 shadow-xl relative group">
              <img src="/logo.jpg" alt="Housepub PS Lounge Logo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-1.5">
                <span className="text-[8px] text-zinc-300 font-extrabold uppercase tracking-widest text-center">HousePub</span>
              </div>
            </div>
            <div className="text-center space-y-0.5">
              <h1 className="text-xl font-black tracking-tight graffiti-tag italic">
                HOUSEPUB
              </h1>
              <p className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase">
                PS LOUNGE
              </p>
              <p className="text-[8px] text-zinc-500 font-bold italic tracking-normal">
                "La Maison du Bonheur"
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "dashboard"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Tableau de Bord
            </button>

            <button
              onClick={() => setActiveTab("consoles")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "consoles"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Gamepad2 className="w-5 h-5" />
              Gestion Consoles
              {consoles.filter(c => c.status === "occupée").length > 0 && (
                <span className="ml-auto bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {consoles.filter(c => c.status === "occupée").length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("snack")}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "snack"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <GlassWater className="w-5 h-5" />
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
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "stocks"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5" />
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
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "expenses"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <TrendingDown className="w-5 h-5 text-rose-500" />
              Gestion Dépenses
            </button>

            <button
              onClick={() => setActiveTab("purchases")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "purchases"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
              Gestion Achats
            </button>

            <button
              onClick={() => setActiveTab("fournisseurs")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "fournisseurs"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Building2 className="w-5 h-5 text-teal-400" />
              Fournisseurs
              <span className="ml-auto bg-teal-900/60 text-teal-400 border border-teal-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full">
                {suppliers.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("caisse")}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === "caisse"
                  ? "bg-gradient-to-r from-blue-900/30 to-rose-900/10 text-blue-300 border-l-2 border-blue-500 shadow-inner"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Wallet className="w-5 h-5 text-amber-500" />
              Gestion Caisse
              <span className={`ml-auto text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 ${
                caisseStatus === "ouverte" ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/30" : "bg-rose-950/60 text-rose-400 border border-rose-500/30"
              }`}>
                {caisseStatus === "ouverte" ? "Ouverte" : "Fermée"}
              </span>
            </button>
          </nav>
        </div>

        {/* Access Rights Switcher (Admin vs Gérant) */}
        <div className="p-4 border-t border-zinc-800/40 bg-zinc-950/50">
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
            src="/logo.jpg" 
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
              {activeTab === "dashboard" ? "Tableau de Bord" : activeTab === "consoles" ? "Hub Stations PS" : activeTab === "snack" ? "Snack Bar POS" : activeTab === "stocks" ? "Gestion des Stocks" : activeTab === "expenses" ? "Gestion des Dépenses" : activeTab === "purchases" ? "Gestion des Achats" : activeTab === "fournisseurs" ? "Gestion des Fournisseurs" : "Gestion de Caisse"}
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

            {/* Realtime Event Simulator */}
            <button 
              onClick={triggerSimulatedEvent}
              className="sim-btn flex items-center gap-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-pink-900/20 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow" />
              Simuler Flux
            </button>

            <div className="h-8 w-px bg-zinc-800"></div>

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
            <span>Événement simulé appliqué avec succès !</span>
          </div>

          <div className="view-container">

            {/* ==================== VUE 1 : DASHBOARD ==================== */}
            {activeTab === "dashboard" && (
              <div className="space-y-8 graffiti-spray-blue">
                <div>
                  <span className="sticker-badge bg-blue-600 text-white font-black px-3 py-1.5 text-[9px] uppercase tracking-widest inline-block">Tableau de Bord</span>
                </div>
                
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
                      { label: "Revenus Jeux", value: `${stats.gamesRevenue.toLocaleString('fr-FR')} FCFA`, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20", icon: "🎮" },
                      { label: "Revenus Snack", value: `${stats.snackRevenue.toLocaleString('fr-FR')} FCFA`, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: "🥤" },
                      { label: "Total du Jour", value: `${(stats.gamesRevenue + stats.snackRevenue).toLocaleString('fr-FR')} FCFA`, color: "text-violet-300", bg: "bg-violet-500/10", border: "border-violet-500/20", icon: "💰" },
                      { label: "Solde Caisse", value: role === "admin" ? `${stats.cashBalance.toLocaleString('fr-FR')} FCFA` : "Admin requis", color: role === "admin" ? "text-emerald-400" : "text-zinc-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: "🏦" }
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
                
                {/* Rates & Actions panel for Admins */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
                  <div>
                    <h3 className="text-sm font-bold text-white">Console Command Station</h3>
                    <p className="text-xs text-zinc-400">Gérez le statut des postes de jeu et encaissez les sessions en cours.</p>
                  </div>

                  {role === "admin" ? (
                    <div className="flex items-center gap-3 w-full lg:w-auto">
                      {editingRates ? (
                        <div className="flex flex-wrap items-center gap-2 text-xs bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                          {Object.keys(customRates).map(type => (
                            <div key={type} className="flex items-center gap-1">
                              <span className="text-zinc-400 font-bold text-[10px]">{type}:</span>
                              <input 
                                type="number" 
                                value={customRates[type]} 
                                onChange={(e) => setCustomRates({ ...customRates, [type]: Number(e.target.value) })}
                                className="w-14 bg-zinc-900 border border-zinc-850 px-1 py-0.5 rounded text-white font-bold"
                              />
                              <span className="text-zinc-600">FCFA/h</span>
                            </div>
                          ))}
                          <button 
                            onClick={handleUpdateRates}
                            className="bg-purple-600 hover:bg-purple-500 px-3 py-1 rounded text-white font-bold transition-all text-[11px]"
                          >
                            Valider
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setEditingRates(true)}
                          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-bold px-4 py-2.5 rounded-lg border border-zinc-700/40 transition-all ml-auto"
                        >
                          <Settings className="w-4 h-4" />
                          Modifier les Tarifs (/h)
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs bg-zinc-950 px-3 py-2 rounded-lg border border-zinc-800 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                      <span className="text-zinc-400">Modifications de tarifs restreintes (Admin requis)</span>
                    </div>
                  )}
                </div>

                {/* Console Grid – grouped by Zone */}
                {["A", "B", "C"].map(zone => {
                  const zoneConsoles = consoles.filter(c => c.zone === zone);
                  if (zoneConsoles.length === 0) return null;

                  const zoneColors = {
                    A: { border: "border-sky-500/30", text: "text-sky-400", bg: "bg-sky-950/30", dot: "bg-sky-400" },
                    B: { border: "border-violet-500/30", text: "text-violet-400", bg: "bg-violet-950/30", dot: "bg-violet-400" },
                    C: { border: "border-rose-500/30", text: "text-rose-400", bg: "bg-rose-950/30", dot: "bg-rose-400" }
                  }[zone];

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

                          {/* Stadium name + club logo */}
                          <div className="flex items-center gap-3 mt-3">
                            {club?.logo && (
                              <div className="w-11 h-11 rounded-xl flex-shrink-0 bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden p-1 shadow-md">
                                <img
                                  src={club.logo}
                                  alt={club.club}
                                  className="w-9 h-9 object-contain"
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
                
                {/* Left: Product List (8 columns) */}
                <div className="xl:col-span-8 space-y-6">
                  
                  {/* Category Filter Capsules & Search */}
                  <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-zinc-900 p-4 rounded-2xl border border-zinc-800/80">
                    
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                      {[
                        { id: "all", label: "Tous", emoji: "🍽️" },
                        { id: "boissons", label: "Boissons", emoji: "🥤" },
                        { id: "eau", label: "Eaux", emoji: "💧" },
                        { id: "chicha", label: "Chichas", emoji: "💨" },
                        { id: "whisky", label: "Whisky & Alcool", emoji: "🥃" }
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
                    {cart.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-850/60 rounded-xl text-xs">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-lg">{item.product.image}</span>
                            <span className="font-bold text-white truncate block">{item.product.name}</span>
                          </div>
                          <span className="text-[10px] text-zinc-500 block mt-0.5">{item.product.price.toLocaleString('fr-FR')} FCFA / u</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Qty counter */}
                          <div className="flex items-center gap-1 bg-zinc-950 rounded-lg p-0.5 border border-zinc-850">
                            <button 
                              onClick={() => handleUpdateCartQty(item.product.id, -1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center text-[11px] font-extrabold text-white">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateCartQty(item.product.id, 1)}
                              className="w-5 h-5 rounded flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Delete */}
                          <button 
                            onClick={() => handleRemoveFromCart(item.product.id)}
                            className="p-1.5 text-zinc-500 hover:text-rose-400 rounded-lg transition-all"
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
                      <div className="flex justify-between">
                        <span>Sous-total HT</span>
                        <span>{Math.round(cartTotal * 0.9).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="flex justify-between">
                        <span>TVA (10%)</span>
                        <span>{Math.round(cartTotal * 0.1).toLocaleString('fr-FR')} FCFA</span>
                      </div>
                      <div className="h-px bg-zinc-850 my-1"></div>
                      <div className="flex justify-between text-base font-extrabold text-white">
                        <span>Montant Total</span>
                        <span className="text-violet-400">{cartTotal.toLocaleString('fr-FR')} FCFA</span>
                      </div>
                    </div>

                    <button
                      onClick={handlePOSCheckout}
                      disabled={cart.length === 0}
                      className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:from-zinc-800 disabled:to-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed text-white rounded-xl text-xs font-extrabold shadow-lg shadow-violet-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4.5 h-4.5" />
                      {posAssociateConsoleId ? "Associer la facture à la Console" : "Encaisser & Imprimer"}
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
                        <option value="boissons">Boissons</option>
                        <option value="eau">Eaux</option>
                        <option value="chicha">Chichas</option>
                        <option value="whisky">Whisky / Alcool</option>
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
                                  <td className="p-4 text-right font-mono text-zinc-400">{purchase.toLocaleString('fr-FR')} FCFA</td>
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
                                    <div className="flex justify-end gap-2">
                                      <button
                                        onClick={() => openAdjustStockModal(p)}
                                        className="bg-zinc-800 hover:bg-zinc-750 text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg border border-zinc-700/50 text-[11px] font-bold transition-all active:scale-95"
                                      >
                                        Ajuster
                                      </button>
                                      {role === "admin" && (
                                        <button
                                          onClick={() => openEditProductModal(p)}
                                          className="bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 hover:text-white px-3 py-1.5 rounded-lg border border-violet-500/30 text-[11px] font-bold transition-all active:scale-95"
                                        >
                                          Configurer
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
                            {role === "admin" && <th className="p-4 text-center">Action</th>}
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
                                  {role === "admin" && (
                                    <td className="p-4 text-center">
                                      <button
                                        onClick={() => {
                                          if (confirm(`Voulez-vous vraiment supprimer cette dépense de ${e.amount.toLocaleString('fr-FR')} FCFA ? Le solde de caisse sera réajusté.`)) {
                                            handleDeleteExpense(e.id);
                                          }
                                        }}
                                        className="p-1.5 hover:bg-rose-950/40 text-zinc-500 hover:text-rose-400 rounded-lg transition-all"
                                        title="Supprimer la dépense"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </td>
                                  )}
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
                              <td colSpan={role === "admin" ? 6 : 5} className="p-8 text-center text-zinc-500 italic text-xs">
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
                        <option value="espèces">Espèces</option>
                        <option value="wave">Wave</option>
                        <option value="mobile money">Mobile Money</option>
                        <option value="carte bancaire">Carte Bancaire</option>
                        <option value="virement">Virement</option>
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
                          {role === "admin" && <th className="p-4 text-right">Actions</th>}
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
                                {role === "admin" && (
                                  <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
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
                                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                                        title="Modifier cet achat"
                                      >
                                        <Settings className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        onClick={() => {
                                          if (confirm(`Voulez-vous vraiment supprimer cet achat de ${p.quantity}x "${p.product}" de chez "${p.supplier}" ?`)) {
                                            handleDeletePurchase(p.id);
                                          }
                                        }}
                                        className="p-1.5 rounded-lg bg-rose-950/20 border border-rose-500/20 hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 transition-all"
                                        title="Supprimer cet achat"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </td>
                                )}
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
                            <td colSpan={role === "admin" ? 9 : 8} className="p-8 text-center text-zinc-500 italic">Aucun achat enregistré.</td>
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
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => {
                                setSuppNom(supp.nom); setSuppTel(supp.telephone);
                                setSuppEmail(supp.email); setSuppAdresse(supp.adresse);
                                setSuppProduits((supp.produitsFournis || []).join(", "));
                                setSuppNotes(supp.notes || "");
                                setShowEditSupplierModal(supp);
                              }}
                              className="p-1.5 rounded-lg bg-zinc-800 hover:bg-blue-900/40 hover:text-blue-400 text-zinc-400 transition-all"
                              title="Modifier"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            {role === "admin" && (
                              <button
                                onClick={() => handleDeleteSupplier(supp.id)}
                                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-900/40 hover:text-rose-400 text-zinc-400 transition-all"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
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
                    <div className="space-y-6">
                      {/* Active Shift Header Metrics */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-900/40 p-4 border border-zinc-850 rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center text-xl">
                            <Unlock className="w-5 h-5 animate-pulse" />
                          </div>
                          <div>
                            <h3 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                              Session Active
                              <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full border border-emerald-500/30">En Cours</span>
                            </h3>
                            <p className="text-[10px] text-zinc-500">
                              Ouverte par <span className="text-zinc-300 font-bold">{activeCaisseSession.openedBy}</span> depuis le {new Date(activeCaisseSession.dateOpen).toLocaleDateString('fr-FR')} à {new Date(activeCaisseSession.dateOpen).toLocaleTimeString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setCloseCaisseRealBalance("");
                            setCloseCaisseNotes("");
                            setCloseCaisseOperator("");
                            setShowCloseCaisseModal(true);
                          }}
                          className="w-full lg:w-auto py-2.5 px-4 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <Lock className="w-4 h-4" />
                          Fermer la Caisse (Z-Clôture)
                        </button>
                      </div>

                      {/* Live Counter Cards */}
                      {(() => {
                        const opening = activeCaisseSession.openingBalance;
                        const jeux = activeCaisseSession.gamesRevenue;
                        const snack = activeCaisseSession.snackRevenue;
                        const encaissementsTotal = jeux + snack;
                        
                        const achats = activeCaisseSession.purchases;
                        const depensesDiverses = activeCaisseSession.expensesDiverses;
                        const maintenance = activeCaisseSession.expensesMaintenance;
                        const remboursements = activeCaisseSession.refunds;
                        const decaissementsTotal = achats + depensesDiverses + maintenance + remboursements;
                        
                        const netBenefit = encaissementsTotal - decaissementsTotal;
                        const cashAvailable = opening + netBenefit;

                        return (
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                              {/* 1. Fond d'ouverture */}
                              <div className="glass-panel p-4 rounded-xl border border-zinc-800/40 relative overflow-hidden flex flex-col gap-1 shadow-md">
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Fond d'Ouverture</span>
                                <span className="text-lg font-black text-zinc-300 font-mono">
                                  {opening.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>

                              {/* 2. Total Encaissements */}
                              <div className="glass-panel p-4 rounded-xl border border-emerald-500/10 relative overflow-hidden flex flex-col gap-1 shadow-md">
                                <div className="absolute right-2 top-2 text-[9px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-sans tracking-wider">ENTRÉE</div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Total Encaissements</span>
                                <span className="text-lg font-black text-emerald-400 font-mono">
                                  +{encaissementsTotal.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>

                              {/* 3. Total Décaissements */}
                              <div className="glass-panel p-4 rounded-xl border border-rose-500/10 relative overflow-hidden flex flex-col gap-1 shadow-md">
                                <div className="absolute right-2 top-2 text-[9px] font-black px-1.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded font-sans tracking-wider">SORTIE</div>
                                <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider">Total Décaissements</span>
                                <span className="text-lg font-black text-rose-400 font-mono">
                                  -{decaissementsTotal.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>

                              {/* 4. Caisse Disponible */}
                              <div className="glass-panel p-4 rounded-xl border border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 to-blue-950/10 relative overflow-hidden flex flex-col gap-1 shadow-lg">
                                <div className="absolute right-2 top-2 text-[9px] font-black px-1.5 py-0.5 bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 rounded font-sans uppercase tracking-widest">DISPONIBLE</div>
                                <span className="text-[9px] text-zinc-400 font-black uppercase tracking-wider">Caisse Disponible</span>
                                <span className="text-lg font-black text-cyan-300 font-mono">
                                  {cashAvailable.toLocaleString('fr-FR')} FCFA
                                </span>
                              </div>
                            </div>

                            {/* Detailed Bilan Panel */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              {/* Left/Middle: Bilan Table (2 cols) */}
                              <div className="lg:col-span-2 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  {/* Encaissements (Left side) */}
                                  <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="text-emerald-400">📥</span> Bilan des Encaissements
                                      </h4>
                                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/20 uppercase">Entrées</span>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-semibold">Jeux (revenus joueurs) :</span>
                                        <span className="font-mono text-zinc-200 font-bold">+{jeux.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-semibold">Snack (ventes snack) :</span>
                                        <span className="font-mono text-zinc-200 font-bold">+{snack.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="border-t border-zinc-900 pt-2 flex justify-between items-center text-xs font-bold">
                                        <span className="text-zinc-300">Total Jeux :</span>
                                        <span className="font-mono text-white">+{jeux.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs font-bold">
                                        <span className="text-zinc-300">Total Snack :</span>
                                        <span className="font-mono text-white">+{snack.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-sm font-black text-emerald-400">
                                        <span>TOTAL GÉNÉRAL :</span>
                                        <span className="font-mono">+{encaissementsTotal.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Décaissements (Right side) */}
                                  <div className="glass-panel p-6 rounded-2xl border border-zinc-850 space-y-4">
                                    <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                      <h4 className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                                        <span className="text-rose-400">📤</span> Bilan des Décaissements
                                      </h4>
                                      <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-rose-950/60 text-rose-400 border border-rose-500/20 uppercase">Sorties</span>
                                    </div>
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-semibold">Achats :</span>
                                        <span className="font-mono text-zinc-200 font-bold">-{achats.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-semibold">Dépenses Diverses :</span>
                                        <span className="font-mono text-zinc-200 font-bold">-{depensesDiverses.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-semibold">Maintenance :</span>
                                        <span className="font-mono text-zinc-200 font-bold">-{maintenance.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="flex justify-between items-center text-xs">
                                        <span className="text-zinc-400 font-semibold">Remboursements :</span>
                                        <span className="font-mono text-zinc-200 font-bold">-{remboursements.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                      <div className="border-t border-zinc-800 pt-3 flex justify-between items-center text-sm font-black text-rose-400">
                                        <span>TOTAL DÉPENSES :</span>
                                        <span className="font-mono">-{decaissementsTotal.toLocaleString('fr-FR')} FCFA</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Summary bar */}
                                <div className="p-5 bg-zinc-950/50 border border-zinc-850 rounded-2xl flex flex-wrap gap-6 items-center justify-between">
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Fond d'Ouverture</span>
                                    <span className="text-sm font-bold text-zinc-300 font-mono">{opening.toLocaleString('fr-FR')} FCFA</span>
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Bénéfice Net Shift</span>
                                    <span className={`text-base font-extrabold font-mono ${netBenefit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                      {netBenefit > 0 ? '+' : ''}{netBenefit.toLocaleString('fr-FR')} FCFA
                                    </span>
                                  </div>
                                  <div className="space-y-1 text-right">
                                    <span className="text-[10px] text-cyan-400 font-black uppercase tracking-wider block">Solde Caisse Disponible</span>
                                    <span className="text-xl font-black text-cyan-300 font-mono tracking-tight">{cashAvailable.toLocaleString('fr-FR')} FCFA</span>
                                  </div>
                                </div>
                              </div>

                              {/* Right: Shift Info (1 col) */}
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
                                    onClick={() => handlePrintShiftReport(activeCaisseSession)}
                                    className="w-full py-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                  >
                                    <Printer className="w-4.5 h-4.5" />
                                    Imprimer Ticket d'État
                                  </button>
                                </div>
                              </div>
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
                                  <div className="flex items-center justify-center gap-2">
                                    <button
                                      onClick={() => handlePrintShiftReport(session)}
                                      className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                                      title="Imprimer le rapport de shift"
                                    >
                                      <Printer className="w-3.5 h-3.5" />
                                    </button>
                                    {session.notes && (
                                      <button
                                        onClick={() => alert(`Remarques du shift :\n\n"${session.notes}"`)}
                                        className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                                        title="Voir les remarques"
                                      >
                                        <FileText className="w-3.5 h-3.5" />
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Prénom</label>
                  <input 
                    type="text"
                    placeholder="Ex: Karim"
                    value={newPlayerFirstName}
                    onChange={(e) => setNewPlayerFirstName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nom</label>
                  <input 
                    type="text"
                    placeholder="Ex: Belhadj"
                    value={newPlayerLastName}
                    onChange={(e) => setNewPlayerLastName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800/80 rounded-xl px-4 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
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
                    disabled={!newPlayerFirstName.trim() || !newPlayerLastName.trim() || !newPlayerPhone.trim()}
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
                      onClick={() => handleConfirmCloseSession(
                        showCloseModal.id,
                        gameCostDue,
                        snackCost,
                        showCloseModal.activeSession?.player || "Joueur",
                        showCloseModal.name,
                        gameCost,
                        prepaid
                      )}
                      className="flex-1 py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-950/20 active:scale-95 transition-all"
                    >
                      {totalCost > 0 ? "Régler le solde & Clôturer" : "Clôturer & Libérer"}
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

      {/* 4. Modal Reçu de Vente / Facture imprimable client */}
      {showReceiptModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-white text-zinc-900 w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-6 relative overflow-hidden flex flex-col items-center">
            
            {/* Simulated Receipt paper layout */}
            <div className="w-12 h-1.5 bg-zinc-300 rounded-full mb-2"></div>
            
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-lg tracking-tight uppercase">GAMEZONE HUB</h3>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-semibold">12 Rue des Gamers, 75000 Paris</p>
              <p className="text-[9px] text-zinc-400">Tél : 01.23.45.67.89</p>
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
                <span>{currentDateTime.toLocaleDateString('fr-FR')} {showReceiptModal.date}</span>
              </div>
              <div className="flex justify-between">
                <span>CLIENT :</span>
                <span className="font-bold text-zinc-900">{showReceiptModal.customer}</span>
              </div>
              <div className="flex justify-between">
                <span>TYPE :</span>
                <span className="font-bold text-zinc-900 uppercase">{showReceiptModal.type}</span>
              </div>
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
                  <span className="font-bold font-mono">{showReceiptModal.gameCost.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}

              {/* If snack items direct checkout or associated */}
              {showReceiptModal.itemsList ? (
                showReceiptModal.itemsList.map((item, idx) => (
                  <div key={idx} className="flex justify-between py-1">
                    <div>
                      <span>{item.quantity}x {item.product.name}</span>
                    </div>
                    <span className="font-bold font-mono">{(item.product.price * item.quantity).toLocaleString('fr-FR')} FCFA</span>
                  </div>
                ))
              ) : showReceiptModal.snackCost > 0 ? (
                <div className="flex justify-between py-1">
                  <span>Consommations Snack Bar</span>
                  <span className="font-bold font-mono">{showReceiptModal.snackCost.toLocaleString('fr-FR')} FCFA</span>
                </div>
              ) : null}
            </div>

            <div className="w-full border-t border-dashed border-zinc-300 my-2"></div>

            {/* Grand Total Receipt */}
            <div className="w-full space-y-1">
              {showReceiptModal.prepaid > 0 && (
                <div className="flex justify-between text-xs text-zinc-600">
                  <span>Prépayé au démarrage :</span>
                  <span>{showReceiptModal.prepaid.toLocaleString('fr-FR')} FCFA</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-zinc-600">
                <span>Total Prestations :</span>
                <span>{showReceiptModal.total.toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-600">
                <span>TVA (10%) :</span>
                <span>{Math.round(showReceiptModal.total * 0.10).toLocaleString('fr-FR')} FCFA</span>
              </div>
              <div className="flex justify-between text-base font-black text-zinc-950 pt-2 border-t border-zinc-200">
                <span>
                  {showReceiptModal.prepaid > 0 
                    ? (showReceiptModal.total - showReceiptModal.prepaid < 0 ? "REMBOURSEMENT :" : "RESTE À PAYER :") 
                    : "NET À PAYER :"}
                </span>
                <span className="font-mono text-lg">
                  {showReceiptModal.prepaid > 0 
                    ? Math.abs(showReceiptModal.total - showReceiptModal.prepaid).toLocaleString('fr-FR')
                    : showReceiptModal.total.toLocaleString('fr-FR')} FCFA
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

            <button
              onClick={() => setShowReceiptModal(null)}
              className="w-full mt-4 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-bold transition-all text-center"
            >
              Fermer & Retour
            </button>

          </div>
        </div>
      )}


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
                    <option value="espèces">Espèces</option>
                    <option value="wave">Wave</option>
                    <option value="mobile money">Mobile Money</option>
                    <option value="carte bancaire">Carte Bancaire</option>
                    <option value="virement">Virement</option>
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
                    <option value="espèces">Espèces</option>
                    <option value="wave">Wave</option>
                    <option value="mobile money">Mobile Money</option>
                    <option value="carte bancaire">Carte Bancaire</option>
                    <option value="virement">Virement</option>
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
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase block">Nom du produit :</label>
                <input
                  type="text"
                  value={editProdName}
                  onChange={(e) => setEditProdName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block">Catégorie :</label>
                  <select
                    value={editProdCategory}
                    onChange={(e) => setEditProdCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="boissons">Boissons</option>
                    <option value="eau">Eaux</option>
                    <option value="chicha">Chichas</option>
                    <option value="whisky">Whisky / Alcool</option>
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
                    editProdMinThreshold
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
                    onChange={(e) => setAddProdCategory(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-violet-500"
                  >
                    <option value="boissons">Boissons</option>
                    <option value="eau">Eaux</option>
                    <option value="chicha">Chichas</option>
                    <option value="whisky">Whisky / Alcool</option>
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

    </div>
  );
}
