import { createContext, useContext, useState, useEffect } from 'react';
import { mockOrders, incoterms as defaultIncoterms } from '../data/mockOrders';
import { mockInventory } from '../data/mockInventory';
import { mockClients } from '../data/mockClients';

const AppContext = createContext();

// localStorage keys
const STORAGE_KEYS = {
    ORDERS: 'tradeflow_orders',
    INVENTORY: 'tradeflow_inventory',
    INCOTERMS: 'tradeflow_incoterms',
    TAGS: 'tradeflow_tags',
    CLIENTS: 'tradeflow_clients'
};

// Helper to load from localStorage with fallback
const loadFromStorage = (key, fallback) => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : fallback;
    } catch {
        return fallback;
    }
};

export function AppProvider({ children }) {
    // Orders State
    const [orders, setOrders] = useState(() => loadFromStorage(STORAGE_KEYS.ORDERS, mockOrders));

    // Inventory State
    const [inventory, setInventory] = useState(() => loadFromStorage(STORAGE_KEYS.INVENTORY, mockInventory));

    // Clients State
    const [clients, setClients] = useState(() => loadFromStorage(STORAGE_KEYS.CLIENTS, mockClients));

    // Settings State
    const [incoterms, setIncoterms] = useState(() => loadFromStorage(STORAGE_KEYS.INCOTERMS, defaultIncoterms));
    const [tags, setTags] = useState(() => loadFromStorage(STORAGE_KEYS.TAGS, ['urgent', 'pending', 'review']));

    // Persist to localStorage on change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }, [orders]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.CLIENTS, JSON.stringify(clients));
    }, [clients]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.INCOTERMS, JSON.stringify(incoterms));
    }, [incoterms]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.TAGS, JSON.stringify(tags));
    }, [tags]);

    // ========== ORDER ACTIONS ==========
    const addOrder = (orderData) => {
        const newOrder = {
            ...orderData,
            id: `ORD-${Date.now()}`,
            date: new Date().toISOString().split('T')[0]
        };
        setOrders(prev => [newOrder, ...prev]);
        return newOrder;
    };

    const updateOrder = (orderId, updates) => {
        setOrders(prev => prev.map(order =>
            order.id === orderId ? { ...order, ...updates } : order
        ));
    };

    const deleteOrder = (orderId) => {
        setOrders(prev => prev.filter(order => order.id !== orderId));
    };

    // ========== INVENTORY ACTIONS ==========
    const addInventoryItem = (itemData) => {
        const newItem = {
            ...itemData,
            id: `INV-${Date.now()}`,
            sku: itemData.sku || `SKU-${Date.now().toString().slice(-6)}`
        };
        setInventory(prev => [newItem, ...prev]);
        return newItem;
    };

    const updateInventoryItem = (itemId, updates) => {
        setInventory(prev => prev.map(item =>
            item.id === itemId ? { ...item, ...updates } : item
        ));
    };

    const deleteInventoryItem = (itemId) => {
        setInventory(prev => prev.filter(item => item.id !== itemId));
    };

    // ========== CLIENT ACTIONS ==========
    const addClient = (clientData) => {
        const newClient = {
            ...clientData,
            id: `CLI-${Date.now()}`,
            createdAt: new Date().toISOString().split('T')[0],
            totalOrders: 0,
            totalValue: 0
        };
        setClients(prev => [newClient, ...prev]);
        return newClient;
    };

    const updateClient = (clientId, updates) => {
        setClients(prev => prev.map(client =>
            client.id === clientId ? { ...client, ...updates } : client
        ));
    };

    const deleteClient = (clientId) => {
        setClients(prev => prev.filter(client => client.id !== clientId));
    };

    // ========== SETTINGS ACTIONS ==========
    const addIncoterm = (newTerm) => {
        if (!incoterms.find(t => t.code === newTerm.code)) {
            setIncoterms(prev => [...prev, newTerm]);
        }
    };

    const removeIncoterm = (code) => {
        setIncoterms(prev => prev.filter(t => t.code !== code));
    };

    const addTag = (newTag) => {
        if (!tags.includes(newTag)) {
            setTags(prev => [...prev, newTag]);
        }
    };

    // ========== COMPUTED VALUES ==========
    const getStats = () => ({
        totalOrders: orders.length,
        activeShipments: orders.filter(o => o.status === 'IN_TRANSIT').length,
        pendingOrders: orders.filter(o => o.status === 'PENDING').length,
        deliveredOrders: orders.filter(o => o.status === 'DELIVERED').length,
        totalInventoryItems: inventory.length,
        lowStockItems: inventory.filter(i => (i.stockLevel || 0) <= (i.reorderPoint || 10)).length,
        totalInventoryValue: inventory.reduce((sum, i) => sum + ((i.stockLevel || 0) * (i.unitValue || 0)), 0),
        totalClients: clients.length,
        activeClients: clients.filter(c => c.status === 'ACTIVE').length
    });

    const value = {
        // Data
        orders,
        inventory,
        clients,
        incoterms,
        tags,
        // Order Actions
        addOrder,
        updateOrder,
        deleteOrder,
        // Inventory Actions
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        // Client Actions
        addClient,
        updateClient,
        deleteClient,
        // Settings Actions
        addIncoterm,
        removeIncoterm,
        addTag,
        // Computed
        getStats
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}

// Alias for backwards compatibility
export const useSettings = useApp;
export const SettingsProvider = AppProvider;
