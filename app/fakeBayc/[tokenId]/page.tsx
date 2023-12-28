"use client"

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import FakeBAYCContract from "../FakeBAYC.json";

export default function TokenDetail({ params }: { params: { tokenId: number } }) {
  const [web3, setWeb3] = useState(null);
  const [attributes, setAttributes] = useState([]);
  const [contract, setContract] = useState(null);
  const [tokenExists, setTokenExists] = useState(true);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const networkId = await web3Instance.eth.net.getId();
          const contractData = FakeBAYCContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            FakeBAYCContract.abi,
            contractData.address
          );
          setContract(contractInstance);

          const totalTokens = await contractInstance.methods.totalSupply().call();
          if (params.tokenId < totalTokens) {
            const metadataUri = await contractInstance.methods.tokenURI(params.tokenId).call();
            const metadataResponse = await fetch(metadataUri);
            const metadata = await metadataResponse.json();
            setAttributes(metadata.attributes);
          } else {
            setTokenExists(false);
          }
        } catch (error) {
          console.error("Error loading web3 or contract", error);
        }
      } else {
        console.error("Web3 not found");
      }
    }

    init();
  }, [params.tokenId]);

  if (!tokenExists) {
    return <div>Token does not exist.</div>;
  }

  return (
    <div>
      <h1>Token Details</h1>
      <p>Token ID: {params.tokenId}</p>
      {attributes.map((attr, index) => (
        <p key={index}>
          {attr.trait_type}: {attr.value}
        </p>
      ))}
    </div>
  );
};
