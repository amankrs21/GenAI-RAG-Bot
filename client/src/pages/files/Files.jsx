import { useState } from 'react';
import {
    Box, Container, Grid, Paper, TextField, Typography, IconButton, Card, Tooltip,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Button,
} from '@mui/material';
import { Delete, Search, CloudUpload } from '@mui/icons-material';
import Chunks from './Chunks';


export default function Files() {

    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sources, setSources] = useState([
        {
            source_id: 1,
            source_name: "Source 1.pdf",
            description: "This is a description for Source 1",
            updated_at: "2023-10-01T12:00:00Z"
        },
        {
            source_id: 2,
            source_name: "Source 2.pdf",
            description: "This is a description for Source 2",
            updated_at: "2023-10-02T12:00:00Z"
        },
        {
            source_id: 3,
            source_name: "Source 3.pdf",
            description: "This is a description for Source 3",
            updated_at: "2023-10-03T12:00:00Z"
        },
    ]);

    const data = {
        name: "Sample Data",
        items: [
            { id: 1, content: "Sample content 1" },
            { id: 2, content: "Sample content 2" },
            { id: 3, content: "Sample content 3" },
            { id: 4, content: "Sample content 4" },
            { id: 5, content: "Sample content 5" },
        ]
    }


    return (
        <Container style={{ marginTop: '80px' }}>
            {open && <Chunks open={open} setOpen={setOpen} data={data} />}
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
                            sx={{ ml: 1, height: '50px' }}>
                            Upload
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Card elevation={10} sx={{ mt: 2, p: 3 }}>
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
                                    <TableCell>{source.source_id}</TableCell>
                                    <TableCell>
                                        <Typography color='primary' fontWeight={600} sx={{ cursor: 'pointer' }}
                                            onClick={() => setOpen(true)}>
                                            {source.source_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{source.description}</TableCell>
                                    <TableCell>{new Date(source.updated_at).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Tooltip arrow title="Delete this source">
                                            <IconButton color='error' size='small'>
                                                <Delete />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card >
        </Container >
    )
}
