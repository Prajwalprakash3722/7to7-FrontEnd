import React, { useContext, useEffect, useMemo, useState } from "react";
import {
    Chart as ChartJS,
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import { SelectedContext } from "../../etc/context";
import axios from "axios";
import api_link from "../../etc/api";
ChartJS.register(
    LinearScale,
    CategoryScale,
    BarElement,
    PointElement,
    LineElement,
    Legend,
    Tooltip
);

const labels = ["January", "February", "March", "April", "May", "June", "July"];

/**
 *
 * @param {{year:number}} param0
 * @returns
 */
export default function Overview({ year }) {
    const [alldata, setAlldata] = useState([]);
    const token = useMemo(() => localStorage.getItem("token"), []);
    const [id, setId] = useContext(SelectedContext);
    useEffect(() => {
        axios
            .get(`${api_link}/api/models/preds/1`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const data = res.data;
                setAlldata(data);
            });
    }, [id, token]);

    const chartJSdataCounts = useMemo(() => {
        // these are the numbers
        const chartCounts =  alldata
            .filter((e) => {
                const dateString = e['Enquiry Date']; // Oct 23
                const dateyear = parseInt(dateString.split('-')[2])
                return year===dateyear;
            })
            .reduce(
                (total, element) => {
                    // console.log(element);
                    const month = parseInt(element['Enquiry Date'].split('-')[1])-1;
                    if (element["Status"] === "0") total[month].dropped++;
                    else total[month].success++;
                    return total;
                },
                new Array(12).fill(undefined).map(e=>({
                    dropped: 0,
                    success: 0,
                }))
            );
        // this is the chartjs equivalent
        return {
            labels,
            datasets: [
                // {
                //     type: "line",
                //     stack: "stack2",
        
                //     label: "Dataset 1",
                //     borderColor: "rgb(163, 182, 235) ",
                //     borderWidth: 2,
                //     fill: false,
                //     data: labels.map(() => Math.random() * 1000),
                // },
                // {
                //     type: "bar",
                //     label: "Warm",
                //     stack: "stack1",
        
                //     backgroundColor: "rgb(255, 255,0)",
                //     data: labels.map(() => Math.random() * 1000),
                // },
                {
                    type: "bar",
                    stack: "stack1",
                    label: "Cold",
                    backgroundColor: "rgb(205,92,92)",
                    data: chartCounts.map(e=>e.dropped),
                    borderColor: "white",
                    borderWidth: 2,
                },
                {
                    type: "bar",
                    label: "Ordered",
                    stack: "stack1",
        
                    backgroundColor: "rgb(144,238,144)",
                    data: chartCounts.map(e=>e.success),
                },
            ],
        }
    }, [year, alldata]);



    

    // console.log("counts", chosenCounts);
    return id ? <Chart type="bar" data={chartJSdataCounts} /> : "No model chosen";
}
