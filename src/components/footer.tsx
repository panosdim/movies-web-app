import React from 'react';
import tmdb from '../images/tmdb.png';
export const Footer: React.FC = () => {
    return (
        <footer className='footer' style={{ paddingBottom: '1.5rem' }}>
            <div className='container'>
                <p className='has-text-centered has-text-grey-light'>
                    <a href='https://www.themoviedb.org'>
                        <img src={tmdb} alt='Powered by TMDb' />
                    </a>
                    <br />
                    This product uses the <a href='https://www.themoviedb.org/documentation/api'>TMDb API</a> but is not
                    endorsed or certified by <a href='https://www.themoviedb.org/'>TMDb</a>.
                </p>
            </div>
        </footer>
    );
};
