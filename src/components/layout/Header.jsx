import { useState, useRef, useEffect } from 'react';
import { Bell, Search, User, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-search">
        <Search size={18} className="search-icon" />
        <input type="text" placeholder="Search orders, references..." className="search-input" />
      </div>

      <div className="header-actions">
        <div className="dropdown-container" ref={notifRef}>
          <button
            className={`icon-btn ${showNotifications ? 'active' : ''}`}
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} />
            <span className="badge">2</span>
          </button>

          {showNotifications && (
            <div className="dropdown-menu notifications-menu">
              <div className="dropdown-header">
                <h3>Notifications</h3>
                <button className="text-btn">Mark all read</button>
              </div>
              <div className="notification-list">
                <div className="notification-item unread">
                  <div className="notif-dot"></div>
                  <div>
                    <p className="notif-text">Order <strong>#8823</strong> cleared customs.</p>
                    <span className="notif-time">10 min ago</span>
                  </div>
                </div>
                <div className="notification-item unread">
                  <div className="notif-dot"></div>
                  <div>
                    <p className="notif-text">Low stock alert: <strong>Coffee Beans</strong></p>
                    <span className="notif-time">1 hour ago</span>
                  </div>
                </div>
                <div className="notification-item">
                  <div>
                    <p className="notif-text">New shipment created by <strong>Global Tech</strong>.</p>
                    <span className="notif-time">Yesterday</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="dropdown-container" ref={profileRef}>
          <div
            className="user-profile"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="avatar">
              <User size={18} />
            </div>
            <span className="username">Admin User</span>
          </div>

          {showProfile && (
            <div className="dropdown-menu profile-menu">
              <div className="menu-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                <User size={16} /> My Account
              </div>
              <div className="menu-item" onClick={() => { setShowProfile(false); navigate('/settings'); }}>
                <Settings size={16} /> Settings
              </div>
              <div className="menu-divider"></div>
              <div className="menu-item danger" onClick={() => { alert('Logout functionality would go here in a real app.'); }}>
                <LogOut size={16} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .header {
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          background-color: rgba(15, 17, 21, 0.8);
          backdrop-filter: blur(12px);
          position: sticky;
          top: 0;
          z-index: 40;
          border-bottom: 1px solid var(--color-border);
        }

        .header-search {
          position: relative;
          width: 320px;
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-input {
          width: 100%;
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          color: var(--color-text-primary);
          font-size: 0.875rem;
          transition: all 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .dropdown-container {
            position: relative;
        }

        .icon-btn {
          position: relative;
          color: var(--color-text-secondary);
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          border-radius: 50%;
        }

        .icon-btn:hover, .icon-btn.active {
          color: var(--color-text-primary);
          background-color: var(--color-surface-hover);
        }

        .badge {
          position: absolute;
          top: 2px;
          right: 2px;
          background-color: #ef4444;
          color: white;
          font-size: 0.625rem;
          font-weight: 700;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: var(--radius-md);
          transition: background-color 0.2s;
        }
        
        .user-profile:hover {
            background-color: var(--color-surface-hover);
        }
        
        .avatar {
            width: 32px;
            height: 32px;
            background: var(--color-surface-hover);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--color-text-secondary);
            border: 1px solid var(--color-border);
        }

        .username {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-text-primary);
        }
        
        /* Dropdowns */
        .dropdown-menu {
            position: absolute;
            top: 100%;
            right: 0;
            margin-top: 0.5rem;
            background-color: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-md);
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
            width: 200px;
            overflow: hidden;
            animation: fadeIn 0.1s ease-out;
            z-index: 50;
        }
        
        .notifications-menu {
            width: 320px;
        }
        
        .dropdown-header {
            padding: 1rem;
            border-bottom: 1px solid var(--color-border);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .dropdown-header h3 {
            font-size: 0.875rem;
            font-weight: 600;
        }
        
        .text-btn {
            font-size: 0.75rem;
            color: var(--color-primary);
        }
        
        .text-btn:hover { text-decoration: underline; }
        
        .notification-list {
            max-height: 300px;
            overflow-y: auto;
        }
        
        .notification-item {
            padding: 1rem;
            border-bottom: 1px solid var(--color-border);
            display: flex;
            gap: 0.75rem;
            transition: background-color 0.2s;
        }
        
        .notification-item:hover {
            background-color: var(--color-surface-hover);
        }
        
        .notification-item.unread {
            background-color: rgba(59, 130, 246, 0.05);
        }
        
        .notif-dot {
            width: 8px;
            height: 8px;
            background-color: var(--color-primary);
            border-radius: 50%;
            margin-top: 6px;
        }
        
        .notif-text {
            font-size: 0.875rem;
            margin-bottom: 0.25rem;
            line-height: 1.4;
        }
        
        .notif-time {
            font-size: 0.75rem;
            color: var(--color-text-secondary);
        }
        
        .menu-item {
            padding: 0.75rem 1rem;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-size: 0.875rem;
            color: var(--color-text-primary);
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .menu-item:hover {
            background-color: var(--color-surface-hover);
        }
        
        .menu-item.danger {
            color: #ef4444;
        }
        
        .menu-item.danger:hover {
            background-color: rgba(239, 68, 68, 0.1);
        }
        
        .menu-divider {
            height: 1px;
            background-color: var(--color-border);
            margin: 0.25rem 0;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-5px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </header>
  );
}
