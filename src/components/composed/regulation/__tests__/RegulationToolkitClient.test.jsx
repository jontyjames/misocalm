import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegulationToolkitClient from '../RegulationToolkitClient';
import { getRegulationPractice } from '@/lib/regulationToolkitData';

const mockPush = vi.hoisted(() => vi.fn());
const authGuardState = vi.hoisted(() => ({ isAuthenticated: true, loading: false }));
const favoritesState = vi.hoisted(() => ({
  favorites: [],
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock('@/components/composed', () => ({
  AppLayout: ({ children }) => <>{children}</>,
}));

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useAuthGuard: () => authGuardState,
    useRegulationToolkitFavorites: () => favoritesState,
    useReducedMotion: () => false,
    useTouchGlow: () => ({
      glowStyle: null,
      handlers: { onPointerDown: vi.fn(), onPointerUp: vi.fn() },
    }),
    useHaptic: () => ({ vibrate: vi.fn() }),
  };
});

describe('RegulationToolkitClient', () => {
  beforeEach(() => {
    mockPush.mockClear();
    favoritesState.favorites = [];
    favoritesState.isFavorite.mockReturnValue(false);
    favoritesState.toggleFavorite.mockClear();
    authGuardState.isAuthenticated = true;
    authGuardState.loading = false;
  });

  it('renders the prime-count start paths as the first toolkit choice', () => {
    render(<RegulationToolkitClient />);

    expect(screen.getByRole('heading', { name: 'Regulation Toolkit' })).toBeInTheDocument();
    expect(screen.getByText('Start Here')).toBeInTheDocument();
    expect(screen.getByText('Fast Reset')).toBeInTheDocument();
    expect(screen.getByText('Ground and Process')).toBeInTheDocument();
    expect(screen.getByText('Build Capacity')).toBeInTheDocument();
  });

  it('opens a start-here practice using the practice route', () => {
    render(<RegulationToolkitClient />);

    fireEvent.click(screen.getAllByRole('button', { name: /Physiological Sigh/i })[0]);

    expect(mockPush).toHaveBeenCalledWith('/tools/4?duration=quick&from=regulation');
  });

  it('shows saved practices without hiding the main pathways', () => {
    favoritesState.favorites = [getRegulationPractice('sound-support')];

    render(<RegulationToolkitClient />);

    expect(screen.getByText('My Toolkit')).toBeInTheDocument();
    expect(screen.getByText('Start Here')).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole('button', { name: /Sound Support/i })[0]);

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation/sound-support?from=regulation');
  });

  it('adds toolkit source context to existing experience routes', () => {
    render(<RegulationToolkitClient />);

    fireEvent.click(screen.getAllByRole('button', { name: /5-4-3-2-1 Grounding/i })[0]);

    expect(mockPush).toHaveBeenCalledWith('/tools/experiences/grounding?from=regulation');
  });

  it('uses the route skeleton while auth is resolving', () => {
    authGuardState.loading = true;

    const { container } = render(<RegulationToolkitClient />);

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Regulation Toolkit' })).not.toBeInTheDocument();
  });
});
