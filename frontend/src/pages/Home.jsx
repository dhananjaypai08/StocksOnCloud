import React, { useEffect, useRef, useState } from "react";
import { Chart } from "../components/Chart";
import { Watchlist } from "../components/Watchlist";
import { MarketBar } from "../components/MarketBar";
import { Trade } from "../components/Trade";
import { Appbar } from "../components/Appbar";

export const Home = () => {
  // const apiUrl = `http://127.0.0.1:5000/echios?symbol=msft`;
  const [data, setData] = useState([
    { time: 1545436800, value: 32.51 },
    { time: 1545523200, value: 31.11 },
    { time: 1545609600, value: 27.02 },
    { time: 1545696000, value: 27.32 },
    { time: 1545782400, value: 25.17 },
    { time: 1545868800, value: 28.89 },
    { time: 1545955200, value: 25.46 },
    { time: 1546041600, value: 23.92 },
    { time: 1546128000, value: 22.68 },
    { time: 1546214400, value: 22.67 },
  ]);

  const fetchData = async () => {
    try {
      const response = await fetch(apiUrl);
      const result = await response.json();
      if (result) {
        const newDataPoint = {
          time: result.time,
          value: parseFloat(result.price),
        };
        setData((prevData) => [...prevData, newDataPoint]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   const intervalId = setInterval(fetchData, 5000);
  //   return () => clearInterval(intervalId);
  // }, []);

  useEffect(() => {
    if (data) {
      console.log("Updated stock data:", data);
    }
  }, [data]);

  return (
    <div className="bg-black">
      <Appbar />
      <div className="flex flex-row flex-1">
        <div className="flex flex-col flex-1">
          <MarketBar data={data} />
          <div className="flex flex-row h-[920px] border-y border-slate-800">
            <div className="flex flex-col w-[250px] overflow-hidden border-r border-slate-800">
              <Watchlist />
            </div>
            <div className="flex flex-col flex-1">
              <Chart data={data} />
            </div>
          </div>
        </div>
        <div className="w-[10px] flex-col border-slate-800 border-l"></div>
        <div>
          <div className="flex flex-col w-[250px]">
            <Trade />
          </div>
        </div>
      </div>
    </div>
  );
};
