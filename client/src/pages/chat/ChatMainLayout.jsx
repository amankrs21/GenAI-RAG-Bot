import { useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import { PsychologyAlt } from '@mui/icons-material';

import "./Chat.css";
import ChatHome from './ChatHome';
import ChatLayout from './ChatLayout';
import ChatWelcome from './ChatWelcome';
import ChatInfoPop from './ChatInfoPop';
import { handleChatLLM } from './handleChat';
import { useAuth } from '../../hooks/useAuth';


// ChatMainLayout component
export default function ChatMainLayout() {

    const { baseURL } = useAuth();

    const [open, setOpen] = useState(false);
    const [aiLoad, setAiLoad] = useState(false);
    const [messages, setMessages] = useState([
        {
            bot: "Hello! I'm GenAIBot. How can I assist you today?",
            user: "Hey there! Can you help me with some coding questions?",
        },
        {
            bot: "Of course! What coding questions do you have?",
            user: "I need help with a Python script.",
        },
        {
            bot: "Sure! What do you need help with in your Python script?",
            user: "Can you show me how to read a file in Python?",
        },
        {
            bot: "Sure! What do you need help with in your Python script?",
            user: "Can you show me how to read a file in Python?",
        },
        {
            bot: "Sure! What do you need help with in your Python script?",
            user: "Can you show me how to read a file in Python?",
        },
    ]);

    const handleChat = async (text) => {
        try {
            setAiLoad(true);
            await handleChatLLM({
                query: text,
                baseURL,
                setMessages,
                setAiLoad,
            })
        } catch (error) {
            console.error("Error in handleChat:", error);
        } finally {
            setAiLoad(false);
        }
    }

    return (
        <div className='chat__main'>

            <div className='chat__main__left'>
                <div className='chat__title' onClick={() => window.location.reload()}>
                    <img src="/bot.png" alt="GenAIBot" />
                    <h2>GenAIBot</h2>
                </div>
            </div>

            <div className='chat__main__center'>
                {messages.length === 0 ? (
                    <ChatWelcome onSend={handleChat} />
                ) : (
                    <ChatHome aiLoad={aiLoad} messages={messages} onSend={handleChat} />
                )}
            </div>

            <div className='chat__main__right'>
                <Tooltip arrow title="Click to see more info">
                    <Button
                        color="primary"
                        variant="outlined"
                        sx={{ margin: 1 }}
                        endIcon={<PsychologyAlt />}
                        onClick={() => setOpen(!open)}
                    >
                        Info
                    </Button>
                </Tooltip>
                {open && <ChatInfoPop open={open} setOpen={setOpen} />}
            </div>

        </div>
    )
}
