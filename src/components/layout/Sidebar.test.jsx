import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import Sidebar from './Sidebar';

describe('Sidebar Component', () => {
    it('renders navigation links correctly', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
        expect(screen.getByText('Register')).toBeInTheDocument();
        expect(screen.getByText('Inventory')).toBeInTheDocument();
        expect(screen.getByText('Settings')).toBeInTheDocument();
    });

    it('renders logo', () => {
        render(
            <BrowserRouter>
                <Sidebar />
            </BrowserRouter>
        );
        expect(screen.getByText('TradeFlow')).toBeInTheDocument();
    });
});
