import { useState } from 'react';

import ChatLayout from './ChatLayout';
import ChatWelcome from './ChatWelcome';
import { handleChatLLM } from './handleChat';
import { useAuth } from '../../hooks/useAuth';


// ChatHome component
export default function ChatHome() {

    const { baseURL } = useAuth();

    const [aiLoad, setAiLoad] = useState(false);
    const [messages, setMessages] = useState([]);

    const handleChat = async (text) => {
        console.log("Message sent:", text);
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
        <div className='main__center'>
            {messages.length === 0 ? (
                <ChatWelcome onSend={handleChat} />
            ) : (
                <ChatLayout aiLoad={aiLoad} messages={messages} onSend={handleChat} />
            )}
        </div>
    )
}
