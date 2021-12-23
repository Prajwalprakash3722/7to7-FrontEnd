import React, { useState, useEffect, useContext, useMemo } from "react";
import { SelectedContext } from "../etc/context";
import axios from "axios";
import api_link from "../etc/api";

export default function PredTables() {
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [id, setId] = useContext(SelectedContext);
    const [tableData, setTableData] = useState([]);
    const [tableHeaders, setTableHeaders] = useState([]);
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
                setTableHeaders(Object.keys(res.data[0]));

                setTableData(res.data);

                //   console.log(res);
            });
    }, [id]);
    return (
        <>
            <table>
                <tr>
                    {tableHeaders.map((e) => (
                        <td key={e}>{e}</td>
                    ))}
                </tr>

                {tableData.map((e) => (
                    <tr>
                        {Object.keys(e).map((val, index) => (
                            <td key={e+val+index}>{e[tableHeaders[index]]}</td>
                        ))}
                    </tr>
                ))}
            </table>
        </>
    );
}
