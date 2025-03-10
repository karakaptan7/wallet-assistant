"use client";

import { ethers } from "ethers";

export async function handleCommand(
    command: string,
    setMessages: (messages: (prev: any) => any[]) => void

) {
    if (!window.ethereum) {
        setMessages((prev) => [...prev, "Ethereum provider not found."]);
        return;
    }

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
            setMessages((prev) => [...prev, JSON.stringify(data.result)]);

            console.log(data.result);
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
        "balance": "The balance refers to the total amount of cryptocurrency an account currently holds.",
        "history": "History refers to the list of transactions (both incoming and outgoing) associated with the wallet.",
        "stats": "Stats refer to performance metrics related to the wallet or account.",
        "asset": "An asset is a digital or physical item that holds value."
    };

    return explanations[asset] || `No explanation found for ${asset}.`;
}
