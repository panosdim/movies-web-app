import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Globals, User } from '../model';
import { useGlobal } from 'reactn';
// @ts-ignore
import { toast } from 'bulma-toast';

export const LoginForm: React.FC = () => {
    const [isLoading, setLoading] = useState(false);
    const loginFormRef = useRef<HTMLFormElement>(null);
    const [user, setUser] = useGlobal<User>('user');
    const [isLoggedIn, setLoggedIn] = useGlobal<Globals>('isLoggedIn');
    const [values, setValues] = useState<FormData>({});

    type FormData = { [key: string]: string };

    React.useEffect(() => {
        if (isLoggedIn) {
            toast({
                message: `Welcome ${user.firstName} ${user.lastName}`,
                type: 'is-success',
                position: 'bottom-center',
                dismissible: false,
                pauseOnHover: true,
            });
        }
    }, [user, isLoggedIn]);

    const checkValidity = (): boolean => {
        let form = loginFormRef.current as HTMLFormElement;

        if (form && !form.checkValidity()) {
            form.querySelectorAll(':invalid').forEach(element => {
                const el = element as HTMLInputElement;
                if (!el.validity.valid) {
                    el.classList.add('is-danger');
                } else {
                    el.classList.remove('is-danger');
                }
            });

            return false;
        }

        return true;
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.persist();
        const el = event.target;
        setValues(values => ({ ...values, [el.name]: el.value }));
        if (!el.validity.valid) {
            el.classList.add('is-danger');
        } else {
            el.classList.remove('is-danger');
        }
    };

    const login = (event: React.FormEvent) => {
        if (event) event.preventDefault();

        if (!checkValidity()) {
            return;
        }
        setLoading(true);

        axios
            .post('login', values)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                setLoading(false);
                setUser(response.data.user);
                setLoggedIn(true);
            })
            .catch(() => {
                toast({
                    message: 'Login Failed. Please check your email and password.',
                    type: 'is-danger',
                    position: 'bottom-center',
                    dismissible: false,
                    pauseOnHover: true,
                });
                setLoading(false);
            });
    };

    return (
        <form onSubmit={login} noValidate ref={loginFormRef}>
            <div className='field is-horizontal is-pulled-right'>
                <div className='field-body'>
                    <div className='field'>
                        <div className='control is-expanded has-icons-left'>
                            <input
                                onChange={handleChange}
                                className='input'
                                name='email'
                                type='email'
                                placeholder='Email'
                                value={values.email || ''}
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
                                onChange={handleChange}
                                className='input'
                                name='password'
                                type='password'
                                placeholder='Password'
                                value={values.password || ''}
                                required
                            />
                            <span className='icon is-small is-left'>
                                <i className='fa fa-lock'></i>
                            </span>
                        </div>
                    </div>
                    <div className='field'>
                        <div className='control'>
                            <button className={isLoading ? 'button is-link is-loading' : 'button is-link'}>
                                Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};
