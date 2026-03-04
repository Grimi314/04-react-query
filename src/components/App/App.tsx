import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMovie } from "../../services/movieServices";
import MovieGriad from "../MovieGrid/MovieGrid";
import type { Movie } from "../../types/movie";
import MovieModal from "../MovieModal/MovieModal";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import ReactPaginate from "react-paginate";
import css from "./App.module.css";
import toast from "react-hot-toast";

export default function App() {
  const [movies] = useState<Movie[]>([]);
  const [topic, setTopic] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectMovie, setSelectMovie] = useState<Movie | null>(null);

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["topic", topic, currentPage],
    queryFn: () => fetchMovie(topic, currentPage),
    enabled: topic !== "",
    placeholderData: keepPreviousData,
  });

  if (data?.movies.length === 0) {
    toast("No movies found for your request.");
  }

  const totalPages = data?.totalPages ?? 0;

  function handleSearch(newTopic: string) {
    setTopic(newTopic);
  }
  function handleSelectMovie(movie: Movie) {
    setSelectMovie(movie);
  }

  function onCloseModal() {
    setSelectMovie(null);
  }

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={currentPage - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {data && <MovieGriad movies={data.movies} onSelect={handleSelectMovie} />}
      {selectMovie && <MovieModal movie={selectMovie} onClose={onCloseModal} />}
      {!isLoading && isError && movies.length === 0 && <ErrorMessage />}
    </>
  );
}
