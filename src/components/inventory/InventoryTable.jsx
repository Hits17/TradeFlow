import { Edit, Trash2, Download } from 'lucide-react';
import { exportToCSV } from '../../utils/exportUtils';

const getStockStatus = (level, reorderPoint = 10) => {
  if (level <= 0) return { label: 'Out of Stock', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)' };
  if (level <= reorderPoint * 0.5) return { label: 'Critical', color: '#f97316', bg: 'rgba(249, 115, 22, 0.15)' };
  if (level <= reorderPoint) return { label: 'Low Stock', color: '#eab308', bg: 'rgba(234, 179, 8, 0.15)' };
  return { label: 'In Stock', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' };
};

export default function InventoryTable({ inventory, onEdit, onDelete, searchTerm, onSearchChange }) {
  const handleExport = () => {
    exportToCSV(inventory, `inventory_export_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="table-container">
      <div className="table-actions">
        <input type="text" placeholder="Search by SKU, name, category..." className="table-search" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
        <button className="btn-secondary" onClick={handleExport}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="table-responsive">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Unit</th>
              <th>Location</th>
              <th>Status</th>
              <th>Unit Value</th>
              <th>Total Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr><td colSpan="10" className="empty-state">No inventory items found.</td></tr>
            ) : (
              inventory.map((item) => {
                const status = getStockStatus(item.stockLevel, item.reorderPoint);
                const totalValue = (item.stockLevel || 0) * (item.unitValue || 0);
                return (
                  <tr key={item.id}>
                    <td className="font-mono">{item.sku}</td>
                    <td className="font-medium">{item.name}</td>
                    <td>{item.category}</td>
                    <td className="font-mono">{item.stockLevel}</td>
                    <td>{item.unit}</td>
                    <td>{item.location}</td>
                    <td><span className="status-badge" style={{ backgroundColor: status.bg, color: status.color }}>{status.label}</span></td>
                    <td className="text-right">${(item.unitValue || 0).toLocaleString()}</td>
                    <td className="text-right total-value">${totalValue.toLocaleString()}</td>
                    <td>
                      <div className="action-group">
                        <button className="icon-btn-sm" onClick={() => onEdit(item)} title="Edit"><Edit size={16} /></button>
                        <button className="icon-btn-sm danger" onClick={() => onDelete(item.id)} title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-container { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
        .table-actions { padding: 1rem; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; }
        .table-search { background: var(--color-background); border: 1px solid var(--color-border); color: var(--color-text-primary); padding: 0.5rem 1rem; border-radius: var(--radius-sm); min-width: 300px; }
        .table-search:focus { outline: none; border-color: var(--color-primary); }
        .btn-secondary { background: var(--color-background); border: 1px solid var(--color-border); color: var(--color-text-secondary); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; }
        .btn-secondary:hover { border-color: var(--color-text-secondary); color: var(--color-text-primary); }
        .inventory-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .inventory-table th { text-align: left; padding: 0.75rem 1rem; color: var(--color-text-secondary); font-weight: 500; border-bottom: 1px solid var(--color-border); background: rgba(255,255,255,0.02); }
        .inventory-table td { padding: 1rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); }
        .inventory-table tr:hover td { background: var(--color-surface-hover); }
        .empty-state { text-align: center; padding: 3rem !important; color: var(--color-text-secondary); }
        .font-mono { font-family: monospace; color: var(--color-text-secondary); }
        .font-medium { font-weight: 500; }
        .text-right { text-align: right; }
        .total-value { color: var(--color-primary); font-weight: 600; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .action-group { display: flex; gap: 0.25rem; }
        .icon-btn-sm { padding: 6px; border-radius: 4px; color: var(--color-text-secondary); transition: all 0.2s; }
        .icon-btn-sm:hover { background: var(--color-background); color: var(--color-primary); }
        .icon-btn-sm.danger:hover { color: #ef4444; background: rgba(239, 68, 68, 0.1); }
      `}</style>
    </div>
  );
}
