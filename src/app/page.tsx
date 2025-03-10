"use client";

import { Button, Box, Text, Spinner } from "@chakra-ui/react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { useWallet } from "../hooks/useWallet";
import Chat from "../components/Chat";
import { handleCommand } from "../utils/commandHandler";
import { useWebSocket } from "@/hooks/useWebSocket";

export default function Home() {
    const { walletAddress, connectWallet, isLoading, isWalletConnected } = useWallet();
    const { balance, error } = useWebSocket(`wss://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`);
    const handleConnectWallet = async () => {
        try {
            toaster.loading({
                title: "Wallet connecting",
            });
            await connectWallet();
            toaster.dismiss(); // Dismiss the loading state
            if (isWalletConnected) {
                toaster.success({
                    title: "Wallet Connected",
                    description: `Connected to ${walletAddress}`,
                });
            }
        } catch (error) {
            toaster.dismiss(); // Dismiss the loading state
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

            {error && (
                <Box mt={4}>
                    <Text color="red.500">Error: {error}</Text>
                </Box>
            )}

            <Box mt={5}>
                <Chat handleCommand={handleCommand} isWalletConnected={isWalletConnected} />
            </Box>
        </Box>
    );
}
