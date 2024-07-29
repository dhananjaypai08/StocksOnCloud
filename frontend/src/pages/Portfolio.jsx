import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(value);
};

const chartDATAA = [
  { month: "January", value: 186 },
  { month: "February", value: 305 },
  { month: "March", value: 237 },
  { month: "April", value: 73 },
  { month: "May", value: 209 },
  { month: "June", value: 214 },
];

export const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [todayGainLoss, setTodayGainLoss] = useState({
    value: 0,
    percentage: 0,
  });
  const [overallGainLoss, setOverallGainLoss] = useState({
    value: 0,
    percentage: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch("YOUR_DB_API_ENDPOINT");
      const data = await response.json();
      setPortfolioData(data);
      calculatePortfolioMetrics(data);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    }
  };

  const fetchCurrentMarketPrices = async (stockNames) => {
    try {
      const response = await fetch("YOUR_CURRENT_PRICE_API_ENDPOINT", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stocks: stockNames }),
      });
      const data = await response.json();
      return data.reduce((acc, stock) => {
        acc[stock.name] = stock.price;
        return acc;
      }, {});
    } catch (error) {
      console.error("Error fetching current market prices:", error);
      return {};
    }
  };

  const calculatePortfolioMetrics = async (data) => {
    const stockNames = [...new Set(data.map((stock) => stock.name))];
    const currentPrices = await fetchCurrentMarketPrices(stockNames);

    let totalValue = 0;
    let totalCost = 0;
    let stockQuantities = {};
    let stockValues = {};

    for (const transaction of data) {
      const { name, quantity, action, current_price } = transaction;

      if (action === "BUY") {
        stockQuantities[name] = (stockQuantities[name] || 0) + quantity;
        totalCost += current_price * quantity;
      } else if (action === "SELL") {
        stockQuantities[name] = (stockQuantities[name] || 0) - (quantity || 0);
      }
    }

    for (const [name, quantity] of Object.entries(stockQuantities)) {
      const currentPrice = currentPrices[name] || 0;
      const value = currentPrice * quantity;
      totalValue += value;
      stockValues[name] = value;
    }

    setPortfolioValue(totalValue);

    const overallGain = totalValue - totalCost;
    setOverallGainLoss({
      value: overallGain,
      percentage: (overallGain / totalCost) * 100,
    });

    // Mock calculation for today's gain/loss (replace with actual logic if you have historical data)
    const todayGain = totalValue * 0.01; // Assuming 1% daily change
    setTodayGainLoss({
      value: todayGain,
      percentage: (todayGain / totalValue) * 100,
    });

    // Prepare chart data (mock data, replace with actual historical data if available)
    const mockChartData = [
      { month: "January", value: 186 },
      { month: "February", value: 305 },
      { month: "March", value: 237 },
      { month: "April", value: 73 },
      { month: "May", value: 209 },
      { month: "June", value: 214 },
    ];
    setChartData(mockChartData);

    // Prepare pie chart data
    setPieChartData(
      Object.entries(stockValues).map(([name, value]) => ({ name, value }))
    );
  };

  return (
    <div className="bg-black text-foreground p-6 min-h-screen">
      <Card className="mb-6 bg-black border border-gray-100 text-slate-200">
        <CardHeader>
          <CardTitle>Portfolio Value</CardTitle>
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
              <div
                className={`flex items-center ${
                  todayGainLoss.value >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
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
              <div
                className={`flex items-center ${
                  overallGainLoss.value >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
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
              <LineChart data={chartDATAA}>
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
        <Card className="bg-black border border-gray-100 text-slate-200">
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {pieChartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value)} />
              </PieChart>
            </ResponsiveContainer>
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
