import React, { useEffect, useState, useContext, useMemo } from 'react';
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

    // const [file, setFile] = useState(null);
    // const [fileName, setFileName] = useState('');
    // const [fileType, setFileType] = useState('');
    // const [fileSize, setFileSize] = useState('');
    // const [fileData, setFileData] = useState('');
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');

    // global state to use
    const [globalSelected, setGlobalSelected] = useContext(SelectedContext);

    const [confusionData, setConfusionData] = useState(null);

    // get model list
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

    useEffect(() => {
        (() => {
            // short circuit the axios request if id is not available
            if (globalSelected)
                return axios.get(
                    `${api_link}/api/models/conf/${globalSelected}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
            else return new Promise((res) => res({ data: null }));
        })().then(({ data }) => {
            console.log(data);
            setConfusionData(data);
        });
    }, [globalSelected]);

    const totalRowCols = useMemo(() => {
        let rows = [0, 0],
            cols = [0, 0],
            total = 0;
        if (confusionData) {
            cols = [
                confusionData[1][0] + confusionData[0][0],
                confusionData[1][1] + confusionData[0][1],
            ];
            rows = [
                confusionData[0][0] + confusionData[0][1],
                confusionData[1][0] + confusionData[1][1],
            ];
            total = rows[0] + rows[1];
        }
        console.log('i maked this', rows, cols, total);
        return { rows, cols, total };
    }, [confusionData]);

    const selectModel = (selectedOption) => {
        setSelectedOption(selectedOption);
        console.log('selectedoption', selectedOption);
        setGlobalSelected(selectedOption?.id ?? null);
        // localStorage.setItem("selected", selectedOption.id);
    };
    return (
        <>
            {token && (
                <>
                    {success && (
                        <>
                            <div
                                className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 "
                                style={{
                                    position: 'fixed',
                                    bottom: '2rem',
                                    right: '2rem',
                                }}
                            >
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
                        Select a Model
                    </h1>
                    <div className="lg:flex flex-col justify-center items-center">
                        <div className="flex flex-col items-center">
                            <div className="p-5 flex flex-col items-center ">
                                <div className="dropdown inline-block relative">
                                    <label
                                        className="block text-gray-700 text-sm font-bold mb-2"
                                        htmlFor="modelfile"
                                    >
                                        Pick a model:
                                    </label>
                                    <select
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        id="modelfile"
                                        name="modelfile"
                                        required
                                        onChange={(e) => {
                                            if (e.target.value) {
                                                selectModel(
                                                    options[e.target.value]
                                                );
                                                setSuccess(true);
                                                setTimeout(() => {
                                                    setSuccess(false);
                                                }, 2000);
                                            } else selectModel(null);
                                        }}
                                    >
                                        {options ? (
                                            <>
                                                <option
                                                    disabled
                                                    selected
                                                    value={null}
                                                >
                                                    Select a model
                                                </option>
                                                {options.map((e, i) => (
                                                    <option
                                                        value={i}
                                                        key={e.model_desc + i}
                                                    >
                                                        {`${e.model_desc}`}
                                                    </option>
                                                ))}
                                            </>
                                        ) : (
                                            <option
                                                disabled
                                                selected
                                                value={null}
                                            >
                                                Loading...
                                            </option>
                                        )}
                                    </select>
                                    {selectedOption ? (
                                        <table className="mt-8">
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
                                                        {selectedOption.model_loc ?? (
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
                                                        Confusion data location
                                                    </td>
                                                    <td className="text-gray-700 bg-slate-200 m-5 p-5">
                                                        {selectedOption.conf_loc ?? (
                                                            <span
                                                                style={{
                                                                    color: 'red',
                                                                }}
                                                            >
                                                                Empty
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
                                    ) : (
                                        <div className="mt-8">
                                            Click on a model to get started
                                        </div>
                                    )}
                                </div>

                                {confusionData && (
                                    <div className="p-5 flex flex-col items-center mt-3">
                                        <h1 className="text-neutral-500 text-2xl m-5">
                                            Confusion Matrix for{' '}
                                            {selectedOption.model_desc}
                                        </h1>
                                        <table class="min-w-full bg-white">
                                            <thead className="bg-gray-600 text-white">
                                                <tr>
                                                    <th></th>
                                                    <th className="text-center p-5 uppercase font-semibold text-sm">
                                                        Positive
                                                    </th>
                                                    <th className="text-center p-5 uppercase font-semibold text-sm">
                                                        Negative
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr className="bg-gray-100">
                                                    <th className="text-center p-5 bg-gray-600 text-white uppercase font-semibold text-sm">
                                                        Positive
                                                    </th>
                                                    <td className="w-1/2 text-center py-3 px-4">
                                                        {confusionData[0][0]} -{' '}
                                                        {(
                                                            (confusionData[0][0] *
                                                                100) /
                                                            totalRowCols.total
                                                        ).toFixed(2)}{' '}
                                                        %
                                                    </td>
                                                    <td className="w-1/2 text-center py-3 px-4">
                                                        {confusionData[0][1]} -{' '}
                                                        {(
                                                            (confusionData[0][1] *
                                                                100) /
                                                            totalRowCols.total
                                                        ).toFixed(2)}{' '}
                                                        %
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th className="text-center p-5 bg-gray-600 text-white uppercase font-semibold text-sm">
                                                        Negative
                                                    </th>
                                                    <td className="w-1/2 text-center py-3 px-4">
                                                        {confusionData[1][0]} -{' '}
                                                        {(
                                                            (confusionData[1][0] *
                                                                100) /
                                                            totalRowCols.total
                                                        ).toFixed(2)}{' '}
                                                        %
                                                    </td>
                                                    <td className="w-1/2 text-center py-3 px-4">
                                                        {confusionData[1][1]} -{' '}
                                                        {(
                                                            (confusionData[1][1] *
                                                                100) /
                                                            totalRowCols.total
                                                        ).toFixed(2)}{' '}
                                                        %
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            {!token && (
                <>
                    <h1 className="lg:text-3xl text-center m-5 p-5">
                        Login to get started!
                    </h1>
                </>
            )}
        </>
    );
};

export default Add;
