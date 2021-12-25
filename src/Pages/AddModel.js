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
                                                className="ml-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
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
                                                            window.alert(
                                                                'Model Deleted'
                                                            );
                                                            return mutateMasterList();
                                                        })
                                                        .catch((e) =>
                                                            console.log(
                                                                'error updating and deleting master'
                                                            )
                                                        );
                                                }}
                                            >
                                                Del
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
                    <div className="w-full max-w-xs">
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
                        >
                            <input type="file" name="misc"></input>
                            <button
                                className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                        </form>
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
