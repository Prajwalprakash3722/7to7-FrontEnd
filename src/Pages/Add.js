import React, { useEffect, useState, useContext } from 'react';
import { FileDrop } from 'react-file-drop';
import './Add.css';
import { SelectedContext } from '../etc/context';
import axios from 'axios';
import api_link from '../etc/api';
const Add = () => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [success, setSuccess] = useState(false);
    const styles = {
        // border: '1px solid black',
        width: 600,
        color: 'black',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        margin: '0 auto',
        marginTop: '10%',
        marginBottom: '10%',
        backgroundColor: 'white',
    };

    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [fileSize, setFileSize] = useState('');
    const [fileData, setFileData] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    // global state to use
    const [globalSelected, setGlobalSelected] = useContext(SelectedContext);

    const uploadFile = (files) => {
        setFile(files[0]);
        setFileName(files[0].name);
        setFileType(files[0].type);
        setFileSize(files[0].size);
        setFileData(files[0].data);
        if (fileType === 'text/csv') {
            console.log('Good File Type');
        } else {
            console.error('Bad File Type');
        }
    };

    useEffect(() => {
        axios
            .get(api_link + '/api/models', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + localStorage.getItem('token'),
                },
            })
            .then((res) => {
                setOptions(res.data);
            });
    }, []);

    const selectModel = (selectedOption) => {
        setSelectedOption(selectedOption);
        console.log('selectedoption', selectedOption);
        setGlobalSelected(selectedOption.id);
        // localStorage.setItem("selected", selectedOption.id);
    };
    return (
        <>
            {token && (
                <>
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
                                            You have selected{' '}
                                            {selectedOption.model_desc}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                    <h1 className="lg:text-3xl font-bold text-center m-5 p-5">
                        Drop like a Hot Potato
                    </h1>
                    <div className="lg:flex flex-col justify-center items-center">
                        <div className="flex flex-col items-center">
                            <label className="custom">
                                <div style={styles}>
                                    <form
                                        method="POST"
                                        // action={`${api_link}/api/files?token=${urlEncodedToken}`}
                                        onSubmit={(e) => {
                                            Promise.allSettled([
                                                // mutateDataFilesList(),
                                                // mutateModelList(),
                                            ])
                                                .then((e) =>
                                                    alert('done uploading')
                                                )
                                                .catch((e) =>
                                                    console.log('What happened')
                                                );
                                        }}
                                        target="uploadtarget"
                                        encType="multipart/form-data"
                                    >
                                        <input type="file" name="misc"></input>
                                    </form>
                                    <FileDrop
                                        onDrop={(files, event) =>
                                            console.log(files, event)
                                        }
                                    >
                                        Drop or click to upload CSV file here
                                    </FileDrop>
                                </div>
                            </label>
                            <button className="m-2 flex items-center justify-center w-full px-2 py-1 text-white transition-colors duration-200 transform bg-blue-600 rounded-md focus:outline-none sm:w-auto sm:mx-1 hover:bg-blue-500 focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-40">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 mx-1"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <span className="mx-1">Upload</span>
                            </button>

                            <div className="p-5 flex flex-col items-center ">
                                <div className="dropdown inline-block relative">
                                    <button
                                        className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
                                        style={{ transition: 'width 2s' }}
                                    >
                                        <span className="mr-1 ">
                                            {selectedOption?.model_desc ??
                                                'Select Model for Base Prediction'}
                                            {/* {options.length > 0 ? options[0].model_desc : "Select Model"} */}
                                        </span>
                                        <svg
                                            className="fill-current h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{' '}
                                        </svg>
                                    </button>
                                    <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                                        {options.map((option, i) => (
                                            <li key={option + i}>
                                                <p
                                                    href="#"
                                                    className="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block cursor-pointer"
                                                    onClick={() => {
                                                        // setSelectedOption(
                                                        //     option
                                                        // );
                                                        selectModel(option);
                                                        setSuccess(true);
                                                        setTimeout(() => {
                                                            setSuccess(false);
                                                        }, 2000);
                                                    }}
                                                >
                                                    {`${option.model_desc}`}
                                                </p>
                                            </li>
                                        ))}
                                    </ul>
                                    <table className="mt-44">
                                        <tbody>
                                            <tr>
                                                <td className="text-gray-700 bg-blue-100 m-5 p-5">
                                                    Description
                                                </td>
                                                <td className="text-gray-700 bg-slate-200 m-5 p-5">
                                                    {selectedOption.model_desc ?? (
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            Not selected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-gray-700 bg-blue-100 m-5 p-5">
                                                    Model location
                                                </td>
                                                <td className="text-gray-700 bg-slate-200 m-5 p-5">
                                                    {selectedOption.model_desc ?? (
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            Not selected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-gray-700 bg-blue-100 m-5 p-5">
                                                    Data location
                                                </td>
                                                <td className="text-gray-700 bg-slate-200 m-5 p-5">
                                                    {selectedOption.data_loc ?? (
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            Not selected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-gray-700 bg-blue-100 m-5 p-5">
                                                    Prediction data location
                                                </td>
                                                <td className="text-gray-700 bg-slate-200 m-5 p-5">
                                                    {selectedOption.pred_loc ?? (
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            Not selected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-gray-700 bg-blue-100 m-5 p-5">
                                                    Created at:
                                                </td>
                                                <td className="text-gray-700 bg-slate-200 m-5 p-5">
                                                    {selectedOption.createdAt ?? (
                                                        <span
                                                            style={{
                                                                color: 'red',
                                                            }}
                                                        >
                                                            Not selected
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                {/* <div>
                                    <button
                                        className="m-2 flex items-center justify-center w-full px-2 py-1 text-white transition-colors duration-200 transform bg-blue-600 rounded-md focus:outline-none sm:w-auto sm:mx-1 hover:bg-blue-500 focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                                        onClick={selectModel}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-5 h-5 mx-1"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        <span className="mx-1">Submit</span>
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {!token && (
                <>
                    <h1 className="lg:text-3xl font-bold text-center m-5 p-5">
                        Login to Upload
                    </h1>
                </>
            )}
        </>
    );
};

export default Add;
