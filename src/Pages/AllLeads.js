import React, { useMemo } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';
import DatePicker from 'react-date-picker';
import Overview from '../components/Graphs/DatasetOverviewChart';
function AllLeads() {
    const [value, setValue] = React.useState(new Date());
    const yearDecided = useMemo(() => {
        return value.getFullYear();
    }, [value]);
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
                    onChange={(date) => {
                        setValue(date);
                    }}
                    value={value}
                    format="yyyy"
                    maxDetail="decade"
                />
            </div>
            {/* dateFormat="MM/yyyy" */}
            <div className="grid grid-flow-col grid-cols-1 lg:grid-cols-1">
                {/* <div className="bg-gray-50 p-5 m-2">
          <p>
            <span className="text-gray-500">Expense :</span>
          </p>

          <PieChart height={200} width={200} />
        </div> */}
                <div className="bg-gray-50 p-5 m-2">
                    <p>
                        <span className="text-gray-500">
                            Year Selected : {yearDecided}{' '}
                        </span>
                    </p>
                    {/* <LineChart height={200} width={200} /> */}
                    {/* <Mixed />
                     */}
                    <Overview year={yearDecided} />
                    <div className="m-5" />
                </div>
            </div>
        </>
    );
}

export default AllLeads;
