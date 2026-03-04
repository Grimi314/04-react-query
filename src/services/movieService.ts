const myKey = import.meta.env.VITE_API_KEY;
import type { Movie } from "../types/movie";
import axios from "axios";
const URL = "https://api.themoviedb.org/3/search/movie";


interface FetchMovieResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

export async function fetchMovie(
  topic: string,
  page: number
): Promise<FetchMovieResponse> {
  const response = await axios.get<FetchMovieResponse>(URL, {
    params: {
      query: topic,
      page,
    },
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${myKey}`,
    },
  });

  return response.data; 
}