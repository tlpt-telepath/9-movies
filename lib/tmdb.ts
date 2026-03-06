import { Movie } from './types';

const API_BASE = 'https://api.themoviedb.org/3';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const READ_TOKEN = process.env.NEXT_PUBLIC_TMDB_READ_TOKEN;

function headers(): HeadersInit {
  if (READ_TOKEN) {
    return {
      Authorization: `Bearer ${READ_TOKEN}`,
      'Content-Type': 'application/json;charset=utf-8',
    };
  }
  return { 'Content-Type': 'application/json;charset=utf-8' };
}

function withAuth(url: URL) {
  if (!READ_TOKEN && API_KEY) {
    url.searchParams.set('api_key', API_KEY);
  }
  return url;
}

function normalize(item: any): Movie {
  return {
    id: item.id,
    title: item.title,
    original_title: item.original_title,
    release_date: item.release_date,
    poster_path: item.poster_path,
  };
}

async function searchByLanguage(query: string, language: string): Promise<Movie[]> {
  const url = withAuth(new URL(`${API_BASE}/search/movie`));
  url.searchParams.set('query', query);
  url.searchParams.set('language', language);
  url.searchParams.set('region', 'JP');
  url.searchParams.set('include_adult', 'false');
  url.searchParams.set('page', '1');

  const res = await fetch(url.toString(), { headers: headers() });
  if (!res.ok) {
    const error = await res.text();
    throw new Error(`TMDB search failed (${res.status}): ${error}`);
  }

  const json = await res.json();
  return (json.results ?? []).map(normalize);
}

export async function searchMovies(query: string): Promise<Movie[]> {
  if (!API_KEY && !READ_TOKEN) {
    throw new Error('TMDB credentials are missing. Set NEXT_PUBLIC_TMDB_READ_TOKEN or NEXT_PUBLIC_TMDB_API_KEY.');
  }

  const ja = await searchByLanguage(query, 'ja-JP');
  if (ja.length >= 5) {
    return ja;
  }

  const en = await searchByLanguage(query, 'en-US');
  const map = new Map<number, Movie>();
  for (const item of ja) map.set(item.id, item);
  for (const item of en) {
    if (!map.has(item.id)) map.set(item.id, item);
  }
  return Array.from(map.values());
}

export function getPosterUrl(path?: string | null): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/w342${path}`;
}

export function getReleaseYear(date?: string): string {
  if (!date) return '';
  return date.slice(0, 4);
}
