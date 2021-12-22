import React, { useEffect, useState } from "react";
import axios from "axios";
import api_link from "../etc/api.js";

const Users = () => {
  const [TableData, setTableData] = useState([]);
  const [token, setToken] = useState("");
  useEffect(() => {
    setToken(localStorage.getItem("token"));
    if (token) {
      axios
        .get(api_link + "/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setTableData(res.data);
        });
    }
  }, [token]);

  return (
    <div className="mb-10">
      {TableData.length > 0 ? (
        <table class="shadow-lg bg-white">
          <tr>
            <th class="bg-blue-100 border text-center px-8 py-4">Id</th>
            <th class="bg-blue-100 border text-center px-8 py-4">Name</th>
            <th class="bg-blue-100 border text-center px-8 py-4">Email</th>
            <th class="bg-blue-100 border text-center px-8 py-4">Created At</th>
          </tr>
          {TableData.length > 0 &&
            TableData.map((data) => (
              <tr className="group">
                <td className="border text-center px-8 py-4 group-hover:bg-gray-100">
                  {" "}
                  {data._id}
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
