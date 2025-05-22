import PropTypes from 'prop-types';
import { Close, DeleteForever } from '@mui/icons-material';
import { Dialog, DialogContent, Typography, IconButton, Button } from '@mui/material';


// FeedbackDialog component
export default function FeedbackDialog({ open, feedDialog, handleClose, handleDelete }) {
    return (
        <Dialog
            fullWidth
            keepMounted
            open={open}
            maxWidth="md"
            onClose={handleClose}
            sx={{ '& .MuiDialog-paper': { borderRadius: '8px', backgroundColor: '#ececec' } }}
        >
            <DialogContent
                sx={{
                    padding: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'inherit',
                }}
            >
                <Typography variant="h5" color='primary' textAlign='center' fontWeight={600} >
                    USER NEGETIVE FEEDBACK
                </Typography>
                <Typography variant='subtitle1'>
                    <b>User Message:</b> {feedDialog?.userMessage}<br />
                    <b>Bot Response:</b> {feedDialog?.botResponse}<br />
                    <b>User Feedback:</b> {feedDialog?.comment}<br />
                    <b>Feedback Date:</b> {new Date(feedDialog?.createdAt).toLocaleString()}
                </Typography>
                <Button
                    size='small'
                    color='error'
                    variant='contained'
                    sx={{ marginTop: 2 }}
                    onClick={handleDelete}
                    endIcon={<DeleteForever />}
                >
                    DELETE THIS FEEDBACK
                </Button>
            </DialogContent>
            <IconButton
                size='small'
                color='error'
                onClick={handleClose}
                sx={{ position: 'absolute', top: 10, right: 10, border: '1px solid #D1D4DA' }}
            >
                <Close />
            </IconButton>
        </Dialog>
    )
}

FeedbackDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    feedDialog: PropTypes.object.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleDelete: PropTypes.func.isRequired,
}
