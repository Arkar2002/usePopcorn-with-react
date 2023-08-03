import { useState } from "react";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useMovie } from "./hooks/useMovie";
import { MovieDetails } from "./components/MovieDetails";
import { Loader } from "./components/Loader";
import { ErrorMessage } from "./components/ErrorMessage";
import { Navbar } from "./components/Navbar";
import { Logo } from "./components/Logo";
import { Search } from "./components/Search";
import { NumResults } from "./components/NumResults";
import { Main } from "./components/Main";
import { Box } from "./components/Box";
import { MovieLists } from "./components/MovieLists";
import { WatchedSummary } from "./components/WatchedSummary";
import { WatchedMovieLists } from "./components/WatchedMovieLists";

export const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export const KEY = "f84fc31d";

export default function App() {
  const [query, setQuery] = useState("");
  const { movies, isLoading, error } = useMovie(query, KEY, handleCloseMovie);
  const [watched, setWatched] = useLocalStorageState([], "watched");
  const [selectedId, setSelectedId] = useState(null);

  function handleSelectId(id) {
    setSelectedId((curId) => (curId !== id ? id : null));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleAddMovie(newMovie) {
    setWatched((movies) => [...movies, newMovie]);
    setSelectedId(null);
  }

  function handleDelete(id) {
    setWatched((movies) => movies.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
          {!isLoading && !error && (
            <MovieLists movies={movies} onSelectionId={handleSelectId} />
          )}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              watched={watched}
              onClose={handleCloseMovie}
              onAdd={handleAddMovie}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieLists
                watched={watched}
                onDeleteWatched={handleDelete}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
