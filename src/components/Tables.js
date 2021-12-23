import React, { useEffect, useState } from "react";
import axios from "axios";
import api_link from "../etc/api";
const Users = () => {
  const [TableData, setTableData] = useState([]);
  const [id, setId] = useState("");
  const [token, setToken] = useState("");
  const [header, setHeader] = useState([]);
  useEffect(() => {
    setId(localStorage.getItem("selected"));
    setToken(localStorage.getItem("token"));
    if (token) {
      axios
        .get(api_link + `/api/models/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTableData(res.data);
          setHeader(res.data[0]);
          console.log(header);
        });
    }
  }, [id, token]);

  return (
    <div className="mb-10">
      {TableData.length > 0 ? (
        <table class="shadow-lg bg-white">
          <tr>
            {header.map((item) => (
              <th class="bg-blue-100 border text-center px-8 py-4">{item}</th>
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
