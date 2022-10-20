export type MovieType = {
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: [number];
    id: number;
    original_title: string;
    original_language: string;
    title: string | null;
    name: string | null;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
};

export type MovieResultType = {
    id: number;
    image: string | null;
    movie_id: number;
    overview: string;
    release_date: string;
    title: string | null;
    name: string | null;
};

export type UserType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
};

export type AxiosResponseError = {
    error: string;
};

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
