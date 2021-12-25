import React, { useState } from 'react';
import axios from 'axios';
function AddModel() {
    const [model, setModel] = useState({
        description: '',
        model_location: '',
        data_source: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        axios
            .post('http://localhost:5000/api/models', model)
            .then((res) => {
                console.log(res);
                console.log(res.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <>
            <div>
                <h1 className="text-center text-3xl font-bold text-gray-600 m-5 p-5">
                    Add Model
                </h1>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-xs">
                        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="username"
                                >
                                    Model Description:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    type="text"
                                    placeholder=" Model Description"
                                    onChange={(e) =>
                                        setModel({
                                            ...model,
                                            description: e.target.value,
                                        })
                                    }
                                />
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="username"
                                >
                                    Model Location:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    type="text"
                                    placeholder=" Model Location"
                                    onChange={(e) =>
                                        setModel({
                                            ...model,
                                            model_location: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="Data Source"
                                >
                                    Data Source:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="username"
                                    type="text"
                                    placeholder="Data Source"
                                    onChange={(e) =>
                                        setModel({
                                            ...model,
                                            data_source: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                                    onClick={() => {
                                        console.log(model);
                                    }}
                                >
                                    Add Model
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddModel;
