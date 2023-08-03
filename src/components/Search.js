import { useRef } from "react";
import { useKey } from "../hooks/useKey";

export function Search({ query, setQuery }) {
  // Input Feature
  const inputEl = useRef(null);

  useKey("Enter", () => {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      type="text"
      className="search"
      placeholder="Search..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
