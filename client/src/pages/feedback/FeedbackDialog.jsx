import PropTypes from 'prop-types';
import { Close } from '@mui/icons-material';
import { Dialog, DialogContent, Typography, IconButton, Button } from '@mui/material';


// FeedbackDialog component
export default function FeedbackDialog({ open, feedDialog, handleClose }) {
    return (
        <Dialog
            open={open}
            keepMounted
            fullWidth
            maxWidth="sm"
            onClose={handleClose}
            sx={{ '& .MuiDialog-paper': { borderRadius: '8px', backgroundColor: '#ececec' } }}
        >
            <DialogContent
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'inherit',
                }}
            >
                <Typography variant="h5" color='primary' textAlign='center' fontWeight={600} >
                    USER FEEDBACK
                </Typography>
                <Typography variant='subtitle1'>
                    <b>User Message:</b> {feedDialog?.userMessage}<br />
                    <b>Bot Message:</b> {feedDialog?.botMessage}<br />
                    <b>User Comment:</b> {feedDialog?.comment}<br />
                    <b>Feedback Date:</b> {new Date(feedDialog?.createdAt).toLocaleString()}
                </Typography>
            </DialogContent>
            <IconButton
                size='small'
                color='error'
                onClick={handleClose}
                sx={{ position: 'absolute', top: 10, right: 10, border: '1px solid #D1D4DA' }}
            >
                <Close />
            </IconButton>
            <Button
                margin={2}
                variant='contained'
                color='error'
                size='small'
                onClick={handleClose}>
                DELETE THIS FEEDBACK
            </Button>
        </Dialog>
    )
}

FeedbackDialog.propTypes = {
    open: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    feedDialog: PropTypes.object.isRequired
}
