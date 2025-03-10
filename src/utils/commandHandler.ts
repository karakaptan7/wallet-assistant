"use client";

import {ethers} from "ethers";
import {useWallet} from "@/hooks/useWallet";

export async function handleCommand(
    command: string,
    setMessages: (messages: (prev) => any[]) => void
) {
    // @ts-ignore
    if (!window.ethereum) {
        setMessages((prev) => [...prev, "Ethereum provider not found."]);
        return;
    }

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();

    const apiKey = "91BXZBQQ5BCW2B4ARCQSXJNR7952DB5G15";

    if (command === "balance") {
        const balance = await provider.getBalance(signer.address);
        setMessages((prev) => [...prev, `Balance: ${ethers.formatEther(balance)} ETH`]);
    } else if (command === "history") {
        const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${signer.address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
        const response = await fetch(etherscanUrl);
        const data = await response.json();

        if (data.status === "1") {
            const formattedHistory = data.result.map((tx: any) => {
                const date = new Date(tx.timeStamp * 1000); // Convert timestamp to milliseconds
                const formattedDate = date.toLocaleString(); // Format date to a readable string
               // return `Tx: ${tx.hash}, \nStatus:${tx.status}, \nValue: ${ethers.formatEther(tx.value)} ETH, \nTimestamp: ${formattedDate}, \nGas Price: ${tx.gasPrice} , \nGas Used: ${tx.gasUsed} , \nBlock Hash: ${tx.blockHash}`;
                return `${tx.hash},${formattedDate},${tx.gasPrice},${tx.gasUsed},${tx.blockHash},${ethers.formatEther(tx.value)}`;
            });
            setMessages((prev) => [...prev, ...formattedHistory]);
        } else {
            setMessages((prev) => [...prev, "No transactions found or an error occurred."]);
        }
    } else if (command === "stats") {
        const stats = await getAssetStatistics(signer.address, apiKey);

        setMessages((prev) => [...prev, stats]);
    } else if (command.startsWith("explain")) {
        const asset = command.split(" ")[1];
        const explanation = getAssetExplanation(asset);
        setMessages((prev) => [...prev, explanation]);
    } else {
        setMessages((prev) => [...prev, "Unknown command."]);
    }
}

async function getAssetStatistics(address: string, apiKey: string): Promise<string> {

    const response = await fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${apiKey}`);
    const data = await response.json();

    if (data.status === "1") {
        return `Asset Distribution: ${data.assetDistribution}, Performance: ${data.performance}`;
    } else {
        return "Failed to fetch asset statistics.";
    }
}

function getAssetExplanation(asset: string): string {
    const explanations: { [key: string]: string } = {
        "ETH": "Ethereum (ETH) is a decentralized, open-source blockchain with smart contract functionality.",
        "BTC": "Bitcoin (BTC) is a decentralized digital currency, without a central bank or single administrator.",
    };

    return explanations[asset] || `No explanation found for ${asset}.`;
}
