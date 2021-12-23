import React, { useContext, useEffect, useState, useMemo } from "react";
import axios from "axios";
import api_link from "../etc/api";
import { SelectedContext } from "../etc/context";
const Users = () => {
    const [TableData, setTableData] = useState([]);
    const [id, setId] = useContext(SelectedContext); //useState("");
    // const [token, setToken] = useState(()=>localStorage.getItem("token"));
    // we arent using setToken -> localStorage can itself preserve values between renders, useMemo is better
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [header, setHeader] = useState([]);
    useEffect(() => {
        // setId(localStorage.getItem("selected"));
        // setToken(localStorage.getItem("token"));
        if (token) {
            axios
                .get(api_link + `/api/models/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((res) => {
                    setTableData(res.data);
                    // setHeader(res.data[0]);

                    console.log("headers test", header);
                })
                .catch(console.error);
        } else {
            console.error("No token");
        }
    }, [id]);

    return (
        <div className="mb-10">
            {TableData.length > 0 ? (
                <table class="shadow-lg bg-white">
                    <tr>
                        {header.map((item, i) => (
                            <th
                                class="bg-blue-100 border text-center px-8 py-4"
                                key={item + i}
                            >
                                {item}
                            </th>
                        ))}
                    </tr>
                    {TableData.length > 0 &&
                        TableData.map((data) => (
                            <tr className="group">
                                <td className="border text-center px-8 py-4 group-hover:bg-gray-100">
                                    {" "}
                                    {data.id}
                                </td>
                                <td className="border text-center px-8 py-4 group-hover:bg-gray-100">
                                    {data.name}
                                </td>
                                <td className="border text-center px-8 py-4 group-hover:bg-gray-100">
                                    {data.email}
                                </td>
                                <td className="border text-center px-8 py-4 group-hover:bg-gray-100">
                                    {data.date}
                                </td>
                            </tr>
                        ))}
                </table>
            ) : (
                <div></div>
            )}
        </div>
    );
};

export default Users;
