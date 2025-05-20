/* eslint-disable react-hooks/exhaustive-deps */
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import {
    Box, Container, Grid, Paper, TextField, Typography, IconButton, Card, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button,
} from '@mui/material';
import { Delete, Search, CloudUpload } from '@mui/icons-material';

import './Files.css';
import FileChunks from './FileChunks';
import FileUpload from './FileUpload';
import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import ConfirmPop from '../../components/ConfirmPop';


export default function FileMain() {

    const { http } = useAuth();
    const { setLoading } = useLoading();

    const [open, setOpen] = useState(false);
    const [openU, setOpenU] = useState(false);
    const [openD, setOpenD] = useState(false);
    const [fileId, setFileId] = useState(null);
    const [sources, setSources] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");


    useEffect(() => {
        fetchSources();
    }, []);


    const fetchSources = async () => {
        try {
            setLoading(true);
            const response = await http.get('/source/files');
            setSources(response.data);
        } catch (error) {
            console.error("Error fetching sources:", error);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteOpen = (fileId) => {
        setFileId(fileId);
        setOpenD(true);
    }

    const handleDeleteSource = async () => {
        try {
            if (!fileId) return;
            setOpenD(false);
            setLoading(true);
            const response = await http.delete(`/source/file/${fileId}`);
            toast.success(response?.data?.message);
            await fetchSources();
        } catch (error) {
            toast.error(error?.response?.data?.error ?? 'Error deleting source');
            console.error("Error deleting source:", error);
        } finally {
            setFileId(null);
            setLoading(false);
        }
    }

    const handleOpenSource = async (source) => {
        try {
            setLoading(true);
            const response = await http.get(`/source/file/${source?.file_id}`);
            setSourceData({
                fileId: source?.file_id,
                name: source?.filename,
                items: response?.data
            });
            setOpen(true);
        } catch (error) {
            console.error("Error fetching chunks:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Container style={{ marginTop: '80px' }}>
            {open && <FileChunks open={open} setOpen={setOpen} data={sourceData} />}
            {openU && <FileUpload open={openU} setOpen={setOpenU} onSuccess={fetchSources} />}
            {openD && <ConfirmPop open={openD} setOpen={setOpenD} confirmAction={handleDeleteSource} />}

            <Grid container alignItems="center">
                <Grid size={{ xs: 12, md: 7 }}>
                    <Typography variant="h4" color='primary' fontWeight={700}>
                        📘 Knowledge Base
                    </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Box display="flex" alignItems="center" justifyContent="flex-end">
                        <TextField
                            fullWidth
                            value={searchTerm}
                            variant="outlined"
                            placeholder='Search File Name'
                            onChange={(e) => setSearchTerm(e.target.value)}
                            slotProps={{
                                input: {
                                    endAdornment: (
                                        <IconButton color='secondary' disabled={!searchTerm}>
                                            <Search />
                                        </IconButton>
                                    ),
                                },
                            }}
                        />
                        <Button variant="contained" size='large' endIcon={<CloudUpload />}
                            sx={{ ml: 1, height: '50px' }} onClick={() => setOpenU(true)}>
                            Upload
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Card elevation={10} sx={{ mt: 2, p: 3 }}>
                {sources?.length === 0 ? (
                    <Typography variant="h5" color='secondary' textAlign='center' fontWeight={600}>
                        No Data Source Found. Please upload one to get started.
                    </Typography>
                ) : (
                    <TableContainer component={Paper} elevation={10} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#70b2ef', color: '#fff' }}>
                                    <TableCell sx={{ fontSize: '20px', fontWeight: '700' }}>#</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Source Name</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Description</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Updated At</TableCell>
                                    <TableCell sx={{ fontSize: '16px', fontWeight: '700' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sources?.map((source, index) => (
                                    <TableRow key={index} >
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            <Typography color='primary' fontWeight={600} sx={{ cursor: 'pointer' }}
                                                onClick={() => handleOpenSource(source)}>
                                                {source?.filename}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{source?.description}</TableCell>
                                        <TableCell>{new Date(source?.last_updated).toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Tooltip arrow title="Delete this source">
                                                <IconButton color='error' size='small'
                                                    onClick={() => handleDeleteOpen(source?.file_id)}>
                                                    <Delete />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
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
