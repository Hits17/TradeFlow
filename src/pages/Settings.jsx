import { useState } from 'react';
import { useApp } from '../context/SettingsContext';
import { Plus, Trash2 } from 'lucide-react';

export default function Settings() {
    const { incoterms, addIncoterm, removeIncoterm, tags, addTag } = useApp();
    const [activeTab, setActiveTab] = useState('incoterms');

    const [newCode, setNewCode] = useState('');
    const [newLabel, setNewLabel] = useState('');
    const [newDesc, setNewDesc] = useState('');
    const [newTag, setNewTag] = useState('');

    const handleAddIncoterm = (e) => {
        e.preventDefault();
        if (newCode && newLabel) {
            addIncoterm({ code: newCode.toUpperCase(), label: newLabel, desc: newDesc });
            setNewCode(''); setNewLabel(''); setNewDesc('');
        }
    };

    const handleAddTag = (e) => {
        e.preventDefault();
        if (newTag.trim()) {
            addTag(newTag.trim().toLowerCase());
            setNewTag('');
        }
    };

    return (
        <div className="settings-page">
            <div className="page-header">
                <h1 className="page-title">Settings</h1>
                <p className="page-subtitle">Manage global lists and application preferences</p>
            </div>

            <div className="settings-layout">
                <div className="settings-sidebar">
                    <button className={`tab-btn ${activeTab === 'general' ? 'active' : ''}`} onClick={() => setActiveTab('general')}>General</button>
                    <button className={`tab-btn ${activeTab === 'incoterms' ? 'active' : ''}`} onClick={() => setActiveTab('incoterms')}>Incoterms</button>
                    <button className={`tab-btn ${activeTab === 'tags' ? 'active' : ''}`} onClick={() => setActiveTab('tags')}>Tags</button>
                </div>

                <div className="settings-content">
                    {activeTab === 'incoterms' && (
                        <div className="settings-section">
                            <h2>Incoterms Configuration</h2>
                            <p className="section-desc">Manage shipment terms available in order forms.</p>

                            <form className="add-form" onSubmit={handleAddIncoterm}>
                                <div className="form-row">
                                    <input type="text" className="input" placeholder="Code (e.g. EXW)" value={newCode} onChange={e => setNewCode(e.target.value)} maxLength={3} required />
                                    <input type="text" className="input" placeholder="Label" value={newLabel} onChange={e => setNewLabel(e.target.value)} required style={{ flex: 2 }} />
                                    <button type="submit" className="btn-primary"><Plus size={16} /> Add</button>
                                </div>
                                <input type="text" className="input" placeholder="Description (optional)" value={newDesc} onChange={e => setNewDesc(e.target.value)} style={{ marginTop: '0.5rem' }} />
                            </form>

                            <div className="list-container">
                                {incoterms.map((term) => (
                                    <div key={term.code} className="list-item">
                                        <div className="item-info">
                                            <span className="item-code">{term.code}</span>
                                            <span className="item-label">{term.label}</span>
                                            <span className="item-desc">{term.desc}</span>
                                        </div>
                                        <button className="action-btn" onClick={() => removeIncoterm(term.code)}><Trash2 size={16} /></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'tags' && (
                        <div className="settings-section">
                            <h2>Global Tags</h2>
                            <p className="section-desc">Manage tags used across the system.</p>

                            <form className="add-form" onSubmit={handleAddTag}>
                                <div className="form-row">
                                    <input type="text" className="input" placeholder="New tag name" value={newTag} onChange={e => setNewTag(e.target.value)} required />
                                    <button type="submit" className="btn-primary"><Plus size={16} /> Add Tag</button>
                                </div>
                            </form>

                            <div className="tags-grid">
                                {tags.map(tag => (
                                    <span key={tag} className="tag-pill">{tag}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div className="settings-section">
                            <h2>General Preferences</h2>
                            <p className="section-desc">Application-wide settings.</p>
                            <div className="card">
                                <p style={{ color: 'var(--color-text-secondary)' }}>
                                    Data is automatically saved to your browser's localStorage.<br />
                                    All changes persist across sessions.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        .settings-page { display: flex; flex-direction: column; gap: 2rem; }
        .settings-layout { display: flex; gap: 2rem; align-items: flex-start; }
        .settings-sidebar { width: 200px; display: flex; flex-direction: column; gap: 0.5rem; }
        .tab-btn { padding: 0.75rem 1rem; text-align: left; border-radius: var(--radius-md); color: var(--color-text-secondary); font-weight: 500; transition: all 0.2s; }
        .tab-btn:hover { background-color: var(--color-surface-hover); color: var(--color-text-primary); }
        .tab-btn.active { background-color: var(--color-surface); color: var(--color-primary); font-weight: 600; }
        .settings-content { flex: 1; max-width: 800px; }
        .settings-section h2 { margin-bottom: 0.5rem; font-size: 1.25rem; }
        .section-desc { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
        .add-form { background-color: var(--color-surface); padding: 1.5rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 2rem; }
        .form-row { display: flex; gap: 0.5rem; align-items: center; }
        .input { background-color: var(--color-background); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: white; flex: 1; }
        .input:focus { outline: none; border-color: var(--color-primary); }
        .btn-primary { background-color: var(--color-primary); color: white; padding: 0.75rem 1rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; white-space: nowrap; }
        .list-container { display: flex; flex-direction: column; gap: 0.75rem; }
        .list-item { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; display: flex; justify-content: space-between; align-items: center; }
        .item-info { display: flex; align-items: baseline; gap: 1rem; }
        .item-code { font-weight: 700; color: var(--color-primary); min-width: 40px; }
        .item-label { font-weight: 500; }
        .item-desc { color: var(--color-text-secondary); font-size: 0.875rem; }
        .action-btn { color: #ef4444; opacity: 0.7; padding: 0.5rem; border-radius: var(--radius-sm); }
        .action-btn:hover { opacity: 1; background-color: rgba(239, 68, 68, 0.1); }
        .tags-grid { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .tag-pill { background-color: var(--color-surface); border: 1px solid var(--color-border); padding: 0.5rem 1rem; border-radius: 999px; font-size: 0.875rem; }
        .card { background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; }
      `}</style>
        </div>
    );
}
