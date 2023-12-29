"use client"

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import FakeNefturiansContract from "./FakeNefturians.json";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function FakeNefturians() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [tokenPrice, setTokenPrice] = useState(0);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState(null);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const networkId = await web3Instance.eth.net.getId();
          const contractData = FakeNefturiansContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            FakeNefturiansContract.abi,
            contractData.address
          );
          setContract(contractInstance);

          const currentAccount = (await web3Instance.eth.getAccounts())[0];
          setAccount(currentAccount);

          const price = await contractInstance.methods.tokenPrice().call();
          setTokenPrice(web3Instance.utils.fromWei(price, "ether"));
        } catch (error) {
          console.error("Error loading web3 or contract", error);
        }
      } else {
        console.error("Web3 not found");
      }
    }

    init();
  }, []);

  const handleBuyToken = async () => {
    setBuying(true);
    setBuyError(null);

    try {
      await contract.methods.buyAToken().send({
        from: account,
        value: web3.utils.toWei(tokenPrice.toString(), "ether"),
      });
    } catch (error) {
      console.error("Error buying token", error);
      setBuyError("Error buying token");
    } finally {
      setBuying(false);
    }
  };

  return (
    <div className="m-4">
      <h1>Fake Nefturians</h1>
      <p>Minimum Token Price: {tokenPrice} ETH</p>
      {account ? (
        <>
          <button className="btn btn-primary" onClick={handleBuyToken} disabled={buying}>
            Buy a Token
          </button>
          {buyError && <p className="text-danger mt-2">{buyError}</p>}
        </>
      ) : (
        <p>Connect your wallet to buy a token</p>
      )}
    </div>
  );
};
