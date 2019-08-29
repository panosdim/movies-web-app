import React, { useState } from 'react';
import './App.css';
import { Login, Main } from './pages';
import axios from 'axios';
import { useGlobal, setGlobal } from 'reactn';
import { LoginInfo, User } from './model';

// TODO: Change to production
axios.defaults.baseURL = 'http://localhost:8000/';
// axios.defaults.baseURL = 'https://api.flat.cc.nf/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

setGlobal({
    isLoggedIn: false,
    user: {},
    movies: [],
});

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useGlobal<LoginInfo>('isLoggedIn');
    const [, setUser] = useGlobal<User>('user');
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        axios
            .get('user')
            .then(response => {
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
