export type Movie = {
  id: number;
  title: string;
  original_title?: string;
  release_date?: string;
  poster_path?: string | null;
};

export type GridState = Array<Movie | null>;
