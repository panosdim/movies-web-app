import React from 'react';
import './App.css';
import { Login } from './pages';
import axios from 'axios';

// TODO: Change to production
axios.defaults.baseURL = 'http://localhost:8000/';
// axios.defaults.baseURL = 'https://api.flat.cc.nf/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

const App: React.FC = () => {
    return <Login />;
};

export default App;
