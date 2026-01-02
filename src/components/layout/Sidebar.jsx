import { LayoutDashboard, FileText, Settings, LogOut, Package, BarChart3, Shield, BookOpen, Users, FolderOpen } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Register', path: '/register' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: Users, label: 'Clients', path: '/clients' },
  { icon: FolderOpen, label: 'Documents', path: '/documents' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Shield, label: 'Compliance', path: '/compliance' },
  { icon: BookOpen, label: 'HS Codes', path: '/hs-codes' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <div className="logo-inner" />
        </div>
        <span className="logo-text">TradeFlow</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
          >
            <item.icon size={20} strokeWidth={1.5} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item">
          <LogOut size={20} strokeWidth={1.5} />
          <span>Sign Out</span>
        </button>
      </div>

      <style>{`
        .sidebar {
          width: 260px;
          height: 100vh;
          background-color: var(--color-surface);
          border-right: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          padding: 1.5rem;
          position: fixed;
          top: 0;
          left: 0;
          transition: transform 0.3s ease;
          z-index: 50;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
          padding: 0 0.5rem;
        }

        .logo-icon {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.3);
        }
        
        .logo-inner {
            width: 12px;
            height: 12px;
            background: #fff;
            border-radius: 2px;
            opacity: 0.8;
        }

        .logo-text {
          font-weight: 700;
          font-size: 1.25rem;
          color: var(--color-text-primary);
          letter-spacing: -0.02em;
        }

        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          flex: 1;
          overflow-y: auto;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.625rem 1rem;
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          transition: all 0.2s ease;
          font-weight: 500;
          width: 100%;
          text-align: left;
          font-size: 0.875rem;
        }

        .nav-item:hover {
          background-color: var(--color-surface-hover);
          color: var(--color-text-primary);
        }

        .nav-item.active {
          background-color: rgba(16, 185, 129, 0.1);
          color: var(--color-primary);
        }
        
        .sidebar-footer {
          border-top: 1px solid var(--color-border);
          padding-top: 1rem;
        }
      `}</style>
    </aside>
  );
}
