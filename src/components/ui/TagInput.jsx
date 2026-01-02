import { useState } from 'react';
import { Tag } from 'lucide-react';
import TagToken from './TagToken';

export default function TagInput({ tags, onChange }) {
    const [inputValue, setInputValue] = useState('');

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const newTag = inputValue.trim();
            if (newTag && !tags.includes(newTag)) {
                onChange([...tags, newTag]);
                setInputValue('');
            }
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            onChange(tags.slice(0, -1));
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div className="tag-input-container">
            <div className="tags-wrapper">
                <Tag size={16} className="tag-icon" />
                {tags.map(tag => (
                    <TagToken key={tag} label={tag} onDelete={removeTag} />
                ))}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={tags.length === 0 ? "Add tags..." : ""}
                    className="tag-input-field"
                />
            </div>

            <style>{`
        .tag-input-container {
          background-color: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          padding: 0.5rem;
          transition: border-color 0.2s;
        }

        .tag-input-container:focus-within {
          border-color: var(--color-primary);
        }

        .tags-wrapper {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }
        
        .tag-icon {
            color: var(--color-text-secondary);
            margin-right: 0.25rem;
        }

        .tag-input-field {
          background: none;
          border: none;
          color: var(--color-text-primary);
          flex: 1;
          min-width: 80px;
          padding: 0.25rem;
          font-size: 0.875rem;
        }

        .tag-input-field:focus {
          outline: none;
        }
      `}</style>
        </div>
    );
}
