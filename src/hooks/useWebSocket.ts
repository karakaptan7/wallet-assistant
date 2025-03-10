"use client";

import { useEffect, useRef, useState } from "react";
import { WebSocketProvider, ethers } from "ethers";

export function useWebSocket(url: string) {
    const [messages, setMessages] = useState<string[]>([]);
    const [balance, setBalance] = useState<string>("");
    const socketRef = useRef<WebSocket | null>(null);
 //   const provider = new WebSocketProvider("wss://mainnet.infura.io/ws/v3/e3294febdfe546e58100bd359704a43a");
    const provider = new ethers.BrowserProvider(window.ethereum);

    useEffect(() => {
        provider.on("block", async (blockNumber) => {
            console.log(`🔄 New block received: ${blockNumber}`);
            const signer = provider.getSigner();
            const newBalance = await provider.getBalance(signer.address);
            setBalance(ethers.formatEther(newBalance));
        });

        socketRef.current = new WebSocket(url);

        socketRef.current.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
        };

        return () => {
            socketRef.current?.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return { messages, balance, sendMessage };
}
