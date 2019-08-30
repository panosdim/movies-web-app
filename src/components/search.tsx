import React, { useState, useRef } from 'react';
import { useGlobal } from 'reactn';
import { ISearchingInfo, MovieType, IMAGE_BASE_URL, ILoginInfo } from '../model';
import axios, { Canceler } from 'axios';
const Notification = require('bulma-toast');
const autoComplete = require('pixabay-javascript-autocomplete');

export const Search: React.FC = () => {
    const [isSearching, setSearching] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [isInSearch, setInSearch] = useGlobal<ISearchingInfo>('isInSearch');
    const [results, setResults] = useState<MovieType[]>([]);
    const [, setLoggedIn] = useGlobal<ILoginInfo>('isLoggedIn');
    const searchRef = useRef<HTMLInputElement>(null);

    const baseUrl = IMAGE_BASE_URL + 'w92';
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
                                cancelToken: new CancelToken(function executor(c) {
                                    cancelRef.current = c;
                                }),
                            },
                        )
                        .then(results => {
                            response(results.data);
                        })
                        .catch(error => {
                            if (error.response && error.response.status === 400) {
                                // JWT Token expired
                                setSearching(false);
                                setLoggedIn(false);
                                Notification.toast({
                                    message: error.response.data.error,
                                    type: 'is-danger',
                                    position: 'bottom-center',
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
                return false;
            }
        }
        return true;
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
                .then(response => {
                    setSearching(false);
                    setResults(response.data.results);
                    if (cancelRef.current !== undefined) {
                        cancelRef.current();
                    }
                })
                .catch(error => {
                    if (error.response && error.response.status === 400) {
                        // JWT Token expired
                        setSearching(false);
                        setLoggedIn(false);
                        Notification.toast({
                            message: error.response.data.error,
                            type: 'is-danger',
                            position: 'bottom-center',
                            dismissible: false,
                            pauseOnHover: true,
                        });
                    } else {
                        Notification.toast({
                            message: 'Search failed. Please try again.',
                            type: 'is-danger',
                            position: 'bottom-center',
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

    const clear = () => {
        setInSearch(false);
        setSearchTerm('');
    };

    const addMovie = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, movie: MovieType) => {
        const button = event.target as HTMLButtonElement;
        button.classList.add('is-loading');

        const data = {
            title: movie.original_title,
            overview: movie.overview,
            movie_id: movie.id,
            image: movie.poster_path,
        };

        axios
            .post('movies', data)
            .then(() => {
                button.classList.remove('is-loading');
                clear();
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setLoggedIn(false);
                    Notification.toast({
                        message: error.response.data.error,
                        type: 'is-danger',
                        position: 'bottom-center',
                        dismissible: false,
                        pauseOnHover: true,
                    });
                } else {
                    Notification.toast({
                        message: 'Adding movie to watch list failed. Please try again.',
                        type: 'is-danger',
                        position: 'bottom-center',
                        dismissible: false,
                        pauseOnHover: true,
                    });
                    button.classList.remove('is-loading');
                }
            });
    };

    return (
        <>
            <div className='container'>
                <div className='heading'>
                    <div className='columns'>
                        <div className='column is-half is-offset-one-quarter'>
                            <div className='field has-addons'>
                                <div className='control is-expanded'>
                                    <input
                                        ref={searchRef}
                                        className='input'
                                        type='text'
                                        placeholder='Find a movie'
                                        value={searchTerm}
                                        onChange={handleChange}
                                        onKeyPress={handleKeyPress}
                                    />
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
                </div>
                {isInSearch && (
                    <div className='container'>
                        <div className='level'>
                            <div className='level-left'>
                                <h1 className='title level-item'>Results</h1>
                            </div>
                            <div className='level-right'>
                                <button className='button is-light level-item' onClick={clear}>
                                    Clear
                                </button>
                            </div>
                        </div>
                        <div>
                            {results.length > 0
                                ? results.map((movie: MovieType) => (
                                      <div key={movie.id} className='box'>
                                          <div className='media'>
                                              <figure className='media-left'>
                                                  <img src={baseUrl + movie.poster_path} alt='Movie Poster' />
                                              </figure>
                                              <div className='media-content'>
                                                  <div className='content'>
                                                      <p className='title is-3'>{movie.original_title}</p>
                                                      <p className='subtitle is-5'>{movie.release_date}</p>
                                                      <br />
                                                      {movie.overview}
                                                  </div>
                                              </div>
                                              <div className='media-right'>
                                                  <button
                                                      className='button is-success'
                                                      onClick={e => addMovie(e, movie)}
                                                  >
                                                      Add to watchlist
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  ))
                                : !isSearching && <h2>Nothing found. Please search again.</h2>}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};
