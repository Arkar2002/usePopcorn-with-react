import { useEffect, useState } from "react";
import { useKey } from "../hooks/useKey";
import StarRating from "./StarRating";
import { KEY } from "../App";
import { Loader } from "./Loader";

export function MovieDetails({ selectedId, watched, onClose, onAdd }) {
  const [movie, setMovie] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState(0);

  const isWatched = watched?.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched?.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Actors: actors,
    Poster: poster,
    Runtime: runtime,
    Released: released,
    Year: year,
    Plot: plot,
    Genre: genre,
    Director: director,
    imdbRating,
    imdbID,
  } = movie;

  function handleRating(num) {
    setRating(num);
  }

  function handleAddWatched() {
    const newMovies = {
      imdbID,
      title,
      year,
      poster,
      imdbRating,
      runtime: Number(runtime.split(" ").at(0)),
      userRating: rating,
    };
    onAdd(newMovies);
  }

  // Api fetch
  useEffect(() => {
    const fetchMovie = async () => {
      setIsLoading(true);
      const res = await fetch(
        `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
      );
      const data = await res.json();
      setMovie(data);
      setIsLoading(false);
    };
    fetchMovie();
  }, [selectedId]);

  // Key (Enter)
  useKey("Escape", onClose);

  // Title
  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    // Title cleanup after ummounted
    return () => {
      document.title = "usePopcorn";
    };
  }, [title]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={poster} alt={`Poster ${title} ofmovie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span> {imdbRating} IMDb Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {isWatched ? (
                <p>
                  You've rated that movie{" "}
                  <strong style={{ fontSize: "16px" }}>
                    {watchedUserRating}
                  </strong>{" "}
                  ⭐
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={26}
                    textSize={18}
                    textColor="#fff"
                    onSetRating={handleRating}
                  />
                  {rating > 0 && (
                    <button className="btn-add" onClick={handleAddWatched}>
                      + Add to watched List
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Staring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
