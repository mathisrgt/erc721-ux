"use client"

import { Button } from "react-bootstrap";
import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../../lib/utils";
import { useEffect, useState } from "react";

export const ConnectWalletButton = () => {
  const { sdk, connected, connecting, account } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
    } catch (err) {
      console.warn(`No accounts found`, err);
    }
  };

  const disconnect = () => {
    if (sdk) {
      sdk.disconnect();
    }
  };

  const [showPopover, setShowPopover] = useState(false);

  return (
    <div className="relative">
      {connected ? (
        <div>
          <Button
            variant="light"
            onClick={() => setShowPopover(!showPopover)}
          >
            {formatAddress(account)}
          </Button>
          {showPopover && (
            <div className="position-absolute mt-2 w-44 bg-gray-100 border rounded-md shadow-lg right-0 z-10 top-10">
              <button
                onClick={disconnect}
                className="block w-full pl-2 pr-4 py-2 text-left text-[#F05252] hover:bg-gray-200"
              >
                Disconnect
              </button>
            </div>
          )}
        </div>
      ) : (
        <Button
          variant="primary"
          disabled={connecting}
          onClick={connect}
          className="d-flex align-items-center"
        >
          Connect Wallet
        </Button>
      )}
    </div>
  );
};

export const ChainInfoDetails = () => {
  const { sdk, account } = useSDK();
  const [chainId, setChainId] = useState(null);
  const [blockNumber, setBlockNumber] = useState(null);
  const [isInvalidChain, setIsInvalidChain] = useState(false);

  const redirectToSepoliaChain = async () => {
    try {
      const ethereum = window.ethereum;

      const chainIdResult = await ethereum.request({ method: "eth_chainId" });
      setChainId(chainIdResult);

      if (chainIdResult !== "0xaa36a7") {
        setIsInvalidChain(true);

        const sepoliaNetwork = {
          chainId: "0xaa36a7",
          chainName: "Sepolia",
        };

        await ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: sepoliaNetwork.chainId }],
        });
      }
    } catch (error) {
      console.error("Error fetching chain info:", error);
    }
  };

  useEffect(() => {
    if (sdk && account) {
      redirectToSepoliaChain();
    }
  }, [sdk, account]);

  return (
    <div>
      {isInvalidChain ? (
        <div>
          <h2>Error: Invalid Chain</h2>
          <p>
            The current chain is not Sepolia. Please switch to Sepolia network.
          </p>
        </div>
      ) : (
        <>
          <h2>Chain Information</h2>
          <p>ChainId: {chainId}</p>
          <p>Last Block Number: {blockNumber}</p>
          <p>User Address: {account}</p>
        </>
      )}
    </div>
  );
};

export const ChainInfo = () => {
  const host =
    typeof window !== "undefined" ? window.location.host : "defaultHost";

  const sdkOptions = {
    logging: { developerMode: false },
    checkInstallationImmediately: false,
    dappMetadata: {
      name: "Next-Metamask-Boilerplate",
      url: host,
    },
  };

  return (
    <MetaMaskProvider debug={false} sdkOptions={sdkOptions}>
      <ConnectWalletButton />
      <ChainInfoDetails />
    </MetaMaskProvider>
  );
};

export default ChainInfo;
