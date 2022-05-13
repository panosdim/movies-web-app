import { atom } from 'recoil';
import { MovieResultType, MovieType, UserType } from '.';

export const loginState = atom({
    key: 'loginState',
    default: false,
});

export const userState = atom<UserType>({
    key: 'userState',
    default: { id: -1, lastName: '', firstName: '', email: '' },
});

export const searchState = atom({
    key: 'searchState',
    default: false,
});

export const searchResultsState = atom<MovieType[]>({
    key: 'searchResultsState',
    default: [],
});

export const moviesState = atom<MovieResultType[]>({
    key: 'moviesState',
    default: [],
});
