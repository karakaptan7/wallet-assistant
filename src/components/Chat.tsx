"use client";

import { useState } from "react";
import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

export default function Chat({ handleCommand }) {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<string[]>([]);

    const sendMessage = () => {
        if (!input.trim()) return;
        setMessages([...messages, `> ${input}`]);
        handleCommand(input, setMessages);
        setInput("");
    };

    return (
        <Box p={4} border="1px solid gray" borderRadius="md" width="800px">
            <VStack align="start" maxH="300px" overflowY="auto">
                {messages.map((msg, index) => (
                    <Text key={index}>{msg}</Text>
                ))}
            </VStack>
            <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Komut girin..."
            />
            <Button onClick={sendMessage} mt={2} colorScheme="blue">
                Gönder
            </Button>
        </Box>
    );
}
