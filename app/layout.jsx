import './globals.css'
import { Josefin_Sans, JetBrains_Mono } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import { PremiumProvider } from '@/context/PremiumContext'
import { QueryProvider } from '@/providers/QueryProvider'
import { NavProvider } from '@/context/NavContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import AnalyticsTracker from '@/components/AnalyticsTracker'

const josefinSans = Josefin_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300'],
  display: 'swap',
  variable: '--font-josefin',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300'],
  display: 'swap',
  variable: '--font-mono',
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
    title: 'MisoCalm - Free Calming Tools for Living with Misophonia',
    description:
      'A free companion app for understanding misophonia, regulating your nervous system, and finding steadier ground. Breathwork, journaling, and calming tools.',
    url: 'https://misocalm.app',
    siteName: 'MisoCalm',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MisoCalm - A Space for Living with Misophonia',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MisoCalm - Free Calming Tools for Living with Misophonia',
    description:
      'A free companion app for understanding misophonia, regulating your nervous system, and finding steadier ground. Breathwork, journaling, and calming tools.',
    images: ['/og-image.png'],
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
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#0f172a',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'MisoCalm',
              description:
                'A companion app for understanding misophonia, regulating your nervous system, and finding steadier ground. Free breathwork, journaling, and calming tools.',
              url: 'https://misocalm.app',
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              creator: {
                '@type': 'Organization',
                name: 'MisoCalm',
              },
            }),
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(!sessionStorage.getItem('misocalm_welcome_shown'))document.documentElement.dataset.welcome=''}catch(e){}`,
          }}
        />
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
        <QueryProvider>
          <AuthProvider>
            <PremiumProvider>
              <NavProvider>
                <ErrorBoundary>
                  <AnalyticsTracker />
                  <main id="main-content" className="w-full">
                    {children}
                  </main>
                </ErrorBoundary>
              </NavProvider>
            </PremiumProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
