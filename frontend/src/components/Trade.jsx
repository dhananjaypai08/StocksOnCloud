import React, { useState } from "react";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const stocks = [
  { value: "AAPL", label: "Apple Inc." },
  { value: "GOOGL", label: "Alphabet Inc." },
  { value: "MSFT", label: "Microsoft Corporation" },
  { value: "AMZN", label: "Amazon.com, Inc." },
  { value: "FB", label: "Meta Platforms, Inc." },
];

export const Trade = () => {
  const [selectedStock, setSelectedStock] = useState(stocks[0].value);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const email = localStorage.getItem("Email");

  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const handleTrade = async (action) => {
    try {
      const response = await axios.post("http://127.0.0.1:5000/transaction", {
        email: email,
        stock_name: selectedStock,
        price: parseFloat(price),
        quantity: parseInt(quantity),
        action: action,
      });
      console.log(response.data);
      //
      setTransactionResult(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error:", error);
      setTransactionResult(false);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-md bg-black text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Trade Stocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setSelectedStock} defaultValue={selectedStock}>
            <SelectTrigger className="w-full bg-black">
              <SelectValue placeholder="Select a stock" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock.value} value={stock.value}>
                  {stock.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="mt-4">
            <Input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-900 mb-4"
            />

            <Input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-900"
            />
          </div>
          <div className="space-y-2 pt-6">
            <Button
              onClick={() => handleTrade("BUY")}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              Buy
            </Button>
            <Button
              onClick={() => handleTrade("SELL")}
              className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
            >
              Sell
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{transactionResult ? "Success" : "Error"}</DialogTitle>
            <DialogDescription>
              {transactionResult ? (
                <>
                  Transaction successful
                  <p>Transaction ID: {transactionResult}</p>
                </>
              ) : (
                "Transaction failed"
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={closeModal} className="bg-black text-white">
              {transactionResult ? "Close" : "Try Again"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
