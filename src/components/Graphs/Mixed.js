import React from "react";
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

export const data = {
  labels,
  datasets: [
    {
      type: "line",
      stack: "stack2",

      label: "Dataset 1",
      borderColor: "rgb(163, 182, 235) ",
      borderWidth: 2,
      fill: false,
      data: labels.map(() => Math.random() * 1000),
    },
    {
      type: "bar",
      label: "Warm",
      stack: "stack1",

      backgroundColor: "rgb(255, 255,0)",
      data: labels.map(() => Math.random() * 1000),
    },
    {
      type: "bar",
      stack: "stack1",
      label: "Cold",
      backgroundColor: "rgb(205,92,92)",
      data: labels.map(() => Math.random() * 1000),
      borderColor: "white",
      borderWidth: 2,
    },
    {
      type: "bar",
      label: "Ordered",
      stack: "stack1",

      backgroundColor: "rgb(144,238,144)",
      data: labels.map(() => Math.random() * 1000),
    },
  ],
};

export default function App() {
  return <Chart type="bar" data={data} />;
}
