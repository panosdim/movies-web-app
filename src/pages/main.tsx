import React from 'react';
import { Header, Footer, MoviesList, Search } from '../components';

export const Main: React.FC = () => {
    return (
        <>
            <Header />
            <section className='section is-with-fixed-navbar'>
                <Search />
                <MoviesList />
            </section>
            <Footer />
        </>
    );
};
