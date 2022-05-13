import React from 'react';
import { useRecoilState } from 'recoil';
import { LoginForm, Search } from '.';
import { loginState } from '../model';

export const Header: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useRecoilState(loginState);

    const logout = () => {
        localStorage.removeItem('token');
        setLoggedIn(false);
    };

    return (
        <>
            <section className='hero is-primary is-bold is-fixed-top'>
                <div className='hero-head'>
                    <div className='container'>
                        <div className='columns is-vcentered'>
                            <div className='column is-one-quarter'>
                                <h1 className='title'>Movies Watchlist</h1>
                                <h2 className='subtitle'>DVD release dates of movies</h2>
                            </div>
                            {isLoggedIn ? (
                                <>
                                    <Search />
                                    <div className='column is-one-quarter'>
                                        <div className='field is-horizontal is-pulled-right'>
                                            <div className='field-body'>
                                                <div className='control'>
                                                    <button onClick={logout} className='button is-danger'>
                                                        <span className='icon'>
                                                            <i className='fas fa-sign-out-alt'></i>
                                                        </span>
                                                        <span>Logout</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <LoginForm />
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};
