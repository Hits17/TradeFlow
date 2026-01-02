import { useState } from 'react';
import { Plus, Filter, X } from 'lucide-react';
import OrderTable from '../components/register/OrderTable';
import OrderForm from '../components/register/OrderForm';
import { useApp } from '../context/SettingsContext';

export default function Register() {
  const { orders, addOrder, updateOrder, deleteOrder } = useApp();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    dateFrom: '',
    dateTo: '',
    valueMin: '',
    valueMax: ''
  });

  const handleCreateNew = () => {
    setEditingOrder(null);
    setIsFormOpen(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingOrder(null);
  };

  const handleSaveOrder = (orderData) => {
    if (editingOrder) {
      updateOrder(editingOrder.id, orderData);
    } else {
      addOrder(orderData);
    }
    handleCloseForm();
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      deleteOrder(orderId);
    }
  };

  const clearFilters = () => {
    setFilters({ status: '', type: '', dateFrom: '', dateTo: '', valueMin: '', valueMax: '' });
    setSearchTerm('');
  };

  // Apply all filters
  const filteredOrders = orders.filter(order => {
    // Search term
    const term = searchTerm.toLowerCase();
    const matchesSearch = !term ||
      order.id?.toLowerCase().includes(term) ||
      order.reference?.toLowerCase().includes(term) ||
      order.partner?.toLowerCase().includes(term) ||
      order.tags?.some(tag => tag.toLowerCase().includes(term));

    // Status filter
    const matchesStatus = !filters.status || order.status === filters.status;

    // Type filter
    const matchesType = !filters.type || order.type === filters.type;

    // Date range filter
    const orderDate = order.date;
    const matchesDateFrom = !filters.dateFrom || orderDate >= filters.dateFrom;
    const matchesDateTo = !filters.dateTo || orderDate <= filters.dateTo;

    // Value range filter
    const orderValue = Number(order.value) || 0;
    const matchesValueMin = !filters.valueMin || orderValue >= Number(filters.valueMin);
    const matchesValueMax = !filters.valueMax || orderValue <= Number(filters.valueMax);

    return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo && matchesValueMin && matchesValueMax;
  });

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="register-page">
      <div className="page-header-row">
        <div>
          <h1 className="page-title">Register</h1>
          <p className="page-subtitle">
            {filteredOrders.length} of {orders.length} orders
            {hasActiveFilters && <span className="filter-badge">Filtered</span>}
          </p>
        </div>
        <div className="header-actions">
          <button className={`btn-secondary ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(!showFilters)}>
            <Filter size={18} /> Filters
          </button>
          <button className="btn-primary" onClick={handleCreateNew}>
            <Plus size={20} /> New Order
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-grid">
            <div className="filter-group">
              <label>Status</label>
              <select value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}>
                <option value="">All Statuses</option>
                <option value="DRAFT">Draft</option>
                <option value="PENDING">Pending</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="CUSTOMS">Customs</option>
                <option value="DELIVERED">Delivered</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Type</label>
              <select value={filters.type} onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}>
                <option value="">All Types</option>
                <option value="IMPORT">Import</option>
                <option value="EXPORT">Export</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Date From</label>
              <input type="date" value={filters.dateFrom} onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))} />
            </div>
            <div className="filter-group">
              <label>Date To</label>
              <input type="date" value={filters.dateTo} onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))} />
            </div>
            <div className="filter-group">
              <label>Min Value ($)</label>
              <input type="number" value={filters.valueMin} onChange={e => setFilters(f => ({ ...f, valueMin: e.target.value }))} placeholder="0" />
            </div>
            <div className="filter-group">
              <label>Max Value ($)</label>
              <input type="number" value={filters.valueMax} onChange={e => setFilters(f => ({ ...f, valueMax: e.target.value }))} placeholder="Any" />
            </div>
          </div>
          {hasActiveFilters && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              <X size={14} /> Clear All Filters
            </button>
          )}
        </div>
      )}

      <OrderTable
        orders={filteredOrders}
        onEdit={handleEditOrder}
        onDelete={handleDeleteOrder}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {isFormOpen && (
        <OrderForm
          onClose={handleCloseForm}
          onSave={handleSaveOrder}
          initialData={editingOrder}
        />
      )}

      <style>{`
        .register-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header-row { display: flex; justify-content: space-between; align-items: flex-end; }
        .header-actions { display: flex; gap: 0.75rem; }
        .filter-badge { background: var(--color-primary); color: white; font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 999px; margin-left: 0.5rem; }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover { background: var(--color-primary-hover); }
        .btn-secondary { background: var(--color-surface); border: 1px solid var(--color-border); color: var(--color-text-secondary); padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 500; display: flex; align-items: center; gap: 0.5rem; transition: all 0.2s; }
        .btn-secondary:hover, .btn-secondary.active { border-color: var(--color-primary); color: var(--color-primary); }
        .filters-panel { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; animation: slideDown 0.2s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .filters-grid { display: grid; grid-template-columns: repeat(6, 1fr); gap: 1rem; }
        .filter-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .filter-group label { font-size: 0.75rem; color: var(--color-text-secondary); font-weight: 500; }
        .filter-group select, .filter-group input { background: var(--color-background); border: 1px solid var(--color-border); padding: 0.625rem; border-radius: var(--radius-sm); color: var(--color-text-primary); }
        .filter-group select:focus, .filter-group input:focus { outline: none; border-color: var(--color-primary); }
        .clear-filters-btn { margin-top: 1rem; color: var(--color-text-secondary); font-size: 0.875rem; display: flex; align-items: center; gap: 0.25rem; }
        .clear-filters-btn:hover { color: var(--color-primary); }
      `}</style>
    </div>
  );
}
