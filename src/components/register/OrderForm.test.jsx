import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import OrderForm from './OrderForm';
import { SettingsProvider } from '../../context/SettingsContext';

// Wrap in provider
const renderWithProviders = (ui) => {
    return render(
        <SettingsProvider>
            {ui}
        </SettingsProvider>
    );
};

describe('OrderForm Editing', () => {
    const mockInitialData = {
        id: '1',
        reference: 'REF-EDIT-TEST',
        type: 'Export',
        partner: 'Test Shipper Ltd',
        incoterm: 'CIF',
        tags: ['urgent'],
        value: 5000
    };

    it('populates fields with initial data', () => {
        const onClose = vi.fn();
        renderWithProviders(<OrderForm onClose={onClose} initialData={mockInitialData} />);

        // Check header
        expect(screen.getByText('Edit Order')).toBeInTheDocument();

        // Check fields
        expect(screen.getByDisplayValue('REF-EDIT-TEST')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Shipper Ltd')).toBeInTheDocument();

        // Check Incoterm - Use getAllByText to handle duplicate label/desc occurrences
        const termElements = screen.getAllByText(/Cost, Insurance and Freight/);
        expect(termElements.length).toBeGreaterThan(0);
    });

    it('renders "Update Order" button when editing', () => {
        const onClose = vi.fn();
        renderWithProviders(<OrderForm onClose={onClose} initialData={mockInitialData} />);

        expect(screen.getByText('Update Order')).toBeInTheDocument();
    });

    it('renders "Create Order" button when creating new', () => {
        const onClose = vi.fn();
        renderWithProviders(<OrderForm onClose={onClose} />);

        expect(screen.getByText('Create Order')).toBeInTheDocument();
    });
});
