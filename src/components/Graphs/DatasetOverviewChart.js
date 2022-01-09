import React, { useContext, useEffect, useMemo, useState } from 'react';
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { SelectedContext } from '../../etc/context';
import axios from 'axios';
import api_link from '../../etc/api';
import { Link } from 'react-router-dom';
// ChartJS.register(
//     LinearScale,
//     CategoryScale,
//     BarElement,
//     PointElement,
//     LineElement,
//     Legend,
//     Tooltip
// );

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

/**
 * Hash function - hash a string to a color
 * @param {string} str
 * @returns {string} hex color
 */
const randomColor = function (str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        let value = (hash >> (i * 8)) & 0xff;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
};

/**
 *
 * @param {{year:number}} param0
 * @returns
 */
export default function Overview({ year }) {
    const [alldata, setAlldata] = useState([]);
    const token = useMemo(() => localStorage.getItem('token'), []);
    const [id] = useContext(SelectedContext);
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
            console.log('got data', data);
            setAlldata(data);
        });
    }, [id, token]);

    const chartJSdataCounts = useMemo(() => {
        // these are the array of header and count per month
        const headers = new Set();
        const chartCounts = alldata
            .filter((e) => {
                const dateString = e['Enquiry Date']; // Oct 23
                const dateyear = parseInt(dateString.split(/-|\//)[2]);
                return year === dateyear;
            })
            .reduce(
                (total, element) => {
                    // console.log(element);
                    const month =
                        parseInt(element['Enquiry Date'].split(/-|\//)[1]) - 1;
                    // if (element["Status"] === "0")
                    // console.log('example',element['Status'])
                    // console.log("setting",element['Status'],(total[month].get( element["Status"])??0)+1)
                    total[month].set(
                        element['Status'],
                        (total[month].get(element['Status']) ?? 0) + 1
                    );
                    headers.add(element['Status']);
                    return total;
                },
                new Array(12).fill(undefined).map((e) => new Map())
            );
        // this is the chartjs equivalent

        // console.log("mydata", chartCounts, headers);
        return {
            labels,
            // datasets: [...headers].map((e) => {
            //     const label = e === '0' ? 'Dropped' : e === '1' ? 'Ordered' : e;
            //     return {
            //         type: 'bar',
            //          for 0,1 rest are default
            //         label,
            //         stack: 'stack1',
            //         backgroundColor: randomColor(label),
            //         data: chartCounts.map((month) => month.get(e)), //labels.map(() => Math.random() * 1000),
            //     };
            // }),
            datasets: [
                {
                    type: 'bar',
                    label: 'Dropped',
                    yAxisID: 'y',
                    stack: 'stack1',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    data: chartCounts.map((month) => month.get('1')),
                },
                {
                    type: 'bar',
                    label: 'Ordered',
                    yAxisID: 'y',
                    stack: 'stack1',
                    backgroundColor: 'rgba(0,250,154, 0.5)',
                    data: chartCounts.map((month) => month.get('0')),
                },
                {
                    type: 'bar',
                    label: 'Warm',
                    yAxisID: 'y',
                    stack: 'stack1',
                    backgroundColor: 'rgba(255,250,154, 0.9)',
                    data: chartCounts.map((month) => month.get('2')),
                },
                // {
                //     type: 'line',
                //     label: 'Ordered',
                //     yAxisID: 'y',
                //     backgroundColor: 'rgba(255, 99, 132)',
                //     data: chartCounts.map((month) => month.get('0')),
                // },
                {
                    type: 'line',
                    label: 'TPR',
                    yAxisID: 'y1',
                    backgroundColor: randomColor('TPR'),
                    // (#ordered & #(prob of 1>.5))/#Ordered
                    data: chartCounts.map((month) => {
                        const total =
                            (month.get('0') ?? 0) + (month.get('1') ?? 0);
                        if (total) {
                            const prob = (month.get('1') ?? 0) / total;
                            return prob * 100;
                        } else return 0;
                    }),
                },
                {
                    type: 'line',
                    label: 'TNR',
                    yAxisID: 'y1',
                    backgroundColor: randomColor('TNR'),
                    data: chartCounts.map((month) => {
                        const total =
                            (month.get('0') ?? 0) + (month.get('1') ?? 0);
                        if (total) {
                            const prob = (month.get('0') ?? 0) / total;
                            return prob * 100;
                        } else return 0;
                    }),
                },
                {
                    type: 'line',
                    label: 'Conversion Rate',
                    yAxisID: 'y1',
                    backgroundColor: randomColor('Conversion Rate'),
                    // #1/(#0+#1+#2)
                    data: chartCounts.map((month) => {
                        const total =
                            (month.get('0') ?? 0) +
                            (month.get('1') ?? 0) +
                            (month.get('2') ?? 0);
                        if (total) {
                            const prob = (month.get('1') ?? 0) / total;
                            console.log('prob', prob * 100);
                            return prob * 100;
                        } else return 0;
                    }),
                },
            ],
        };
    }, [year, alldata]);

    // console.log("counts", chosenCounts);
    return id ? (
        <Chart
            type="bar"
            data={chartJSdataCounts}
            options={{
                title: {
                    display: true,
                    text: `Orders per month for ${year}`,
                    fontSize: 20,
                },
                legend: {
                    display: true,
                    position: 'top',
                },
                scales: {
                    y: {
                        ticks: {
                            beginAtZero: true,
                        },
                    },
                    y1: {
                        position: 'right',
                        type: 'linear',
                        min: 0,
                        max: 100,
                        grid: { color: '#ff000022' },
                    },
                },
                responsive: true,
            }}
        />
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
