import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button';

// Mock the hooks Button depends on
vi.mock('@/hooks/useTouchGlow', () => ({
  default: () => ({
    glowStyle: null,
    handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
  }),
}));

vi.mock('@/hooks/useHaptic', () => ({
  default: () => ({ vibrate: vi.fn() }),
}));

vi.mock('@/hooks/useReducedMotion', () => ({
  default: () => false,
}));

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('is disabled when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows aria-busy when loading', () => {
    render(<Button loading>Loading</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('does not have aria-busy when not loading', () => {
    render(<Button>Normal</Button>);
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-busy');
  });

  it('renders spinner with aria-hidden when loading', () => {
    const { container } = render(<Button loading>Loading</Button>);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});
