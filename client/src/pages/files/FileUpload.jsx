import PropTypes from 'prop-types';
import { useState } from 'react';
import {
    Avatar, Dialog, DialogContent, Button, TextField, Typography, Box, Paper, IconButton, Tooltip
} from '@mui/material';
import {
    CloudDone, CloudUpload, InsertDriveFile, Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';

export default function FileUpload({ open, setOpen, onSuccess }) {
    const { http } = useAuth();
    const { setLoading } = useLoading();

    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && !['application/pdf', 'text/plain'].includes(selectedFile.type)) {
            toast.warning('Only PDF and TXT files are allowed!');
            return;
        }
        setFile(selectedFile);
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            toast.error('Please select a valid .txt or .pdf file!');
            return;
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            formData.append('description', description);

            await http.post('/source/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            toast.success('File uploaded successfully!');
            setFile(null);
            setDescription('');
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.error ?? 'Upload failed');
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
            sx={{ '& .MuiDialog-paper': { borderRadius: '10px', backgroundColor: '#f9f9f9' } }}
        >
            <DialogContent
                sx={{
                    m: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: 'inherit',
                }}
            >
                <Avatar sx={{ bgcolor: '#1976d2' }}>
                    <CloudDone sx={{ color: '#fff' }} />
                </Avatar>
                <Typography component="h1" variant="h6" sx={{ color: '#333', mb: 2 }}>
                    Upload a File
                </Typography>

                <Box component="form" onSubmit={handleUpload} sx={{ width: '100%' }}>

                    <Button
                        variant="outlined"
                        component="label"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        {file ? 'Change File' : 'Choose .pdf or .txt file'}
                        <input
                            type="file"
                            hidden
                            accept=".pdf,.txt"
                            onChange={handleFileChange}
                        />
                    </Button>

                    {file && (
                        <Paper
                            variant="outlined"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                p: 1.5,
                                mb: 2,
                                backgroundColor: '#fff',
                            }}
                        >
                            <Box display="flex" alignItems="center">
                                <InsertDriveFile sx={{ color: '#1976d2', mr: 1 }} />
                                <Box>
                                    <Typography fontSize="0.9rem" fontWeight={500}>
                                        {file.name}
                                    </Typography>
                                    <Typography fontSize="0.75rem" color="text.secondary">
                                        {(file.size / 1024).toFixed(1)} KB
                                    </Typography>
                                </Box>
                            </Box>
                            <Tooltip title="Remove file">
                                <IconButton onClick={handleRemoveFile}>
                                    <DeleteIcon color="error" />
                                </IconButton>
                            </Tooltip>
                        </Paper>
                    )}

                    <TextField
                        rows={3}
                        required
                        fullWidth
                        multiline
                        name="description"
                        placeholder="Short Description of the file"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        sx={{ mb: 3 }}
                    />

                    <Button
                        fullWidth
                        type="submit"
                        variant="contained"
                        endIcon={<CloudUpload />}
                        disabled={!file || !description.trim()}
                    >
                        Upload
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}

FileUpload.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    onSuccess: PropTypes.func,
};
