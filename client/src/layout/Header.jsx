import { useState } from 'react';
import Box from '@mui/material/Box';
import { toast } from 'react-toastify';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Collapse, Typography, Container, Button, Tooltip, MenuItem,
    IconButton, Menu, Avatar
} from '@mui/material';
import {
    Menu as MenuIcon, Close, Logout, Description, ConnectWithoutContact, Person
} from '@mui/icons-material';

import './Header.css';
import { useAuth } from '../hooks/useAuth';
import LogoutPop from '../components/LogoutPop';


// Header component
export default function Header() {

    const navigate = useNavigate();
    const location = useLocation();
    const { userData, logout } = useAuth();

    const [open, setOpen] = useState(false);
    const [popUser, setPopUser] = useState(null);
    const [openLogout, setOpenLogout] = useState(false);

    const isActive = (page) => location.pathname.split('/')[2] === page;

    const toggleDrawer = (page) => {
        setOpen(!open);
        if (page) {
            navigate('/admin/' + page);
        }
    };

    const handleOpenUserMenu = (event) => {
        setPopUser(event.currentTarget);
    };

    const handleLogout = async (e) => {
        if (e) {
            setOpenLogout(false);
            await logout();
            toast.success('Logged out successfully');
            navigate('/');
        }
        setOpenLogout(false);
    };

    return (
        <AppBar position="fixed">
            {openLogout && <LogoutPop open={openLogout} handleLogout={(e) => handleLogout(e)} />}
            <Container maxWidth="lg">
                <Toolbar disableGutters variant="dense">
                    <Tooltip arrow placement="bottom" title="Click to refresh">
                        <Avatar
                            src="/bot.png"
                            variant="square"
                            alt="header-icon"
                            onClick={() => { window.location.reload() }}
                            sx={{ display: { xs: 'none', md: 'flex', cursor: 'pointer' } }}
                        />
                    </Tooltip>
                    <Typography noWrap variant="h6" sx={{ display: { xs: 'none', md: 'flex' } }}>
                        &nbsp;GENAI-BOT
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }} ml={3}>
                        <MenuItem onClick={() => navigate('/admin/source')} className={isActive('source') ? "active-route" : "non-active-route"}>
                            <Description />&nbsp;<Typography variant="body1">Source</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/admin/feedback')} className={isActive('feedback') ? "active-route" : "non-active-route"}>
                            <ConnectWithoutContact />&nbsp;<Typography variant="body1">Feedback</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => navigate('/admin/account')} className={isActive('account') ? "active-route" : "non-active-route"}>
                            <Person />&nbsp;<Typography variant="body1">Account</Typography>
                        </MenuItem>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <Button
                            variant="outlined"
                            onClick={() => toggleDrawer()}
                            sx={{ minWidth: '30px', p: '4px' }}
                        >
                            {!open ? <MenuIcon sx={{ color: 'white' }} /> : <Close sx={{ color: 'white' }} />}
                        </Button>
                    </Box>

                    <Avatar
                        src="/bot.png"
                        variant="square"
                        alt="header-icon"
                        sx={{ display: { xs: 'flex', md: 'none' } }}
                    />
                    <Typography noWrap variant="h5" sx={{ display: { xs: 'flex', md: 'none' }, flexGrow: 1 }}>
                        &nbsp;GENAI-BOT
                    </Typography>

                    <Box sx={{ flexGrow: 0 }}>
                        <Tooltip arrow placement="bottom" title="Click to logout">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt={userData?.name} src={`https://robohash.org/${userData?.email}`} className='profileAvt' />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={popUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(popUser)}
                            onClose={() => setPopUser(null)}
                        >
                            <MenuItem onClick={() => setOpenLogout(true)}>
                                <Typography sx={{ display: 'flex', textAlign: 'center', fontWeight: 600 }}>
                                    Logout &nbsp; <Logout color='secondary' />
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>

                </Toolbar>
                <Collapse in={open}>
                    <Box
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            bgcolor: 'rgba(241, 241, 241, 0.9)',
                            backdropFilter: 'blur(10px)',
                            borderRadius: '20px',
                            textAlign: 'center',
                            p: 2,
                            mb: 2,
                        }}
                    >
                        <MenuItem onClick={() => toggleDrawer('source')} className={isActive('source') ? "pop-active" : "pop-non-active"}>
                            <Description />&nbsp;<Typography variant="body1" fontWeight={800}>Source</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => toggleDrawer('feedback')} className={isActive('feedback') ? "pop-active" : "pop-non-active"}>
                            <ConnectWithoutContact />&nbsp;<Typography variant="body1" fontWeight={800}>Feedback</Typography>
                        </MenuItem>
                        <MenuItem onClick={() => toggleDrawer('account')} className={isActive('account') ? "pop-active" : "pop-non-active"}>
                            <Person />&nbsp;<Typography variant="body1" fontWeight={800}>Account</Typography>
                        </MenuItem>
                    </Box>
                </Collapse>
            </Container>
        </AppBar>
    );
}
