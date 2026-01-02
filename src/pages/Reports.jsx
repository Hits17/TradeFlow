import { useMemo, useState } from 'react';
import { useApp } from '../context/SettingsContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Download, TrendingUp, Package, Users, AlertTriangle } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="stat-card">
        <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
            <Icon size={20} />
        </div>
        <div className="stat-info">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
        </div>
    </div>
);

export default function Reports() {
    const { orders, inventory } = useApp();
    const [activeTab, setActiveTab] = useState('orders');

    // ========== ORDER ANALYTICS ==========
    const ordersByStatus = useMemo(() => {
        const counts = {};
        orders.forEach(o => {
            const status = o.status || 'DRAFT';
            counts[status] = (counts[status] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name: name.replace('_', ' '), value }));
    }, [orders]);

    const ordersByType = useMemo(() => {
        const imports = orders.filter(o => o.type === 'IMPORT').length;
        const exports = orders.filter(o => o.type === 'EXPORT').length;
        return [
            { name: 'Import', value: imports },
            { name: 'Export', value: exports }
        ];
    }, [orders]);

    const ordersByMonth = useMemo(() => {
        const months = {};
        orders.forEach(o => {
            if (o.date) {
                const month = o.date.substring(0, 7); // YYYY-MM
                months[month] = (months[month] || 0) + 1;
            }
        });
        return Object.entries(months)
            .sort((a, b) => a[0].localeCompare(b[0]))
            .slice(-6)
            .map(([month, count]) => ({ month, orders: count }));
    }, [orders]);

    const topPartners = useMemo(() => {
        const partners = {};
        orders.forEach(o => {
            if (o.partner) {
                if (!partners[o.partner]) {
                    partners[o.partner] = { name: o.partner, orders: 0, value: 0 };
                }
                partners[o.partner].orders += 1;
                partners[o.partner].value += Number(o.value) || 0;
            }
        });
        return Object.values(partners)
            .sort((a, b) => b.value - a.value)
            .slice(0, 5);
    }, [orders]);

    const totalTradeValue = useMemo(() =>
        orders.reduce((sum, o) => sum + (Number(o.value) || 0), 0)
        , [orders]);

    // ========== INVENTORY ANALYTICS ==========
    const inventoryByCategory = useMemo(() => {
        const cats = {};
        inventory.forEach(i => {
            const cat = i.category || 'Uncategorized';
            cats[cat] = (cats[cat] || 0) + 1;
        });
        return Object.entries(cats).map(([name, value]) => ({ name, value }));
    }, [inventory]);

    const stockLevelBreakdown = useMemo(() => {
        let inStock = 0, low = 0, critical = 0, outOfStock = 0;
        inventory.forEach(i => {
            const level = i.stockLevel || 0;
            const reorder = i.reorderPoint || 10;
            if (level <= 0) outOfStock++;
            else if (level <= reorder * 0.5) critical++;
            else if (level <= reorder) low++;
            else inStock++;
        });
        return [
            { name: 'In Stock', value: inStock },
            { name: 'Low Stock', value: low },
            { name: 'Critical', value: critical },
            { name: 'Out of Stock', value: outOfStock }
        ].filter(d => d.value > 0);
    }, [inventory]);

    // ========== EXPORT ==========
    const exportToCSV = (data, filename) => {
        const headers = Object.keys(data[0] || {}).join(',');
        const rows = data.map(row => Object.values(row).join(','));
        const csv = [headers, ...rows].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
    };

    return (
        <div className="reports-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Reports & Analytics</h1>
                    <p className="page-subtitle">Insights into your trade operations</p>
                </div>
                <button className="btn-primary" onClick={() => exportToCSV(orders, 'orders_report')}>
                    <Download size={18} /> Export Orders
                </button>
            </div>

            <div className="stats-row">
                <StatCard icon={TrendingUp} label="Total Trade Value" value={`$${totalTradeValue.toLocaleString()}`} color="#10b981" />
                <StatCard icon={Package} label="Total Orders" value={orders.length} color="#3b82f6" />
                <StatCard icon={Users} label="Active Partners" value={topPartners.length} color="#8b5cf6" />
                <StatCard icon={AlertTriangle} label="Low Stock Items" value={inventory.filter(i => (i.stockLevel || 0) <= (i.reorderPoint || 10)).length} color="#ef4444" />
            </div>

            <div className="tabs">
                <button className={`tab ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Order Analytics</button>
                <button className={`tab ${activeTab === 'inventory' ? 'active' : ''}`} onClick={() => setActiveTab('inventory')}>Inventory Analytics</button>
                <button className={`tab ${activeTab === 'partners' ? 'active' : ''}`} onClick={() => setActiveTab('partners')}>Partner Performance</button>
            </div>

            {activeTab === 'orders' && (
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>Orders by Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    {ordersByStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3>Import vs Export</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={ordersByType} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    <Cell fill="#818cf8" />
                                    <Cell fill="#f472b6" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card wide">
                        <h3>Orders Trend (Last 6 Months)</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={ordersByMonth}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="month" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Line type="monotone" dataKey="orders" stroke="#10b981" strokeWidth={2} dot={{ fill: '#10b981' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'inventory' && (
                <div className="charts-grid">
                    <div className="chart-card">
                        <h3>Items by Category</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={inventoryByCategory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
                                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="chart-card">
                        <h3>Stock Level Status</h3>
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie data={stockLevelBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                                    <Cell fill="#10b981" />
                                    <Cell fill="#f59e0b" />
                                    <Cell fill="#f97316" />
                                    <Cell fill="#ef4444" />
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {activeTab === 'partners' && (
                <div className="charts-grid">
                    <div className="chart-card wide">
                        <h3>Top Partners by Trade Value</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={topPartners} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis type="number" stroke="#9ca3af" tickFormatter={(v) => `$${v.toLocaleString()}`} />
                                <YAxis type="category" dataKey="name" stroke="#9ca3af" width={150} />
                                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} formatter={(v) => `$${v.toLocaleString()}`} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="partner-table">
                        <h3>Partner Summary</h3>
                        <table>
                            <thead>
                                <tr><th>Partner</th><th>Orders</th><th>Total Value</th></tr>
                            </thead>
                            <tbody>
                                {topPartners.map(p => (
                                    <tr key={p.name}>
                                        <td>{p.name}</td>
                                        <td>{p.orders}</td>
                                        <td>${p.value.toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <style>{`
        .reports-page { display: flex; flex-direction: column; gap: 2rem; }
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        .stat-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.25rem; display: flex; gap: 1rem; align-items: center; }
        .stat-icon { width: 40px; height: 40px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .stat-label { font-size: 0.875rem; color: var(--color-text-secondary); display: block; }
        .stat-value { font-size: 1.5rem; font-weight: 700; }
        .tabs { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--color-border); padding-bottom: 0.5rem; }
        .tab { padding: 0.75rem 1.5rem; border-radius: var(--radius-md) var(--radius-md) 0 0; color: var(--color-text-secondary); font-weight: 500; transition: all 0.2s; }
        .tab:hover { color: var(--color-text-primary); }
        .tab.active { background: var(--color-surface); color: var(--color-primary); }
        .charts-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; }
        .chart-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; }
        .chart-card.wide { grid-column: span 2; }
        .chart-card h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--color-text-secondary); }
        .partner-table { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; }
        .partner-table h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--color-text-secondary); }
        .partner-table table { width: 100%; }
        .partner-table th, .partner-table td { padding: 0.75rem; text-align: left; border-bottom: 1px solid var(--color-border); }
        .partner-table th { color: var(--color-text-muted); font-weight: 500; }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover { background: var(--color-primary-hover); }
      `}</style>
        </div>
    );
}
