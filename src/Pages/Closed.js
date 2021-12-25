import React, { useContext, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';
import DatePicker from 'react-date-picker';
// import LineChart from '../components/Graphs/LineGraph';
import { SelectedContext } from '../etc/context';
import axios from 'axios';
import api_link from '../etc/api';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
} from 'chart.js';
import { Doughnut as PieChart, Line as LineChart } from 'react-chartjs-2';
ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

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
    const token = useMemo(() => localStorage.getItem('token'), []);
    const [id] = useContext(SelectedContext);

    // selected category from the below - this state is guaranteed to exist in the beginning
    const [selectedCategory, setSelectedCategory] =
        useState('Predicted Prob.1');
    // set of categories that can be selected
    const [selectableCategories, setSelectableCategories] = useState([
        'Predicted Prob.1',
    ]);

    //null for
    const [selectedProbabilitySection, setSelectedProbabilitySection] =
        useState(null);
    useEffect(() => {
        (() => {
            // short circuit the axios request if id is not available
            if (id !== undefined && id !== null)
                return axios.get(`${api_link}/api/models/preds/${id ?? 1}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            else return new Promise((res) => res({ data: [] }));
        })().then((res) => {
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
            // check if month and year matches - split by separator
            const dateString = e['Enquiry Date'];
            const datesplit = dateString.split(/-|\//);
            const dateyear = parseInt(datesplit[2]);
            const datemonth = parseInt(datesplit[1]);
            const pred = year === dateyear && month === datemonth;
            // console.log('Try',year,month,datesplit,pred);
            return pred;
        });
        // console.log('trimmed data', data);
        return data;
    }, [year, month, alldata]);
    // chart for all the probabilities
    const {
        counts: probfrequencyCounts,
        labels: probfrequencyLabels,
        chartjsdata: probfreqchartjsdata,
    } = useMemo(() => {
        // this is a very easy yet terse count reduction using a map
        const total = new Map();

        trimmedData.forEach((element) => {
            total.set(
                element['Predicted Prob.1'],
                // get the current value (if there isnt any, take 0) then add one
                (total.get(element['Predicted Prob.1']) ?? 0) + 1
            );
        });
        // convert to a nice array
        const trimArray = [...total];
        // sort these based on the probability values
        trimArray.sort((a, b) => {
            return a[0] - b[0];
        });
        // unzip the above array into labels and counts
        const labels = trimArray.map((e) => e[0]);
        const counts = trimArray.map((e) => e[1]);

        const chartjsdata = {
            labels,
            datasets: [
                {
                    label: 'My First Dataset',
                    data: counts,
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        '#2E7500',
                        '#839DD0',
                        '#007280',
                        '#7985C3',
                        '#EB9E64',
                        '#D2D4C0',
                        '#AEA306',
                    ],
                    hoverOffset: 4,
                },
            ],
        };
        return { labels, counts, chartjsdata: chartjsdata };
    }, [trimmedData]);

    // const groupByCol = "Enquiry Status Reasoning";
    // per group counts
    const { labels: groupedLabels, chartjsdata: groupedchartjsoptions } =
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
            const chartjsdata = {
                labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Grouped',
                        stack: 'stack1',
                        data: counts,
                        backgroundColor: 'rgba(255, 99, 132,.7)',
                        hoverOffset: 4,
                    },
                    {
                        type: 'line',
                        label: 'CF',
                        data: counts.map((e, i, x) => {
                            let sum = 0;
                            for (let it = 0; it < i; it++) {
                                sum += x[it];
                            }
                            return sum;
                        }),
                        backgroundColor: 'rgb( 99,255, 132)',
                        hoverOffset: 4,
                    },
                ],
            };

            // if we have selected a probability section we need to show that as well
            if (selectedProbabilitySection !== null) {
                const total = new Map();
                trimmedData
                    .filter(
                        (e) =>
                            e['Predicted Prob.1'] === selectedProbabilitySection
                    )
                    .forEach((element) => {
                        total.set(
                            element[selectedCategory],
                            (total.get(element[selectedCategory]) ?? 0) + 1
                        );
                    });
                // use existing labels to construct a count set in the same order - use 0 if not in the map
                const probabilityFilteredCounts = labels.map((label) => {
                    return total.get(label) ?? 0;
                });
                // add this extra map
                chartjsdata.datasets.push({
                    type: 'bar',
                    label: `Selected Probability (${selectedProbabilitySection})`,
                    data: probabilityFilteredCounts,
                    backgroundColor: 'rgb( 99,255, 132)',
                    stack: 'stack1',

                    hoverOffset: 4,
                });
            }
            return { labels, counts, chartjsdata };
        }, [trimmedData, selectedProbabilitySection, selectedCategory]);
    // console.log("log", getMeHelp);

    return id !== null && id !== undefined ? (
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

                    <PieChart
                        data={probfreqchartjsdata}
                        options={{
                            onClick: (_evt, elements) => {
                                // data index
                                const elementClickedIndex = elements[0]?.index;
                                //dataset number selected - for us itll be 0 always
                                // const elementClickedDatasetIndex = elements[0]?.datasetIndex
                                const dataSelected = [
                                    probfrequencyLabels[elementClickedIndex] ??
                                        null,
                                    probfrequencyCounts[elementClickedIndex] ??
                                        null,
                                ];
                                setSelectedProbabilitySection(
                                    probfrequencyLabels[elementClickedIndex] ??
                                        null
                                );
                                console.log('selected', dataSelected);
                            },
                        }}
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
                        
                        data={groupedchartjsoptions}
                        options={{ scales: { y: { stacked: false } } }}
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
        </>
    ) : (
        <>No model selected</>
    );
}

export default Closed;
