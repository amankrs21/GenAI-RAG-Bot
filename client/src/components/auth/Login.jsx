import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import { useState } from 'react';
import { toast } from 'react-toastify';
import {
    Avatar, Dialog, DialogContent, Button, TextField, InputAdornment, IconButton, Typography
} from '@mui/material';
import { LockOutlined, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';


// Login component
export default function Login({ open, setOpen, setOpenR }) {
    const { http, refreshAuth } = useAuth();
    const { setLoading } = useLoading();
    const [showPass, setShowPass] = useState(false);

    const handleOpenRegister = () => {
        setOpenR(true);
        setOpen(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await http.post('/login', {
                email: e?.target?.email?.value,
                password: e?.target?.password?.value,
            });
            await refreshAuth();
            toast.success('Login successful!!');
            setOpen(false);
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.error ?? 'An error occurred');
        } finally {
            setLoading(false);
        }
    };



    return (
        <Dialog
            open={open}
            keepMounted
            maxWidth="xs"
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiDialog-paper': { borderRadius: '8px', backgroundColor: '#ececec' }
            }}
        >
            <DialogContent
                sx={{
                    margin: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'inherit',
                }}
            >
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <LockOutlined sx={{ color: '#fff' }} />
                </Avatar>
                <Typography component="h1" variant="h5" sx={{ color: '#2c2c2c' }}>
                    Sign in
                </Typography>

                <Box required component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
                    <TextField
                        required
                        autoFocus
                        fullWidth
                        name="email"
                        type="email"
                        placeholder="Enter your Email*"
                        sx={{ my: 3 }}
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        placeholder="Enter your password*"
                        type={showPass ? 'text' : 'password'}
                        slotProps={{
                            input: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            edge="end"
                                            color='primary'
                                            onClick={() => setShowPass(!showPass)}
                                        >
                                            {showPass ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            },
                        }}
                    />
                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        endIcon={<LoginIcon />}
                        sx={{ mt: 4, mb: 3 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        fullWidth
                        variant="text"
                        onClick={handleOpenRegister}
                        sx={{ color: '#36383A', '&:hover': { color: '#1f2122' } }}
                    >
                        Don’t have an account? Sign Up
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

Login.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    setOpenR: PropTypes.func.isRequired
};
