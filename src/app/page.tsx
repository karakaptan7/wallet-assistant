"use client";

import { Button, Box, Text, Spinner } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import Chat from "../components/Chat";
import { handleCommand } from "../utils/commandHandler";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Home() {
    const { walletAddress, connectWallet, isLoading, isWalletConnected } = useWallet();
    const { balance } = useWebSocket("wss://your-websocket-url");

    const handleConnectWallet = async () => {
        try {
            await connectWallet();
            toaster.success({
                title: "Wallet Connected",
            });
            if (walletAddress) {
                toaster.success({
                    title: "Wallet Connected",
                    description: `Connected to ${walletAddress}`,
                });
            }
        } catch (error) {
            toaster.error({
                title: "Failed to connect wallet",
            });
        }
    };

    return (
        <Box p={5}>
            <Toaster />
            <Button onClick={handleConnectWallet} colorScheme="blue" loading={isLoading} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Cüzdanı Bağla"}
            </Button>

            {walletAddress && (
                <Box mt={4}>
                    <Text>Cüzdan: {walletAddress}</Text>
                    <Text>Bakiye: {balance} ETH</Text>
                </Box>
            )}

            <Box mt={5}>
                <Chat handleCommand={handleCommand} isWalletConnected={isWalletConnected} />
            </Box>
        </Box>
    );
}
