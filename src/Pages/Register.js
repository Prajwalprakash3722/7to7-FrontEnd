import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
// import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import api_link from "../etc/api";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const body = {
        name: name,
        email: email,
        password: password,
    };

    function handleForm(e) {
        e.preventDefault();
        setLoading(true);
        if (password !== confirmPassword) {
            setError(true);
            setLoading(false);
            setSuccess(false);
            setErrorMessage("Passwords don't match");
            setTimeout(() => {
                setError(false);
            }, 3000);
        } else {
            fetch(api_link + "/api/auth/register", {
                method: "post",
                body: JSON.stringify(body),
                headers: { "Content-Type": "application/json" },
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.message === "User Created Successfully") {
                        setSuccess(true);
                        setLoading(false);
                        setSuccessMessage(data.message);
                        setTimeout(() => {
                            setError(false);
                            setSuccess(false);
                            window.location.href = "/login";
                        }, 2000);
                    } else if (data.message === "User Exists Already") {
                        setError(true);
                        setErrorMessage(data.message);
                        setLoading(false);
                        setSuccess(false);
                        setTimeout(() => {
                            window.location.pathname = "/login";
                        }, 3000);
                    } else {
                        setError(true);
                        setErrorMessage(
                            "Something went wrong, Please try again later!"
                        );
                        setLoading(false);
                        setSuccess(false);
                    }
                })
                .then(
                    setTimeout(() => {
                        setError(false);
                        setSuccess(false);
                    }, 3000)
                );
        }
    }
    return (
        <>
            <div>
                <section className="min-h-screen flex flex-col">
                    {error && (
                        <>
                            <div className="mt-8 flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
                                <div className="flex items-center justify-center w-12 bg-red-500">
                                    <svg
                                        className="w-6 h-6 text-white fill-current"
                                        viewBox="0 0 40 40"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M20 3.36667C10.8167 3.36667 3.3667 10.8167 3.3667 20C3.3667 29.1833 10.8167 36.6333 20 36.6333C29.1834 36.6333 36.6334 29.1833 36.6334 20C36.6334 10.8167 29.1834 3.36667 20 3.36667ZM19.1334 33.3333V22.9H13.3334L21.6667 6.66667V17.1H27.25L19.1334 33.3333Z" />
                                    </svg>
                                </div>

                                <div className="px-4 py-2 -mx-3">
                                    <div className="mx-3">
                                        <span className="font-semibold text-red-500 dark:text-red-400">
                                            Error
                                        </span>
                                        <p className="text-sm text-gray-600 dark:text-gray-200">
                                            {errorMessage}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    {success && (
                        <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
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
                                        {successMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex flex-1 items-center justify-center">
                        <div className="rounded-lg sm:border-2 px-4 lg:px-24 py-16 lg:max-w-xl sm:max-w-md w-full text-center">
                            <form
                                className="text-center"
                                onSubmit={handleForm}
                                action="/login"
                            >
                                <h1 className="font-bold tracking-wider text-3xl mb-8 w-full text-gray-600">
                                    Register
                                </h1>
                                <div className="py-2 text-left">
                                    <TextField
                                        id="standard-basic"
                                        label="Name"
                                        type="Name"
                                        className=" border-2 border-gray-100
                  focus:outline-none  block w-full py-2 px-4
                  rounded-lg focus:border-gray-700 outline-none "
                                        placeholder="Name"
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </div>
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
                                        type="Password"
                                        className=" border-2 border-gray-100 focus:outline-none  block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                                        placeholder="Password"
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                                <div className="py-2 text-left">
                                    <TextField
                                        id="standard-basic"
                                        label="Confirm Password"
                                        type="Password"
                                        className=" border-2 border-gray-100 focus:outline-none  block w-full py-2 px-4 rounded-lg focus:border-gray-700 "
                                        placeholder="Confirm Password"
                                        onChange={(e) =>
                                            setConfirmPassword(e.target.value)
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
                                        {loading ? "Loading...." : "Register"}
                                    </Button>
                                    <button type="reset" className="m-2">
                                        {/* <RotateLeftIcon /> */}
                                    </button>
                                </div>
                                <div>
                                    Already Have a account,{" "}
                                    <Link to="/login" className="text-blue-400">
                                        click here
                                    </Link>{" "}
                                    to login.
                                </div>
                            </form>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}

export default Register;
