export const mockRouter = {
  push: vi.fn(),
  replace: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
  refresh: vi.fn(),
};

export const mockPathname = '/dashboard';
export const mockSearchParams = new URLSearchParams();

vi.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useSelectedLayoutSegment: () => null,
}));
