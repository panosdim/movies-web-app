import React, { useState } from 'react';
import axios from 'axios';
import { Movie } from '../model';

export const Popular: React.FC = () => {
    const [popular, setPopular] = useState();
    const baseUrl = 'https://image.tmdb.org/t/p/w342';

    React.useEffect(() => {
        axios.get('popular').then(response => {
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
                    popular.slice(1, 5).map((movie: Movie) => (
                        <div key={movie.id} className='column'>
                            <div className='card'>
                                <div className='card-image'>
                                    <figure className='image'>
                                        <img src={baseUrl + movie.poster_path} alt='Movie Poster' />
                                    </figure>
                                </div>
                                <div className='card-content'>
                                    <div className='content'>
                                        <h2>{movie.original_title}</h2>
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
