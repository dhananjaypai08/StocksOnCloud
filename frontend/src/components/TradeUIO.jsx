import React, { useState } from "react";
import axios from "axios";

const TradeUI = ({ onOrderFilled }) => {
  const [formData, setFormData] = useState({
    baseAsset: "",
    price: "",
    quantity: "",
    side: "buy",
    type: "limit",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      price: parseInt(formData.price, 10),
      quantity: parseInt(formData.quantity, 10),
    };

    try {
      const response = await axios.post(
        "http://localhost:3002/api/v1/order",
        orderData
      );
      onOrderFilled(response.data);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-gray-800 p-4 rounded-md"
    >
      <div>
        <label>Base Asset:</label>
        <input
          type="text"
          name="baseAsset"
          value={formData.baseAsset}
          onChange={handleChange}
          className="border p-2 w-full bg-gray-700 text-white"
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          className="border p-2 w-full bg-gray-700 text-white"
        />
      </div>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleChange}
          className="border p-2 w-full bg-gray-700 text-white"
        />
      </div>
      <div>
        <label>Side:</label>
        <select
          name="side"
          value={formData.side}
          onChange={handleChange}
          className="border p-2 w-full bg-gray-700 text-white"
        >
          <option value="buy">Buy</option>
          <option value="sell">Sell</option>
        </select>
      </div>
      <div>
        <label>Type:</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 w-full bg-gray-700 text-white"
        >
          <option value="limit">Limit</option>
          <option value="market">Market</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white p-2 w-full rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default TradeUI;
