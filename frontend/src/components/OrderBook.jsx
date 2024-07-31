import React from "react";

const OrderBook = ({ orderBook }) => {
  return (
    <div className="flex bg-gray-800 text-white p-4 rounded-md">
      <div className="w-1/2 pr-2">
        <h2 className="text-center text-green-500 mb-2">Bids</h2>
        {orderBook.bids.map((bid, index) => (
          <div key={index} className="flex justify-between py-1">
            <span>{bid.quantity}</span>
            <span>{bid.price}</span>
          </div>
        ))}
      </div>
      <div className="w-1/2 pl-2">
        <h2 className="text-center text-red-500 mb-2">Asks</h2>
        {orderBook.asks.map((ask, index) => (
          <div key={index} className="flex justify-between py-1">
            <span>{ask.quantity}</span>
            <span>{ask.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBook;
