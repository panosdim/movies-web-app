import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { setGlobal, useGlobal } from 'reactn';
import './App.css';
import { ILoginInfo, IUser } from './model';
import { Login, Main } from './pages';

// TODO: Change to production
// axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.baseURL = 'https://api.movies.cc.nf/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

setGlobal({
    isLoggedIn: false,
    isInSearch: false,
    user: {},
    movies: [],
    results: [],
});

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useGlobal<ILoginInfo>('isLoggedIn');
    const [, setUser] = useGlobal<IUser>('user');
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        axios
            .get('user')
            .then((response: AxiosResponse) => {
                setLoggedIn(true);
                setLoading(false);
                setUser(response.data);
            })
            .catch(() => {
                setLoggedIn(false);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoading ? (
                <div className='pageloader is-active'>
                    <span className='title'>Checking for active session...</span>
                </div>
            ) : isLoggedIn ? (
                <Main />
            ) : (
                <Login />
            )}
        </>
    );
};

export default App;
