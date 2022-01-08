import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useRefreshableData } from '../etc/useRefreshableData';
import api_link from '../etc/api';
import { masterListColumns } from '../etc/columns';
import { useTable } from 'react-table';
function AddModel() {
    const token = useMemo(() => localStorage.getItem('token'), []);
    const urlEncodedToken = useMemo(() => localStorage.getItem('token'), []);
    const [model, setModel] = useState({
        description: '',
        model_location: '',
        data_source: '',
    });

    const { data: masterList, mutator: mutateMasterList } = useRefreshableData(
        `${api_link}/api/models`,
        []
    );

    const masterListDataColumns = useMemo(() => masterListColumns, []);
    // const update
    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
        useTable({
            columns: masterListDataColumns,
            data: masterList,
        });

    const {
        data: modelList,
        mutator: mutateModelList,
        isReady: modelListIsReady,
    } = useRefreshableData(`${api_link}/api/files/models`, []);
    const {
        data: dataFilesList,
        mutator: mutateDataFilesList,
        isReady: dataFilesListIsReady,
    } = useRefreshableData(`${api_link}/api/files/data`, []);

    return (
        /*
         * * DONE styling
         */
        <>
            <div>
                <div className="m-5 flex flex-col items-center justify-center">
                    <table {...getTableProps()}>
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th
                                            className="bg-blue-100 border text-center"
                                            {...column.getHeaderProps()}
                                        >
                                            {column.render('Header')}
                                        </th>
                                    ))}
                                    <th className="bg-blue-100 border text-center"  >Actions</th>
                                </tr>
                                    
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {rows.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        className="group"
                                        {...row.getRowProps()}
                                    >
                                        {row.cells.map((cell) => {
                                            return (
                                                <td
                                                    className="border text-center px-8 py-4 group-hover:bg-gray-100"
                                                    {...cell.getCellProps()}
                                                >
                                                    {cell.render('Cell')}
                                                </td>
                                            );
                                        })}
                                        <td>
                                            <button
                                                className="ml-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={(e) => {
                                                    axios
                                                        .delete(
                                                            `${api_link}/api/models/${row.original.id}`,
                                                            {
                                                                headers: {
                                                                    Authorization: `Bearer ${token}`,
                                                                },
                                                            }
                                                        )
                                                        .then((e) => {
                                                            return mutateMasterList();
                                                        })
                                                        .catch((e) =>
                                                            console.log(
                                                                'error updating and deleting master',e
                                                            )
                                                        );
                                                }}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="24"
                                                    height="24"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M9 19c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm4 0c0 .552-.448 1-1 1s-1-.448-1-1v-10c0-.552.448-1 1-1s1 .448 1 1v10zm5-17v2h-20v-2h5.711c.9 0 1.631-1.099 1.631-2h5.315c0 .901.73 2 1.631 2h5.712zm-3 4v16h-14v-16h-2v18h18v-18h-2z" />
                                                </svg>
                                            </button>
                                        {/* </td> */}

                                                {/* Refresh button */}
                                        {/* <td> */}
                                            <button
                                                className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                                type="button"
                                                onClick={(e) => {
                                                    axios
                                                        .get(
                                                            `${api_link}/api/models/revalidate/${row.original.id}`,
                                                            {
                                                                headers: {
                                                                    Authorization: `Bearer ${token}`,
                                                                },
                                                            }
                                                        )
                                                        .then((e) => {
                                                            return mutateMasterList();
                                                        })
                                                        .catch((e) =>
                                                            console.log(
                                                                'error updating and deleting master',e
                                                            )
                                                        );
                                                }}
                                            >
                                                <svg fill="#000000" xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 30 30" width="1.25rem" height="1.25rem"><path d="M 15 3 C 12.031398 3 9.3028202 4.0834384 7.2070312 5.875 A 1.0001 1.0001 0 1 0 8.5058594 7.3945312 C 10.25407 5.9000929 12.516602 5 15 5 C 20.19656 5 24.450989 8.9379267 24.951172 14 L 22 14 L 26 20 L 30 14 L 26.949219 14 C 26.437925 7.8516588 21.277839 3 15 3 z M 4 10 L 0 16 L 3.0507812 16 C 3.562075 22.148341 8.7221607 27 15 27 C 17.968602 27 20.69718 25.916562 22.792969 24.125 A 1.0001 1.0001 0 1 0 21.494141 22.605469 C 19.74593 24.099907 17.483398 25 15 25 C 9.80344 25 5.5490109 21.062074 5.0488281 16 L 8 16 L 4 10 z"/></svg>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                <h1 className="text-center text-3xl font-bold text-gray-600 m-5 p-5">
                    Add Model
                </h1>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-xs">
                        <form
                            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                axios
                                    .post(
                                        `${api_link}/api/models`,
                                        {
                                            model_desc:
                                                e.target.model_desc.value,
                                            model_loc: e.target.modelfile.value,
                                            data_loc: e.target.datafile.value,
                                        },
                                        {
                                            headers: {
                                                Authorization: `Bearer ${token}`,
                                            },
                                        }
                                    )
                                    .then((res) => {
                                        console.log(res);
                                        console.log(res.data);
                                        alert('Added');
                                        return mutateMasterList();
                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            }}
                        >
                            <div className="mb-4">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="username"
                                >
                                    Model Description:
                                </label>
                                <input
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="modeldesc"
                                    type="text"
                                    name="model_desc"
                                    placeholder=" Model Description"
                                    required
                                />
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="modelfile"
                                >
                                    Model Location:
                                </label>
                                <select
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="modelfile"
                                    name="modelfile"
                                    required
                                >
                                    {modelListIsReady ? (
                                        modelList.map((e) => (
                                            <option value={e.name} key={e.name}>
                                                {e.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled selected>
                                            Loading...
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className="mb-6">
                                <label
                                    className="block text-gray-700 text-sm font-bold mb-2"
                                    htmlFor="datafile"
                                >
                                    Data Source:
                                </label>
                                <select
                                    name="datafile"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    id="datafile"
                                    required
                                >
                                    {dataFilesListIsReady ? (
                                        dataFilesList.map((e) => (
                                            <option value={e.name} key={e.name}>
                                                {e.name}
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled selected>
                                            Loading...
                                        </option>
                                    )}
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <button
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="submit"
                                >
                                    Add Model
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <h1 className="text-center text-3xl font-bold text-gray-600 m-5 p-5">
                    Upload artifacts (.csv and .rds)
                </h1>
                <div className="flex flex-col items-center justify-center">
                    <div className=" w-full max-w-xs">
                        <form
                            method="POST"
                            action={`${api_link}/api/files?token=${urlEncodedToken}`}
                            onSubmit={(e) => {
                                Promise.allSettled([
                                    mutateDataFilesList(),
                                    mutateModelList(),
                                ])
                                    .then((e) => alert('done uploading'))
                                    .catch((e) => console.log('What happened'));
                            }}
                            target="uploadtarget"
                            encType="multipart/form-data"
                            style={{ textAlign: 'center' }}
                        >
                            <label
                                className="custom"
                                style={{ margin: 'auto' }}
                            >
                                Add File
                                <input type="file" name="misc"></input>
                            </label>
                            <button
                                className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>{' '}
                        {new Array(3).fill(undefined).map((e) => (
                            <br />
                        ))}
                        {/* this iframe will make the form request, itll be hidden tho */}
                        <iframe
                            title="uploadtarget"
                            name="uploadtarget"
                            height="0"
                            width="0"
                        ></iframe>
                    </div>
                </div>
            </div>
        </>
    );
}

export default AddModel;
