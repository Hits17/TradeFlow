import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { SettingsProvider, useSettings } from './SettingsContext';

// Helper component to test context
const TestComponent = () => {
    const { incoterms, addIncoterm, removeIncoterm } = useSettings();

    return (
        <div>
            <div data-testid="count">{incoterms.length}</div>
            <button onClick={() => addIncoterm({ code: 'TEST', label: 'Test Term' })}>
                Add Term
            </button>
            <button onClick={() => removeIncoterm('TEST')}>
                Remove Term
            </button>
        </div>
    );
};

describe('SettingsContext', () => {
    it('provides incoterms state and update functions', () => {
        render(
            <SettingsProvider>
                <TestComponent />
            </SettingsProvider>
        );

        // Initial count (from default mock data)
        // We expect some default items, so count should be > 0.
        // Let's just check the add/remove logic increases/decreases count.

        const countElement = screen.getByTestId('count');
        const initialCount = parseInt(countElement.textContent);

        // Add Item
        fireEvent.click(screen.getByText('Add Term'));
        expect(screen.getByTestId('count')).toHaveTextContent(String(initialCount + 1));

        // Remove Item
        fireEvent.click(screen.getByText('Remove Term'));
        expect(screen.getByTestId('count')).toHaveTextContent(String(initialCount));
    });
});
