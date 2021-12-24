import React, { useContext, useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { SelectedContext } from "../../etc/context";
import axios from "axios";
import api_link from "../../etc/api";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 *
 * @param {{year:number,month:number,status:string}} param0
 * @returns
 */
export default function PieChart({ year, month, status }) {
    const options = {
        responsive: true,
        interaction: {
            mode: "index",
            intersect: false,
        },
        stacked: false,
        plugins: {
            title: {
                display: true,
                // text: "Expense vs Income Data Analysis in Line Chart",
            },
        },
        scales: {
            y: {
                type: "linear",
                display: true,
                position: "left",
            },
            y1: {
                type: "linear",
                display: true,
                position: "right",
                grid: {
                    drawOnChartArea: false,
                },
            },
        },
    };
    // const data = {
    //     labels: ["Red", "Blue", "Yellow"],
    //     datasets: [
    //         {
    //             label: "My First Dataset",
    //             data: [300, 50, 100],
    //             backgroundColor: [
    //                 "rgb(255, 99, 132)",
    //                 "rgb(54, 162, 235)",
    //                 "rgb(255, 205, 86)",
    //             ],
    //             hoverOffset: 4,
    //         },
    //     ],
    // };

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
    const [labels,chartcounts,chartjsdata] = useMemo(() => {
        const total = new Map();
        const trimmedCounts = trimmedData.forEach((element) => {
            
            total.set(
                element["Predicted Prob.1"],
                (total.get(element["Predicted Prob.1"]) ?? 0) + 1
            );
        });
        const trimArray = [...total];
        const labels = trimArray.map(e=>e[0]);
        const counts = trimArray.map(e=>e[1]);
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
                  '#D2D4C0',
                  '#AEA306',
                ],
                hoverOffset: 4,
              },
            ]};
        return [labels,counts,chartjsoptions];
    }, [trimmedData]);

    return (
        <>
            <Doughnut data={chartjsdata} opions={options} />
        </>
    );
}
