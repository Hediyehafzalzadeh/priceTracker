"use client";

import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RechartsDevtools } from "@recharts/devtools";
import { getPriceHistory } from "@/app/actions";
const PriceChart = ({ productId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const priceHistory = await getPriceHistory(productId);

      setData(
        priceHistory.map((item) => ({
          date: new Date(item.checked_at).toLocaleDateString(),
          price: parseFloat(item.price),
        })),
      );
      setLoading(false);
    }

    fetchData();
  }, [productId]);

  return (
    <LineChart
      className=""
      style={{
        width: "100%",
        maxWidth: "700px",
        height: "100%",
        maxHeight: "70vh",
        aspectRatio: 1.618,
      }}
      responsive
      data={data}
      margin={{
        top: 5,
        right: 5,
        left: 0,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-3)" />
      <XAxis dataKey="date" stroke="#8f8f8f" />
      <YAxis dataKey="price" width={30} stroke="#8f8f8f" />
      <Tooltip
        cursor={{
          stroke: "var(--color-border-2)",
        }}
        contentStyle={{
          backgroundColor: "#fff",
          borderColor: "var(--color-border-2)",
        }}
      />
      <Legend />

      <Line
        type="monotone"
        dataKey="price"
        stroke="#7c3aed"
        dot={{
          fill: "#fff",
        }}
        activeDot={{ stroke: "#fff", fill: "#7c3aed" }}
      />
      <RechartsDevtools />
    </LineChart>
  );
};

export default PriceChart;
