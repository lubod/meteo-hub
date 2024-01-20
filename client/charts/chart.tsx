/* eslint-disable react/jsx-no-bind */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import moment from "moment";
import React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type ChartData = {
  chdata: {}[];
  xkey: string;
  ykey: string;
  y2key: string;
  yDomainMin: number;
  yDomainMax: number;
  color: string;
  range: string;
  xDomainMin: string;
  xDomainMax: string;
};

function Chart({
  chdata,
  xkey,
  // eslint-disable-next-line no-unused-vars
  ykey,
  y2key,
  yDomainMin,
  yDomainMax,
  color,
  range,
  xDomainMin,
  xDomainMax,
}: ChartData) {
  function formatXAxis(tickItem: string) {
    if (range?.includes("hour")) {
      return moment(tickItem).format("HH:mm");
    }
    if (range?.includes("week")) {
      return moment(tickItem).format("DD.MM");
    }
    if (range?.includes("year")) {
      return moment(tickItem).format("MMM");
    }
    return moment(tickItem).format("DD MMM HH:mm");
  }

  function formatLabel(label: string) {
    return moment(label).format("DD.MM.YYYY HH:mm:ss");
  }
/*
  console.info(
    "render chart",
    chdata,
    xkey,
    ykey,
    y2key,
    yDomainMin,
    yDomainMax,
    color,
    range,
    xDomainMin,
    xDomainMax,
  );
  */
  return (
    <div className="text-left">
      <ResponsiveContainer width="100%" aspect={5.0 / 4.0}>
        <ComposedChart
          data={chdata}
          margin={{
            top: 0,
            right: 0,
            left: 0,
            bottom: 0,
          }}
        >
          <Area
            type="monotoneX"
            dataKey="val"
            stroke={color}
            fillOpacity={1}
            fill="url(#colorUv)"
            isAnimationActive
          />
          <Line
            type="monotoneX"
            dataKey={y2key}
            stroke="#F93154"
            dot={false}
            strokeWidth={2}
            isAnimationActive
          />
          <defs>
            <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.8} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#81D4FA" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#81D4FA" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#ccc" vertical={false} horizontal={false} />
          <XAxis
            dataKey={xkey}
            tick={{ fill: "white" }}
            tickFormatter={formatXAxis}
            axisLine={false}
            domain={[xDomainMin, xDomainMax]}
            scale="time"
            type="number"
          />
          <YAxis
            hide
            type="number"
            domain={[yDomainMin, yDomainMax]}
            tick={{ fill: "white" }}
          />
          <Tooltip
            labelStyle={{ color: "black" }}
            itemStyle={{ color: "black" }}
            labelFormatter={formatLabel}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
