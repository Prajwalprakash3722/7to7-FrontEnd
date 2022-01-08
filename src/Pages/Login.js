import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
// import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import api_link from '../etc/api';
function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrormessage] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        fetch(api_link + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.message) {
                    setError(true);
                    setErrormessage(data.message);
                } else if (data.token) {
                    localStorage.setItem('token', data.token);
                    setSuccess(true);
                    setTimeout(() => {
                        window.location.assign('/');
                    }, 1500);
                } else {
                    setError(true);
                    setErrormessage(
                        'Something went wrong, Please try again later!'
                    );
                    setLoading(false);
                    setSuccess(false);
                }
            })
            .then(
                setTimeout(() => {
                    setError(false);
                    setSuccess(false);
                }, 4000)
            );
    }

    return (
        <>
            <div>
                {error && (
                    <div
                        className="mt-2 bg-red-100 border-t border-b border-r border-l border-red-500 text-red-700 px-4 py-3 rounded-lg"
                        role="alert"
                    >
                        <p className="font-bold">Error</p>
                        <p className="text-sm">{errorMessage}</p>
                    </div>
                )}
                {success && (
                    <>
                        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 m-5">
                            <div className="flex items-center justify-center w-12 bg-emerald-500">
                                <svg
                                    className="w-6 h-6 text-white fill-current"
                                    viewBox="0 0 40 40"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
                                </svg>
                            </div>

                            <div className="px-4 py-2 -mx-3">
                                <div className="mx-3">
                                    <span className="font-semibold text-emerald-500 dark:text-emerald-400">
                                        Success
                                    </span>
                                    <p className="text-sm text-gray-600 dark:text-gray-200">
                                        You have successfully logged in!
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                <section className="min-h-screen flex flex-col items-center justify-center">
                    <div className="">
                        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">
                            <form
                                className="text-center"
                                onSubmit={handleSubmit}
                                action="/login"
                            >
                                <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
                                    Login
                                </h1>
                                <div className="py-2 text-left">
                                    <TextField
                                        id="standard-basic"
                                        label="Email"
                                        type="email"
                                        className=" border-5 border-gray-100
                  focus:outline-none  block w-full py-4 px-5
                  rounded-lg focus:border-gray-600 "
                                        placeholder="Email"
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="py-2 text-left">
                                    <TextField
                                        id="standard-basic"
                                        label="Password"
                                        type="password"
                                        className=" border-5 border-gray-100
                  focus:outline-none  block w-full py-4 px-5
                  rounded-lg focus:border-gray-600 "
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="py-2 flex flex-row justify-between">
                                    <Button
                                        type="submit"
                                        className="border-2 border-gray-100 focus:outline-none bg-blue-400 text-white font-bold tracking-wider block w-full p-2 rounded-lg"
                                        variant="contained"
                                        color="primary"
                                    > 
                                        {loading ? (
                                            <svg
                                                className="animate-spin h-5 w-5 mr-3 ..."
                                                viewBox="0 0 24 24"
                                            >
                                                {' '}
                                            </svg>
                                        ) : (
                                            <span>Login</span>
                                        )}
                                    </Button>
                                    <button type="reset" className="m-2">
                                        {/* <RotateLeftIcon /> */}
                                    </button>
                                </div>
                                <div>
                                    Don't Have a Account,{' '}
                                    <Link
                                        to="/register"
                                        className="text-blue-400"
                                    >
                                        click here
                                    </Link>{' '}
                                    to Register.
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Login;
