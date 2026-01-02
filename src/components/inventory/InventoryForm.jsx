import { useState } from 'react';
import { Save, X } from 'lucide-react';

export default function InventoryForm({ onClose, onSave, initialData }) {
    const [formData, setFormData] = useState({
        sku: initialData?.sku || '',
        name: initialData?.name || '',
        category: initialData?.category || '',
        stockLevel: initialData?.stockLevel || 0,
        unit: initialData?.unit || 'pcs',
        location: initialData?.location || '',
        reorderPoint: initialData?.reorderPoint || 10,
        unitValue: initialData?.unitValue || 0
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="form-overlay">
            <form className="form-container" onSubmit={handleSubmit}>
                <div className="form-header">
                    <h2>{initialData ? 'Edit Item' : 'New Inventory Item'}</h2>
                    <button type="button" onClick={onClose} className="close-btn">
                        <X size={24} />
                    </button>
                </div>

                <div className="form-content">
                    <div className="form-row">
                        <div className="form-group">
                            <label>SKU</label>
                            <input name="sku" type="text" placeholder="Auto-generated if empty" className="input" value={formData.sku} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Product Name *</label>
                            <input name="name" type="text" className="input" value={formData.name} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Category</label>
                            <input name="category" type="text" placeholder="e.g., Electronics" className="input" value={formData.category} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Location</label>
                            <input name="location" type="text" placeholder="e.g., Warehouse A" className="input" value={formData.location} onChange={handleChange} />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Stock Level *</label>
                            <input name="stockLevel" type="number" className="input" value={formData.stockLevel} onChange={handleChange} required min="0" />
                        </div>
                        <div className="form-group">
                            <label>Unit</label>
                            <select name="unit" className="select" value={formData.unit} onChange={handleChange}>
                                <option value="pcs">Pieces</option>
                                <option value="kg">Kilograms</option>
                                <option value="lbs">Pounds</option>
                                <option value="boxes">Boxes</option>
                                <option value="pallets">Pallets</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Reorder Point</label>
                            <input name="reorderPoint" type="number" className="input" value={formData.reorderPoint} onChange={handleChange} min="0" />
                        </div>
                        <div className="form-group">
                            <label>Unit Value ($)</label>
                            <input name="unitValue" type="number" className="input" value={formData.unitValue} onChange={handleChange} min="0" step="0.01" />
                        </div>
                    </div>
                </div>

                <div className="form-footer">
                    <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
                    <button type="submit" className="btn-primary">
                        <Save size={18} />
                        {initialData ? 'Update Item' : 'Add Item'}
                    </button>
                </div>
            </form>

            <style>{`
        .form-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background-color: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 100; display: flex; justify-content: flex-end; animation: fadeIn 0.3s ease; }
        .form-container { width: 500px; height: 100%; background-color: var(--color-background); border-left: 1px solid var(--color-border); display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.5); animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .form-header { padding: 1.5rem; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; }
        .form-content { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-row { display: flex; gap: 1rem; }
        .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; color: var(--color-text-primary); font-weight: 500; }
        .input, .select { background-color: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: white; width: 100%; }
        .input:focus, .select:focus { outline: none; border-color: var(--color-primary); }
        .form-footer { padding: 1.5rem; border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; gap: 1rem; background-color: var(--color-surface); }
        .close-btn { color: var(--color-text-secondary); } .close-btn:hover { color: white; }
        .btn-primary { background-color: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover { background-color: var(--color-primary-hover); }
        .btn-ghost { padding: 0.75rem 1.5rem; color: var(--color-text-secondary); font-weight: 500; } .btn-ghost:hover { color: var(--color-text-primary); }
      `}</style>
        </div>
    );
}
