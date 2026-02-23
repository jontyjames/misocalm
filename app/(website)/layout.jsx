/**
 * Website Layout
 * Full-width layout with starfield, header, and footer.
 * Used for public SEO pages: /learn, /about.
 */

'use client';

import { Starfield } from '@/components/composed';
import WebsiteHeader from '@/components/composed/WebsiteHeader';
import WebsiteFooter from '@/components/composed/WebsiteFooter';
import { ErrorBoundary } from '@/components/ErrorBoundary';

export default function WebsiteLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-void-black relative overflow-hidden flex flex-col">
      <Starfield />

      <WebsiteHeader />

      <main className="flex-1 relative z-10">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>

      <div className="relative z-10">
        <WebsiteFooter />
      </div>
    </div>
  );
}
