import React, { useEffect, useState } from "react";
import abi from "../contracts/AMMPool.json";
import address from "../contracts/address.json";
// import axios from "axios";
const ethers = require("ethers");

const stocks = [
  { value: "ETH", label: "Ethereum" },
  { value: "USDC", label: "USDC Token" },
];
const desiredChainId = 11155111;

export const Landing = () => {
  const [selectedStock, setSelectedStock] = useState(stocks[0].value);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [isConnected, setConnected] = useState(false);
  const [connectedMsg, setConnectedMsg] = useState("Please connect your wallet");
  const [provider, setProvider] = useState("");
  const [signer, setSigner] = useState("");
//   const email = localStorage.getItem("Email");

  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

//   const handleTrade = async (action) => {
//     try {
//       const response = await axios.post("http://127.0.0.1:5000/transaction", {
//         email: email,
//         stock_name: selectedStock,
//         price: parseFloat(price),
//         quantity: parseInt(quantity),
//         action: action,
//       });
//       console.log(response.data);
//       //
//       setTransactionResult(response.data);
//       setIsModalOpen(true);
//     } catch (error) {
//       console.error("Error:", error);
//       setTransactionResult(false);
//       setIsModalOpen(true);
//     }
//   };
  useEffect(() => {
    // Code to be run after the component renders
    const getBalance = async() => {

    }
  }, []);

  const connectWallet = async() => {
    if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const account = accounts[0];
        const provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        console.log(network.chainId);
        console.log(address.address);
        if(network.chainId != desiredChainId){
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: `0x${desiredChainId.toString(16)}` }], // Convert ID to hex string
            });

          } catch (switchError) {
            // Handle errors (e.g., user rejection, unsupported network)
            if (switchError.code === 4902) {
              console.log('User rejected network switch');
            } else if (switchError.code === -32602) {
              console.log('Network switch not supported');
            } else {
              console.error('Error switching network:', switchError);
            }
          }
        }
        const signer = provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(
            address.address, 
            abi.abi,
            provider
        )
        const resp = contract.getFunction();
        console.log(resp)
        // const contractwithsigner = contract.connect(signer);
        const val = await contract.getConstantProduct();
        console.log(parseInt(val));
    }

  }

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <h1 className="w-full max-w-md bg-black text-white">
        <header>
          <title className="text-2xl font-bold">Trade Crypto</title>
        </header>
        <h4 className="space-y-4">
        <button
              onClick={() => connectWallet()}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              Buy
            </button>
          <select onValueChange={setSelectedStock} defaultValue={selectedStock}>
            <select className="w-full bg-black">
              <select placeholder="Select a stock" />
            </select>
            <select>
              {stocks.map((stock) => (
                <li key={stock.value} value={stock.value}>
                  {stock.label}
                </li>
              ))}
            </select>
          </select>

          <div className="mt-4">
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-slate-900 mb-4"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-slate-900"
            />
          </div>
          <div className="space-y-2 pt-6">
            <button
              
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              Buy
            </button>
            <button
              
              className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg"
            >
              Sell
            </button>
          </div>
        </h4>
      </h1>
    </>
  );
};