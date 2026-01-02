import { useState } from 'react';
import { Plus, Users, Building2, Globe, Mail, Phone, Edit, Trash2, Filter, Search } from 'lucide-react';
import { useApp } from '../context/SettingsContext';

export default function Clients() {
    const { clients, addClient, updateClient, deleteClient } = useApp();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('');

    const [formData, setFormData] = useState({
        name: '', type: 'IMPORTER', country: '', city: '', email: '', phone: '', taxId: '', status: 'ACTIVE', riskLevel: 'LOW'
    });

    const handleOpenForm = (client = null) => {
        if (client) {
            setFormData(client);
            setEditingClient(client);
        } else {
            setFormData({ name: '', type: 'IMPORTER', country: '', city: '', email: '', phone: '', taxId: '', status: 'ACTIVE', riskLevel: 'LOW' });
            setEditingClient(null);
        }
        setIsFormOpen(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (editingClient) {
            updateClient(editingClient.id, formData);
        } else {
            addClient(formData);
        }
        setIsFormOpen(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this client?')) deleteClient(id);
    };

    const filteredClients = clients.filter(c => {
        const matchesSearch = !searchTerm ||
            c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = !typeFilter || c.type === typeFilter;
        return matchesSearch && matchesType;
    });

    const getRiskColor = (level) => {
        switch (level) {
            case 'LOW': return { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' };
            case 'MEDIUM': return { bg: 'rgba(234, 179, 8, 0.15)', color: '#eab308' };
            case 'HIGH': return { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' };
            default: return { bg: 'rgba(107, 114, 128, 0.15)', color: '#9ca3af' };
        }
    };

    return (
        <div className="clients-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Client Management</h1>
                    <p className="page-subtitle">{clients.length} clients registered</p>
                </div>
                <button className="btn-primary" onClick={() => handleOpenForm()}>
                    <Plus size={20} /> Add Client
                </button>
            </div>

            <div className="stats-row">
                <div className="stat-card"><Building2 size={20} /><div><span>Importers</span><strong>{clients.filter(c => c.type === 'IMPORTER').length}</strong></div></div>
                <div className="stat-card"><Globe size={20} /><div><span>Exporters</span><strong>{clients.filter(c => c.type === 'EXPORTER').length}</strong></div></div>
                <div className="stat-card"><Users size={20} /><div><span>Active</span><strong>{clients.filter(c => c.status === 'ACTIVE').length}</strong></div></div>
            </div>

            <div className="filters-row">
                <div className="search-box">
                    <Search size={18} />
                    <input type="text" placeholder="Search clients..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                </div>
                <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="IMPORTER">Importers</option>
                    <option value="EXPORTER">Exporters</option>
                </select>
            </div>

            <div className="clients-grid">
                {filteredClients.length === 0 ? (
                    <div className="empty-state">No clients found. Add your first client!</div>
                ) : (
                    filteredClients.map(client => {
                        const risk = getRiskColor(client.riskLevel);
                        return (
                            <div key={client.id} className="client-card">
                                <div className="card-header">
                                    <div className="client-avatar">{client.name?.charAt(0)}</div>
                                    <div className="client-info">
                                        <h3>{client.name}</h3>
                                        <span className={`type-badge ${client.type?.toLowerCase()}`}>{client.type}</span>
                                    </div>
                                    <div className="card-actions">
                                        <button onClick={() => handleOpenForm(client)}><Edit size={16} /></button>
                                        <button className="danger" onClick={() => handleDelete(client.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <div className="info-row"><Globe size={14} /><span>{client.city}, {client.country}</span></div>
                                    <div className="info-row"><Mail size={14} /><span>{client.email}</span></div>
                                    <div className="info-row"><Phone size={14} /><span>{client.phone}</span></div>
                                </div>
                                <div className="card-footer">
                                    <span className="status-badge" style={{ background: client.status === 'ACTIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(107,114,128,0.15)', color: client.status === 'ACTIVE' ? '#10b981' : '#9ca3af' }}>
                                        {client.status}
                                    </span>
                                    <span className="risk-badge" style={{ background: risk.bg, color: risk.color }}>Risk: {client.riskLevel}</span>
                                </div>
                                <div className="card-stats">
                                    <div><span>Orders</span><strong>{client.totalOrders || 0}</strong></div>
                                    <div><span>Total Value</span><strong>${(client.totalValue || 0).toLocaleString()}</strong></div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {isFormOpen && (
                <div className="form-overlay">
                    <form className="form-panel" onSubmit={handleSave}>
                        <h2>{editingClient ? 'Edit Client' : 'New Client'}</h2>
                        <div className="form-grid">
                            <div className="form-group full"><label>Company Name *</label><input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                            <div className="form-group"><label>Type</label><select value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })}><option value="IMPORTER">Importer</option><option value="EXPORTER">Exporter</option></select></div>
                            <div className="form-group"><label>Country</label><input value={formData.country} onChange={e => setFormData({ ...formData, country: e.target.value })} /></div>
                            <div className="form-group"><label>City</label><input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} /></div>
                            <div className="form-group"><label>Email</label><input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} /></div>
                            <div className="form-group"><label>Phone</label><input value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                            <div className="form-group"><label>Tax ID</label><input value={formData.taxId} onChange={e => setFormData({ ...formData, taxId: e.target.value })} /></div>
                            <div className="form-group"><label>Status</label><select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></div>
                            <div className="form-group"><label>Risk Level</label><select value={formData.riskLevel} onChange={e => setFormData({ ...formData, riskLevel: e.target.value })}><option value="LOW">Low</option><option value="MEDIUM">Medium</option><option value="HIGH">High</option></select></div>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={() => setIsFormOpen(false)}>Cancel</button>
                            <button type="submit" className="btn-primary">{editingClient ? 'Update' : 'Create'} Client</button>
                        </div>
                    </form>
                </div>
            )}

            <style>{`
        .clients-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .stat-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; display: flex; gap: 1rem; align-items: center; }
        .stat-card span { font-size: 0.875rem; color: var(--color-text-secondary); display: block; }
        .stat-card strong { font-size: 1.5rem; }
        .filters-row { display: flex; gap: 1rem; }
        .search-box { flex: 1; position: relative; }
        .search-box input { width: 100%; background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: var(--radius-md); color: var(--color-text-primary); }
        .search-box svg { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
        .filters-row select { background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: var(--color-text-primary); }
        .clients-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .empty-state { grid-column: span 3; text-align: center; padding: 3rem; color: var(--color-text-secondary); background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); }
        .client-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
        .card-header { padding: 1.25rem; display: flex; gap: 1rem; align-items: center; border-bottom: 1px solid var(--color-border); }
        .client-avatar { width: 48px; height: 48px; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.25rem; color: white; }
        .client-info { flex: 1; }
        .client-info h3 { margin-bottom: 0.25rem; }
        .type-badge { font-size: 0.75rem; padding: 0.125rem 0.5rem; border-radius: 4px; }
        .type-badge.importer { background: rgba(129, 140, 248, 0.15); color: #818cf8; }
        .type-badge.exporter { background: rgba(244, 114, 182, 0.15); color: #f472b6; }
        .card-actions { display: flex; gap: 0.25rem; }
        .card-actions button { padding: 0.5rem; border-radius: var(--radius-sm); color: var(--color-text-secondary); }
        .card-actions button:hover { background: var(--color-background); color: var(--color-primary); }
        .card-actions button.danger:hover { color: #ef4444; }
        .card-body { padding: 1rem 1.25rem; }
        .info-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; font-size: 0.875rem; color: var(--color-text-secondary); }
        .card-footer { padding: 0.75rem 1.25rem; border-top: 1px solid var(--color-border); display: flex; gap: 0.5rem; }
        .status-badge, .risk-badge { font-size: 0.75rem; padding: 0.25rem 0.75rem; border-radius: 999px; font-weight: 500; }
        .card-stats { display: flex; padding: 1rem 1.25rem; background: var(--color-background); }
        .card-stats > div { flex: 1; text-align: center; }
        .card-stats span { font-size: 0.75rem; color: var(--color-text-secondary); display: block; }
        .card-stats strong { color: var(--color-primary); }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .form-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); z-index: 100; display: flex; justify-content: center; align-items: center; }
        .form-panel { background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 2rem; width: 600px; max-height: 90vh; overflow-y: auto; }
        .form-panel h2 { margin-bottom: 1.5rem; }
        .form-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group.full { grid-column: span 2; }
        .form-group label { font-size: 0.875rem; color: var(--color-text-secondary); }
        .form-group input, .form-group select { background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: var(--color-text-primary); }
        .form-actions { margin-top: 1.5rem; display: flex; justify-content: flex-end; gap: 0.75rem; }
        .form-actions button { padding: 0.75rem 1.5rem; border-radius: var(--radius-md); }
      `}</style>
        </div>
    );
}
