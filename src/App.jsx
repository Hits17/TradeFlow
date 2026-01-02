import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Inventory from './pages/Inventory';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Compliance from './pages/Compliance';
import HSCodes from './pages/HSCodes';
import Settings from './pages/Settings';
import { AppProvider } from './context/SettingsContext';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="register" element={<Register />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="clients" element={<Clients />} />
            <Route path="documents" element={<Documents />} />
            <Route path="reports" element={<Reports />} />
            <Route path="compliance" element={<Compliance />} />
            <Route path="hs-codes" element={<HSCodes />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Page Not Found</h2>
              </div>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
