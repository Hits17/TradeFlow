import { useState } from 'react';
import { MoreHorizontal, ArrowUpDown, Filter, Download, Trash2, Edit, FileText, FileSpreadsheet, Printer } from 'lucide-react';
import TagToken from '../ui/TagToken';
import { exportToCSV } from '../../utils/exportUtils';
import { generateInvoice, generatePackingList, generateBillOfLading } from '../../utils/documentGenerator';

const StatusBadge = ({ status }) => {
  const styles = {
    IN_TRANSIT: { bg: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', label: 'In Transit' },
    PENDING: { bg: 'rgba(234, 179, 8, 0.15)', color: '#facc15', label: 'Pending' },
    DELIVERED: { bg: 'rgba(16, 185, 129, 0.15)', color: '#34d399', label: 'Delivered' },
    CUSTOMS: { bg: 'rgba(249, 115, 22, 0.15)', color: '#fb923c', label: 'Customs' },
    DRAFT: { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af', label: 'Draft' },
  };
  const style = styles[status] || styles.DRAFT;
  return <span className="status-badge" style={{ backgroundColor: style.bg, color: style.color }}>{style.label}</span>;
};

export default function OrderTable({ orders, onEdit, onDelete, searchTerm, onSearchChange }) {
  const [openMenu, setOpenMenu] = useState(null);

  const handleExport = () => {
    exportToCSV(orders, `orders_export_${new Date().toISOString().split('T')[0]}`);
  };

  return (
    <div className="table-container">
      <div className="table-actions">
        <div className="search-wrapper">
          <input type="text" placeholder="Search orders, references, tags..." className="table-search" value={searchTerm} onChange={(e) => onSearchChange(e.target.value)} />
        </div>
        <div className="action-buttons">
          <button className="btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <div className="table-responsive">
        <table className="order-table">
          <thead>
            <tr>
              <th><div className="th-content">Order ID <ArrowUpDown size={14} /></div></th>
              <th>Reference / Tags</th>
              <th>Type</th>
              <th>Partner</th>
              <th>Incoterm</th>
              <th>Status</th>
              <th>Date</th>
              <th>Value</th>
              <th>Landed Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan="10" className="empty-state">No orders found. Create your first order!</td></tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id}>
                  <td className="font-mono">{order.id}</td>
                  <td>
                    <div className="ref-cell">
                      <span>{order.reference}</span>
                      <div className="tags-row">
                        {order.tags && order.tags.map(tag => <TagToken key={tag} label={tag} />)}
                      </div>
                    </div>
                  </td>
                  <td><span className={`type-tag ${order.type?.toLowerCase()}`}>{order.type}</span></td>
                  <td className="font-medium">{order.partner}</td>
                  <td><span className="incoterm-tag">{order.incoterm}</span></td>
                  <td><StatusBadge status={order.status} /></td>
                  <td>{order.date}</td>
                  <td className="text-right">{new Intl.NumberFormat('en-US', { style: 'currency', currency: order.currency || 'USD' }).format(order.value || 0)}</td>
                  <td className="text-right landed-cost">{order.landedCost ? `$${Number(order.landedCost).toLocaleString()}` : '-'}</td>
                  <td>
                    <div className="action-group">
                      <button className="icon-btn-sm" onClick={() => onEdit(order)} title="Edit"><Edit size={16} /></button>
                      <div className="dropdown-wrapper">
                        <button className="icon-btn-sm" onClick={() => setOpenMenu(openMenu === order.id ? null : order.id)} title="More">
                          <MoreHorizontal size={16} />
                        </button>
                        {openMenu === order.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => { generateInvoice(order); setOpenMenu(null); }}><FileText size={14} /> Invoice</button>
                            <button onClick={() => { generatePackingList(order); setOpenMenu(null); }}><FileSpreadsheet size={14} /> Packing List</button>
                            <button onClick={() => { generateBillOfLading(order); setOpenMenu(null); }}><Printer size={14} /> Bill of Lading</button>
                            <div className="divider"></div>
                            <button className="danger" onClick={() => { onDelete(order.id); setOpenMenu(null); }}><Trash2 size={14} /> Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .table-container { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
        .table-actions { padding: 1rem; display: flex; justify-content: space-between; border-bottom: 1px solid var(--color-border); }
        .table-search { background: var(--color-background); border: 1px solid var(--color-border); color: var(--color-text-primary); padding: 0.5rem 1rem; border-radius: var(--radius-sm); min-width: 300px; }
        .table-search:focus { outline: none; border-color: var(--color-primary); }
        .action-buttons { display: flex; gap: 0.5rem; }
        .btn-secondary { background: var(--color-background); border: 1px solid var(--color-border); color: var(--color-text-secondary); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm); display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; transition: all 0.2s; }
        .btn-secondary:hover { border-color: var(--color-text-secondary); color: var(--color-text-primary); }
        .order-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .order-table th { text-align: left; padding: 0.75rem 1rem; color: var(--color-text-secondary); font-weight: 500; border-bottom: 1px solid var(--color-border); background: rgba(255,255,255,0.02); }
        .th-content { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .order-table td { padding: 1rem; border-bottom: 1px solid var(--color-border); color: var(--color-text-primary); }
        .order-table tr:hover td { background: var(--color-surface-hover); }
        .empty-state { text-align: center; padding: 3rem !important; color: var(--color-text-secondary); }
        .ref-cell { display: flex; flex-direction: column; gap: 4px; }
        .tags-row { display: flex; gap: 4px; flex-wrap: wrap; }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .type-tag { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.05em; }
        .type-tag.import { color: #818cf8; }
        .type-tag.export { color: #f472b6; }
        .incoterm-tag { background: var(--color-background); border: 1px solid var(--color-border); padding: 0.125rem 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.75rem; }
        .landed-cost { color: var(--color-primary); font-weight: 600; }
        .font-mono { font-family: monospace; color: var(--color-text-secondary); }
        .font-medium { font-weight: 500; }
        .text-right { text-align: right; }
        .action-group { display: flex; gap: 0.25rem; align-items: center; }
        .dropdown-wrapper { position: relative; }
        .dropdown-menu { position: absolute; right: 0; top: 100%; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: 0 10px 15px rgba(0,0,0,0.3); z-index: 50; min-width: 150px; animation: fadeIn 0.1s ease; }
        .dropdown-menu button { width: 100%; padding: 0.75rem 1rem; text-align: left; display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem; color: var(--color-text-primary); }
        .dropdown-menu button:hover { background: var(--color-surface-hover); }
        .dropdown-menu button.danger { color: #ef4444; }
        .dropdown-menu button.danger:hover { background: rgba(239,68,68,0.1); }
        .dropdown-menu .divider { height: 1px; background: var(--color-border); margin: 0.25rem 0; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
        .icon-btn-sm { padding: 6px; border-radius: 4px; color: var(--color-text-secondary); transition: all 0.2s; }
        .icon-btn-sm:hover { background: var(--color-background); color: var(--color-primary); }
      `}</style>
    </div>
  );
}
