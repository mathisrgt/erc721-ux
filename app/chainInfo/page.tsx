"use client"

import { useSDK, MetaMaskProvider } from "@metamask/sdk-react";
import { formatAddress } from "../../lib/utils";
import { useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

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
                <div className="mb-4">
                    <button type="button" className="btn btn-light" onClick={() => setShowPopover(!showPopover)}>{formatAddress(account)}</button>
                    {showPopover && (<button onClick={disconnect} className="text-danger ml-4">Disconnect</button>)}
                </div>
            ) : (
                <button type="button" className="btn btn-primary mb-4" disabled={connecting} onClick={connect}>Connect Wallet</button>
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
