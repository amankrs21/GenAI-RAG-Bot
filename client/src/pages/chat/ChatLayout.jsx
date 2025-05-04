/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { ArrowDownward } from "@mui/icons-material";
import { Container, IconButton } from "@mui/material";

import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "../../components/typing/TypingIndicator";


// Chat layout component
export default function ChatLayout({ aiLoad, messages, onSend }) {

    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);
    const [autoScroll, setAutoScroll] = useState(true);

    useEffect(() => {
        if (autoScroll) {
            scrollToBottom();
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleScroll = () => {
        const chatContainer = chatContainerRef.current;
        if (chatContainer) {
            const isUserNearBottom =
                chatContainer.scrollHeight - chatContainer.scrollTop <=
                chatContainer.clientHeight + 50;
            setAutoScroll(isUserNearBottom);
        }
    };

    return (
        <div className="chat">
            <div
                className="chat__messages"
                ref={chatContainerRef}
                onScroll={handleScroll}
            >
                <Container className="chat__container">
                    {messages.length === 0 ? (
                        <p style={{ color: "#D3D2D2" }}>No messages yet...</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className="message-pair">
                                {msg.user && <ChatMessage msg={{ user: msg.user }} />}
                                {msg.bot && <ChatMessage msg={{ bot: msg.bot }} />}
                            </div>
                        ))
                    )}

                    {aiLoad && <TypingIndicator message="thinking" />}

                    {!autoScroll && (
                        <div className="chat__scrollToBottom">
                            <IconButton
                                sx={{
                                    backgroundColor: "#36383A",
                                    "&:hover": { backgroundColor: "#2F3135" },
                                }}
                                onClick={() => {
                                    scrollToBottom();
                                    setAutoScroll(true);
                                }}
                            >
                                <ArrowDownward color="primary" />
                            </IconButton>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </Container>
            </div>
            <div className="chat__input">
                <Container className="chat__container">
                    <ChatInput onSend={onSend} />
                </Container>
            </div>
        </div>
    );
}

ChatLayout.propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array.isRequired,
    setMessages: PropTypes.func.isRequired,
};
