import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TagToken from './TagToken';

describe('TagToken Component', () => {
    it('renders label correctly', () => {
        render(<TagToken label="urgent" />);
        expect(screen.getByText('urgent')).toBeInTheDocument();
    });

    it('renders delete button when onDelete is provided', () => {
        const mockDelete = vi.fn();
        render(<TagToken label="urgent" onDelete={mockDelete} />);

        const deleteBtn = screen.getByRole('button');
        expect(deleteBtn).toBeInTheDocument();

        fireEvent.click(deleteBtn);
        expect(mockDelete).toHaveBeenCalledWith('urgent');
    });

    it('does not render delete button when onDelete is missing', () => {
        render(<TagToken label="urgent" />);
        const deleteBtn = screen.queryByRole('button');
        expect(deleteBtn).not.toBeInTheDocument();
    });
});
