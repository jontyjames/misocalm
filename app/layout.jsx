import './globals.css'
import { Josefin_Sans } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { PremiumProvider } from '@/context/PremiumContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300'],
  display: 'swap',
  variable: '--font-josefin',
})

export const metadata = {
  title: {
    default: 'MisoCalm - A Space for Living with Misophonia',
    template: '%s | MisoCalm',
  },
  description:
    'A companion app for understanding misophonia, regulating your nervous system, and finding steadier ground. Free breathwork, journaling, and calming tools.',
  keywords: [
    'misophonia',
    'misophonia app',
    'misophonia help',
    'sound sensitivity',
    'misophonia coping',
    'breathwork',
    'nervous system regulation',
    'calm',
    'misophonia support',
    'misophonia tools',
  ],
  authors: [{ name: 'Thriving With Misophonia' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MisoCalm',
  },
  openGraph: {
    title: 'MisoCalm - A Space for Living with Misophonia',
    description:
      'A companion app for understanding misophonia, regulating your nervous system, and finding steadier ground.',
    url: 'https://misocalm.app',
    siteName: 'MisoCalm',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MisoCalm - A Space for Living with Misophonia',
    description:
      'A companion app for understanding misophonia, regulating your nervous system, and finding steadier ground.',
  },
  metadataBase: new URL('https://misocalm.app'),
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={josefinSans.variable}>
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(() => {});
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
