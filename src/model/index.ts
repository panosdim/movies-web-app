export type MovieType = {
    poster_path: string | null;
    adult: boolean;
    overview: string;
    release_date: string;
    genre_ids: [number];
    id: number;
    original_title: string;
    original_language: string;
    title: string;
    backdrop_path: string | null;
    popularity: number;
    vote_count: number;
    video: boolean;
    vote_average: number;
};

export interface LoginInfo {
    isLoggedIn: boolean;
}

export type UserType = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
};

export interface User {
    user: UserType;
}

export interface SearchingInfo {
    isInSearch: boolean;
}

export const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/';
