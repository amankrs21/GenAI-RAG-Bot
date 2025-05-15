import PropTypes from 'prop-types';
import { Typography } from '@mui/material';
import { useEffect, useState } from 'react';

import ChatInput from './ChatInput';
import TypewriterEffect from '../../components/typing/TypewriterEffect';


// ChatWelcome component
export default function ChatWelcome({ onSend }) {

    const [greeting, setGreeting] = useState("Good Morning");

    useEffect(() => {
        const date = new Date();
        const hours = date.getHours();
        if (hours < 12) setGreeting("Good Morning");
        else if (hours >= 12 && hours < 17) setGreeting("Good Afternoon");
        else if (hours >= 17 && hours < 20) setGreeting("Good Evening");
        else setGreeting("Good Night");
    }, []);

    return (
        <div className="chat__welcome">
            <Typography variant="h5" fontWeight={700} color="primary">
                Hello! {greeting} 😊
            </Typography>

            <Typography variant="h6" color="text.secondary" fontWeight={500}>
                How can I assist you today?
            </Typography>

            <ChatInput onSend={onSend} />

            <Typography variant="h6" color="text.primary" fontWeight={500} height='30px' sx={{ mt: 4 }}>
                <TypewriterEffect
                    strings={[
                        "This is RAG (Retrieval Augmented Generation) chat.",
                        "I'll help you with your queries.",
                        "Sometimes I may provide Hallucinated answers.",
                        "Please provide feedback to improve my responses.",
                    ]}
                    delay={50}
                    deleteSpeed={20}
                />
            </Typography>

        </div>
    )
}

ChatWelcome.propTypes = {
    onSend: PropTypes.func.isRequired,
};
