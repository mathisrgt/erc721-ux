"use client"

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import FakeNefturiansContract from "../FakeNefturians.json";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="m-4 col-6">
      <h1>Tokens Owned</h1>
      <div className="input-group mt-4 mb-4">
        <span className="input-group-text">Address</span>
        <input className="form-control" type="text" value={userAddress} />
      </div>
      {tokens.length > 0 ? (
        <div className="card-group">
          {tokens.map((token) => (
            <div className="card">
              <img src="" className="card-img-top" alt=""></img>
              <div className="card-body">
                <h5 className="card-title">{token.metadata.name}</h5>
                <p className="card-text">{token.metadata.description}</p>
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">Token ID: {token.tokenId}</small>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tokens found for this user.</p>
      )}
    </div>
  );
};
