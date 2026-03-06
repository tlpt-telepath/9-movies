'use client';

import { useEffect, useMemo, useState } from 'react';
import { getPosterUrl, getReleaseYear, searchMovies } from '@/lib/tmdb';
import { GridState, Movie } from '@/lib/types';

const GRID_COUNT = 9;
const STORAGE_KEY = 'mybest9movie-state-v1';

function emptyGrid(): GridState {
  return Array.from({ length: GRID_COUNT }, () => null);
}

export default function Home() {
  const [title, setTitle] = useState('#MyBest9Movie');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [grid, setGrid] = useState<GridState>(emptyGrid());
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Movie[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed.title === 'string') setTitle(parsed.title);
      if (Array.isArray(parsed.grid) && parsed.grid.length === GRID_COUNT) {
        setGrid(parsed.grid);
      }
    } catch {
      // ignore invalid local data
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, grid }));
  }, [title, grid]);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      setError('');
      return;
    }

    setLoading(true);
    setError('');
    const timer = window.setTimeout(async () => {
      try {
        const movies = await searchMovies(trimmed);
        setResults(movies.slice(0, 10));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => {
      window.clearTimeout(timer);
      setLoading(false);
    };
  }, [query]);

  const selectedMovie = grid[selectedIndex];

  const shareText = useMemo(() => {
    const picks = grid.filter((item): item is Movie => Boolean(item)).slice(0, 5).map((m) => m.title);
    const suffix = picks.length ? `\n${picks.join(' / ')}` : '';
    return `${title} を作りました！${suffix}`;
  }, [grid, title]);

  const chooseMovie = (movie: Movie) => {
    setGrid((prev) => {
      const next = [...prev];
      next[selectedIndex] = movie;
      return next;
    });
  };

  return (
    <main className="container">
      <h1>#MyBest9Movie</h1>
      <div className="layout">
        <section className="panel">
          <label className="label">
            ページタイトル
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
          </label>

          <div className="slotPicker">
            {grid.map((movie, idx) => (
              <button
                key={idx}
                className={`slotButton ${selectedIndex === idx ? 'active' : ''}`}
                onClick={() => setSelectedIndex(idx)}
                type="button"
              >
                {idx + 1}. {movie?.title ?? '未選択'}
              </button>
            ))}
          </div>

          <label className="label">
            セル {selectedIndex + 1} の映画検索
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movie…"
              className="input"
            />
          </label>

          {loading && <p className="muted">検索中…</p>}
          {error && <p className="error">{error}</p>}
          {!loading && !error && query.trim().length > 0 && query.trim().length < 2 && (
            <p className="muted">2文字以上で検索してください。</p>
          )}

          {results.length > 0 && (
            <ul className="results">
              {results.map((movie) => (
                <li key={movie.id}>
                  <button type="button" onClick={() => chooseMovie(movie)} className="resultItem">
                    <span>{movie.title}</span>
                    <span className="muted">{getReleaseYear(movie.release_date)}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {selectedMovie && (
            <button
              type="button"
              className="clearBtn"
              onClick={() => {
                setGrid((prev) => {
                  const next = [...prev];
                  next[selectedIndex] = null;
                  return next;
                });
              }}
            >
              このセルの選択を解除
            </button>
          )}

          <button
            type="button"
            className="shareBtn"
            onClick={async () => {
              await navigator.clipboard.writeText(shareText);
            }}
          >
            シェア文をコピー
          </button>
        </section>

        <section className="panel">
          <h2>{title || '#MyBest9Movie'}</h2>
          <div className="grid">
            {grid.map((movie, idx) => {
              const poster = getPosterUrl(movie?.poster_path);
              return (
                <article key={idx} className="cell">
                  {poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={poster} alt={movie?.title ?? 'poster'} className="poster" />
                  ) : (
                    <div className="poster placeholder">Search movie…</div>
                  )}
                  <div className="caption">
                    <strong>{movie?.title ?? `No.${idx + 1}`}</strong>
                    <span>{movie ? getReleaseYear(movie.release_date) : ''}</span>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      <footer className="footer">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://www.themoviedb.org/assets/2/v4/logos/stacked-blue-a0e0f60bb2f1f2ac6f6e8f4f4d0228a77df19f2a5ea9f2a6a6f6f07f89f3a7b5.svg"
          alt="TMDB"
          width={80}
        />
        <p>This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
      </footer>
    </main>
  );
}
