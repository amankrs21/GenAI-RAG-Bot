/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import {
    Container, Grid, Paper, Typography, Card,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

import FeedbackDialog from './FeedbackDialog';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';


// Feedback component
export default function Feedback() {

    const { http } = useAuth();
    const { setLoading } = useLoading();

    const [open, setOpen] = useState(false);
    const [feedback, setFeedback] = useState([]);
    const [feedDialog, setFeedDialog] = useState([]);

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

    const openFeedback = (fed) => {
        setOpen(true);
        setFeedDialog(fed);
    }

    const handleClose = () => {
        setOpen(false);
        setFeedDialog([]);
    }

    const handleDelete = async () => {
        try {
            setLoading(true);
            await http.delete(`/feedback/${feedDialog.id}`);
            setOpen(false);
            setFeedDialog([]);
            fetchData();
        } catch (error) {
            console.error("Error deleting feedback:", error);
        } finally {
            setLoading(false);
        }
    }

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
                        <Table size='medium'>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#70b2ef', color: '#fff' }}>
                                    <TableCell sx={{ fontSize: '20px', fontWeight: '700' }}>#</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>User Message</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Bot Response</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>User Comment</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>DateTime</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {feedback?.map((fed, index) => (
                                    <TableRow key={index}
                                        onClick={() => openFeedback(fed)}
                                        sx={{ "&:hover": { backgroundColor: '#f5f5f5' }, cursor: 'pointer' }}
                                    >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {fed?.userMessage.length > 25 ? `${fed?.userMessage.slice(0, 25)}...` : fed?.userMessage}
                                        </TableCell>
                                        <TableCell>
                                            {fed?.botResponse.length > 25 ? `${fed?.botResponse.slice(0, 25)}...` : fed?.botResponse}
                                        </TableCell>
                                        <TableCell>{fed?.comment}</TableCell>
                                        <TableCell>
                                            {new Date(fed?.createdAt).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Card >
            {open &&
                <FeedbackDialog open={open} feedDialog={feedDialog}
                    handleClose={handleClose} handleDelete={handleDelete} />
            }
        </Container >
    )
}
