import React from 'react';
import { Header, Footer, MoviesList, SearchResults } from '../components';
import { useGlobal } from 'reactn';
import { ISearchingInfo } from '../model';

export const Main: React.FC = () => {
    const [isInSearch] = useGlobal<ISearchingInfo>('isInSearch');

    return (
        <>
            <Header />
            {isInSearch ? <SearchResults /> : <MoviesList />}
            <Footer />
        </>
    );
};
