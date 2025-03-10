"use client";

import {useState, useEffect} from "react";
import {ethers} from "ethers";

export function useWallet() {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);

    useEffect(() => {
        // @ts-ignore
        if (window.ethereum) {
            // @ts-ignore
            const newProvider = new ethers.BrowserProvider(window.ethereum);
            setProvider(newProvider);
        }
    }, []);

    const connectWallet = async () => {
        if (!provider) return;
        setIsLoading(true);
        try {
            const accounts = await provider.send("eth_requestAccounts", []);
            setWalletAddress(accounts[0]);

            const signer = await provider.getSigner();
            const balance = await provider.getBalance(signer.address);
            setBalance(ethers.formatEther(balance));


        } catch (error) {
            console.error("Failed to connect wallet:", error);
        } finally {
            setIsLoading(false);
            setIsWalletConnected(true);
        }
    };

    return {walletAddress, balance, connectWallet, isLoading, isWalletConnected};
}
