import React, { useContext, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useEffect } from "react";
import DatePicker from "react-date-picker";
import ClosedPieGraph from "../components/Graphs/ClosedPieGraph";
import LineChart from "../components/Graphs/LineGraph";
import { SelectedContext } from "../etc/context";
import axios from "axios";
import api_link from "../etc/api";
function Closed() {
    const [value, setValue] = React.useState(new Date());
    const year = useMemo(() => {
        return value.getFullYear();
    }, [value]);
    const month = useMemo(() => {
        return value.getMonth();
    }, [value]);

    // MAKE THE DATA
    const [alldata, setAlldata] = useState([]);
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [id, setId] = useContext(SelectedContext);

    const [selectedCategory, setSelectedCategory] =
        useState("Predicted Prob.1");
    const [selectableCategories, setSelectableCategories] = useState([
        "Predicted Prob.1",
    ]);

    useEffect(() => {
        axios
            .get(`${api_link}/api/models/preds/1`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;
                setAlldata(data);
                if (data.length > 0) {
                    setSelectableCategories(Object.keys(data[0]));
                }
            });
    }, [id, token]);

    // trimmed part of data
    const trimmedData = useMemo(() => {
        const data = alldata.filter((e) => {
            const dateString = e["Enquiry Date"];
            const datesplit = dateString.split("-");
            const dateyear = parseInt(datesplit[2]);
            const datemonth = parseInt(datesplit[1]);
            const pred = year === dateyear && month === datemonth;
            // console.log('Try',year,month,datesplit,pred);
            return pred;
        });
        console.log("trimmed data", data);
        return data;
    }, [year, month, alldata]);
    const { chartjsoptions } = useMemo(() => {
        const total = new Map();

        trimmedData.forEach((element) => {
            total.set(
                element["Predicted Prob.1"],
                (total.get(element["Predicted Prob.1"]) ?? 0) + 1
            );
        });
        const trimArray = [...total];
        const labels = trimArray.map((e) => e[0]);
        const counts = trimArray.map((e) => e[1]);
        const chartjsoptions = {
            labels,
            datasets: [
                {
                    label: "My First Dataset",
                    data: counts,
                    backgroundColor: [
                        "rgb(255, 99, 132)",
                        "rgb(54, 162, 235)",
                        "rgb(255, 205, 86)",
                        "#2E7500",
                        "#839DD0",
                        "#007280",
                        "#7985C3",
                        "#EB9E64",
                        "#D2D4C0",
                        "#AEA306",
                    ],
                    hoverOffset: 4,
                },
            ],
        };
        return { labels, counts, chartjsoptions };
    }, [trimmedData]);

    // const groupByCol = "Enquiry Status Reasoning";

    const { labels: groupedLabels, chartjsoptions: groupedchartjsoptions } =
        useMemo(() => {
            const total = new Map();
            trimmedData.forEach((element) => {
                total.set(
                    element[selectedCategory],
                    (total.get(element[selectedCategory]) ?? 0) + 1
                );
            });
            const trimArray = [...total];
            const labels = trimArray.map((e) => e[0]);
            const counts = trimArray.map((e) => e[1]);
            const chartjsoptions = {
                labels,
                datasets: [
                    {
                        type: "bar",
                        label: "Grouped",
                        data: counts,
                        backgroundColor: "rgb(255, 99, 132)",
                        hoverOffset: 4,
                    },
                    {
                        type: "line",
                        label: "CF",
                        data: counts.map((e,i,x)=>{
                            let sum=0;
                            for(let it=0;it<i;it++){
                                sum+=x[it]
                            }
                            return sum;
                        }),
                        backgroundColor: "rgb( 99,255, 132)",
                        hoverOffset: 4,
                    },
                ],
            };
            return { labels, counts, chartjsoptions };
        }, [trimmedData, selectedCategory]);
    // console.log("log", getMeHelp);
    return ((id!==null&&id!==undefined)?
        <>
            <div className="flex flex-row items-center justify-center m-5 p-5">
                <DatePicker
                    onChange={(date) => setValue(date)}
                    value={value}
                    format="MM/yyyy"
                    maxDetail="year"
                />
            </div>
            <div className="grid grid-flow-col grid-cols-1 lg:grid-cols-2">
                <div className="bg-gray-50 p-5 m-2">
                    <p>
                        <span className="text-gray-500">Expense :</span>
                    </p>

                    <ClosedPieGraph
                        height={200}
                        width={200}
                        chartjsdata={chartjsoptions}
                    />
                </div>
                <div className="bg-gray-50 p-5 m-2">
                    <p>
                        <span className="text-gray-500">Grouped :</span>
                        <select
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                            }}
                        >
                            {selectableCategories.map((e) => (
                                <option key={e} value={e}>
                                    {e}
                                </option>
                            ))}
                        </select>
                    </p>
                    <LineChart
                        height={200}
                        width={200}
                        data={groupedchartjsoptions}
                    />
                    <div className="m-5" />
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            {/* <InputLabel id="demo-simple-select-label">
                                Age
                            </InputLabel> */}
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
        </>:<>No model selected</>
    );
}

export default Closed;
