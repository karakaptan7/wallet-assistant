"use client";

import { Button, Box, Text, Spinner } from "@chakra-ui/react";
import { useWallet } from "../hooks/useWallet";
import Chat from "../components/Chat";
import { handleCommand } from "../utils/commandHandler";

export default function Home() {
    const { walletAddress, balance, connectWallet, isLoading } = useWallet();

    return (
        <Box p={5}>
            <Button onClick={connectWallet} colorScheme="blue" loading={isLoading} disabled={isLoading}>
                {isLoading ? <Spinner size="sm" /> : "Cüzdanı Bağla"}
            </Button>

            {walletAddress && (
                <Box mt={4}>
                    <Text>Cüzdan: {walletAddress}</Text>
                </Box>
            )}

            <Box mt={5}>
                <Chat handleCommand={handleCommand} />
            </Box>
        </Box>
    );
}
