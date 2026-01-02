import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OrderTable from './OrderTable';

describe('OrderTable Component', () => {
    const mockOrders = [
        {
            id: 'ORD-TEST-1',
            reference: 'REF-001',
            type: 'IMPORT',
            partner: 'Test Partner',
            incoterm: 'FOB',
            status: 'PENDING',
            date: '2024-01-01',
            value: 1000,
            currency: 'USD',
            tags: ['test-tag']
        }
    ];

    it('renders order data correctly', () => {
        render(<OrderTable orders={mockOrders} />);

        expect(screen.getByText('ORD-TEST-1')).toBeInTheDocument();
        expect(screen.getByText('Test Partner')).toBeInTheDocument();
        expect(screen.getByText('FOB')).toBeInTheDocument();
        expect(screen.getByText('Pending')).toBeInTheDocument();
    });

    it('renders tags', () => {
        render(<OrderTable orders={mockOrders} />);
        expect(screen.getByText('test-tag')).toBeInTheDocument();
    });
});
