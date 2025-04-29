import { useState } from "react";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { Grid, Typography, Button } from "@mui/material";
import { Login as LoginIcon, AppRegistration } from "@mui/icons-material";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import './Welcome.css';
import Login from "../../components/auth/Login";
import Register from "../../components/auth/Register";
import TypewriterEffect from "../../components/typing/TypewriterEffect";


// Welcome component
export default function Welcome() {

    const navigate = useNavigate();
    const [openReg, setOpenReg] = useState(false);
    const [openLogin, setOpenLogin] = useState(false);

    return (
        <Grid container component="main" sx={{ height: "100vh", overflow: "hidden" }}>

            {openReg && <Register open={openReg} setOpen={setOpenReg} setOpenL={setOpenLogin} />}
            {openLogin && <Login open={openLogin} setOpen={setOpenLogin} setOpenR={setOpenReg} />}

            {/* Background Image */}

            {/* Left Section */}
            <Grid
                size={{ xs: 12, md: 7 }}
                sx={{
                    px: 2,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                    background: "linear-gradient(135deg, #e0f2ff 0%, #fbeaff 100%)",
                }}
            >
                <Typography variant="h4" fontWeight={700} gutterBottom color="primary">
                    GENAI-BOT
                </Typography>

                <Typography variant="h6" color="text.primary" fontWeight={500} height='50px' sx={{ mb: 1 }}>
                    <TypewriterEffect
                        strings={[
                            "Your AI-Powered Bot for Smart Assistance",
                            "Built to understand your knowledge base.",
                            "Transforming your data into actionable insights."
                        ]}
                        delay={35}
                        deleteSpeed={20}
                    />
                </Typography>

                <div style={{ height: '50vh', width: '95%' }}>
                    <DotLottieReact
                        loop
                        autoplay
                        src="welcome.lottie"
                        style={{ width: '100%', height: '100%' }}
                    />
                </div>
            </Grid>

            {/* Right Section */}
            <Grid
                size={{ xs: 12, md: 5 }}
                sx={{
                    px: 3,
                    backgroundColor: "#ffffff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "-2px 0 10px rgba(0,0,0,0.05)",
                }}
            >
                <Box
                    sx={{
                        gap: 3,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                    }}
                >
                    <Typography variant="h5" textAlign="center" fontWeight={600}>
                        Enter the Knowledge Zone
                    </Typography>

                    {/* <Typography variant="body1" color="text.secondary" textAlign="center">
                        Sign in or register to upload your project and unlock smart code assistance.
                    </Typography> */}

                    <div className="welcome__buttons">
                        <Button
                            size="large"
                            variant="contained"
                            endIcon={<LoginIcon />}
                            onClick={() => navigate("/chat")}
                            // onClick={() => setOpenLogin(true)}
                            sx={{
                                background: "linear-gradient(to right, #4a90e2, #a163e6)",
                                color: "#fff",
                                '&:hover': {
                                    background: "linear-gradient(to right, #3a78c2, #884fd1)",
                                },
                            }}
                        >
                            Login
                        </Button>
                        <Button
                            size="large"
                            variant="outlined"
                            endIcon={<AppRegistration />}
                            onClick={() => setOpenReg(true)}
                            sx={{
                                borderColor: "#4a90e2",
                                color: "#4a90e2",
                                '&:hover': {
                                    backgroundColor: "#e3f2fd",
                                    borderColor: "#3a78c2",
                                },
                            }}
                        >
                            Register
                        </Button>
                    </div>
                </Box>
            </Grid>
        </Grid>
    );
}
