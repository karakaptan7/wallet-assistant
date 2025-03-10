"use client";

import {useState, useEffect} from "react";
import {Box, Input, Button, VStack, Text, Spinner, Table} from "@chakra-ui/react";
import { ethers } from "ethers";

type HandleCommandType = (input: string, setMessages: React.Dispatch<React.SetStateAction<string[]>>) => void;

interface ChatProps {
    handleCommand: HandleCommandType;
    isWalletConnected: boolean;
}
function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
        return str;
    }
    return str.slice(0, maxLength) + '...';
}
export default function Chat({handleCommand, isWalletConnected}: ChatProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, `> ${input}`]);
        setIsLoading(true);
        handleCommand(input, (newMessages) => {
            setMessages(newMessages);
            setIsLoading(false);
        });
        setInput("");
    };

    const clearMessages = () => {
        setMessages([]);
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Enter" && isWalletConnected) {
                sendMessage();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [input, isWalletConnected]);

    return (
        <Box p={4} border="1px solid gray" borderRadius="md" width="100%">
            <VStack align="end" maxH="500px" overflowY="auto">
                {messages.map((msg, index) => (
                    <Box key={index} width="100%">
                        {msg.startsWith("[{") ? (
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Block Number</Table.ColumnHeader>
                                        <Table.ColumnHeader>Time</Table.ColumnHeader>
                                        <Table.ColumnHeader>Hash</Table.ColumnHeader>
                                        <Table.ColumnHeader>From</Table.ColumnHeader>
                                        <Table.ColumnHeader>To</Table.ColumnHeader>
                                        <Table.ColumnHeader>Gas Price</Table.ColumnHeader>
                                        <Table.ColumnHeader>Gas Used</Table.ColumnHeader>
                                        <Table.ColumnHeader>Block Hash</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">Value</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {JSON.parse(msg).map((data: any, index: number) => (
                                        <Table.Row key={index}>
                                            <Table.Cell>{data.blockNumber}</Table.Cell>
                                            <Table.Cell>{new Date(data.timeStamp * 1000).toLocaleString()}</Table.Cell>
                                            <Table.Cell>{truncateString(data.hash, 10)}</Table.Cell>
                                            <Table.Cell>{truncateString(data.from, 10)}</Table.Cell>
                                            <Table.Cell>{truncateString(data.to, 10)}</Table.Cell>
                                            <Table.Cell>{data.gasPrice}</Table.Cell>
                                            <Table.Cell>{data.gasUsed}</Table.Cell>
                                            <Table.Cell>{truncateString(data.blockHash, 10)}</Table.Cell>
                                            <Table.Cell textAlign="end">{ethers.formatEther(data.value)} ETH</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                            </Table.Root>
                        ) : (
                            <Text>{msg}</Text>
                        )}
                    </Box>
                ))}
            </VStack>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Komut girin..."
                disabled={!isWalletConnected} // Disable input if wallet is not connected
            />
            <Button onClick={sendMessage} mt={2} disabled={isLoading || !isWalletConnected}>
                {isLoading ? <Spinner size="sm"/> : "Gönder"}
            </Button>
            &nbsp;
            <Button onClick={clearMessages} mt={2} variant="outline" disabled={!isWalletConnected}>
                Temizle
            </Button>
        </Box>
    );
}
