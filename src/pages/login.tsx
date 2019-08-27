import React from 'react';
import { Popular, Footer } from '../components';

export const Login: React.FC = () => {
    return (
        <>
            <section className='hero is-primary is-bold is-fixed-top'>
                <div className='hero-head'>
                    <div className='container'>
                        <div className='columns is-vcentered'>
                            <div className='column'>
                                <h1 className='title'>Movies Watchlist</h1>
                                <h2 className='subtitle'>DVD release dates of movies</h2>
                            </div>
                            <div className='column'>
                                <div id='signUp'>
                                    If you don't have an account please <a id='btnSignUp'>Sign up</a>
                                </div>
                                <div id='welcome' style={{ display: 'none' }}></div>
                            </div>
                            <div className='column'>
                                <form id='frmLogin'>
                                    <div className='field is-horizontal'>
                                        <div className='field-body'>
                                            <div className='field'>
                                                <div className='control is-expanded has-icons-left'>
                                                    <input
                                                        className='input'
                                                        name='email'
                                                        type='email'
                                                        placeholder='Email'
                                                        required
                                                    />
                                                    <span className='icon is-small is-left'>
                                                        <i className='fa fa-envelope'></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='field'>
                                                <div className='control is-expanded has-icons-left'>
                                                    <input
                                                        className='input'
                                                        name='password'
                                                        type='password'
                                                        placeholder='Password'
                                                        required
                                                    />
                                                    <span className='icon is-small is-left'>
                                                        <i className='fa fa-lock'></i>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className='field'>
                                                <div className='control'>
                                                    <button id='btnLogin' className='button is-link'>
                                                        Login
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div id='logout' style={{ display: 'none' }} className='column'>
                                <div className='field is-horizontal'>
                                    <div className='field-body'>
                                        <div className='field is-grouped'>
                                            <p className='control'>
                                                <button id='btnUpdate' className='button is-link'>
                                                    Update Release Dates
                                                </button>
                                            </p>
                                            <p className='control'>
                                                <button id='btnLogout' className='button is-danger'>
                                                    Logout
                                                </button>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Popular />
            <Footer />
        </>
    );
};
