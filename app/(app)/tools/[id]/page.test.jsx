import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import ToolPage from './page';

const mockPush = vi.hoisted(() => vi.fn());
const mockReplace = vi.hoisted(() => vi.fn());
const routeState = vi.hoisted(() => ({
  params: { id: '4' },
  searchParams: new URLSearchParams(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  useParams: () => routeState.params,
  useSearchParams: () => routeState.searchParams,
}));

vi.mock('@/context/AuthContext', () => ({
  useAuth: () => ({ profile: { id: 'user-1' } }),
}));

vi.mock('@/hooks', async () => {
  const actual = await vi.importActual('@/hooks');
  return {
    ...actual,
    useAuthGuard: () => ({ isAuthenticated: true, loading: false }),
    useTools: () => ({ markCompleted: vi.fn() }),
  };
});

vi.mock('@/components/composed', () => ({
  AppLayout: ({ children }) => <>{children}</>,
}));

vi.mock('@/components/composed/skeletons', () => ({
  RouteSkeleton: () => <div aria-busy="true" />,
}));

vi.mock('@/components/composed/tools/DurationSelector', () => ({
  DURATION_OPTIONS_BY_TYPE: {
    sigh: [{ id: 'quick', name: 'Quick Release', rounds: 3, time: '~30 sec' }],
  },
  default: ({ onBack }) => (
    <button type="button" onClick={onBack}>
      Duration back
    </button>
  ),
}));

vi.mock('@/components/composed/tools/BreathingPlayer', () => ({
  default: () => <div>Breathing player</div>,
}));

vi.mock('@/components/composed/tools/ComingSoon', () => ({
  default: ({ onBack }) => (
    <button type="button" onClick={onBack}>
      Coming soon back
    </button>
  ),
}));

vi.mock('@/components/composed/tools/TimerSetup', () => ({
  default: ({ onBack }) => (
    <button type="button" onClick={onBack}>
      Timer setup back
    </button>
  ),
}));

vi.mock('@/components/composed/tools/TimerPlayer', () => ({
  default: () => <div>Timer player</div>,
}));

vi.mock('@/components/composed/tools/LaunchSequence', () => ({
  default: () => <div>Launch sequence</div>,
}));

describe('ToolPage route context', () => {
  beforeEach(() => {
    mockPush.mockClear();
    mockReplace.mockClear();
    routeState.params = { id: '4' };
    routeState.searchParams = new URLSearchParams();
  });

  it('returns straight to the regulation toolkit when launched with a quick duration from regulation', () => {
    routeState.searchParams = new URLSearchParams('duration=quick&from=regulation');

    render(<ToolPage />);

    expect(screen.getByText('Breathing player')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('returns straight to dashboard when a quick calm practice was launched from calm', () => {
    routeState.searchParams = new URLSearchParams('duration=quick&from=calm');

    render(<ToolPage />);

    fireEvent.click(screen.getByRole('button', { name: /Go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/dashboard');
  });

  it('returns straight to the journal hub when a quick practice was launched post-log', () => {
    routeState.searchParams = new URLSearchParams('duration=quick&from=post-log');

    render(<ToolPage />);

    fireEvent.click(screen.getByRole('button', { name: /Go back/i }));

    expect(mockPush).toHaveBeenCalledWith('/journal');
  });

  it('returns duration setup to the regulation toolkit when no duration is active', () => {
    routeState.searchParams = new URLSearchParams('from=regulation');

    render(<ToolPage />);

    fireEvent.click(screen.getByRole('button', { name: /Duration back/i }));

    expect(mockPush).toHaveBeenCalledWith('/tools/regulation');
  });

  it('preserves source context when redirecting legacy regulation tool ids', () => {
    routeState.params = { id: '2' };
    routeState.searchParams = new URLSearchParams('from=regulation');

    render(<ToolPage />);

    expect(mockReplace).toHaveBeenCalledWith('/tools/regulation/body-scan?from=regulation');
  });
});
