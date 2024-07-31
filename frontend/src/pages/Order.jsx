import React, { useState } from "react";
import OrderBook from "../components/OrderBook";
import TradeUI from "../components/TradeUIO";
import TransactionTable from "../components/TransactionTableO";

export function Order() {
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [transactions, setTransactions] = useState([]);

  const handleOrderFilled = (order) => {
    setOrderBook(order.orderBook);
    setTransactions([...transactions, ...order.fills]);
  };

  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen">
      <div className="container mx-auto space-y-8">
        <OrderBook orderBook={orderBook} />
        <TradeUI onOrderFilled={handleOrderFilled} />
        <TransactionTable transactions={transactions} />
      </div>
    </div>
  );
}
