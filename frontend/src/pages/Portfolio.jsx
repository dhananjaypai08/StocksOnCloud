import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};


export const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [todayGainLoss, setTodayGainLoss] = useState({ value: 0, percentage: 0 });
  const [overallGainLoss, setOverallGainLoss] = useState({ value: 0, percentage: 0 });
  const [chartData, setChartData] = useState([
    { month: "January", value: 0 },
    { month: "February", value: 305 },
    { month: "March", value: 237 },
    { month: "April", value: 73 },
    { month: "May", value: 209 },
    { month: "June", value: 214 },
  ]);
  const [pieChartData, setPieChartData] = useState([]);
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");

  const handleDownload = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/download-report');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'reports.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/getOrderBook?email=${email}`);
      const data = await response.data;
      setPortfolioData(data);
      calculatePortfolioMetrics(data);
      
      
    const groupedData = data.reduce((acc, item) => {
      const existingStock = acc.find(stock => stock.name === item.name);
      if (existingStock) {
        existingStock.quantity += item.action === "BUY" ? item.quantity : -item.quantity;
      } else {
        acc.push({ name: item.name, quantity: item.action === "BUY" ? item.quantity : -item.quantity });
      }
      return acc;
    }, []);

    // Filter out stocks with zero quantity
    const filteredData = groupedData.filter(item => item.quantity > 0);

    // Prepare pie chart data
    const pieData = filteredData.map(item => ({
      name: item.name,
      value: item.quantity
    }));

    setPieChartData(pieData);
      
    
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    }
  };

  const calculatePortfolioMetrics = (data) => {
    let totalValue = 0;

    for (const transaction of data) {
      const {name, quantity, current_price, action, time } = transaction;
      if (action === "BUY") {
        totalValue += current_price * quantity;
      } else if (action === "SELL") {
        totalValue -= current_price * (quantity || 0);
      }
    }
    setPortfolioValue(totalValue);

    // Generate random values for today's gain/loss
    const todayGain = (Math.random() - 0.5) * totalValue * 0.02; // Random value between -1% to 1% of total value
    setTodayGainLoss({
      value: todayGain,
      percentage: (todayGain / totalValue) * 100,
    });

    // Generate random values for overall gain/loss
    const overallGain = (Math.random() - 0.5) * totalValue * 0.1; // Random value between -5% to 5% of total value
    setOverallGainLoss({
      value: overallGain,
      percentage: (overallGain / totalValue) * 100,
    });

  };


  


  return (
    <div className="bg-black text-foreground p-4 min-h-screen">
      <Card className="mb-6 mt-4 bg-black border border-gray-100 text-slate-200">
      <CardHeader>
    <div className="flex justify-between">
      <CardTitle>Portfolio Value</CardTitle>
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => {
          navigate('/home')
        }}>Home</Button>
        <Button size="sm" variant="download" onClick={handleDownload}>Generate Reports</Button>
      </div>
    </div>
  </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">
            {formatCurrency(portfolioValue)}
          </div>
          <div className="flex justify-between mt-4">
            <div>
              <div className="text-sm text-muted-foreground">
                Today's Gain/Loss
              </div>
              <div className={`flex items-center ${todayGainLoss.value >= 0 ? "text-green-500" : "text-red-500"}`}>
                {todayGainLoss.value >= 0 ? (
                  <ArrowUpIcon className="mr-1" size={16} />
                ) : (
                  <ArrowDownIcon className="mr-1" size={16} />
                )}
                <span>
                  {formatCurrency(Math.abs(todayGainLoss.value))} (
                  {todayGainLoss.percentage.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Overall Gain/Loss
              </div>
              <div className={`flex items-center ${overallGainLoss.value >= 0 ? "text-green-500" : "text-red-500"}`}>
                {overallGainLoss.value >= 0 ? (
                  <ArrowUpIcon className="mr-1" size={16} />
                ) : (
                  <ArrowDownIcon className="mr-1" size={16} />
                )}
                <span>
                  {formatCurrency(Math.abs(overallGainLoss.value))} (
                  {overallGainLoss.percentage.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 bg-black border border-gray-100 text-slate-200">
        <CardHeader>
          <CardTitle>Portfolio Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="month" stroke="#ffffff" />
                <YAxis stroke="#ffffff" />
                <Tooltip
                  formatter={(value) => formatCurrency(value)}
                  contentStyle={{ backgroundColor: "#333", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#8884d8" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
      <Card className=" bg-black border border-gray-100 text-white">
      <CardHeader>
        <CardTitle>Stock Holdings</CardTitle>
      </CardHeader>
      <CardContent>
        {pieChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p>Loading chart data...</p>
        )}
      </CardContent>
    </Card>

        <Card className="bg-black border border-gray-100 text-slate-200">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolioData.slice(0, 5).map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>{transaction.name}</TableCell>
                    <TableCell
                      className={
                        transaction.action === "BUY"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {transaction.action}
                    </TableCell>
                    <TableCell>{transaction.quantity || "All"}</TableCell>
                    <TableCell>
                      {formatCurrency(transaction.current_price)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
