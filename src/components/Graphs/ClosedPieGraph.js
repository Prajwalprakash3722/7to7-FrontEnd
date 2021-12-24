import React, { useContext, useEffect, useMemo, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { SelectedContext } from "../../etc/context";
import axios from "axios";
import api_link from "../../etc/api";

ChartJS.register(ArcElement, Tooltip, Legend);

/**
 *
 * @returns
 */
export default function PieChart({ chartjsdata }) {
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

    

    return (
        <>
            <Doughnut data={chartjsdata}  />
        </>
    );
}
