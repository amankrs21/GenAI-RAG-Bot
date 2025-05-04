import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Button, DialogActions, TextField
} from '@mui/material';


// Editable file chunk dialog
export default function FileChunkEdit({ open, setOpen, chunk, confirmAction }) {
    const [updatedChunk, setUpdatedChunk] = useState(chunk?.chunk);

    useEffect(() => {
        if (open) setUpdatedChunk(chunk?.chunk);
    }, [open, chunk]);

    const handleUpdate = () => {
        confirmAction(updatedChunk);
        setOpen(false);
    };

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth='md'
            onClose={() => setOpen(false)}
        >
            <DialogTitle>Update Chunk</DialogTitle>
            <DialogContent>
                <TextField
                    rows={10}
                    multiline
                    fullWidth
                    value={updatedChunk}
                    margin='normal'
                    variant="outlined"
                    label="Chunk Content"
                    placeholder="Enter chunk content here..."
                    onChange={(e) => setUpdatedChunk(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='outlined' onClick={() => setOpen(false)}>
                    Cancel
                </Button>
                <Button variant='contained' color="primary" onClick={handleUpdate}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
}

FileChunkEdit.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    chunk: PropTypes.array.isRequired,
    confirmAction: PropTypes.func.isRequired
};
