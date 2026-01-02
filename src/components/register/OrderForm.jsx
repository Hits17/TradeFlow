import { useState, useMemo } from 'react';
import { Save, X, Info, DollarSign } from 'lucide-react';
import { useApp } from '../../context/SettingsContext';
import TagInput from '../ui/TagInput';

export default function OrderForm({ onClose, onSave, initialData }) {
  const { incoterms, addTag } = useApp();

  const [formData, setFormData] = useState({
    reference: initialData?.reference || '',
    type: initialData?.type || 'IMPORT',
    partner: initialData?.partner || '',
    consignee: initialData?.consignee || '',
    origin: initialData?.origin || '',
    destination: initialData?.destination || '',
    incoterm: initialData?.incoterm || 'FOB',
    status: initialData?.status || 'DRAFT',
    cargo: initialData?.cargo || '',
    hsCode: initialData?.hsCode || '',
    value: initialData?.value || '',
    currency: initialData?.currency || 'USD',
    grossWeight: initialData?.grossWeight || '',
    tags: initialData?.tags || [],
    // Landed Cost Fields
    freightCost: initialData?.freightCost || '',
    customsDuty: initialData?.customsDuty || '',
    insurance: initialData?.insurance || '',
    otherCosts: initialData?.otherCosts || ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (newTags) => {
    setFormData(prev => ({ ...prev, tags: newTags }));
    newTags.forEach(tag => addTag(tag));
  };

  // Calculate Landed Cost
  const landedCost = useMemo(() => {
    return (Number(formData.value) || 0) +
      (Number(formData.freightCost) || 0) +
      (Number(formData.customsDuty) || 0) +
      (Number(formData.insurance) || 0) +
      (Number(formData.otherCosts) || 0);
  }, [formData.value, formData.freightCost, formData.customsDuty, formData.insurance, formData.otherCosts]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...formData, landedCost });
  };

  return (
    <div className="form-overlay">
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2>{initialData ? 'Edit Order' : 'New Trade Order'}</h2>
          <button type="button" onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <div className="form-content">
          <section className="form-section">
            <h3 className="section-title">1. General Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Order Reference *</label>
                <input name="reference" type="text" placeholder="e.g., PO-2024-001" className="input" value={formData.reference} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select name="type" className="select" value={formData.type} onChange={handleChange}>
                  <option value="IMPORT">Import</option>
                  <option value="EXPORT">Export</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select name="status" className="select" value={formData.status} onChange={handleChange}>
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING">Pending</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="CUSTOMS">Customs</option>
                  <option value="DELIVERED">Delivered</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Tags</label>
                <TagInput tags={formData.tags} onChange={handleTagsChange} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">2. Trading Partners</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Partner / Supplier *</label>
                <input name="partner" type="text" placeholder="Company Name" className="input" value={formData.partner} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Consignee</label>
                <input name="consignee" type="text" placeholder="Receiving Company" className="input" value={formData.consignee} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Origin</label>
                <input name="origin" type="text" placeholder="City, Country" className="input" value={formData.origin} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Destination</label>
                <input name="destination" type="text" placeholder="City, Country" className="input" value={formData.destination} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">3. Incoterms 2020</h3>
            <div className="incoterm-grid">
              {incoterms.map((term) => (
                <button key={term.code} type="button" className={`term-btn ${formData.incoterm === term.code ? 'active' : ''}`} onClick={() => setFormData(prev => ({ ...prev, incoterm: term.code }))}>
                  <span className="term-code">{term.code}</span>
                  <span className="term-label">{term.label}</span>
                </button>
              ))}
            </div>
            <div className="term-details">
              <Info size={18} className="info-icon" />
              <div>
                <strong>{formData.incoterm}</strong> - {incoterms.find(i => i.code === formData.incoterm)?.desc || 'Select an incoterm'}
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">4. Cargo & Value</h3>
            <div className="form-row">
              <div className="form-group" style={{ flex: 2 }}>
                <label>Description of Goods</label>
                <input name="cargo" type="text" className="input" value={formData.cargo} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>HS Code</label>
                <input name="hsCode" type="text" className="input" value={formData.hsCode} onChange={handleChange} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Goods Value</label>
                <div className="input-group">
                  <input name="value" type="number" className="input" placeholder="0.00" value={formData.value} onChange={handleChange} />
                  <select name="currency" className="select addon" value={formData.currency} onChange={handleChange}>
                    <option>USD</option><option>EUR</option><option>CNY</option><option>CAD</option><option>GBP</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Gross Weight (kg)</label>
                <input name="grossWeight" type="number" className="input" value={formData.grossWeight} onChange={handleChange} />
              </div>
            </div>
          </section>

          <section className="form-section">
            <h3 className="section-title">5. Landed Cost Calculation</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Freight Cost</label>
                <input name="freightCost" type="number" className="input" placeholder="0.00" value={formData.freightCost} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Customs Duty</label>
                <input name="customsDuty" type="number" className="input" placeholder="0.00" value={formData.customsDuty} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Insurance</label>
                <input name="insurance" type="number" className="input" placeholder="0.00" value={formData.insurance} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Other Costs</label>
                <input name="otherCosts" type="number" className="input" placeholder="0.00" value={formData.otherCosts} onChange={handleChange} />
              </div>
            </div>
            <div className="landed-cost-display">
              <DollarSign size={20} />
              <span>Total Landed Cost:</span>
              <strong>${landedCost.toLocaleString()}</strong>
            </div>
          </section>
        </div>

        <div className="form-footer">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary">
            <Save size={18} />
            {initialData ? 'Update Order' : 'Create Order'}
          </button>
        </div>
      </form>

      <style>{`
        .form-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); z-index: 100; display: flex; justify-content: flex-end; animation: fadeIn 0.3s ease; }
        .form-container { width: 700px; height: 100%; background: var(--color-background); border-left: 1px solid var(--color-border); display: flex; flex-direction: column; box-shadow: -10px 0 30px rgba(0,0,0,0.5); animation: slideIn 0.3s ease; }
        @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .form-header { padding: 1.5rem; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; }
        .form-content { flex: 1; overflow-y: auto; padding: 2rem; display: flex; flex-direction: column; gap: 2rem; }
        .section-title { font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-secondary); margin-bottom: 1rem; font-weight: 600; }
        .form-row { display: flex; gap: 1rem; margin-bottom: 1rem; }
        .form-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.875rem; color: var(--color-text-primary); font-weight: 500; }
        .input, .select { background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: white; width: 100%; }
        .input:focus, .select:focus { outline: none; border-color: var(--color-primary); }
        .input-group { display: flex; }
        .input-group .input { border-top-right-radius: 0; border-bottom-right-radius: 0; border-right: none; }
        .input-group .addon { width: auto; border-top-left-radius: 0; border-bottom-left-radius: 0; background: var(--color-surface-hover); }
        .incoterm-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem; margin-bottom: 1rem; }
        .term-btn { padding: 0.5rem; background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); text-align: center; transition: all 0.2s; }
        .term-btn:hover { border-color: var(--color-primary); }
        .term-btn.active { background: var(--color-primary); border-color: var(--color-primary); }
        .term-btn.active .term-code, .term-btn.active .term-label { color: #fff; }
        .term-code { display: block; font-weight: 700; font-size: 0.875rem; color: var(--color-text-primary); }
        .term-label { font-size: 0.625rem; color: var(--color-text-secondary); }
        .term-details { background: rgba(59,130,246,0.1); border: 1px solid rgba(59,130,246,0.3); padding: 1rem; border-radius: var(--radius-md); display: flex; gap: 0.75rem; align-items: flex-start; font-size: 0.875rem; }
        .info-icon { color: var(--color-accent); flex-shrink: 0; margin-top: 2px; }
        .landed-cost-display { background: linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1)); border: 1px solid var(--color-primary); padding: 1rem 1.5rem; border-radius: var(--radius-md); display: flex; align-items: center; gap: 0.75rem; font-size: 1rem; }
        .landed-cost-display strong { font-size: 1.25rem; color: var(--color-primary); margin-left: auto; }
        .form-footer { padding: 1.5rem; border-top: 1px solid var(--color-border); display: flex; justify-content: flex-end; gap: 1rem; background: var(--color-surface); }
        .close-btn { color: var(--color-text-secondary); } .close-btn:hover { color: white; }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover { background: var(--color-primary-hover); }
        .btn-ghost { padding: 0.75rem 1.5rem; color: var(--color-text-secondary); font-weight: 500; } .btn-ghost:hover { color: var(--color-text-primary); }
      `}</style>
    </div>
  );
}
