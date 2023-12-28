"use client"

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Web3 from "web3";
import FakeBAYCContract from "./FakeBAYC.json";
import Button from "react-bootstrap/Button";

const FakeBayc = () => {
  const [name, setName] = useState("");
  const [totalTokens, setTotalTokens] = useState(0);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(null);

  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState(null);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const accounts = await web3Instance.eth.getAccounts();
          setAccounts(accounts);

          const networkId = await web3Instance.eth.net.getId();
          const contractData = FakeBAYCContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            FakeBAYCContract.abi,
            contractData.address
          );
          setContract(contractInstance);

          const contractName = await contractInstance.methods.name().call();
          const totalSupply = await contractInstance.methods.totalSupply().call();

          setName(contractName);
          setTotalTokens(totalSupply);
        } catch (error) {
          console.error("Error loading web3 or contract", error);
        }
      } else {
        console.error("Web3 not found");
      }
    }

    init();
  }, []);

  const handleClaim = async () => {
    setClaiming(true);
    setClaimError(null);

    try {
      await contract.methods.claimAToken().send({ from: accounts[0] });
    } catch (error) {
      console.error("Error claiming token", error);
      setClaimError("Error claiming token");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div>
      <h1>{name}</h1>
      <p>Total Token Number: {totalTokens}</p>
      {accounts.length > 0 ? (
        <>
          <Button onClick={handleClaim} disabled={claiming}>
            Claim a New Token
          </Button>
          {claimError && <p>{claimError}</p>}
        </>
      ) : (
        <p>Connect your wallet to claim a token</p>
      )}
    </div>
  );
};

export default FakeBayc;
