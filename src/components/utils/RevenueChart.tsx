"use client";
import { toIDR } from "@/lib/utils";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function CustomTooltip({ active, payload }: any) {
  if (active && payload && payload.length) {
    const { month, Revenue } = payload[0].payload;
    return (
      <div
        className="custom-tooltip"
        style={{
          backgroundColor: "#fff",
          padding: "10px",
          border: "1px solid #ccc",
        }}
      >
        <p>{`Month: ${month}`}</p>
        <p>{`Revenue: ${toIDR(Revenue)}`}</p>
      </div>
    );
  }

  return null;
}

export default function RevenueChart({
  data,
}: {
  data: { month: string; Revenue: number }[];
}) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="Revenue" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
}
