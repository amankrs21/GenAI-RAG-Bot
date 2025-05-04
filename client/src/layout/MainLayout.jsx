import { useEffect, useState } from 'react';
import AppHeader from './AppHeader';

export default function MainLayout({ children }) {

    const [chatId, setChatId] = useState(null);
    const [history, setHistory] = useState([]);
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setChatId(urlParams.get('chatId') ?? null);
    }, []);


    const handleOpenHistory = async () => {
        console.log("Opening chat history...");
    }

    return (
        <div className='main'>
            <div className='main__left'>
                <AppHeader />
            </div>

            <div className='main__center'>
                {children}
            </div>

            <div className='main__right'>
                <NavbarActions
                    chatId={chatId}
                    history={history}
                    setChatId={setChatId}
                    setHistory={setHistory}
                    setMessages={setMessages}
                    handleOpen={(e) => handleOpenHistory(e)}
                />
            </div>

        </div>
    )
}
