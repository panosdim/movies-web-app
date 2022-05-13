import axios, { AxiosError, AxiosResponse, Canceler } from 'axios';
import * as bulmaToast from 'bulma-toast';
import React, { useRef, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { AxiosResponseError, loginState, searchResultsState, searchState } from '../model';
const autoComplete = require('pixabay-javascript-autocomplete');

export const Search: React.FC = () => {
    const [isSearching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const setLoggedIn = useSetRecoilState(loginState);
    const setResults = useSetRecoilState(searchResultsState);
    const [isInSearch, setInSearch] = useRecoilState(searchState);
    const searchRef = useRef<HTMLInputElement>(null);

    const CancelToken = axios.CancelToken;
    let cancelRef = useRef<Canceler>();

    React.useEffect(() => {
        new autoComplete({
            selector: searchRef.current,
            source: (term: string, response: (data: [string[]]) => void) => {
                if (cancelRef.current !== undefined) {
                    cancelRef.current();
                }
                if (!isSearching) {
                    axios
                        .post(
                            'autocomplete',
                            { term: term },
                            {
                                cancelToken: new CancelToken(function executor(c: Canceler) {
                                    cancelRef.current = c;
                                }),
                            },
                        )
                        .then((results: AxiosResponse) => {
                            response(results.data);
                        })
                        .catch((error: AxiosError<AxiosResponseError>) => {
                            if (error.response && error.response.status === 400) {
                                // JWT Token expired
                                setSearching(false);
                                setLoggedIn(false);
                                bulmaToast.toast({
                                    message: error.response.data.error,
                                    type: 'is-danger',
                                    position: 'bottom-right',
                                    dismissible: false,
                                    pauseOnHover: true,
                                });
                            }
                        });
                }
            },
            renderItem: (item: string[], search: string) => {
                // eslint-disable-next-line no-useless-escape
                search = search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                const re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi');
                let img = '<i class="fa fa-picture-o no_image_holder search" aria-hidden="true"></i>';
                if (item[2] !== null) {
                    img = '<img width="45" height="67" src="' + item[2] + '">';
                }
                return (
                    '<div class="autocomplete-suggestion media" data-title="' +
                    item[0] +
                    '">' +
                    '<figure class="image media-left">' +
                    img +
                    '</figure>' +
                    '<div class="media-content"><div class="content">' +
                    '<h4 class="title is-4">' +
                    item[0].replace(re, '<b>$1</b>') +
                    '</h4>' +
                    '<h5 class="subtitle is-5">' +
                    item[1] +
                    '</h5>' +
                    '</div></div></div>'
                );
            },
            onSelect: (_e: any, _term: any, item: HTMLElement) => {
                const query = item.getAttribute('data-title');
                query && setSearchTerm(query);
                setSearching(true);
                setResults([]);
                setInSearch(true);
            },
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRef]);

    React.useEffect(() => {
        if (!isInSearch) {
            setSearchTerm('');
        }
    }, [isInSearch]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const el = event.target;

        setSearchTerm(el.value);
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.which === 13 || event.keyCode === 13) {
            if (searchTerm) {
                if (cancelRef.current !== undefined) {
                    cancelRef.current();
                }
                setSearching(true);
                setResults([]);
                setInSearch(true);
                event.preventDefault();
            }
        }
    };

    const handleSearch = () => {
        if (searchTerm) {
            if (cancelRef.current !== undefined) {
                cancelRef.current();
            }
            setSearching(true);
            setResults([]);
            setInSearch(true);
        }
    };

    const search = () => {
        if (searchTerm) {
            if (cancelRef.current !== undefined) {
                cancelRef.current();
            }
            axios
                .post('search', { term: searchTerm })
                .then((response: AxiosResponse) => {
                    setSearching(false);
                    setResults(response.data.results);
                    if (cancelRef.current !== undefined) {
                        cancelRef.current();
                    }
                })
                .catch((error: AxiosError<AxiosResponseError>) => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setSearching(false);
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
                            message: 'Search failed. Please try again.',
                            type: 'is-danger',
                            position: 'bottom-right',
                            dismissible: false,
                            pauseOnHover: true,
                        });
                        setSearching(false);
                    }
                });
        }
    };

    React.useEffect(() => {
        if (isSearching) {
            search();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSearching, searchTerm]);

    return (
        <div className='column'>
            <div className='field is-horizontal'>
                <div className='field has-addons' style={{ width: '100%' }}>
                    <div className='control is-expanded'>
                        <input
                            ref={searchRef}
                            className='input'
                            type='text'
                            placeholder='Find a movie'
                            value={searchTerm}
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />{' '}
                    </div>
                    <div className='control'>
                        <button
                            className={isSearching ? 'button is-info is-loading' : 'button is-info'}
                            onClick={handleSearch}
                        >
                            <span className='icon'>
                                <i className='fas fa-search'></i>
                            </span>
                            <span>Search</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
