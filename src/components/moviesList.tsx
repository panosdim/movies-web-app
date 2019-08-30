import React, { useState } from 'react';
import { useGlobal } from 'reactn';
import { ISearchingInfo, IMoviesList, IMAGE_BASE_URL, MovieResultType } from '../model';
import axios from 'axios';

export const MoviesList: React.FC = () => {
    const [isInSearch] = useGlobal<ISearchingInfo>('isInSearch');
    const [movies, setMovies] = useGlobal<IMoviesList>('movies');
    const [released, setReleased] = useState<MovieResultType[]>([]);
    const [comming, setComming] = useState<MovieResultType[]>([]);
    const [unknown, setUnknown] = useState<MovieResultType[]>([]);

    const baseUrl = IMAGE_BASE_URL + 'w185';
    const now: string = new Date().toISOString().slice(0, 10);

    React.useEffect(() => {
        axios.get('movies').then(response => {
            setMovies(response.data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        const releasedMovies = movies
            .filter((movie: MovieResultType) => movie.release_date !== '0000-00-00')
            .filter((movie: MovieResultType) => movie.release_date < now);
        setReleased(releasedMovies);

        const commingMovies = movies
            .filter((movie: MovieResultType) => movie.release_date !== '0000-00-00')
            .filter((movie: MovieResultType) => movie.release_date > now);
        setComming(commingMovies);

        setUnknown(movies.filter((movie: MovieResultType) => movie.release_date !== '0000-00-00'));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movies]);

    return (
        <>
            {!isInSearch && (
                <div className='container'>
                    <section className='section'>
                        <div className='container'>
                            <a>
                                <h1 className='title'>
                                    <span className='icon is-medium'>
                                        <i className='fa fa-caret-down'></i>
                                    </span>{' '}
                                    Released on DVD ({released.length})
                                </h1>
                            </a>
                            <hr />
                            <div style={{ display: 'flex', flexFlow: 'row wrap' }}>
                                {released &&
                                    released.map((movie: MovieResultType) => (
                                        <div className='card' style={{ width: '200px', margin: '10px' }}>
                                            <a className='watched button is-danger' data-id='125'>
                                                <span className='icon'>
                                                    <i className='fa fa-trash-o'></i>
                                                </span>
                                            </a>
                                            <div className='card-image'>
                                                <figure className='image is-200x300'>
                                                    <img
                                                        width='200'
                                                        height='300'
                                                        src={baseUrl + movie.image}
                                                        alt='Movie Poster'
                                                    />
                                                </figure>
                                            </div>
                                            <header className='card-header'>
                                                <h6 className='card-header-title'>{movie.title}</h6>
                                            </header>
                                            <div className='card-content'>
                                                <div className='has-text-centered'>
                                                    <span className='tag is-success'>{movie.release_date}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </section>
                </div>
            )}
        </>
    );
};
