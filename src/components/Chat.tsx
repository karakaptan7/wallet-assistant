import { useState } from "react";
import { Box, Input, Button, VStack, Text, Table } from "@chakra-ui/react";

type HandleCommandType = (input: string, setMessages: React.Dispatch<React.SetStateAction<string[]>>) => void;

interface ChatProps {
    handleCommand: HandleCommandType;
}

export default function Chat({ handleCommand }: ChatProps) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, `> ${input}`]);
        handleCommand(input, setMessages);
        setInput("");
    };

    const clearMessages = () => {
        setMessages([]);
    };

    return (
        <Box p={4} border="1px solid gray" borderRadius="md" width="100%">
            <VStack align="end" maxH="500px" overflowY="auto">
                {messages.map((msg, index) => (
                    <Box key={index} width="100%">
                        <Text>{msg}</Text>
                        {msg.startsWith("> history") && (
                            <Table.Root>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.ColumnHeader>Hash</Table.ColumnHeader>
                                        <Table.ColumnHeader>Timestamp</Table.ColumnHeader>
                                        <Table.ColumnHeader>Gas Price</Table.ColumnHeader>
                                        <Table.ColumnHeader>Gas Used</Table.ColumnHeader>
                                        <Table.ColumnHeader>Block Hash</Table.ColumnHeader>
                                        <Table.ColumnHeader textAlign="end">Value</Table.ColumnHeader>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {msg.split(",").slice(1).map((data, index) => {
                                        const [hash, timestamp, gasPrice, gasUsed, blockHash, value] = data.split(",");
                                        return (
                                            <Table.Row key={index}>
                                                <Table.Cell>{hash}</Table.Cell>
                                                <Table.Cell>{timestamp}</Table.Cell>
                                                <Table.Cell>{gasPrice}</Table.Cell>
                                                <Table.Cell>{gasUsed}</Table.Cell>
                                                <Table.Cell>{blockHash}</Table.Cell>
                                                <Table.Cell textAlign="end">{value}</Table.Cell>
                                            </Table.Row>
                                        );
                                    })}
                                </Table.Body>
                            </Table.Root>
                        )}
                    </Box>
                ))}
            </VStack>

            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Komut girin..."
            />
            <Button onClick={sendMessage} mt={2} colorScheme="blue">
                Gönder
            </Button>&nbsp;
            <Button onClick={clearMessages} mt={2} variant="outline">
                Temizle
            </Button>
        </Box>
    );
}
