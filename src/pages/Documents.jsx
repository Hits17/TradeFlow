import { useState, useMemo } from 'react';
import { FileText, Download, Eye, Trash2, Filter, Search, FileSpreadsheet, File, Upload } from 'lucide-react';
import { useApp } from '../context/SettingsContext';
import { generateInvoice, generatePackingList, generateBillOfLading } from '../utils/documentGenerator';

const docTypes = [
    { id: 'INVOICE', name: 'Invoice', icon: FileText, color: '#10b981' },
    { id: 'PACKING_LIST', name: 'Packing List', icon: FileSpreadsheet, color: '#3b82f6' },
    { id: 'BILL_OF_LADING', name: 'Bill of Lading', icon: File, color: '#8b5cf6' },
    { id: 'CERTIFICATE', name: 'Certificate of Origin', icon: FileText, color: '#f59e0b' },
    { id: 'CUSTOMS', name: 'Customs Declaration', icon: File, color: '#ef4444' },
];

export default function Documents() {
    const { orders } = useApp();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [selectedOrder, setSelectedOrder] = useState('');

    // Generate document list from orders
    const documents = useMemo(() => {
        const docs = [];
        orders.forEach(order => {
            // Each order can have these documents
            docs.push({
                id: `DOC-INV-${order.id}`,
                type: 'INVOICE',
                orderId: order.id,
                orderRef: order.reference,
                partner: order.partner,
                date: order.date,
                status: 'READY'
            });
            docs.push({
                id: `DOC-PL-${order.id}`,
                type: 'PACKING_LIST',
                orderId: order.id,
                orderRef: order.reference,
                partner: order.partner,
                date: order.date,
                status: 'READY'
            });
            docs.push({
                id: `DOC-BOL-${order.id}`,
                type: 'BILL_OF_LADING',
                orderId: order.id,
                orderRef: order.reference,
                partner: order.partner,
                date: order.date,
                status: order.status === 'IN_TRANSIT' || order.status === 'DELIVERED' ? 'READY' : 'PENDING'
            });
        });
        return docs;
    }, [orders]);

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = !searchTerm ||
            doc.orderRef?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.partner?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !typeFilter || doc.type === typeFilter;
        const matchesOrder = !selectedOrder || doc.orderId === selectedOrder;
        return matchesSearch && matchesType && matchesOrder;
    });

    const handleViewDocument = (doc) => {
        const order = orders.find(o => o.id === doc.orderId);
        if (!order) return;

        switch (doc.type) {
            case 'INVOICE': generateInvoice(order); break;
            case 'PACKING_LIST': generatePackingList(order); break;
            case 'BILL_OF_LADING': generateBillOfLading(order); break;
            default: break;
        }
    };

    const getDocType = (typeId) => docTypes.find(t => t.id === typeId) || docTypes[0];

    return (
        <div className="documents-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Document Center</h1>
                    <p className="page-subtitle">Manage all trade documents in one place</p>
                </div>
            </div>

            <div className="stats-row">
                {docTypes.slice(0, 3).map(type => {
                    const count = documents.filter(d => d.type === type.id).length;
                    return (
                        <div key={type.id} className="stat-card" style={{ borderLeftColor: type.color }}>
                            <type.icon size={24} style={{ color: type.color }} />
                            <div>
                                <span>{type.name}s</span>
                                <strong>{count}</strong>
                            </div>
                        </div>
                    );
                })}
                <div className="stat-card" style={{ borderLeftColor: '#6b7280' }}>
                    <FileText size={24} style={{ color: '#6b7280' }} />
                    <div>
                        <span>Total Documents</span>
                        <strong>{documents.length}</strong>
                    </div>
                </div>
            </div>

            <div className="filters-row">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search by order reference or partner..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Document Types</option>
                    {docTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
                <select value={selectedOrder} onChange={e => setSelectedOrder(e.target.value)}>
                    <option value="">All Orders</option>
                    {orders.map(o => <option key={o.id} value={o.id}>{o.reference || o.id}</option>)}
                </select>
            </div>

            <div className="documents-table">
                <table>
                    <thead>
                        <tr>
                            <th>Document Type</th>
                            <th>Order Reference</th>
                            <th>Partner</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.length === 0 ? (
                            <tr><td colSpan="6" className="empty">No documents found.</td></tr>
                        ) : (
                            filteredDocs.map(doc => {
                                const docType = getDocType(doc.type);
                                return (
                                    <tr key={doc.id}>
                                        <td>
                                            <div className="doc-type">
                                                <docType.icon size={18} style={{ color: docType.color }} />
                                                <span>{docType.name}</span>
                                            </div>
                                        </td>
                                        <td className="order-ref">{doc.orderRef || doc.orderId}</td>
                                        <td>{doc.partner}</td>
                                        <td>{doc.date}</td>
                                        <td>
                                            <span className={`status-badge ${doc.status.toLowerCase()}`}>
                                                {doc.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="actions">
                                                <button onClick={() => handleViewDocument(doc)} disabled={doc.status === 'PENDING'} title="View/Print">
                                                    <Eye size={16} />
                                                </button>
                                                <button onClick={() => handleViewDocument(doc)} disabled={doc.status === 'PENDING'} title="Download">
                                                    <Download size={16} />
                                                </button>
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
        .documents-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .stat-card { background: var(--color-surface); border: 1px solid var(--color-border); border-left: 4px solid; border-radius: var(--radius-md); padding: 1.25rem; display: flex; gap: 1rem; align-items: center; }
        .stat-card span { font-size: 0.875rem; color: var(--color-text-secondary); display: block; }
        .stat-card strong { font-size: 1.5rem; }
        .filters-row { display: flex; gap: 1rem; }
        .search-box { flex: 1; position: relative; }
        .search-box input { width: 100%; background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: var(--radius-md); color: var(--color-text-primary); }
        .search-box svg { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
        .filters-row select { background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: var(--color-text-primary); min-width: 180px; }
        .documents-table { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
        .documents-table table { width: 100%; border-collapse: collapse; }
        .documents-table th { text-align: left; padding: 0.875rem 1rem; color: var(--color-text-secondary); font-weight: 500; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--color-border); }
        .documents-table td { padding: 1rem; border-bottom: 1px solid var(--color-border); }
        .documents-table tr:hover td { background: var(--color-surface-hover); }
        .empty { text-align: center; padding: 3rem !important; color: var(--color-text-secondary); }
        .doc-type { display: flex; align-items: center; gap: 0.5rem; }
        .order-ref { font-family: monospace; color: var(--color-primary); }
        .status-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .status-badge.ready { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .status-badge.pending { background: rgba(234, 179, 8, 0.15); color: #eab308; }
        .actions { display: flex; gap: 0.25rem; }
        .actions button { padding: 0.5rem; border-radius: var(--radius-sm); color: var(--color-text-secondary); }
        .actions button:hover:not(:disabled) { background: var(--color-background); color: var(--color-primary); }
        .actions button:disabled { opacity: 0.4; cursor: not-allowed; }
      `}</style>
        </div>
    );
}
