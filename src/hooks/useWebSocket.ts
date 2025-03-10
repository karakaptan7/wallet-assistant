"use client";

import { useEffect, useRef, useState } from "react";
import { WebSocketProvider, ethers } from "ethers";

export function useWebSocket(url: string) {
    const [messages, setMessages] = useState<string[]>([]);
    const [balance, setBalance] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const provider = new ethers.WebSocketProvider(url);

    useEffect(() => {
        const updateBalance = async () => {
            const signer = provider.getSigner();
            const newBalance = await provider.getBalance((await signer).address);
            setBalance(ethers.formatEther(newBalance));
        };

        provider.on("block", updateBalance);

        socketRef.current = new WebSocket(url);

        socketRef.current.onopen = () => {
            setError(null);
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === "balanceUpdate") {
                setBalance(ethers.formatEther(data.newBalance));
                setMessages((prevMessages) => [...prevMessages, `Balance updated: ${ethers.formatEther(data.newBalance)} ETH`]);
            } else {
                setMessages((prevMessages) => [...prevMessages, event.data]);
            }
        };

        socketRef.current.onerror = () => {
            setError("WebSocket connection error");
        };

        socketRef.current.onclose = () => {
            setError("WebSocket connection closed");
        };

        return () => {
            provider.off("block", updateBalance);
            socketRef.current?.close();
        };
    }, [url]);

    const sendMessage = (message: string) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(message);
        }
    };

    return { messages, balance, sendMessage, error };
}
