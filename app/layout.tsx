import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '#MyBest9Movie',
  description: 'Pick your favorite 9 movies with TMDB.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
