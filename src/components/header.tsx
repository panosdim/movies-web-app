import React from 'react';
import { useGlobal } from 'reactn';
import { Globals } from '../model';
import { LoginForm } from '.';

export const Header: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useGlobal<Globals>('isLoggedIn');

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
                            <div className='column'>
                                {isLoggedIn ? (
                                    <div className='column'>
                                        <div className='field is-horizontal is-pulled-right'>
                                            <div className='field-body'>
                                                <div className='control'>
                                                    <button onClick={logout} className='button is-danger'>
                                                        Logout
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <LoginForm />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};