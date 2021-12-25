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
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

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

// color based on string
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
    const [id, setId] = useContext(SelectedContext);
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
            datasets: [...headers].map((e) => {
                const label = e === '0' ? 'Dropped' : e === '1' ? 'Ordered' : e;
                return {
                    type: 'bar',
                    // for 0,1 rest are default
                    label,
                    stack: 'stack1',

                    backgroundColor: randomColor(label),
                    data: chartCounts.map((month) => month.get(e)), //labels.map(() => Math.random() * 1000),
                };
            }),
            // datasets: [
            //     // {
            //     //     type: "line",
            //     //     stack: "stack2",

            //     //     label: "Dataset 1",
            //     //     borderColor: "rgb(163, 182, 235) ",
            //     //     borderWidth: 2,
            //     //     fill: false,
            //     //     data: labels.map(() => Math.random() * 1000),
            //     // },
            //     {
            //         type: "bar",
            //         label: chartCounts??"Warm",
            //         stack: "stack1",

            //         backgroundColor: "rgb(255, 255,0)",
            //         data: chartCounts.map(e=>e.get())//labels.map(() => Math.random() * 1000),
            //     },
            //     {
            //         type: "bar",
            //         stack: 'stack1',
            //         label: "Cold",
            //         backgroundColor: "rgb(205,92,92)",
            //         data: labels.map(e=>0),
            //         borderColor: "white",
            //         borderWidth: 2,
            //     },
            //     {
            //         type: "bar",
            //         label: "Ordered",
            //         stack: "stack1",

            //         backgroundColor: "rgb(144,238,144)",
            //         data: labels.map(e=>0),
            //     },
            // ],
        };
    }, [year, alldata]);

    // console.log("counts", chosenCounts);
    return id ? (
        <Chart
            type="bar"
            data={chartJSdataCounts}
            options={{
                onClick: (x, y) => {
                    console.log('kekw', x, y);
                },
            }}
        />
    ) : (
        'No model chosen'
    );
}
