import { Movie } from "./Movie";

export function MovieLists({ movies, onSelectionId }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectionId={onSelectionId} />
      ))}
    </ul>
  );
}
