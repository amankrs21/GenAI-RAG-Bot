/* eslint-disable react-hooks/exhaustive-deps */
import PropTypes from "prop-types";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { ArrowDownward } from "@mui/icons-material";
import { Container, IconButton } from "@mui/material";

import ChatInput from "./ChatInput";
import ChatMessageBot from "./ChatMessageBot";
import ChatMessageUser from "./ChatMessageUser";
import TypingIndicator from "../../components/typing/TypingIndicator";
import { useAuth } from "../../hooks/useAuth";


// Chat layout component
export default function ChatHome({ aiLoad, messages, onSend }) {

    const { http } = useAuth();
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const [autoScroll, setAutoScroll] = useState(true);
    const [feedbackLike, setFeedbackLike] = useState([]);
    const [feedbackDislike, setFeedbackDislike] = useState([]);

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
                chatContainer.clientHeight + 100;
            setAutoScroll(isUserNearBottom);
        }
    };

    const handleLikeFeedback = (index) => {
        if (!feedbackLike.includes(index)) {
            setFeedbackLike((prev) => [...prev, index]);
            toast.success("Thank you for your feedback!");
        } else {
            setFeedbackLike((prev) => prev.filter((i) => i !== index));
        }
    }

    const handleDislikeFeedback = async (index, comment, bot, user) => {
        console.log("Feedback submitted:", index, comment, bot, user);
        if (!feedbackDislike.includes(index)) {
            try {
                await http.post("/feedback/dislike", {
                    userMessage: user,
                    botResponse: bot,
                    comment: comment,
                });
                setFeedbackDislike((prev) => [...prev, index]);
                toast.success("Feedback submitted successfully!");
            } catch (error) {
                console.error("Error submitting feedback:", error);
                toast.error("Error submitting feedback. Please try again.");
            }
        } else {
            setFeedbackDislike((prev) => prev.filter((i) => i !== index));
        }
    }

    return (
        <div className="chat__home">
            <div
                className="chat__home__messages"
                ref={chatContainerRef}
                onScroll={handleScroll}
            >
                <Container className="chat__home__container">
                    {messages.length === 0 ? (
                        <p style={{ color: "#D3D2D2" }}>No messages yet...</p>
                    ) : (
                        messages.map((msg, index) => (
                            <div key={index} className="chat__home__message__pair">
                                {msg.user &&
                                    <ChatMessageUser msg={{ user: msg.user }} />
                                }
                                {msg.bot &&
                                    <ChatMessageBot
                                        msg={{ bot: msg.bot }}
                                        isLiked={feedbackLike.includes(index)}
                                        onLike={() => handleLikeFeedback(index)}
                                        isDisliked={feedbackDislike.includes(index)}
                                        onDislike={(comment) =>
                                            handleDislikeFeedback(index, comment, msg.bot, messages[index - 1].user)}
                                    />
                                }
                            </div>
                        ))
                    )}

                    {aiLoad && <TypingIndicator message="thinking" />}

                    {!autoScroll && (
                        <div className="chat__home__scrollToBottom">
                            <IconButton
                                sx={{
                                    backgroundColor: "#fff",
                                    border: "1px solid #ccc",
                                    "&:hover": { backgroundColor: "#f0f0f0" },
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
            <div className="chat__home__input">
                <Container className="chat__home__container">
                    <ChatInput onSend={onSend} />
                </Container>
            </div>
        </div>
    );
}

ChatHome.propTypes = {
    chatId: PropTypes.string,
    messages: PropTypes.array.isRequired,
    setMessages: PropTypes.func.isRequired,
};
