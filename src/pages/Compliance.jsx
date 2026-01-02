import { useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, Search, AlertCircle, Globe, Users } from 'lucide-react';
import { screenParty, sanctionsSources, restrictedCountries } from '../data/sanctionsList';
import { useApp } from '../context/SettingsContext';

export default function Compliance() {
    const { orders } = useApp();
    const [searchName, setSearchName] = useState('');
    const [screeningResults, setScreeningResults] = useState(null);
    const [isSearching, setIsSearching] = useState(false);

    const handleScreen = (e) => {
        e.preventDefault();
        if (!searchName.trim()) return;

        setIsSearching(true);
        // Simulate API delay
        setTimeout(() => {
            const results = screenParty(searchName);
            setScreeningResults(results);
            setIsSearching(false);
        }, 500);
    };

    // Calculate compliance stats from orders
    const ordersWithRisk = orders.filter(o => {
        const countryRisk = restrictedCountries.find(c =>
            o.origin?.includes(c.name) || o.destination?.includes(c.name)
        );
        return countryRisk;
    });

    const complianceScore = Math.round(((orders.length - ordersWithRisk.length) / Math.max(orders.length, 1)) * 100);

    return (
        <div className="compliance-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Compliance Center</h1>
                    <p className="page-subtitle">Denied party screening and regulatory compliance</p>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon green"><Shield size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-label">Compliance Score</span>
                        <span className={`stat-value ${complianceScore >= 90 ? 'green' : complianceScore >= 70 ? 'yellow' : 'red'}`}>
                            {complianceScore}%
                        </span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon blue"><Users size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-label">Total Parties Screened</span>
                        <span className="stat-value">{orders.length * 2}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon yellow"><AlertTriangle size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-label">Orders with Risk Flags</span>
                        <span className="stat-value">{ordersWithRisk.length}</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon purple"><Globe size={24} /></div>
                    <div className="stat-content">
                        <span className="stat-label">Restricted Countries</span>
                        <span className="stat-value">{restrictedCountries.length}</span>
                    </div>
                </div>
            </div>

            <div className="screening-section">
                <div className="screening-card">
                    <h2><Search size={20} /> Denied Party Screening</h2>
                    <p>Check individuals and entities against global sanctions lists</p>

                    <form onSubmit={handleScreen} className="screening-form">
                        <input
                            type="text"
                            placeholder="Enter name to screen (e.g., company or individual name)"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                            className="screening-input"
                        />
                        <button type="submit" className="btn-primary" disabled={isSearching}>
                            {isSearching ? 'Screening...' : 'Screen Party'}
                        </button>
                    </form>

                    {screeningResults !== null && (
                        <div className="screening-results">
                            {screeningResults.length === 0 ? (
                                <div className="result-clear">
                                    <CheckCircle size={48} />
                                    <h3>No Matches Found</h3>
                                    <p>"{searchName}" did not match any entries in our sanctions databases.</p>
                                </div>
                            ) : (
                                <div className="result-matches">
                                    <div className="result-header danger">
                                        <AlertCircle size={20} />
                                        <span>{screeningResults.length} Potential Match{screeningResults.length > 1 ? 'es' : ''} Found</span>
                                    </div>
                                    <div className="matches-list">
                                        {screeningResults.map((match, i) => (
                                            <div key={i} className="match-item">
                                                <div className="match-header">
                                                    <span className="match-name">{match.name}</span>
                                                    <span className={`confidence-badge ${match.confidence >= 75 ? 'high' : match.confidence >= 50 ? 'medium' : 'low'}`}>
                                                        {match.confidence}% Match
                                                    </span>
                                                </div>
                                                <div className="match-details">
                                                    <span><strong>Type:</strong> {match.type}</span>
                                                    <span><strong>Country:</strong> {match.country || 'N/A'}</span>
                                                    <span><strong>Source:</strong> {match.source}</span>
                                                    <span><strong>Programs:</strong> {match.programs.join(', ')}</span>
                                                    <span><strong>Added:</strong> {match.addedDate}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="info-cards">
                    <div className="info-card">
                        <h3>Sanctions Sources</h3>
                        <div className="sources-list">
                            {sanctionsSources.map(source => (
                                <div key={source.id} className="source-item">
                                    <span className="source-name">{source.name}</span>
                                    <span className="source-country">{source.country}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="info-card">
                        <h3>Restricted Countries</h3>
                        <div className="countries-list">
                            {restrictedCountries.map(country => (
                                <div key={country.code} className="country-item">
                                    <span className="country-name">{country.name}</span>
                                    <span className={`embargo-level ${country.level.toLowerCase().replace('_', '-')}`}>
                                        {country.level.replace('_', ' ')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
        .compliance-page { display: flex; flex-direction: column; gap: 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem; }
        .stat-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; gap: 1rem; align-items: center; }
        .stat-icon { width: 48px; height: 48px; border-radius: var(--radius-md); display: flex; align-items: center; justify-content: center; }
        .stat-icon.green { background: rgba(16, 185, 129, 0.15); color: #10b981; }
        .stat-icon.blue { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .stat-icon.yellow { background: rgba(234, 179, 8, 0.15); color: #eab308; }
        .stat-icon.purple { background: rgba(139, 92, 246, 0.15); color: #8b5cf6; }
        .stat-label { font-size: 0.875rem; color: var(--color-text-secondary); display: block; }
        .stat-value { font-size: 1.75rem; font-weight: 700; }
        .stat-value.green { color: #10b981; }
        .stat-value.yellow { color: #eab308; }
        .stat-value.red { color: #ef4444; }
        
        .screening-section { display: grid; grid-template-columns: 2fr 1fr; gap: 1.5rem; }
        .screening-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 2rem; }
        .screening-card h2 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .screening-card > p { color: var(--color-text-secondary); margin-bottom: 1.5rem; }
        .screening-form { display: flex; gap: 0.75rem; }
        .screening-input { flex: 1; background: var(--color-background); border: 1px solid var(--color-border); padding: 0.875rem 1rem; border-radius: var(--radius-md); color: var(--color-text-primary); font-size: 1rem; }
        .screening-input:focus { outline: none; border-color: var(--color-primary); }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.875rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; white-space: nowrap; }
        .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .screening-results { margin-top: 2rem; }
        .result-clear { text-align: center; padding: 3rem; background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.3); border-radius: var(--radius-md); color: #10b981; }
        .result-clear h3 { margin-top: 1rem; margin-bottom: 0.5rem; }
        .result-clear p { color: var(--color-text-secondary); }
        
        .result-matches { }
        .result-header { display: flex; align-items: center; gap: 0.5rem; padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; }
        .result-header.danger { background: rgba(239, 68, 68, 0.15); color: #ef4444; font-weight: 600; }
        .matches-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .match-item { background: var(--color-background); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; }
        .match-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
        .match-name { font-weight: 600; font-size: 1rem; }
        .confidence-badge { padding: 0.25rem 0.75rem; border-radius: 999px; font-size: 0.75rem; font-weight: 600; }
        .confidence-badge.high { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .confidence-badge.medium { background: rgba(249, 115, 22, 0.15); color: #f97316; }
        .confidence-badge.low { background: rgba(234, 179, 8, 0.15); color: #eab308; }
        .match-details { display: flex; flex-wrap: wrap; gap: 1rem; font-size: 0.875rem; color: var(--color-text-secondary); }
        
        .info-cards { display: flex; flex-direction: column; gap: 1rem; }
        .info-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; }
        .info-card h3 { font-size: 1rem; margin-bottom: 1rem; color: var(--color-text-secondary); }
        .sources-list, .countries-list { display: flex; flex-direction: column; gap: 0.5rem; }
        .source-item, .country-item { display: flex; justify-content: space-between; align-items: center; padding: 0.5rem 0; border-bottom: 1px solid var(--color-border); }
        .source-item:last-child, .country-item:last-child { border-bottom: none; }
        .source-country { background: var(--color-background); padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.75rem; }
        .embargo-level { padding: 0.125rem 0.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
        .embargo-level.full-embargo { background: rgba(239, 68, 68, 0.15); color: #ef4444; }
        .embargo-level.partial { background: rgba(234, 179, 8, 0.15); color: #eab308; }
      `}</style>
        </div>
    );
}
