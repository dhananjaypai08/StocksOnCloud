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
  const [buyquantity, setbuyQuantity] = useState(1);
  const [sellquantity, setsellQuantity] = useState(1);
  const [isConnected, setConnected] = useState(false);
  const [connectedMsg, setConnectedMsg] = useState("Please connect your wallet");
  const [provider, setProvider] = useState("");
  const [signer, setSigner] = useState("");
  const [buyAmount, setbuyAmount] = useState(0);
  const [sellAmount, setsellAmount] = useState(0);
  const [constant_product, setConstantProduct] = useState();
  const [getDataFeedETH, setDataFeedETH] = useState();
  const [getDataFeedUSDC, setDataFeedUSDC] = useState();
  const [contract, setContract] = useState();
  const [contractwithsigner, setContractwithsigner] = useState();
//   const email = localStorage.getItem("Email");

  //
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionResult, setTransactionResult] = useState(null);

  const buyAsset = async() => {
    const contractdeployed = new ethers.Contract(
      address.address,
      abi.abi,
      signer
    );
    const tx = await contractdeployed.buyAsset(buyquantity);
    await tx.wait();
    console.log(tx.hash);
  //   if (window.ethereum) {
  //     const provider = new ethers.BrowserProvider(window.ethereum);
  //     const signer = await provider.getSigner();
  //     const contractdeployed = new ethers.Contract(
  //         address.address, 
  //         abi.abi,
  //         signer
  //     )
  //     console.log(signer, contractdeployed);
  //     const tx = await contractdeployed.buyAsset(buyquantity);
  //     await tx.wait();
  //     console.log(tx.hash);
  // }

  }

  const sellAsset = async() => {
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      signer
    )
    const tx = await contract.sellAsset(sellquantity);
    await tx.wait();
  }

  const resetBalance = async() => {
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      signer
    )
    const tx = await contract.resetBal();
    await tx.wait();
  }

  const setbuyChangeQuantity = async(value) => {
    if(value<=0){
      setbuyQuantity(1);
      return ;
    }
    setbuyQuantity(value);
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      provider
    )
    let val = await contract.getbuyAssetAmt(value);
    setbuyAmount(parseInt(val));
  }

  const setsellChangeQuantity = async(value) => {
    if(value<=0){
      setbuyQuantity(1);
      return ;
    }
    setsellQuantity(value);
    const contract = new ethers.Contract(
      address.address,
      abi.abi,
      provider
    )
    let val = await contract.getsellAssetAmt(value);
    setsellAmount(parseInt(val));
  }

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
        const signer = await provider.getSigner();
        setSigner(signer);
        const contract = new ethers.Contract(
            address.address, 
            abi.abi,
            provider
        )
        const contractwithsigner = contract.connect(signer);
        setConnectedMsg(account);
        setConnected(true);
        setContract(contract);
        setContractwithsigner(contractwithsigner);
        // const contractwithsigner = contract.connect(signer);
        let val = await contract.getConstantProduct();
        setConstantProduct(parseInt(val));
        val = await contract.getDataFeedETH();
        setDataFeedETH(parseInt(val));
        val = await contract.getDataFeedUSDC();
        setDataFeedUSDC(parseInt(val));
        val = await contract.getbuyAssetAmt(1);
        setbuyAmount(parseInt(val));
        val = await contract.getsellAssetAmt(1);
        setsellAmount(parseInt(val));
    }

  }

  return (
    <>
      <h1 className="w-full max-w-md bg-black text-white">
        <header>
          <title className="text-2xl font-bold">Trade Crypto</title>
        </header>
        <button
              onClick={() => connectWallet()}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              Connect
            </button>
        <h4 className="space-y-4">
          {isConnected && 
          <>
          <div>{connectedMsg}</div>
       
          {/* <select onValueChange={setSelectedStock} defaultValue={selectedStock}>
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
          </select> */}

          <div className="mt-4">
            <input
              type="number"
              placeholder="Price"
              value={buyAmount}
              disabled
              className="w-full bg-slate-900 mb-4"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={buyquantity}
              onChange={(e) => setbuyChangeQuantity(e.target.value)}
              className="w-full bg-slate-900"
            />

            <button onClick={() => buyAsset()} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
              Buy
            </button>
          </div>
          <div className="space-y-2 pt-6">
          <input
              type="number"
              placeholder="Price"
              value={sellAmount}
              disabled
              className="w-full bg-slate-900 mb-4"
            />

            <input
              type="number"
              placeholder="Quantity"
              value={sellquantity}
              onChange={(e) => setsellChangeQuantity(e.target.value)}
              className="w-full bg-slate-900"
            />

            <button className="w-full bg-red-600 hover:bg-red-700 h-12 text-lg" onClick={() => sellAsset()}>
              Sell
            </button>
          </div>
          </>}
        </h4>
      </h1>
    </>
  );
};