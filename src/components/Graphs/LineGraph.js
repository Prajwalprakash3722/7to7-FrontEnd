import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function lineChart({data}) {
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

  const labels = ["January", "February", "March", "April", "May"];

  // const data = {
  //   labels,
  //   datasets: [
  //     {
  //       label: "Income",
  //       data: [10, 5, 2, 32, 5],
  //       backgroundColor: "rgba(52, 211, 153, 0.5)",
  //       borderColor: "rgba(52, 211, 153, 1.5)",

  //       yAxisID: "y",
  //     },
  //     {
  //       label: "Expense",
  //       data: [1, 2, 5, 0.3, 45],
  //       borderColor: "rgb(255, 99, 132)",
  //       backgroundColor: "rgba(255, 99, 132, 0.5)",
  //       yAxisID: "y1",
  //     },
  //   ],
  // };

  return <Line options={options} data={data} />;
}
