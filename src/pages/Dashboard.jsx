import { TrendingUp, TrendingDown, Package, Truck, Users, AlertCircle, FileText, ArrowRight } from 'lucide-react';
import { useApp } from '../context/SettingsContext';
import { NavLink } from 'react-router-dom';

const SummaryCard = ({ icon: Icon, label, value, trend, trendValue, color }) => (
  <div className="summary-card">
    <div className="card-icon" style={{ backgroundColor: `${color}20`, color }}>
      <Icon size={24} />
    </div>
    <div className="card-content">
      <span className="card-label">{label}</span>
      <span className="card-value">{value}</span>
      {trend && (
        <span className={`card-trend ${trend}`}>
          {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {trendValue}
        </span>
      )}
    </div>
  </div>
);

export default function Dashboard() {
  const { orders, inventory, getStats } = useApp();
  const stats = getStats();

  // Recent orders (last 5)
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="dashboard">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Welcome back! Here's your trade overview.</p>
      </div>

      <div className="summary-grid">
        <SummaryCard icon={FileText} label="Total Orders" value={stats.totalOrders} trend="up" trendValue="+12%" color="#3b82f6" />
        <SummaryCard icon={Truck} label="Active Shipments" value={stats.activeShipments} color="#8b5cf6" />
        <SummaryCard icon={Package} label="Inventory Items" value={stats.totalInventoryItems} color="#10b981" />
        <SummaryCard icon={AlertCircle} label="Low Stock Alerts" value={stats.lowStockItems} trend={stats.lowStockItems > 0 ? 'down' : null} trendValue="Needs attention" color="#ef4444" />
      </div>

      <div className="dashboard-grid">
        <div className="card recent-activity">
          <div className="card-header">
            <h2>Recent Orders</h2>
            <NavLink to="/register" className="view-all-link">
              View All <ArrowRight size={16} />
            </NavLink>
          </div>
          <div className="activity-list">
            {recentOrders.length === 0 ? (
              <p className="empty-text">No orders yet. Create your first order!</p>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="activity-item">
                  <div className="activity-icon" style={{ backgroundColor: order.type === 'IMPORT' ? 'rgba(129, 140, 248, 0.2)' : 'rgba(244, 114, 182, 0.2)' }}>
                    {order.type === 'IMPORT' ? <Package size={16} style={{ color: '#818cf8' }} /> : <Truck size={16} style={{ color: '#f472b6' }} />}
                  </div>
                  <div className="activity-content">
                    <span className="activity-title">{order.reference || order.id}</span>
                    <span className="activity-subtitle">{order.partner} • {order.status?.replace('_', ' ')}</span>
                  </div>
                  <span className="activity-time">{order.date}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card quick-stats">
          <div className="card-header">
            <h2>Order Status</h2>
          </div>
          <div className="stats-breakdown">
            <div className="stat-row">
              <span className="stat-label">Pending</span>
              <div className="stat-bar-container">
                <div className="stat-bar" style={{ width: `${(stats.pendingOrders / stats.totalOrders * 100) || 0}%`, backgroundColor: '#facc15' }}></div>
              </div>
              <span className="stat-value">{stats.pendingOrders}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">In Transit</span>
              <div className="stat-bar-container">
                <div className="stat-bar" style={{ width: `${(stats.activeShipments / stats.totalOrders * 100) || 0}%`, backgroundColor: '#60a5fa' }}></div>
              </div>
              <span className="stat-value">{stats.activeShipments}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Delivered</span>
              <div className="stat-bar-container">
                <div className="stat-bar" style={{ width: `${(stats.deliveredOrders / stats.totalOrders * 100) || 0}%`, backgroundColor: '#34d399' }}></div>
              </div>
              <span className="stat-value">{stats.deliveredOrders}</span>
            </div>
          </div>
          <div className="inventory-value">
            <span className="value-label">Total Inventory Value</span>
            <span className="value-amount">${stats.totalInventoryValue.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <style>{`
        .dashboard { display: flex; flex-direction: column; gap: 2rem; }
        .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .summary-card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; gap: 1rem; align-items: center; transition: transform 0.2s, box-shadow 0.2s; }
        .summary-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
        .card-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .card-content { display: flex; flex-direction: column; }
        .card-label { font-size: 0.875rem; color: var(--color-text-secondary); }
        .card-value { font-size: 1.75rem; font-weight: 700; color: var(--color-text-primary); }
        .card-trend { display: flex; align-items: center; gap: 0.25rem; font-size: 0.75rem; margin-top: 0.25rem; }
        .card-trend.up { color: #10b981; }
        .card-trend.down { color: #ef4444; }
        .dashboard-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; }
        .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .card-header h2 { font-size: 1rem; font-weight: 600; }
        .view-all-link { font-size: 0.875rem; color: var(--color-primary); display: flex; align-items: center; gap: 0.25rem; }
        .view-all-link:hover { text-decoration: underline; }
        .activity-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .activity-item { display: flex; align-items: center; gap: 1rem; padding: 0.75rem; border-radius: var(--radius-sm); transition: background-color 0.2s; }
        .activity-item:hover { background-color: var(--color-surface-hover); }
        .activity-icon { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }
        .activity-content { flex: 1; display: flex; flex-direction: column; }
        .activity-title { font-weight: 500; font-size: 0.875rem; }
        .activity-subtitle { font-size: 0.75rem; color: var(--color-text-secondary); }
        .activity-time { font-size: 0.75rem; color: var(--color-text-muted); }
        .empty-text { color: var(--color-text-secondary); font-size: 0.875rem; text-align: center; padding: 2rem; }
        .stats-breakdown { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 1.5rem; }
        .stat-row { display: flex; align-items: center; gap: 0.75rem; }
        .stat-label { width: 70px; font-size: 0.75rem; color: var(--color-text-secondary); }
        .stat-bar-container { flex: 1; height: 8px; background-color: var(--color-background); border-radius: 4px; overflow: hidden; }
        .stat-bar { height: 100%; border-radius: 4px; transition: width 0.3s ease; }
        .stat-value { width: 30px; text-align: right; font-size: 0.875rem; font-weight: 600; }
        .inventory-value { padding-top: 1rem; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; }
        .value-label { font-size: 0.875rem; color: var(--color-text-secondary); }
        .value-amount { font-size: 1.25rem; font-weight: 700; color: var(--color-primary); }
      `}</style>
    </div>
  );
}
