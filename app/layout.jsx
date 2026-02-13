import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { PremiumProvider } from '@/context/PremiumContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata = {
  title: 'MisoCalm - Your Companion for Thriving with Misophonia',
  description: 'Track triggers, build coping skills, and find support on your misophonia journey.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MisoCalm',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@100;200;300&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className="bg-slate-950 text-white min-h-screen flex justify-center">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-indigo-600 focus:text-white focus:text-sm focus:font-light"
        >
          Skip to content
        </a>
        {/* Phone container - constrains to mobile dimensions */}
        <div className="w-full max-w-md min-h-screen relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-2xl">
          <QueryProvider>
            <AuthProvider>
              <PremiumProvider>
                <ErrorBoundary>
                  {children}
                </ErrorBoundary>
              </PremiumProvider>
            </AuthProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  )
}
