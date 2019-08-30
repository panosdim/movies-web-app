import React from 'react';
import { useGlobal } from 'reactn';
import { SearchingInfo } from '../model';

export const MoviesList: React.FC = () => {
    const [isInSearch] = useGlobal<SearchingInfo>('isInSearch');

    return (
        <>
            {!isInSearch && (
                <div className='container'>
                    <p>Movies List</p>
                </div>
            )}
        </>
    );
};
