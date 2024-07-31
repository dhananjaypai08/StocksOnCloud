import React from "react";

const TransactionTable = ({ transactions }) => {
  return (
    <div className="bg-gray-800 p-4 rounded-md">
      <h2 className="text-center mb-2">Transactions</h2>
      <div>
        {transactions.map((transaction, index) => (
          <div key={index} className="flex justify-between py-1">
            <span>{transaction.price}</span>
            <span>{transaction.qty}</span>
            <span>{transaction.tradeId}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TransactionTable;
