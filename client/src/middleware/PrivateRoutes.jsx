import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import AppHeader from '../layout/AppHeader';
import NavbarActions from '../layout/NavbarActions';

// import { useAuth } from '../hooks/useAuth';


// PrivateRoutes component to protect routes
export default function PrivateRoutes() {

    // const { isAuthLoading, isAuthenticated, http, logout } = useAuth();

    const tempAuth = true;

    const [chatId, setChatId] = useState(null);
    const [history, setHistory] = useState([]);
    const [messages, setMessages] = useState([]);

    const handleOpenHistory = async () => {
        console.log("Opening chat history...");
    }

    // useEffect(() => {
    //     if (!isAuthenticated) logout();
    //     if (isAuthLoading || !http.defaults.headers.common.Authorization) return;


    //     const urlParams = new URLSearchParams(window.location.search);
    //     setChatId(urlParams.get('chatId') ?? null);

    // }, [isAuthLoading, isAuthenticated, http, logout]);

    // if (!isAuthenticated) {
    //     return null;
    // }

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        setChatId(urlParams.get('chatId') ?? null);

    }, [chatId]);


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
