"use client"

import React, { useState, useEffect } from "react";
import Web3 from "web3";
import FakeMeebitsClaimerContract from "./FakeMeebitsClaimer.json";

const FakeMeebits = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState("");
  const [minting, setMinting] = useState(false);
  const [mintError, setMintError] = useState(null);
  const [selectedToken, setSelectedToken] = useState(0);

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        try {
          await window.ethereum.request({ method: "eth_requestAccounts" });

          const networkId = await web3Instance.eth.net.getId();
          const contractData = FakeMeebitsClaimerContract.networks[networkId];
          const contractInstance = new web3Instance.eth.Contract(
            FakeMeebitsClaimerContract.abi,
            contractData.address
          );
          setContract(contractInstance);

          const currentAccount = (await web3Instance.eth.getAccounts())[0];
          setAccount(currentAccount);
        } catch (error) {
          console.error("Error loading web3 or contract", error);
        }
      } else {
        console.error("Web3 not found");
      }
    }

    init();
  }, []);

  const handleMintToken = async () => {
    setMinting(true);
    setMintError(null);

    try {
      const isTokenClaimed = await contract.methods.tokensThatWereClaimed(selectedToken).call();
      if (!isTokenClaimed) {
        const hash = web3.utils.soliditySha3(contract.options.address, selectedToken);
        const signature = await web3.eth.sign(hash, account);

        await contract.methods.claimAToken(selectedToken, signature).send({ from: account });
      } else {
        setMintError("Token has already been claimed");
      }
    } catch (error) {
      console.error("Error minting token", error);
      setMintError("Error minting token");
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <h1>Fake Meebits</h1>
      <label>
        Select Token Number:
        <input
          type="number"
          min="0"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        />
      </label>
      <button onClick={handleMintToken} disabled={minting}>
        Mint Token
      </button>
      {mintError && <p>{mintError}</p>}
    </div>
  );
};

export default FakeMeebits;
