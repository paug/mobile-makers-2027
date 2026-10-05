// Blog helpers: posts are keyed "<lang>/<slug>" by the glob loader in content.config.ts.
import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/copy';

export type Post = CollectionEntry<'blog'>;

export const blogHome = (lang: Lang) => (lang === 'fr' ? '/blog/' : '/en/blog/');
export const postSlug = (post: Post) => post.id.split('/')[1];
export const postHref = (lang: Lang, slug: string) => blogHome(lang) + slug + '/';

// Newest first.
export async function getPosts(lang: Lang) {
  const posts = await getCollection('blog', (p) => p.id.startsWith(lang + '/'));
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const formatDate = (lang: Lang, date: Date) =>
  new Intl.DateTimeFormat(lang === 'fr' ? 'fr-FR' : 'en-US', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(date);
