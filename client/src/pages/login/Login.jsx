import Box from "@mui/material/Box";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
    Typography, Button, TextField, IconButton, Grid, InputAdornment, Avatar, useTheme, useMediaQuery, Paper
} from '@mui/material';
import {
    Login as LoginIcon, LockOutlined, Visibility, VisibilityOff
} from "@mui/icons-material";

import { useAuth } from "../../hooks/useAuth";
import { useLoading } from "../../hooks/useLoading";
import TypewriterEffect from "../../components/typing/TypewriterEffect";


// Login Component
export default function Login() {
    const navigate = useNavigate();
    const { setLoading } = useLoading();
    const { isAuthenticated, http, refreshAuth } = useAuth();
    const [showPass, setShowPass] = useState(false);

    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up('md'));

    useEffect(() => {
        if (isAuthenticated) {
            navigate("/admin/source");
        }
    }, [isAuthenticated, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            await http.post('/auth/login', {
                email: e?.target?.email?.value,
                password: e?.target?.password?.value,
            });
            await refreshAuth();
            toast.success('Login successful!');
        } catch (error) {
            console.error(error);
            if (error?.response?.status === 401) {
                toast.error('Invalid email or password');
            } else {
                toast.error(error?.response?.data?.detail[0]?.msg ?? 'An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Grid container sx={{ height: "100vh", overflow: "hidden" }}>

            {/* Left Section - Only on md+ screens */}
            {isMdUp && (
                <Grid size={{ xs: 12, md: 7 }}
                    sx={{
                        px: 4,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center",
                        background: "linear-gradient(135deg, #e0f2ff 0%, #fbeaff 100%)",
                    }}
                >
                    <Typography variant="h3" fontWeight={700} gutterBottom color="primary">
                        GENAI-BOT
                    </Typography>

                    <Typography
                        variant="h6"
                        color="text.primary"
                        fontWeight={500}
                        sx={{ height: '60px', mb: 2 }}
                    >
                        <TypewriterEffect
                            strings={[
                                "Smarter AI for your knowledge base",
                                "Understand, process, and answer in real-time",
                                "Convert your data into intelligent actions"
                            ]}
                            delay={35}
                            deleteSpeed={20}
                        />
                    </Typography>

                    <Box sx={{ height: '50vh', width: '95%' }}>
                        <DotLottieReact
                            loop
                            autoplay
                            src="/Welcome.json"
                            style={{ width: '100%', height: '100%' }}
                        />
                    </Box>
                </Grid>
            )}

            {/* Right Section - Always visible */}
            <Grid size={{ xs: 12, md: 5 }}
                component={Paper}
                elevation={6}
                square
                sx={{
                    px: 4,
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Box
                    component="form"
                    onSubmit={handleLogin}
                    sx={{
                        width: '100%',
                        maxWidth: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ bgcolor: '#1976d2' }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography component="h1" variant="h5" textAlign="center" sx={{ mb: 4 }}>
                        Sign in
                    </Typography>

                    <TextField
                        required
                        autoFocus
                        fullWidth
                        name="email"
                        type="email"
                        margin="normal"
                        placeholder="Enter your Email"
                    />
                    <TextField
                        required
                        fullWidth
                        name="password"
                        margin="normal"
                        placeholder="Enter your Password"
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
                        sx={{
                            mt: 4,
                            background: "linear-gradient(to right, #4a90e2, #a163e6)",
                            color: "#fff",
                            '&:hover': {
                                background: "linear-gradient(to right, #3a78c2, #884fd1)",
                            },
                            fontWeight: 600
                        }}
                    >
                        Sign In
                    </Button>
                </Box>
            </Grid>
        </Grid>
    );
}
