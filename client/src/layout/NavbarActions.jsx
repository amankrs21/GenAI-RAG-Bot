import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { useEffect, useRef, useState } from 'react';
import { Button, IconButton, Typography } from '@mui/material';
import { ExpandMore, ExpandLess, AutoDelete, Delete } from '@mui/icons-material';

import { useAuth } from '../hooks/useAuth';
import { useLoading } from '../hooks/useLoading';
import ConfirmPop from '../components/ConfirmPop';
import LogoutPop from '../components/auth/LogoutPop';


// Navbar actions component
export default function NavbarActions({ chatId, history, setChatId, setHistory, setMessages, handleOpen }) {

    const navbarAction = useRef(null);
    const { setLoading } = useLoading();
    const { http, logout } = useAuth();

    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [openLogout, setOpenLogout] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navbarAction.current && !navbarAction.current.contains(event.target)) {
                setExpanded(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async (e) => {
        if (e) {
            setOpenLogout(false);
            await logout();
        }
        setOpenLogout(false);
    };

    const handleClearHistory = async () => {
        setOpen(false);
        try {
            setLoading(true);
            await http.delete('/history');
            toast.success('Chat history cleared successfully');
            setHistory([]);
            setMessages([]);
            setChatId(null);
            window.history.replaceState({}, '', window.location.pathname);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.error || 'Failed to clear chat history');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true);
            await http.delete(`/history/${id}`);
            toast.success('Chat history deleted successfully');
            setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
            if (id === chatId) {
                setChatId(null);
                window.history.replaceState({}, '', window.location.pathname);
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.error || 'Failed to delete chat history');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChat = (id) => {
        setExpanded(false);
        handleOpen(id);
    }

    const handleOpenNewChat = () => {
        setExpanded(false);
        handleOpen(null);
    }

    return (
        <div className="navbar__actions" ref={navbarAction}>

            {openLogout && <LogoutPop open={openLogout} handleLogout={(e) => handleLogout(e)} />}
            {open && <ConfirmPop open={open} setOpen={setOpen} confirmAction={handleClearHistory} />}

            <Button variant="outlined" onClick={() => setExpanded(!expanded)}>
                History {expanded ? <ExpandLess color="primary" /> : <ExpandMore color="primary" />}
            </Button>
            <Button variant="contained" color="error" onClick={() => setOpenLogout(true)}>
                Logout
            </Button>
            {expanded && (
                <div className="navbar__content">
                    <>
                        <Button
                            sx={{ mb: 1 }}
                            fullWidth
                            size="small"
                            color="error"
                            variant="contained"
                            endIcon={<AutoDelete />}
                            onClick={() => setOpen(true)}
                        >
                            Clear Chat History
                        </Button>
                        <Button fullWidth size="small" variant='contained' onClick={handleOpenNewChat}>
                            Start New Chat
                        </Button>
                        <ul>
                            {history?.length > 0 ? (
                                history.map((item, index) => (
                                    <li key={item.id || index} onClick={() => handleOpenChat(item.id)}>
                                        <span className="chat-name">{item.name}</span>
                                        <IconButton
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(item.id);
                                            }}
                                            aria-label="Delete chat"
                                        >
                                            <Delete color="error" fontSize="small" />
                                        </IconButton>
                                    </li>
                                ))
                            ) : (
                                <li className="no-history">
                                    <Typography variant="substitle1">
                                        No chat history available
                                    </Typography>
                                </li>
                            )}
                        </ul>
                    </>
                </div>
            )}
        </div>
    );
};

NavbarActions.propTypes = {
    chatId: PropTypes.string,
    history: PropTypes.array,
    setChatId: PropTypes.func.isRequired,
    setHistory: PropTypes.func.isRequired,
    setMessages: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
};
