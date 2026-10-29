// FAQPage structured data built from the same entries the FAQ page renders, so both stay in sync.
export type Faq = { q: string; a: string[] };

const stripTags = (html: string) => html.replace(/<[^>]+>/g, '');

export const faqJsonLd = (faqs: Faq[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a.map(stripTags).join('\n\n') },
  })),
});
