import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import Chart from 'chart.js/auto';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [currentValues, setCurrentValues] = useState({});
  const [portfolioMetrics, setPortfolioMetrics] = useState({
    totalValue: 0,
    gainLoss: 0,
    gainLossPercentage: 0
  });

  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  useEffect(() => {
    if (portfolioData.length > 0) {
      fetchCurrentValues();
    }
  }, [portfolioData]);

  useEffect(() => {
    if (portfolioData.length > 0 && currentValues.hasOwnProperty('tsla')) {
      createCharts();
    }
  }, [portfolioData, currentValues]);

  const fetchPortfolioData = async () => {
    const mockApiResponse = [
      {"id":"66a61698e6cdc43059b54a62","name":"tsla","current_price":789,"quantity":2,"action":"BUY","time":"28/07/2024 15:29:52"},
      {"id":"66a616decec3f10a04647e2d","name":"ibm","current_price":200,"quantity":10,"action":"SELL","time":"28/07/2024 15:31:02"},
      {"id":"66a61b30aa9b3a2b6984a59b","name":"AAPL","current_price":998,"quantity":10,"action":"BUY","time":"28/07/2024 15:49:28"},
      {"id":"66a61b51aa9b3a2b6984a59c","name":"AAPL","current_price":10,"quantity":1,"action":"BUY","time":"28/07/2024 15:50:01"},
      {"id":"66a61e391da36404644e975d","name":"ibm","current_price":200,"quantity":null,"action":"SELL","time":"28/07/2024 16:02:25"}
    ];
    setPortfolioData(mockApiResponse);
  };

  const fetchCurrentValues = async () => {
    const mockCurrentValues = {
      "tsla": 800,
      "ibm": 210,
      "AAPL": 1000
    };
    setCurrentValues(mockCurrentValues);
    calculatePortfolioMetrics(mockCurrentValues);
  };

  const calculatePortfolioMetrics = (currentPrices) => {
    let totalValue = 0;
    let initialValue = 0;

    portfolioData.forEach(stock => {
      if (stock.action === "BUY" && stock.quantity) {
        totalValue += stock.quantity * currentPrices[stock.name];
        initialValue += stock.quantity * stock.current_price;
      }
    });

    const gainLoss = totalValue - initialValue;
    const gainLossPercentage = (gainLoss / initialValue) * 100;

    setPortfolioMetrics({
      totalValue,
      gainLoss,
      gainLossPercentage
    });
  };

  const getPortfolioGrowthData = () => {
    let runningTotal = 0;
    return portfolioData
      .filter(stock => stock.action === "BUY" && stock.quantity)
      .map(stock => {
        runningTotal += stock.quantity * stock.current_price;
        return {
          time: new Date(stock.time),
          value: runningTotal
        };
      });
  };

  const getStockTypeData = () => {
    const stockCounts = {};
    portfolioData.forEach(stock => {
      if (stock.action === "BUY" && stock.quantity) {
        stockCounts[stock.name] = (stockCounts[stock.name] || 0) + stock.quantity;
      }
    });
    return Object.entries(stockCounts).map(([name, value]) => ({ name, value }));
  };

  const createCharts = () => {
    const growthData = getPortfolioGrowthData();
    const stockTypeData = getStockTypeData();

    // Destroy existing charts if they exist
    if (lineChartRef.current) {
      lineChartRef.current.destroy();
    }
    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    // Create line chart
    const lineCtx = document.getElementById('portfolioGrowthChart').getContext('2d');
    lineChartRef.current = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: growthData.map(d => d.time),
        datasets: [{
          label: 'Portfolio Value',
          data: growthData.map(d => d.value),
          borderColor: '#8884d8',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day'
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Value ($)'
            }
          }
        }
      }
    });

    // Create pie chart
    const pieCtx = document.getElementById('stockDistributionChart').getContext('2d');
    pieChartRef.current = new Chart(pieCtx, {
      type: 'pie',
      data: {
        labels: stockTypeData.map(d => d.name),
        datasets: [{
          data: stockTypeData.map(d => d.value),
          backgroundColor: COLORS
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    });
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Stock Portfolio Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${portfolioMetrics.totalValue.toFixed(2)}</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {portfolioMetrics.gainLoss >= 0 ? (
                <ArrowUpIcon className="text-green-500 mr-2" />
              ) : (
                <ArrowDownIcon className="text-red-500 mr-2" />
              )}
              <p className={`text-2xl font-bold ${portfolioMetrics.gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                ${Math.abs(portfolioMetrics.gainLoss).toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Gain/Loss Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              {portfolioMetrics.gainLossPercentage >= 0 ? (
                <ArrowUpIcon className="text-green-500 mr-2" />
              ) : (
                <ArrowDownIcon className="text-red-500 mr-2" />
              )}
              <p className={`text-2xl font-bold ${portfolioMetrics.gainLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {Math.abs(portfolioMetrics.gainLossPercentage).toFixed(2)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Portfolio Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <canvas id="portfolioGrowthChart"></canvas>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800">
          <CardHeader>
            <CardTitle>Stock Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <canvas id="stockDistributionChart"></canvas>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};