import React from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";
import DatePicker from "react-date-picker";
import PieChart from "../components/Graphs/PieGraph";
import LineChart from "../components/Graphs/LineGraph";
import Mixed from "../components/Graphs/Mixed";
function Closed() {
  const [value, setValue] = React.useState(new Date());
  // const FetchData = (sele) => {
  //   console.log(selectedOption.id);
  //   axios
  //     .get(`http://172.16.18.42:3001/api/models/preds/${selectedOption}`, {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     })
  //     .then((res) => {
  //       setGlobalSelected(res.data);
  //     });
  // };
  return (
    <>
      <div className="flex flex-row items-center justify-center m-5 p-5">
        <DatePicker
          onChange={(date) => setValue(date)}
          value={value}
          format="dd/MM/yyyy"
        />
      </div>
      <div className="grid grid-flow-col grid-cols-1 lg:grid-cols-1">
        {/* <div className="bg-gray-50 p-5 m-2">
          <p>
            <span className="text-gray-500">Expense :</span>
          </p>

          <PieChart height={200} width={200} />
        </div> */}
        <div className="bg-gray-50 p-5 m-2">
          <p>
            <span className="text-gray-500">Expense :</span>
          </p>
          {/* <LineChart height={200} width={200} /> */}
          <Mixed />
          <div className="m-5" />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Age</InputLabel>
              {/* <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={age}
                label="Age"
                onChange={handleChange}
              > */}
              {/* <MenuItem value={10}>Ten</MenuItem>
                <MenuItem value={20}>Twenty</MenuItem>
                <MenuItem value={30}>Thirty</MenuItem>
              </Select> */}
            </FormControl>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Closed;
