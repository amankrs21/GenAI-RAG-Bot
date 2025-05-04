import { useState } from 'react';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import { Delete, Edit } from '@mui/icons-material';
import { Dialog, DialogContent, IconButton, Tooltip, Typography } from '@mui/material';

import { useAuth } from '../../hooks/useAuth';
import { useLoading } from '../../hooks/useLoading';
import ConfirmPop from '../../components/ConfirmPop';
import FileChunkEdit from './FileChunkEdit';


// FileChunks component
export default function FileChunks({ open, setOpen, data }) {

    const { http } = useAuth();
    const { setLoading } = useLoading();

    const [openEdit, setOpenEdit] = useState(false);
    const [chunkData, setChunkData] = useState(null);
    const [openDelete, setOpenDelete] = useState(false);

    const handleEditOpen = (chunk) => {
        setChunkData(chunk);
        setOpenEdit(true);
    }

    const handleEditChunk = async (chunk) => {
        try {
            if (!chunk && !chunkData) return;
            setOpenEdit(false);
            setLoading(true);
            const response = await http.put(`/source/chunk/${chunkData?.chunk_id}`, { new_text: chunk });
            data.items = data.items.map(item => item.chunk_id === chunkData?.chunk_id ? { ...item, chunk } : item);
            toast.success(response?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.error ?? 'Error updating chunk');
            console.error("Error updating chunk:", error);
        } finally {
            setChunkData(null);
            setLoading(false);
        }
    }

    const handleDeleteOpen = (chunk) => {
        setChunkData(chunk);
        setOpenDelete(true);
    }

    const handleDeleteChunk = async () => {
        try {
            if (!chunkData?.chunk_id) return;
            setOpenDelete(false);
            setLoading(true);
            const response = await http.delete(`/source/chunk/${chunkData?.chunk_id}`);
            data.items = data.items.filter(item => item.chunk_id !== chunkData?.chunk_id);
            toast.success(response?.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.error ?? 'Error deleting chunk');
            console.error("Error deleting chunk:", error);
        } finally {
            setChunkData(null);
            setLoading(false);
        }
    }

    return (
        <Dialog
            open={open}
            keepMounted
            maxWidth="lg"
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiDialog-paper': { borderRadius: '8px', backgroundColor: '#ececec' }
            }}
        >
            <DialogContent
                sx={{
                    margin: 1,
                    display: 'flex',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'inherit',
                }}
            >
                <Typography variant="h5" color='primary' fontWeight={700}>
                    File Name: {data?.name}
                </Typography>

                {data?.items?.map((item) => (
                    <div className='source__chunks' key={item?.chunk_id}>
                        <div className='source__chunks__header'>
                            <Typography variant="body1" color='text.secondary' fontWeight={500}>
                                ChunkID: {item?.chunk_id} [index: {item?.index}]
                            </Typography>
                            <div className='source__chunks__header__actions'>
                                <Tooltip arrow title="Edit this chunk">
                                    <IconButton size='small' color='primary'
                                        onClick={() => handleEditOpen(item)}>
                                        <Edit />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip arrow title="Delete this chunk">
                                    <IconButton size='small' color='error'
                                        onClick={() => handleDeleteOpen(item)}>
                                        <Delete />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </div>
                        {item?.chunk}
                    </div>
                ))}
            </DialogContent>
            {openDelete && <ConfirmPop open={openDelete} setOpen={setOpenDelete} confirmAction={handleDeleteChunk} />}
            {openEdit && <FileChunkEdit open={openEdit} setOpen={setOpenEdit} chunk={chunkData} confirmAction={(c) => { handleEditChunk(c) }} />}
        </Dialog>
    )
}


FileChunks.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};
