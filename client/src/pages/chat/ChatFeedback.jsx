import PropTypes from 'prop-types';
import { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, Button, DialogActions, TextField
} from '@mui/material';


export default function ChatFeedback({ open, setOpen, onsubmit }) {

    const [comment, setComment] = useState('');

    return (
        <Dialog
            fullWidth
            open={open}
            maxWidth='xs'
            onClose={() => setOpen(false)}
        >
            <DialogTitle>Feedback</DialogTitle>
            <DialogContent>
                <TextField
                    rows={4}
                    multiline
                    fullWidth
                    value={comment}
                    margin='normal'
                    variant="outlined"
                    label="Feedback Comment"
                    placeholder="Enter your feedback here..."
                    onChange={(e) => setComment(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color="primary" onClick={() => onsubmit(comment)}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    )
}

ChatFeedback.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    onsubmit: PropTypes.func.isRequired,
};