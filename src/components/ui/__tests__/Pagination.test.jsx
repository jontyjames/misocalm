import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { LoadMoreButton } from '../Pagination';

describe('LoadMoreButton', () => {
  it('uses calm loading language and polite status updates', () => {
    render(<LoadMoreButton loading hasMore onLoadMore={vi.fn()} />);

    const button = screen.getByRole('button', { name: /Bringing more in/i });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-live', 'polite');
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
  });

  it('calls the load more handler when ready', () => {
    const onLoadMore = vi.fn();
    render(<LoadMoreButton hasMore onLoadMore={onLoadMore} />);

    fireEvent.click(screen.getByRole('button', { name: /Load more/i }));

    expect(onLoadMore).toHaveBeenCalledOnce();
  });
});
