import { useState } from 'react';
import { Package, AlertTriangle, DollarSign, Plus, Filter, X } from 'lucide-react';
import InventoryTable from '../components/inventory/InventoryTable';
import InventoryForm from '../components/inventory/InventoryForm';
import { useApp } from '../context/SettingsContext';

const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <div className="summary-card">
    <div className="card-icon" style={{ backgroundColor: `${color}20`, color }}><Icon size={24} /></div>
    <div className="card-content">
      <span className="card-label">{label}</span>
      <span className="card-value">{value}</span>
    </div>
  </div>
);

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryItem, deleteInventoryItem } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    stockStatus: '',
    location: ''
  });

  // Get unique categories and locations
  const categories = [...new Set(inventory.map(i => i.category).filter(Boolean))];
  const locations = [...new Set(inventory.map(i => i.location).filter(Boolean))];

  const handleCreateNew = () => { setEditingItem(null); setIsFormOpen(true); };
  const handleEditItem = (item) => { setEditingItem(item); setIsFormOpen(true); };
  const handleCloseForm = () => { setIsFormOpen(false); setEditingItem(null); };

  const handleSaveItem = (itemData) => {
    if (editingItem) { updateInventoryItem(editingItem.id, itemData); }
    else { addInventoryItem(itemData); }
    handleCloseForm();
  };

  const handleDeleteItem = (itemId) => {
    if (window.confirm('Delete this item?')) { deleteInventoryItem(itemId); }
  };

  const clearFilters = () => {
    setFilters({ category: '', stockStatus: '', location: '' });
    setSearchTerm('');
  };

  // Apply filters
  const filteredInventory = inventory.filter(item => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      item.sku?.toLowerCase().includes(term) ||
      item.name?.toLowerCase().includes(term) ||
      item.category?.toLowerCase().includes(term);

    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesLocation = !filters.location || item.location === filters.location;

    // Stock status
    let matchesStock = true;
    if (filters.stockStatus) {
      const level = item.stockLevel || 0;
      const reorder = item.reorderPoint || 10;
      if (filters.stockStatus === 'IN_STOCK') matchesStock = level > reorder;
      else if (filters.stockStatus === 'LOW') matchesStock = level > 0 && level <= reorder;
      else if (filters.stockStatus === 'OUT') matchesStock = level <= 0;
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesStock;
  });

  const totalItems = inventory.length;
  const lowStockCount = inventory.filter(i => (i.stockLevel || 0) <= (i.reorderPoint || 10)).length;
  const totalValue = inventory.reduce((sum, i) => sum + ((i.stockLevel || 0) * (i.unitValue || 0)), 0);
  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="inventory-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Inventory</h1>
          <p className="page-subtitle">
            {filteredInventory.length} of {totalItems} items
            {hasActiveFilters && <span className="filter-badge">Filtered</span>}
          </p>
        </div>
        <div className="header-actions">
          <button className={`btn-secondary ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} /> Filters
          </button>
          <button className="btn-primary" onClick={handleCreateNew}>
            <Plus size={20} /> Add Item
          </button>
        </div>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={Package} label="Total Items" value={totalItems} color="#3b82f6" />
        <SummaryCard icon={AlertTriangle} label="Low Stock Alerts" value={lowStockCount} color="#ef4444" />
        <SummaryCard icon={DollarSign} label="Total Valuation" value={`$${totalValue.toLocaleString()}`} color="#10b981" />
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Category</label>
              <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="filter-group">
              <label>Stock Status</label>
              <select value={filters.stockStatus} onChange={e => setFilters(f => ({ ...f, stockStatus: e.target.value }))}>
                <option value="">All Statuses</option>
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW">Low Stock</option>
                <option value="OUT">Out of Stock</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Location</label>
              <select value={filters.location} onChange={e => setFilters(f => ({ ...f, location: e.target.value }))}>
                <option value="">All Locations</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>
      )}

      <InventoryTable
        inventory={filteredInventory}
        onEdit={handleEditItem}
        onDelete={handleDeleteItem}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isFormOpen && <InventoryForm onClose={handleCloseForm} onSave={handleSaveItem} initialData={editingItem} />}

      <style>{`
        .inventory-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .header-actions { display: flex; gap: 0.75rem; }
        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .summary-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; gap: 1rem; align-items: center; }
        .card-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .card-content { display: flex; flex-direction: column; }
        .card-label { font-size: 0.875rem; color: var(--color-text-secondary); }
        .card-value { font-size: 1.5rem; font-weight: 700; }
        .filter-badge { background: var(--color-primary); color: white; font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover { background: var(--color-primary-hover); }
        .btn-secondary { background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 500; display: flex; align-items: center; gap: 0.5rem; }
        .btn-secondary:hover, .btn-secondary.active { border-color: var(--color-primary); color: var(--color-primary); }
        .filters-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; animation: slideDown 0.2s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .filters-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .filter-group label { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 500; }
        .filter-group select { background: var(--color-background); border: 1px solid var(--color-border); padding: 0.625rem; border-radius: var(--radius-sm); color: var(--color-text-primary); }
        .filter-group select:focus { outline: none; border-color: var(--color-primary); }
        .clear-filters-btn { margin-top: 1rem; color: var(--color-text-secondary); font-size: 0.875rem; display: flex; align-items: center; gap: 0.25rem; }
        .clear-filters-btn:hover { color: var(--color-primary); }
      `}</style>
    </div>
  );
}
