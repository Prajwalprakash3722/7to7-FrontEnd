import React, { useContext, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useEffect } from 'react';
import DatePicker from 'react-date-picker';
import { SelectedContext } from '../etc/context';
import axios from 'axios';
import api_link from '../etc/api';
import { Doughnut as PieChart, Line as LineChart } from 'react-chartjs-2';
import { Link } from 'react-router-dom';

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
    const { trimmedData, affirmativeAllDataLen, allOrderRate } = useMemo(() => {
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
        const affirmativeAllDataLen = alldata.filter((e) => {
            return e['Status'] === '1';
        }).length;
        const allOrderRate = (affirmativeAllDataLen * 100) / alldata.length;
        // console.log('trimmed data', data);
        return { trimmedData: data, affirmativeAllDataLen, allOrderRate };
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
        // labels is the viewing 1.1% as .011
        // why are we creating and returning this?
        // this is useful for section selection, as this will be used to pick the clicked section and filter against it
        const labels = trimArray.map((e) => e[0]);
        // displaylabels is the same but `1.10%`
        const displayLabels = trimArray.map(
            (e) => `${(parseFloat(e[0]) * 100).toFixed(2)}%`
        );
        const counts = trimArray.map((e) => e[1]);

        const chartjsdata = {
            labels: displayLabels,
            datasets: [
                {
                    label: 'Predicted Probability',
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
        return { labels, counts, chartjsdata: chartjsdata, displayLabels };
    }, [trimmedData]);

    // const groupByCol = "Enquiry Status Reasoning";
    // per group counts
    const { labels: groupedLabels, chartjsdata: groupedchartjsoptions } =
        useMemo(() => {
            const total = new Map();
            // let sum=0;
            trimmedData.forEach((element) => {
                // sum+=1;
                total.set(
                    element[selectedCategory],
                    (total.get(element[selectedCategory]) ?? 0) + 1
                );
            });
            const trimArray = [...total];
            const labels = trimArray.map((e) => e[0]);
            const counts = trimArray.map((e) => e[1]);

            //auxiliary length collections
            const trimmedTotalElements = trimmedData.length;
            const trimmedTotalAffirmative = trimmedData.filter(
                (e) => e['Status'] === '1'
            ).length;
            const trimmedOrderRate =
                trimmedTotalAffirmative*100 / trimmedTotalElements;
            console.log('everything', allOrderRate, trimmedOrderRate);

            const chartjsdata = {
                labels,
                datasets: [
                    {
                        type: 'bar',
                        label: 'Grouped',
                        stack: 'stack1',
                        data: counts,
                        yAxisID: 'y',
                        backgroundColor: 'rgba(255, 99, 132,.1)',
                        borderColor: 'rgb(128, 50, 64)',
                        borderWidth: 1,
                        hoverOffset: 4,
                    },
                    {
                        type: 'line',
                        label: 'CF',
                        yAxisID: 'y2',
                        data: counts.map((e, i, x) => {
                            let sum = e;
                            for (let it = 0; it < i; it++) {
                                sum += x[it];
                            }
                            return sum;
                        }),
                        backgroundColor: 'rgb( 99,255, 132)',
                        hoverOffset: 4,
                    },
                    // this would be whole avg
                    {
                        type: 'line',
                        label: 'Order Rate - Month',
                        yAxisID: 'y1',
                        data: labels.map((e) => trimmedOrderRate),
                        backgroundColor: 'rgb( 100,100,0)',
                        hoverOffset: 4,
                    },
                    {
                        type: 'line',
                        label: 'Order Rate - All Time',
                        yAxisID: 'y1',
                        data: labels.map((e) => allOrderRate),
                        backgroundColor: 'rgb( 100,100,0)',
                        hoverOffset: 4,
                    },
                ],
            };

            // if we have selected a probability section we need to show that as well
            if (selectedProbabilitySection !== null) {
                const total = new Map();
                const totalOrderedCounts = new Map();
                const segmentFiltered = trimmedData.filter(
                    (e) => e['Predicted Prob.1'] === selectedProbabilitySection
                );
                // calculate per label distribution of selected category
                segmentFiltered.forEach((element) => {
                    total.set(
                        element[selectedCategory],
                        (total.get(element[selectedCategory]) ?? 0) + 1
                    );
                    // order percents
                    if(element['Status']==='1'){
                        totalOrderedCounts.set(
                            element[selectedCategory],
                            (totalOrderedCounts.get(element[selectedCategory]) ?? 0) + 1
                        );
                    }
                });

                const segmentFilteredOrderedLength = segmentFiltered.filter(e=>e['Status']==='1').length
                const segmentFilteredLength = segmentFiltered.length
                const segmentAvg = segmentFilteredOrderedLength*100/segmentFilteredLength;
                console.log('filtered stats',segmentFilteredLength,segmentFilteredOrderedLength,trimmedTotalElements,segmentAvg)
                // use existing labels to construct a count set in the same order - use 0 if not in the map
                const probabilityFilteredCounts = labels.map((label) => {
                    return total.get(label) ?? 0;
                });

                const probabilityFilteredOrderRates = labels.map((label,i)=>{
                    // dont do division if 0, straightaway return 0
                    return probabilityFilteredCounts[i]!==0? ((totalOrderedCounts.get(label)??0)*100/probabilityFilteredCounts[i]):0
                })
                console.log('manager',probabilityFilteredCounts.map((e,i)=>[e,probabilityFilteredOrderRates[i]]))
                // add this extra map
                chartjsdata.datasets.push({
                    type: 'bar',
                    // yAxisID: 'y',
                    label: `Selected Probability (${selectedProbabilitySection})`,
                    data: probabilityFilteredCounts,
                    backgroundColor: 'rgb( 99,128, 132)',
                    // borderColor:,
                    stack: 'stack1',

                    hoverOffset: 4,
                },{
                    type: 'line',
                    yAxisID: 'y',
                    label: `Month Order Rate - Selected Probability Segment`,
                    data: probabilityFilteredCounts.map(e=>segmentAvg),
                    backgroundColor: 'rgb( 128, 132,99)',
                    // borderColor:,
                    stack: 'stack1',

                    hoverOffset: 4,
                },{
                    type: 'line',
                    yAxisID: 'y',
                    label: `Month Order Rate - Selected Segment Groupwise`,
                    data: probabilityFilteredOrderRates,
                    backgroundColor: 'rgb( 128, 132,99)',
                    // borderColor:,
                    stack: 'stack1',

                    hoverOffset: 4,
                },);
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
                        <span className="text-gray-500">
                            {'Total Enquiries: ' + (trimmedData.length ?? 0)}
                        </span>
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
                    <div className="m-5" />
                    <Box sx={{ minWidth: 120 }}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">
                                Grouped By:
                            </InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={selectedCategory}
                                label="Age"
                                onChange={(e) => {
                                    setSelectedCategory(e.target.value);
                                }}
                            >
                                {selectableCategories.map((e) => (
                                    <MenuItem key={e} value={e}>
                                        {e}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    {/* <p>
                        <span className="text-gray-500">Grouped :</span>
                        <select
                            className="m-2 p-2 bg-slate-100 focus:outline-none"
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                            }}
                        >
                            {selectableCategories.map((e) => (
                                <option
                                    className="m-2 p-2 bg-slate-100 "
                                    key={e}
                                    value={e}
                                >
                                    {e}
                                </option>
                            ))}
                        </select>
                    </p> */}
                    {/* <LineChart
                        data={groupedchartjsoptions}
                        options={{ scales: { y: { stacked: false } } }}
                    /> */}
                    <LineChart
                        data={groupedchartjsoptions}
                        options={{
                            scales: {
                                y: {
                                    position: 'left',
                                    type: 'linear',
                                    stacked: false,
                                },
                                y1: {
                                    id: 'perc',
                                    position: 'right',
                                    type: 'linear',
                                    min:0,max:100,
                                    grid: { color: '#ff000022' },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </>
    ) : (
        <>
            <div className="flex flex-col items-center justify-center m-5 p-5">
                <h1 className="text-gray-500 text-5xl m-5 ">
                    No model selected
                </h1>
                <h2 className="text-neutral-500 text-2xl m-5">
                    Please select a model from the
                    <Link to="/">
                        <span className="text-blue-500 underline">
                            {' '}
                            Home Page{' '}
                        </span>
                    </Link>
                    to view the data
                </h2>
            </div>
        </>
    );
}

export default Closed;
