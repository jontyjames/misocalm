import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import RegulationPracticeClient from '../RegulationPracticeClient';

const mockPush = vi.hoisted(() => vi.fn());
const authGuardState = vi.hoisted(() => ({ isAuthenticated: true, loading: false }));
const searchParamsState = vi.hoisted(() => ({ value: new URLSearchParams() }));
const favoritesState = vi.hoisted(() => ({
  favorites: [],
  isFavorite: vi.fn(() => false),
  toggleFavorite: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => searchParamsState.value,
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

describe('RegulationPracticeClient', () => {
  beforeEach(() => {
    mockPush.mockClear();
    favoritesState.favorites = [];
    favoritesState.isFavorite.mockReturnValue(false);
    favoritesState.toggleFavorite.mockClear();
    authGuardState.isAuthenticated = true;
    authGuardState.loading = false;
    searchParamsState.value = new URLSearchParams();
  });

  it('moves a simple practice through its steps before completion', () => {
    render(<RegulationPracticeClient practiceId="physiological-sigh" />);

    expect(screen.getByRole('heading', { name: 'Physiological Sigh' })).toBeInTheDocument();
    expect(screen.getByText('Breathe in through your nose.')).toBeInTheDocument();
    expect(screen.queryByText('Practice complete')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByRole('button', { name: /Complete/i }));

    expect(screen.getByText('Practice complete')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Journal how you feel/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Return to sanctuary/i })).toBeInTheDocument();
  });

  it('saves the current practice to the user toolkit', () => {
    render(<RegulationPracticeClient practiceId="physiological-sigh" />);

    fireEvent.click(screen.getByRole('button', { name: /Save to my toolkit/i }));

    expect(favoritesState.toggleFavorite).toHaveBeenCalledWith('physiological-sigh');
  });

  it('keeps panel-led practices on their custom completion flow', () => {
    render(<RegulationPracticeClient practiceId="sound-support" />);

    expect(screen.getByRole('heading', { name: 'Sound Support' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^Next/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /I have a sound plan/i }));

    expect(screen.getByText('Practice complete')).toBeInTheDocument();
  });

  it('routes completion actions back into the app flow', () => {
    render(<RegulationPracticeClient practiceId="physiological-sigh" />);

    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByRole('button', { name: /Next/i }));
    fireEvent.click(screen.getByRole('button', { name: /Complete/i }));
    fireEvent.click(screen.getByRole('button', { name: /Journal how you feel/i }));
    fireEvent.click(screen.getByRole('button', { name: /Return to sanctuary/i }));

    expect(mockPush).toHaveBeenCalledWith('/journal/check-in?from=regulation');
    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('shows a safe return action for unknown practices', () => {
    render(<RegulationPracticeClient practiceId="missing-practice" />);

    fireEvent.click(screen.getByRole('button', { name: /Back to toolkit/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('respects source context for the top back action', () => {
    searchParamsState.value = new URLSearchParams('from=regulation');

    render(<RegulationPracticeClient practiceId="body-scan" />);

    fireEvent.click(screen.getByRole('button', { name: /^Toolkit$/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('labels the top return action for post-log context', () => {
    searchParamsState.value = new URLSearchParams('from=post-log');

    render(<RegulationPracticeClient practiceId="body-scan" />);

    fireEvent.click(screen.getByRole('button', { name: /^Journal$/i }));

    expect(mockPush).toHaveBeenCalledWith('/journal');
  });

  it('preserves source context for support routes opened inside a practice', () => {
    searchParamsState.value = new URLSearchParams('from=post-log');

    render(<RegulationPracticeClient practiceId="emergency-protocol" />);

    fireEvent.click(screen.getByRole('button', { name: /Fast breath/i }));
    fireEvent.click(screen.getByRole('button', { name: /Grounding/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/4?duration=quick&from=post-log');
    expect(mockPush).toHaveBeenCalledWith('/tools/experiences/grounding?from=post-log');
  });

  it('defaults support routes to regulation context from direct practice links', () => {
    render(<RegulationPracticeClient practiceId="emergency-protocol" />);

    fireEvent.click(screen.getByRole('button', { name: /Fast breath/i }));
    fireEvent.click(screen.getByRole('button', { name: /Grounding/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/4?duration=quick&from=regulation');
    expect(mockPush).toHaveBeenCalledWith('/tools/experiences/grounding?from=regulation');
  });

  it('keeps toolkit jumps clean when opened inside a practice', () => {
    searchParamsState.value = new URLSearchParams('from=dashboard');

    render(<RegulationPracticeClient practiceId="mimicry-bridge" />);

    const toolkitButtons = screen.getAllByRole('button', { name: /^Toolkit$/i });
    fireEvent.click(toolkitButtons[toolkitButtons.length - 1]);

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('shows planned audio status for guided practices', () => {
    render(<RegulationPracticeClient practiceId="body-scan" />);

    expect(screen.getAllByText('Body Scan guide')).toHaveLength(2);
    expect(screen.getByText('Placeholder ready')).toBeInTheDocument();
    expect(screen.getByText('Temporary guide voice')).toBeInTheDocument();
    expect(screen.getByText('Transcript structure is ready across 5 guided phases.')).toBeInTheDocument();
  });

  it('does not add audio slots to practices without planned audio', () => {
    render(<RegulationPracticeClient practiceId="emergency-protocol" />);

    expect(screen.queryByText(/audio slot/i)).not.toBeInTheDocument();
  });

  it('uses the route skeleton while auth is resolving', () => {
    authGuardState.loading = true;

    const { container } = render(<RegulationPracticeClient practiceId="physiological-sigh" />);

    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Physiological Sigh' })).not.toBeInTheDocument();
  });
});
