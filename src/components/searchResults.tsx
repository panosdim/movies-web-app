import axios, { AxiosError, AxiosResponse } from 'axios';
import * as bulmaToast from 'bulma-toast';
import React from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
    AxiosResponseError,
    IMAGE_BASE_URL,
    loginState,
    MovieResultType,
    moviesState,
    MovieType,
    searchResultsState,
    searchState,
} from '../model';

export const SearchResults: React.FC = () => {
    const setInSearch = useSetRecoilState(searchState);
    const [movies, setMovies] = useRecoilState(moviesState);
    const setLoggedIn = useSetRecoilState(loginState);
    const results = useRecoilValue(searchResultsState);

    const baseUrl = IMAGE_BASE_URL + 'w92';

    const addMovie = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, movie: MovieType) => {
        const button = event.currentTarget as HTMLButtonElement;
        button.classList.add('is-loading');

        const data = {
            title: movie.title ?? movie.name,
            overview: movie.overview,
            movie_id: movie.id,
            image: movie.poster_path,
        };

        axios
            .post('movies', data)
            .then((response: AxiosResponse<MovieResultType>) => {
                button.classList.remove('is-loading');
                setMovies([...movies, response.data]);
                clear();
            })
            .catch((error: AxiosError<AxiosResponseError>) => {
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setLoggedIn(false);
                    bulmaToast.toast({
                        message: error.response.data.error,
                        type: 'is-danger',
                        position: 'bottom-right',
                        dismissible: false,
                        pauseOnHover: true,
                    });
                } else {
                    bulmaToast.toast({
                        message: 'Adding movie to watch list failed. Please try again.',
                        type: 'is-danger',
                        position: 'bottom-right',
                        dismissible: false,
                        pauseOnHover: true,
                    });
                    button.classList.remove('is-loading');
                }
            });
    };

    const clear = () => {
        setInSearch(false);
    };

    return (
        <div className='container'>
            <section className='section is-with-fixed-navbar'>
                <div className='container'>
                    <div className='level'>
                        <div className='level-left'>
                            <h1 className='title level-item'>Results</h1>
                        </div>
                        <div className='level-right'>
                            <button className='button is-light level-item' onClick={clear}>
                                Clear
                            </button>
                        </div>
                    </div>
                    <div>
                        {results.length > 0 ? (
                            results.map((movie: MovieType) => (
                                <div key={movie.id} className='box'>
                                    <div className='media'>
                                        <figure className='media-left'>
                                            <img src={baseUrl + movie.poster_path} alt='Movie Poster' />
                                        </figure>
                                        <div className='media-content'>
                                            <div className='content'>
                                                <p className='title is-3'>{movie.title ?? movie.name}</p>
                                                <p className='subtitle is-5'>{movie.release_date}</p>
                                                <br />
                                                {movie.overview}
                                            </div>
                                        </div>
                                        <div className='media-right'>
                                            <button
                                                className='button is-success'
                                                onClick={(e) => addMovie(e, movie)}
                                                disabled={movies.some(
                                                    (item: MovieResultType) => item.movie_id === movie.id,
                                                )}
                                            >
                                                Add to watchlist
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <h2>Nothing found. Please search again.</h2>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};
