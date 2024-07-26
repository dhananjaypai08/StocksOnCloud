import { createChart, ColorType } from "lightweight-charts";
import React, { useEffect, useRef, useState } from "react";

export const Chart = () => {
const chartContainerRef = useRef();
  const apiKey = '22df77ad4b704e51be4568b617c66068';
  const apiUrl = `http://127.0.0.1:5000/echios?symbol=msft`;
  const [data, setData] = useState([{ time: 1545436800, value: 32.51 },
    { time: 1545523200, value: 31.11 },
    { time: 1545609600, value: 27.02 },
    { time: 1545696000, value: 27.32 },
    { time: 1545782400, value: 25.17 },
    { time: 1545868800, value: 28.89 },
    { time: 1545955200, value: 25.46 },
    { time: 1546041600, value: 23.92 },
    { time: 1546128000, value: 22.68 },
    { time: 1546214400, value: 22.67 }])
  const initialdata = [ ]


const fetchData = async () => {
  try {
    const response = await fetch(apiUrl);
    const result = await response.json();
    console.log(result)
    if (result) {
      const newDataPoint = {
        time: result.time ,
        value: parseFloat(result.price)
      };
      setData(prevData => [...prevData, newDataPoint]);
    }
    console.log(data)
    }catch(err){
      console.error(err)
    }
  
  }   

useEffect(() => {
  // fetchData(); // Initial fetch
  const intervalId = setInterval(fetchData,5000); // Fetch every 5 minutes
  return () => clearInterval(intervalId);
}, []);

useEffect(() => {

  console.log("Updated data:", data);
}, [data]);

  useEffect(() => {
    

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "white" },
      },
      width: 400,
      height: 200,
    });

    const newSeries = chart.addAreaSeries({ 
      lineColor:"#2962FF", 
      topColor:"#2962FF",
      bottomColor:"rgba(41,98,255,0.28)" });

    newSeries.setData(data);

                

    return () => {
      
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef}></div>;
}