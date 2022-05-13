import React from 'react';
import { useRecoilValue } from 'recoil';
import { Footer, Header, MoviesList, SearchResults } from '../components';
import { searchState } from '../model';

export const Main: React.FC = () => {
    const isInSearch = useRecoilValue(searchState);

    return (
        <>
            <Header />
            {isInSearch ? <SearchResults /> : <MoviesList />}
            <Footer />
        </>
    );
};
