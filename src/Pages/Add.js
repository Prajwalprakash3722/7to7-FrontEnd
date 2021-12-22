import React, { useEffect } from "react";
import { FileDrop } from "react-file-drop";
import "./Add.css";

import axios from "axios";

const Add = () => {
  const styles = {
    border: "1px solid black",
    width: 600,
    color: "black",
    padding: 20,
  };

  const [file, setFile] = React.useState(null);
  const [fileName, setFileName] = React.useState("");
  const [fileType, setFileType] = React.useState("");
  const [fileSize, setFileSize] = React.useState("");
  const [fileData, setFileData] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState("");
  const uploadFile = (files) => {
    setFile(files[0]);
    setFileName(files[0].name);
    setFileType(files[0].type);
    setFileSize(files[0].size);
    setFileData(files[0].data);
    if (fileType === "text/csv") {
      console.log("Good File Type");
    } else {
      console.error("Bad File Type");
    }
  };

  useEffect(() => {
    axios
      .get("http://172.16.18.42:3001/api/models", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setOptions(res.data);
        console.log(res);
      });
  }, []);

  const UploadModel = (sele) => {
    console.log(selectedOption.id);
    axios
      .get(`http://172.16.18.42:3001/api/models/preds/${selectedOption}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        console.log(res);
      });
    // };
  };

  return (
    <>
      <h1 className="lg:text-3xl font-bold text-center m-5 p-5">
        Drop like a Hot Potato
      </h1>
      <div className="lg:flex flex-col justify-center items-center">
        <div className="flex flex-col items-center">
          <div style={styles}>
            <FileDrop onDrop={(files, event) => console.log(files, event)}>
              Drop CSV file here
            </FileDrop>
          </div>
          <button className="m-2 flex items-center justify-center w-full px-2 py-1 text-white transition-colors duration-200 transform bg-blue-600 rounded-md focus:outline-none sm:w-auto sm:mx-1 hover:bg-blue-500 focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 mx-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <span className="mx-1">Upload</span>
          </button>

          <div className="p-5 flex flex-row items-center ">
            <div className="dropdown inline-block relative">
              <button className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center">
                <span className="mr-1">
                  {selectedOption
                    ? selectedOption
                    : "Select Model for Base Prediction"}
                  {/* {options.length > 0 ? options[0].model_desc : "Select Model"} */}
                </span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                </svg>
              </button>
              <ul className="dropdown-menu absolute hidden text-gray-700 pt-1">
                {options.map((option) => (
                  <li>
                    <p
                      href="#"
                      class="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block cursor-pointer"
                      onClick={() => setSelectedOption(option.id)}
                    >
                      {option.model_desc}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <button
                className="m-2 flex items-center justify-center w-full px-2 py-1 text-white transition-colors duration-200 transform bg-blue-600 rounded-md focus:outline-none sm:w-auto sm:mx-1 hover:bg-blue-500 focus:bg-blue-500 focus:ring focus:ring-blue-300 focus:ring-opacity-40"
                onClick={UploadModel()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 mx-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="mx-1">Submit</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
