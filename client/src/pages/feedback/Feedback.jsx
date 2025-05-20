/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
    Container, Grid, Paper, Typography, Card,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';



export default function Feedback() {

    const { http } = useAuth();
    const { setLoading } = useLoading();

    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);


    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await http.get('/feedback');
            setFeedback(response.data);
        } catch (error) {
            console.error("Error fetching sources:", error);
        } finally {
            setLoading(false);
        }
    };



    return (
        <Container style={{ marginTop: '80px' }}>

            <Grid container alignItems="center">
                <Typography variant="h4" color='primary' fontWeight={700}>
                    📝 Negative Feedback's Received
                </Typography>
            </Grid>
            <Card elevation={10} sx={{ mt: 2, p: 3 }}>
                {feedback?.length === 0 ? (
                    <Typography variant="h5" color='secondary' textAlign='center' fontWeight={600}>
                        No feedback available.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} elevation={10} variant="outlined">
                        <Table size='small'>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#70b2ef', color: '#fff' }}>
                                    <TableCell sx={{ fontSize: '20px', fontWeight: '700' }}>#</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Recieved From</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>User Message</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Bot Response</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>User Comment</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>DateTime</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feedback?.map((fed, index) => (
                                    <TableRow key={index} >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>{fed?.email}</TableCell>
                                        <TableCell>{fed?.userMessage}</TableCell>
                                        <TableCell>{fed?.botResponse}</TableCell>
                                        <TableCell>{fed?.comment}</TableCell>
                                        <TableCell>{new Date(fed?.createdAt).toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card >
        </Container >
    )
}
