import { useEffect, useRef, useState } from "react";
import { WebSocketProvider, ethers } from "ethers";

export function useWebSocket(url: string) {
    const [messages, setMessages] = useState<string[]>([]);
    const [balance, setBalance] = useState<string>("");
    const socketRef = useRef<WebSocket | null>(null);
    // @ts-ignore
    const provider = new ethers.BrowserProvider(window.ethereum);

    useEffect(() => {
        const updateBalance = async () => {
            const signer = provider.getSigner();
            const newBalance = await provider.getBalance((await signer).address);
            setBalance(ethers.formatEther(newBalance));
        };

        provider.on("block", updateBalance);

        socketRef.current = new WebSocket(url);

        socketRef.current.onmessage = (event) => {
            setMessages((prevMessages) => [...prevMessages, event.data]);
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

    return { messages, balance, sendMessage };
}
