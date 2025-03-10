"use client";

import {ethers} from "ethers";
import {API_KEY} from "../../config";

export async function handleCommand(
    command: string,
    setMessages: (messages: (prev: any) => any[]) => void
) {
    // @ts-ignore
    if (!window.ethereum) {
        setMessages((prev) => [...prev, "Ethereum provider not found."]);
        return;
    }

    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const apiKey = "91BXZBQQ5BCW2B4ARCQSXJNR7952DB5G15"
    if (command === "balance") {
        const balance = await provider.getBalance(signer.address);
        setMessages((prev) => [...prev, `Balance: ${ethers.formatEther(balance)} ETH`]);
    } else if (command === "history") {
        const etherscanUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${signer.address}&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;
        const response = await fetch(etherscanUrl);
        const data = await response.json();
        if (data.status === "1") {
            setMessages((prev) => [...prev, JSON.stringify(data.result)]);
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
    const [supplyResponse, priceResponse, yesterdayResponse] = await Promise.all([
        fetch(`https://api.etherscan.io/api?module=stats&action=ethsupply&apikey=${apiKey}`),
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`),
        fetch(`https://api.coingecko.com/api/v3/coins/ethereum/history?date=${getYesterdayDate()}`)
    ]);

    const supplyData = await supplyResponse.json();
    const priceData = await priceResponse.json();
    const yesterdayData = await yesterdayResponse.json();

    if (supplyData.status === "1" && priceData.ethereum && yesterdayData.market_data) {
        const ethPrice = priceData.ethereum.usd;
        const yesterdayPrice = yesterdayData.market_data.current_price.usd;
        const priceChange = ethPrice - yesterdayPrice;
        const percentageChange = ((priceChange / yesterdayPrice) * 100).toFixed(2);
        // @ts-ignore
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(signer.address);
        const balanceInEth = ethers.formatEther(balance);
        const balanceInUsd = (parseFloat(balanceInEth) * ethPrice).toFixed(2);
        const gainOrLoss = (parseFloat(balanceInEth) * priceChange).toFixed(2);

        return `ETH Price: $${ethPrice}, Wallet Balance: ${balanceInEth} ETH ($${balanceInUsd} USD), Price Change: $${priceChange.toFixed(2)} (${percentageChange}%), Gain/Loss: $${gainOrLoss} USD`;
    } else {
        return "Failed to fetch asset statistics or price.";
    }
}

function getYesterdayDate(): string {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

function getAssetExplanation(asset: string): string {
    const explanations: { [key: string]: string } = {
        "eth": "Ethereum (ETH) is a decentralized, open-source blockchain with smart contract functionality.",
        "btc": "Bitcoin (BTC) is a decentralized digital currency, without a central bank or single administrator.",
        "balance": "The balance refers to the total amount of cryptocurrency an account currently holds.",
        "history": "History refers to the list of transactions (both incoming and outgoing) associated with the wallet.",
        "stats": "Stats refer to performance metrics related to the wallet or account.",
        "asset": "An asset is a digital or physical item that holds value."
    };

    return explanations[asset] || `No explanation found for ${asset}.`;
}
