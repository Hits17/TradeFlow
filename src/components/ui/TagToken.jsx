export default function TagToken({ label, onDelete }) {
    // Deterministic color generation based on label string
    const hashCode = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    };

    const getPastelColor = (str) => {
        const hash = hashCode(str);
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 85%)`;
    };

    const getDarkerColor = (str) => {
        const hash = hashCode(str);
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 80%, 25%)`;
    }

    const bg = getPastelColor(label);
    const fg = getDarkerColor(label);

    return (
        <span className="tag-token" style={{ backgroundColor: bg, color: fg }}>
            {label}
            {onDelete && (
                <button onClick={() => onDelete(label)} className="tag-delete-btn">
                    ×
                </button>
            )}

            <style>{`
        .tag-token {
          display: inline-flex;
          align-items: center;
          padding: 2px 8px;
          border-radius: 999px;
          font-size: 0.75rem;
          font-weight: 600;
          line-height: 1.2;
          gap: 4px;
          user-select: none;
        }
        
        .tag-delete-btn {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 14px;
            color: currentColor;
            opacity: 0.6;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 14px;
            height: 14px;
            border-radius: 50%;
        }
        
        .tag-delete-btn:hover {
            opacity: 1;
            background-color: rgba(0,0,0,0.1);
        }
      `}</style>
        </span>
    );
}
