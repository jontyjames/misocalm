/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Background colors
        'void-black': '#030712',
        'deep-space': '#0f172a',
        // Accent colors
        'indigo-400': '#818cf8',
        'cyan-400': '#22d3ee',
        'purple-400': '#a78bfa',
        'pink-400': '#f472b6',
        // Semantic colors
        'emerald-400': '#34d399',
        'amber-400': '#fbbf24',
        'rose-400': '#fb7185',
      },
      animation: {
        'spin-slow': 'spin 8s linear infinite',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
      },
      keyframes: {
        twinkle: {
          '0%, 100%': { opacity: '0.1' },
          '50%': { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
}
