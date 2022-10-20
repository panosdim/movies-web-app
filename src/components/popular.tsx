import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { IMAGE_BASE_URL, MovieType } from '../model';

export const Popular: React.FC = () => {
    const [popular, setPopular] = useState<MovieType[]>([]);
    const baseUrl = IMAGE_BASE_URL + 'w342';

    React.useEffect(() => {
        axios.get('popular').then((response: AxiosResponse) => {
            setPopular(response.data.results);
        });
    }, []);

    return (
        <section className='section is-with-fixed-navbar'>
            <div className='container'>
                <div className='heading'>
                    <h1 className='title'>Popular Movies</h1>
                </div>
            </div>
            <div className='columns'>
                {popular &&
                    popular.slice(1, 5).map((movie: MovieType) => (
                        <div key={movie.id} className='column'>
                            <div className='card'>
                                <div className='card-image'>
                                    <figure className='image'>
                                        <img src={baseUrl + movie.poster_path} alt='Movie Poster' />
                                    </figure>
                                </div>
                                <div className='card-content'>
                                    <div className='content'>
                                        <h2>{movie.title ?? movie.name}</h2>
                                        <p>{movie.overview}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </section>
    );
};
