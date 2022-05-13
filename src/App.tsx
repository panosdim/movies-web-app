import axios, { AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import './App.css';
import { loginState, userState } from './model';
import { Login, Main } from './pages';

// TODO: Change to production
// axios.defaults.baseURL = 'http://localhost:8001/api/';
axios.defaults.baseURL = 'https://movies.dsw.mywire.org/api';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useRecoilState(loginState);
    const setUser = useSetRecoilState(userState);
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
