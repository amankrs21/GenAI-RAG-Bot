import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import AppHeader from '../layout/AppHeader';
import NavbarActions from '../layout/NavbarActions';


// PrivateRoutes component to protect routes
export default function PrivateRoutes() {

    const navigate = useNavigate();
    const { isAuthLoading, isAuthenticated, http } = useAuth();

    const tempAuth = true;

    const [chatId, setChatId] = useState(null);
    const [history, setHistory] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleOpenHistory = async () => {
        console.log("Opening chat history...");
    }

    useEffect(() => {
        if (!isAuthenticated) { navigate('/'); };
        if (isAuthLoading || !http.defaults.headers.common.Authorization) return;


        // const urlParams = new URLSearchParams(window.location.search);
        // setChatId(urlParams.get('chatId') ?? null);

    }, [isAuthLoading, isAuthenticated, http, navigate]);

    if (!isAuthenticated) {
        return null;
    }

    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     setChatId(urlParams.get('chatId') ?? null);

    // }, [chatId]);


    return (
        <>
            {tempAuth ? (
                // {!isAuthLoading && isAuthenticated && http.defaults.headers.common.Authorization ? (
                <div className='main'>
                    <div className='main__left'>
                        <AppHeader />
                    </div>

                    <Outlet />
                    {/* <div className='main__center'>
                    </div> */}

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
            ) :
                null
            }
        </>
    );
};
