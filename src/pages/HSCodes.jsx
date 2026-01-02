import { useState, useMemo } from 'react';
import { Search, Calculator, Book, DollarSign } from 'lucide-react';
import { hsCodes, hsChapters, searchHSCodes, calculateDuty } from '../data/hsCodes';

export default function HSCodes() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [calculatorOpen, setCalculatorOpen] = useState(false);
    const [calcData, setCalcData] = useState({ hsCode: '', value: '', country: 'US' });
    const [dutyResult, setDutyResult] = useState(null);

    const filteredCodes = useMemo(() => {
        let results = hsCodes;

        if (selectedChapter) {
            results = results.filter(hs => hs.chapter === selectedChapter);
        }

        if (searchQuery) {
            results = searchHSCodes(searchQuery);
            if (selectedChapter) {
                results = results.filter(hs => hs.chapter === selectedChapter);
            }
        }

        return results;
    }, [searchQuery, selectedChapter]);

    const handleCalculate = (e) => {
        e.preventDefault();
        const result = calculateDuty(calcData.hsCode, Number(calcData.value), calcData.country);
        setDutyResult(result);
    };

    const selectCodeForCalc = (code) => {
        setCalcData({ ...calcData, hsCode: code });
        setCalculatorOpen(true);
    };

    return (
        <div className="hscodes-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">HS Code Database</h1>
                    <p className="page-subtitle">Search harmonized tariff codes and calculate duties</p>
                </div>
                <button className="btn-primary" onClick={() => setCalculatorOpen(!calculatorOpen)}>
                    <Calculator size={18} /> Duty Calculator
                </button>
            </div>

            {calculatorOpen && (
                <div className="calculator-card">
                    <h2><DollarSign size={20} /> Import Duty Calculator</h2>
                    <form onSubmit={handleCalculate} className="calc-form">
                        <div className="calc-row">
                            <div className="calc-group">
                                <label>HS Code</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 8517.12.00"
                                    value={calcData.hsCode}
                                    onChange={e => setCalcData({ ...calcData, hsCode: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="calc-group">
                                <label>Goods Value (USD)</label>
                                <input
                                    type="number"
                                    placeholder="10000"
                                    value={calcData.value}
                                    onChange={e => setCalcData({ ...calcData, value: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="calc-group">
                                <label>Destination</label>
                                <select value={calcData.country} onChange={e => setCalcData({ ...calcData, country: e.target.value })}>
                                    <option value="US">United States</option>
                                    <option value="EU">European Union</option>
                                    <option value="CN">China</option>
                                </select>
                            </div>
                            <button type="submit" className="btn-calc">Calculate</button>
                        </div>
                    </form>

                    {dutyResult && (
                        <div className="calc-result">
                            <div className="result-row">
                                <span>HS Code:</span>
                                <strong>{dutyResult.hsCode}</strong>
                            </div>
                            <div className="result-row">
                                <span>Description:</span>
                                <strong>{dutyResult.description}</strong>
                            </div>
                            <div className="result-row">
                                <span>Duty Rate:</span>
                                <strong>{dutyResult.rate}%</strong>
                            </div>
                            <div className="result-row">
                                <span>Goods Value:</span>
                                <strong>${Number(calcData.value).toLocaleString()}</strong>
                            </div>
                            <div className="result-row highlight">
                                <span>Duty Amount:</span>
                                <strong>${dutyResult.dutyAmount.toLocaleString()}</strong>
                            </div>
                            <div className="result-row total">
                                <span>Total with Duty:</span>
                                <strong>${dutyResult.totalWithDuty.toLocaleString()}</strong>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="search-section">
                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search by HS code or description..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>
                <select
                    className="chapter-filter"
                    value={selectedChapter}
                    onChange={e => setSelectedChapter(e.target.value)}
                >
                    <option value="">All Chapters</option>
                    {hsChapters.map(ch => (
                        <option key={ch.chapter} value={ch.chapter}>
                            Ch. {ch.chapter}: {ch.title}
                        </option>
                    ))}
                </select>
            </div>

            <div className="codes-table-container">
                <table className="codes-table">
                    <thead>
                        <tr>
                            <th>HS Code</th>
                            <th>Description</th>
                            <th>US Duty</th>
                            <th>EU Duty</th>
                            <th>China Duty</th>
                            <th>Unit</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCodes.length === 0 ? (
                            <tr><td colSpan="7" className="empty">No HS codes found matching your search.</td></tr>
                        ) : (
                            filteredCodes.map(hs => (
                                <tr key={hs.code}>
                                    <td className="code-cell">{hs.code}</td>
                                    <td>{hs.description}</td>
                                    <td className={hs.dutyUS === 0 ? 'free' : ''}>{hs.dutyUS === 0 ? 'Free' : `${hs.dutyUS}%`}</td>
                                    <td className={hs.dutyEU === 0 ? 'free' : ''}>{hs.dutyEU === 0 ? 'Free' : `${hs.dutyEU}%`}</td>
                                    <td className={hs.dutyChina === 0 ? 'free' : ''}>{hs.dutyChina === 0 ? 'Free' : `${hs.dutyChina}%`}</td>
                                    <td>{hs.unit}</td>
                                    <td>
                                        <button className="calc-btn" onClick={() => selectCodeForCalc(hs.code)}>
                                            <Calculator size={14} /> Calc
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="info-section">
                <div className="info-card">
                    <Book size={20} />
                    <div>
                        <h3>About HS Codes</h3>
                        <p>The Harmonized System (HS) is an international nomenclature for the classification of products. It allows participating countries to classify traded goods on a common basis for customs purposes.</p>
                    </div>
                </div>
            </div>

            <style>{`
        .hscodes-page { display: flex; flex-direction: column; gap: 1.5rem; }
        .page-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .btn-primary { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; display: flex; align-items: center; gap: 0.5rem; }
        
        .calculator-card { background: linear-gradient(135deg, var(--color-surface), var(--color-background)); border: 1px solid var(--color-primary); border-radius: var(--radius-md); padding: 1.5rem; }
        .calculator-card h2 { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem; color: var(--color-primary); }
        .calc-form { margin-bottom: 1rem; }
        .calc-row { display: flex; gap: 1rem; align-items: flex-end; }
        .calc-group { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .calc-group label { font-size: 0.875rem; color: var(--color-text-secondary); }
        .calc-group input, .calc-group select { background: var(--color-background); border: 1px solid var(--color-border); padding: 0.75rem; border-radius: var(--radius-md); color: var(--color-text-primary); }
        .calc-group input:focus, .calc-group select:focus { outline: none; border-color: var(--color-primary); }
        .btn-calc { background: var(--color-primary); color: white; padding: 0.75rem 1.5rem; border-radius: var(--radius-md); font-weight: 600; }
        
        .calc-result { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1rem; display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.75rem; }
        .result-row { display: flex; justify-content: space-between; padding: 0.5rem; background: var(--color-background); border-radius: var(--radius-sm); }
        .result-row.highlight { background: rgba(234, 179, 8, 0.15); }
        .result-row.highlight strong { color: #eab308; }
        .result-row.total { background: rgba(16, 185, 129, 0.15); grid-column: span 3; }
        .result-row.total strong { color: #10b981; font-size: 1.25rem; }
        
        .search-section { display: flex; gap: 1rem; }
        .search-bar { flex: 1; position: relative; }
        .search-bar input { width: 100%; background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem 1rem 0.75rem 2.5rem; border-radius: var(--radius-md); color: var(--color-text-primary); font-size: 1rem; }
        .search-bar input:focus { outline: none; border-color: var(--color-primary); }
        .search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: var(--color-text-muted); }
        .chapter-filter { background: var(--color-surface); border: 1px solid var(--color-border); padding: 0.75rem 1rem; border-radius: var(--radius-md); color: var(--color-text-primary); min-width: 250px; }
        
        .codes-table-container { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; }
        .codes-table { width: 100%; border-collapse: collapse; }
        .codes-table th { text-align: left; padding: 0.75rem 1rem; color: var(--color-text-secondary); font-weight: 500; background: rgba(255,255,255,0.02); border-bottom: 1px solid var(--color-border); }
        .codes-table td { padding: 0.875rem 1rem; border-bottom: 1px solid var(--color-border); }
        .codes-table tr:hover td { background: var(--color-surface-hover); }
        .code-cell { font-family: monospace; color: var(--color-primary); font-weight: 600; }
        .free { color: #10b981; }
        .empty { text-align: center; padding: 3rem !important; color: var(--color-text-secondary); }
        .calc-btn { background: var(--color-background); border: 1px solid var(--color-border); padding: 0.375rem 0.75rem; border-radius: var(--radius-sm); color: var(--color-text-secondary); font-size: 0.75rem; display: flex; align-items: center; gap: 0.25rem; }
        .calc-btn:hover { border-color: var(--color-primary); color: var(--color-primary); }
        
        .info-section { margin-top: 1rem; }
        .info-card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 1.5rem; display: flex; gap: 1rem; align-items: flex-start; }
        .info-card h3 { margin-bottom: 0.5rem; }
        .info-card p { color: var(--color-text-secondary); font-size: 0.875rem; line-height: 1.6; }
      `}</style>
        </div>
    );
}
