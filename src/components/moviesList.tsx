import axios, { AxiosError, AxiosResponse } from 'axios';
import * as bulmaToast from 'bulma-toast';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { formatReleaseDate, now } from '.';
import { AxiosResponseError, IMAGE_BASE_URL, loginState, MovieResultType, moviesState } from '../model';

export const MoviesList: React.FC = () => {
    const [released, setReleased] = useState<MovieResultType[]>([]);
    const [coming, setComing] = useState<MovieResultType[]>([]);
    const [unknown, setUnknown] = useState<MovieResultType[]>([]);
    const setLoggedIn = useSetRecoilState(loginState);
    const [movies, setMovies] = useRecoilState(moviesState);

    const baseUrl = IMAGE_BASE_URL + 'w185';

    React.useEffect(() => {
        axios.get('movies').then((response: AxiosResponse) => {
            setMovies(response.data);
        });

        axios
            .get('update')
            .then(() => {
                axios.get('movies').then((response: AxiosResponse) => {
                    setMovies(response.data);
                    bulmaToast.toast({
                        message: `Release dates have been updated.`,
                        type: 'is-success',
                        position: 'bottom-right',
                        dismissible: false,
                        pauseOnHover: true,
                    });
                });
            })
            .catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const temp = movies.filter((movie: MovieResultType) => movie.release_date !== null);

        const releasedMovies = temp.filter((movie: MovieResultType) => movie.release_date <= now);
        setReleased(releasedMovies);

        const comingMovies = temp.filter((movie: MovieResultType) => movie.release_date > now);
        setComing(comingMovies);

        setUnknown(movies.filter((movie: MovieResultType) => movie.release_date === null));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movies]);

    const deleteMovie = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, movie: MovieResultType) => {
        const button = event.currentTarget as HTMLButtonElement;
        button.classList.add('disabled');

        axios
            .delete(`movies/${movie.id}`)
            .then(() => {
                button.classList.remove('disabled');
                setMovies(movies.filter((item) => item.id !== movie.id));
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
                        message: 'Delete movie from watch list failed. Please try again.',
                        type: 'is-danger',
                        position: 'bottom-right',
                        dismissible: false,
                        pauseOnHover: true,
                    });
                    button.classList.remove('disabled');
                }
            });
    };

    return (
        <>
            <div className='container'>
                <section className='section is-with-fixed-navbar'>
                    <div className='container'>
                        <h1 className='title'>Released on DVD ({released.length})</h1>
                        <hr />
                        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
                            {released &&
                                released.map((movie: MovieResultType) => (
                                    <div key={movie.id} className='card' style={{ width: '200px', margin: '10px' }}>
                                        <div className='card-image'>
                                            <figure className='image'>
                                                <img
                                                    width='200'
                                                    height='300'
                                                    src={baseUrl + movie.image}
                                                    alt='Movie Poster'
                                                />
                                            </figure>
                                        </div>
                                        <header className='card-header'>
                                            <p className='card-header-title'>{movie.title ?? movie.name}</p>
                                            <button
                                                className='card-header-icon link-button'
                                                onClick={(e) => deleteMovie(e, movie)}
                                            >
                                                <span className='icon has-text-danger'>
                                                    <i className='fas fa-trash' aria-hidden='true'></i>
                                                </span>
                                            </button>
                                        </header>
                                        <div className='card-content'>
                                            <div className='has-text-centered'>
                                                <span className='tag is-success is-large'>
                                                    {formatReleaseDate(movie.release_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
                <section className='section'>
                    <div className='container'>
                        <h1 className='title'>Coming Soon ({coming.length})</h1>
                        <hr />
                        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
                            {coming &&
                                coming.map((movie: MovieResultType) => (
                                    <div key={movie.id} className='card' style={{ width: '200px', margin: '10px' }}>
                                        <div className='card-image'>
                                            <figure className='image'>
                                                <img
                                                    width='200'
                                                    height='300'
                                                    src={baseUrl + movie.image}
                                                    alt='Movie Poster'
                                                />
                                            </figure>
                                        </div>
                                        <header className='card-header'>
                                            <p className='card-header-title'>{movie.title ??  movie.name}</p>
                                            <button
                                                className='card-header-icon link-button'
                                                onClick={(e) => deleteMovie(e, movie)}
                                            >
                                                <span className='icon has-text-danger'>
                                                    <i className='fas fa-trash' aria-hidden='true'></i>
                                                </span>
                                            </button>
                                        </header>
                                        <div className='card-content'>
                                            <div className='has-text-centered'>
                                                <span className='tag is-warning is-large'>
                                                    {formatReleaseDate(movie.release_date)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
                <section className='section'>
                    <div className='container'>
                        <h1 className='title'>Unknown Release Date ({unknown.length})</h1>
                        <hr />
                        <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
                            {unknown &&
                                unknown.map((movie: MovieResultType) => (
                                    <div key={movie.id} className='card' style={{ width: '200px', margin: '10px' }}>
                                        <div className='card-image'>
                                            <figure className='image'>
                                                <img
                                                    width='200'
                                                    height='300'
                                                    src={baseUrl + movie.image}
                                                    alt='Movie Poster'
                                                />
                                            </figure>
                                        </div>
                                        <header className='card-header'>
                                            <p className='card-header-title'>{movie.title ?? movie.name}</p>
                                            <button
                                                className='card-header-icon link-button'
                                                onClick={(e) => deleteMovie(e, movie)}
                                            >
                                                <span className='icon has-text-danger'>
                                                    <i className='fas fa-trash' aria-hidden='true'></i>
                                                </span>
                                            </button>
                                        </header>
                                    </div>
                                ))}
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
};
