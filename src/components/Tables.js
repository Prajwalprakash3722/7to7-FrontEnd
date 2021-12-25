import React, { useState, useEffect, useContext, useMemo } from 'react';
import { SelectedContext } from '../etc/context';
import axios from 'axios';
import api_link from '../etc/api';
import { useTable, usePagination, useFilters } from 'react-table';
import { ColumnFilter } from './misc/ColFilter';

export default function PredTables() {
    const token = useMemo(() => localStorage.getItem('token'), []);
    const [isReady, setIsReady] = useState(false);
    const [id] = useContext(SelectedContext);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([
        { Header: 'Input Data', columns: [] },
    ]);
    const colFilterer = useMemo(() => {
        return {
            Filter: ColumnFilter,
        };
    }, []);

    useEffect(() => {
        console.log(`Hey look our id is ${id}`);
        (() => {
            // short circuit the axios request if id is not available
            if (id)
                return axios.get(`${api_link}/api/models/${id ?? 1}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            else return new Promise((res) => res({ data: [] }));
        })()
            .then((res) => {
                // set the headers
                if (!res.data[0]) {
                    // no first element for comparison
                    console.warn('No headers ;_;');
                    return;
                }
                setIsReady(true);
                const settableheaders = [
                    {
                        Header: 'Data input table',
                        columns: Object.keys(res.data[0] ?? {}).map((e) => {
                            return {
                                Header: e===''?'#':e,
                                accessor: (data) => {
                                    return data[''];
                                },
                                id: e === '' ? 'id' : e,
                            };
                        }),
                    },
                ];
                setTableHeaders(settableheaders);

                setTableData(res.data);

                //   console.log(res);
            })
            .catch((e) => console.error('Model predict get failed', e));
    }, [id]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page

        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns: tableHeaders,
            /* tableData */

            data: tableData,
            defaultColumn: colFilterer,
        },
        useFilters,
        usePagination
    );

    // Render the UI for your table
    return isReady && id !== undefined && id !== null ? (
        <>
            {/* <pre>
                <code>
                    {JSON.stringify(
                        {
                            pageIndex,
                            pageSize,
                            pageCount,
                            canNextPage,
                            canPreviousPage,
                        },
                        null,
                        2
                    )}
                </code>
            </pre> */}
            <div
                style={{
                    display: 'block',
                    maxWidth: '100%',
                    overflowX: 'scroll',
                    // overflowY: "hidden",
                    borderBottom: '1px solid black',
                }}
            >
                <table {...getTableProps()} className="shadow-lg bg-white">
                    <thead>
                        {headerGroups.map((headerGroup) => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map((column) => (
                                    <th
                                        className="bg-blue-100 border text-center"
                                        {...column.getHeaderProps()}
                                    >
                                        <div>{column.render('Header')}</div>
                                        <br />
                                        <div>
                                            {column.canFilter &&
                                                column.render('Filter')}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {page.map((row, i) => {
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()} className="group">
                                    {row.cells.map((cell) => {
                                        return (
                                            <td
                                                {...cell.getCellProps()}
                                                className="border text-center px-8 py-4 group-hover:bg-gray-100"
                                            >
                                                {cell.render('Cell')}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            {/* 
            Pagination can be built however you'd like. 
            This is just a very basic UI implementation:
          */}
            <br />
            <div className="pagination">
                <button
                    className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                >
                    {'<<'}
                </button>{' '}
                <button
                    className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                >
                    {'<'}
                </button>{' '}
                <button
                    onClick={() => nextPage()}
                    disabled={!canNextPage}
                    className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                >
                    {'>'}
                </button>{' '}
                <button
                    onClick={() => gotoPage(pageCount - 1)}
                    className="px-4 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-200 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    disabled={!canNextPage}
                >
                    {'>>'}
                </button>{' '}
                <span>
                    Page{' '}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>{' '}
                </span>
                <span>
                    | Go to page:{' '}
                    {/* <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                gotoPage(page);
                            }}
                            style={{ width: "100px" }}
                        /> */}
                    <input
                        type="number"
                        onChange={(e) => {
                            const page = e.target.value
                                ? Number(e.target.value) - 1
                                : 0;
                            gotoPage(page);
                        }}
                        defaultValue={pageIndex + 1}
                        className="px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                    />
                </span>
                {/* <div> */}
                {/* </div> */}{' '}
                <select
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                    }}
                    className="px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
                >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
                <div style={{ marginTop: '1rem' }} />
            </div>
        </>
    ) : (
        <>{id === null || id === undefined ? 'No model' : 'Loading'}</>
    );

    // table stuff

    // return (
    //     <>
    //         {/* <table>
    //             <tr>
    //                 {tableHeaders.map((e) => (
    //                     <td key={e}>{e}</td>
    //                 ))}
    //             </tr>

    //             {tableData.map((e) => (
    //                 <tr>
    //                     {Object.keys(e).map((val, index) => (
    //                         <td key={e+val+index}>{e[tableHeaders[index]]}</td>
    //                     ))}
    //                 </tr>
    //             ))}
    //         </table> */}
    //     </>
    // );
}
