import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-content">
                <Header />
                <main className="page-content">
                    <Outlet />
                </main>
            </div>

            <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
          background-color: var(--color-background);
        }

        .main-content {
          flex: 1;
          margin-left: 260px; /* Sidebar width */
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }

        .page-content {
          padding: 2rem;
          flex: 1;
          overflow-y: auto;
        }
      `}</style>
        </div>
    );
}
