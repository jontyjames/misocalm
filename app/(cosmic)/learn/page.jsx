/**
 * /learn - Hub page for educational content.
 * Public SEO page listing all articles about misophonia.
 */

import Link from 'next/link';

export const metadata = {
  title: 'Learn About Misophonia',
  description:
    'Articles, guides, and research-backed resources for understanding misophonia and sound sensitivity. Written with care by someone who lives with it.',
  keywords: [
    'misophonia',
    'misophonia help',
    'misophonia information',
    'sound sensitivity',
    'misophonia resources',
    'misophonia guide',
    'misophonia parents',
    'misophonia breathing',
    'misophonia at work',
    'misophonia facts',
    'what is misophonia',
  ],
  openGraph: {
    title: 'Learn About Misophonia | MisoCalm',
    description:
      'Articles, guides, and research-backed resources for understanding and living with sound sensitivity.',
    type: 'website',
    url: 'https://misocalm.app/learn',
  },
};

const articles = [
  {
    slug: 'understanding-misophonia',
    title: 'What I Wish People Understood About Misophonia',
    description:
      'The invisible weight of living with sound sensitivity, and what it really feels like from the inside.',
    readingTime: '4 min',
  },
  {
    slug: 'breathing-techniques',
    title: '5 Breathing Techniques That Actually Help With Sound Sensitivity',
    description:
      'Research-backed breathing practices that calm your nervous system when triggers hit.',
    readingTime: '6 min',
  },
  {
    slug: 'fight-or-flight',
    title: "Why Your Fight-or-Flight Response Isn't Broken",
    description:
      'Understanding the neuroscience behind misophonia, and why sensitivity is not a defect.',
    readingTime: '5 min',
  },
  {
    slug: 'misophonia-at-work',
    title: 'The Invisible Weight of Misophonia at Work',
    description:
      'Navigating open-plan offices, meetings, and desk lunches when your nervous system won\'t filter sounds.',
    readingTime: '5 min',
  },
  {
    slug: 'misophonia-facts',
    title: "13 Things About Misophonia Most People Don't Know",
    description:
      'Research-backed facts that change how you understand sound sensitivity.',
    readingTime: '5 min',
  },
  {
    slug: 'what-to-say',
    title: '7 Things to Say (and Not Say) to Someone With Misophonia',
    description:
      'A guide for partners, parents, friends, and anyone who wants to be supportive.',
    readingTime: '4 min',
  },
  {
    slug: 'parents-guide',
    title: "Understanding Your Child's Misophonia",
    description:
      'A comprehensive, compassionate guide for parents who want to help their child navigate sound sensitivity.',
    readingTime: '15 min',
  },
];

function ArticleCard({ slug, title, description, readingTime, delay }) {
  return (
    <Link
      href={`/learn/${slug}`}
      className="block group"
      style={{
        opacity: 0,
        animation: `fadeInUp 610ms ease-out ${delay}ms forwards`,
      }}
    >
      <div
        className="relative rounded-xl p-6 overflow-hidden border border-white/[0.12] hover:border-white/[0.22] transition-all duration-[233ms]"
        style={{
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 30%, rgba(99,102,241,0.04) 100%)',
        }}
      >
        <div
          className="absolute inset-x-0 top-0 h-[1px] pointer-events-none"
          style={{
            background:
              'linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.15) 50%, transparent 90%)',
          }}
        />
        <div className="relative">
          <h2
            className="text-lg text-white mb-2 group-hover:text-indigo-200 transition-colors duration-[233ms]"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            {title}
          </h2>
          <p className="text-sm text-slate-300 font-light leading-relaxed mb-3">
            {description}
          </p>
          <span className="text-xs text-slate-400 font-light">
            {readingTime} read
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function LearnPage() {
  return (
    <main className="min-h-screen flex flex-col items-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-2xl">
        {/* Hero */}
        <section
          className="text-center mb-16"
          style={{ animation: 'fadeIn 987ms ease-out' }}
        >
          <h1
            className="text-3xl sm:text-4xl text-white mb-4 leading-tight"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
              letterSpacing: '0.06em',
            }}
          >
            Learn
          </h1>
          <p
            className="text-lg text-slate-300 font-light leading-relaxed max-w-md mx-auto"
            style={{
              fontFamily: "'Josefin Sans', sans-serif",
              fontWeight: 200,
            }}
          >
            Understanding misophonia is the first step toward living well with
            it. These articles are written with care, backed by research, and
            rooted in lived experience.
          </p>
        </section>

        {/* Article list */}
        <section className="space-y-4">
          {articles.map((article, i) => (
            <ArticleCard
              key={article.slug}
              {...article}
              delay={144 + i * 89}
            />
          ))}
        </section>

        {/* Footer */}
        <footer
          className="mt-16 text-center"
          style={{ animation: 'fadeIn 987ms ease-out 987ms both' }}
        >
          <p className="text-sm text-slate-400 font-light">
            Written by Jonty, founder of MisoCalm.
            <br />
            All content is free to read and share.
          </p>
        </footer>
      </div>
    </main>
  );
}
