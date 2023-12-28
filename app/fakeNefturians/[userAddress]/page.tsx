"use client"

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import FakeNefturiansContract from "../FakeNefturians.json";

export default function TokenDetail({ params }: { params: { userAddress: number } }) {
  const userAddress = params.userAddress;
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);

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

          const totalTokens = await contractInstance.methods.totalSupply().call();
          const userTokens = [];
          for (let tokenId = 0; tokenId < totalTokens; tokenId++) {
            const owner = await contractInstance.methods.ownerOf(tokenId).call();
            if (owner.toLowerCase() === userAddress.toLowerCase()) {
              const metadataUri = await contractInstance.methods.tokenURI(tokenId).call();
              const metadataResponse = await fetch(metadataUri);
              const metadata = await metadataResponse.json();
              userTokens.push({ tokenId, metadata });
            }
          }
          setTokens(userTokens);
          setLoading(false);
        } catch (error) {
          console.error("Error loading web3 or contract", error);
        }
      } else {
        console.error("Web3 not found");
      }
    }

    init();
  }, [userAddress]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Tokens Owned by {userAddress}</h1>
      {tokens.length > 0 ? (
        <ul>
          {tokens.map((token) => (
            <li key={token.tokenId}>
              <p>Token ID: {token.tokenId}</p>
              <p>Name: {token.metadata.name}</p>
              <p>Description: {token.metadata.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tokens found for this user.</p>
      )}
    </div>
  );
};
