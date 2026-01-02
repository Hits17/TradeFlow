import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Header from './Header';

describe('Header Interaction', () => {
    it('toggles notification dropdown on click', () => {
        render(<Header />);

        // Dropdown should be initially hidden
        expect(screen.queryByText('Notifications')).not.toBeInTheDocument();

        // Click Bell
        const bellBtn = screen.getAllByRole('button')[0]; // First button is usually Search-related or Bell, seeing code Bell is first action button
        // Actually bell has badge "2"
        const bell = screen.getByText('2').parentElement;

        fireEvent.click(bell);

        // Dropdown should appear
        expect(screen.getByText('Notifications')).toBeInTheDocument();
        expect(screen.getByText('Mark all read')).toBeInTheDocument();
    });

    it('toggles profile dropdown on click', () => {
        render(<Header />);

        // Click Profile (Admin User)
        const profile = screen.getByText('Admin User').parentElement;
        fireEvent.click(profile);

        // Menu should appear
        expect(screen.getByText('My Account')).toBeInTheDocument();
        expect(screen.getByText('Logout')).toBeInTheDocument();
    });
});
