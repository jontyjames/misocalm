import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { QueryProvider } from '@/providers/QueryProvider'

export const metadata = {
  title: 'MisoMind - Your Companion for Thriving with Misophonia',
  description: 'Track triggers, build coping skills, and find support on your misophonia journey.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'MisoMind',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icons/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
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
        {/* Phone container - constrains to mobile dimensions */}
        <div className="w-full max-w-md min-h-screen relative bg-gradient-to-b from-[#0f172a] via-[#1e293b] to-[#0f172a] shadow-2xl">
          <QueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </QueryProvider>
        </div>
      </body>
    </html>
  )
}
