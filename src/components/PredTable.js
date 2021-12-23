import React, { useState, useEffect, useContext, useMemo } from "react";
import { SelectedContext } from "../etc/context";
import axios from "axios";
import api_link from "../etc/api";
import { useTable, usePagination } from "react-table";

export default function PredTables() {
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [id, setId] = useContext(SelectedContext);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([
        { Header: "Preducctions", columns: [] },
    ]);
    useEffect(() => {
        console.log(`Hey look our id is ${id}`);
        axios
            .get(`${api_link}/api/models/preds/1`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;
                // set the headers
                if (!res.data[0]) {
                    // no first element for comparison
                    console.warn("No headers ;_;");
                    return;
                }
                const settableheaders = [
                    {
                        Header: "Preducctions",
                        columns: Object.keys(res.data[0] ?? {}).map((e) => {
                            return {
                                Header: e,
                                accessor:
                                    e === ""
                                        ? (data) => {
                                              return data[""];
                                          }
                                        : e,
                                id: e === "" ? "id" : e,
                            };
                        }),
                    },
                ];
                setTableHeaders(settableheaders);

                setTableData(res.data);

                //   console.log(res);
            })
            .catch((e) => console.error("Model predict get failed", e));
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
        },
        usePagination
    );

    // Render the UI for your table
    return (
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
                        display: "block",
                        maxWidth: "100%",
                        overflowX: "scroll",
                        // overflowY: "hidden",
                        borderBottom: "1px solid black",
                    }}
                >
                    <table {...getTableProps()} className="shadow-lg bg-white">
                        <thead>
                            {headerGroups.map((headerGroup) => (
                                <tr {...headerGroup.getHeaderGroupProps()}>
                                    {headerGroup.headers.map((column) => (
                                        <th {...column.getHeaderProps()}>
                                            {column.render("Header")}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        <tbody {...getTableBodyProps()}>
                            {page.map((row, i) => {
                                prepareRow(row);
                                return (
                                    <tr
                                        {...row.getRowProps()}
                                        className="group"
                                    >
                                        {row.cells.map((cell) => {
                                            return (
                                                <td
                                                    {...cell.getCellProps()}
                                                    className="border text-center px-8 py-4 group-hover:bg-gray-100"
                                                >
                                                    {cell.render("Cell")}
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
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {"<<"}
                    </button>{" "}
                    <button
                        onClick={() => previousPage()}
                        disabled={!canPreviousPage}
                    >
                        {"<"}
                    </button>{" "}
                    <button onClick={() => nextPage()} disabled={!canNextPage}>
                        {">"}
                    </button>{" "}
                    <button
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {">>"}
                    </button>{" "}
                    <span>
                        Page{" "}
                        <strong>
                            {pageIndex + 1} of {pageOptions.length}
                        </strong>{" "}
                    </span>
                    <span>
                        | Go to page:{" "}
                        <input
                            type="number"
                            defaultValue={pageIndex + 1}
                            onChange={(e) => {
                                const page = e.target.value
                                    ? Number(e.target.value) - 1
                                    : 0;
                                gotoPage(page);
                            }}
                            style={{ width: "100px" }}
                        />
                    </span>{" "}
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                        }}
                    >
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </select>
                    <div style={{marginTop:'1rem'}}/>
                </div>
        </>
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
