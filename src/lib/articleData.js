/**
 * Article metadata — single source of truth for /learn hub,
 * ArticleLayout related articles, and footer links.
 */

export const articles = [
  {
    slug: 'understanding-misophonia',
    title: 'What I Wish People Understood About Misophonia',
    description:
      'The invisible weight of living with sound sensitivity, and what it really feels like from the inside.',
    readingTime: '4 min',
    related: ['breathing-techniques', 'fight-or-flight'],
  },
  {
    slug: 'breathing-techniques',
    title: '5 Breathing Techniques That Actually Help With Sound Sensitivity',
    description:
      'Research-backed breathing practices that calm your nervous system when triggers hit.',
    readingTime: '6 min',
    related: ['fight-or-flight', 'understanding-misophonia'],
  },
  {
    slug: 'fight-or-flight',
    title: "Why Your Fight-or-Flight Response Isn't Broken",
    description:
      'Understanding the neuroscience behind misophonia, and why sensitivity is not a defect.',
    readingTime: '5 min',
    related: ['understanding-misophonia', 'breathing-techniques'],
  },
  {
    slug: 'misophonia-at-work',
    title: 'The Invisible Weight of Misophonia at Work',
    description:
      "Navigating open-plan offices, meetings, and desk lunches when your nervous system won't filter sounds.",
    readingTime: '5 min',
    related: ['what-to-say', 'breathing-techniques'],
  },
  {
    slug: 'misophonia-facts',
    title: "13 Things About Misophonia Most People Don't Know",
    description:
      'Research-backed facts that change how you understand sound sensitivity.',
    readingTime: '5 min',
    related: ['understanding-misophonia', 'fight-or-flight'],
  },
  {
    slug: 'what-to-say',
    title: '7 Things to Say (and Not Say) to Someone With Misophonia',
    description:
      'A guide for partners, parents, friends, and anyone who wants to be supportive.',
    readingTime: '4 min',
    related: ['parents-guide', 'understanding-misophonia'],
  },
  {
    slug: 'parents-guide',
    title: "Understanding Your Child's Misophonia",
    description:
      'A comprehensive, compassionate guide for parents who want to help their child navigate sound sensitivity.',
    readingTime: '15 min',
    featured: true,
    related: ['what-to-say', 'understanding-misophonia'],
  },
];

/** Look up a single article by slug */
export function getArticle(slug) {
  return articles.find((a) => a.slug === slug);
}

/** Get related articles for a given slug */
export function getRelatedArticles(slug) {
  const article = getArticle(slug);
  if (!article) return [];
  return article.related
    .map((relSlug) => getArticle(relSlug))
    .filter(Boolean);
}
