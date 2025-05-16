import PropTypes from 'prop-types';
import {
    Dialog, DialogContent, IconButton, Typography
} from '@mui/material';
import { Close } from '@mui/icons-material';


// ChatInfo component
export default function ChatInfoPop({ open, setOpen }) {

    return (
        <Dialog
            open={open}
            keepMounted
            maxWidth="md"
            onClose={() => setOpen(false)}
            sx={{
                '& .MuiDialog-paper': { borderRadius: '8px', backgroundColor: '#ececec' }
            }}
        >
            <DialogContent
                sx={{
                    margin: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'inherit',
                }}
            >
                <Typography variant="h5" fontWeight={600} color='primary'>
                    GenAI Rag Bot User Manual
                </Typography>

                <Typography variant="h6" sx={{ color: '#2c2c2c', marginTop: 2 }}>
                    This is a simple chat application that allows you to interact with a GenAI Rag Bot.
                    <br />
                    You can ask questions and get answers in real-time.
                    <br />
                    <br />
                    <strong>Features:</strong>
                    <ul>
                        <li>Real-time chat with the GenAI Rag Bot</li>
                        <li>Feedback system to improve the bot's responses</li>
                        <li>Clear chat history</li>
                        <li>Logout functionality</li>
                        <li>Responsive design for mobile and desktop</li>
                        <li>Markdown support for formatting messages</li>
                        <li>Code highlighting for programming languages</li>
                        <li>Typing indicator to show when the bot is typing</li>
                        <li>Chat history with timestamps</li>
                        <li>Feedback system to improve the bot's responses</li>
                    </ul>
                    <strong>How to use:</strong>
                    <ol>
                        <li>Type your message in the input box and hit enter.</li>
                        <li>The bot will respond in real-time.</li>
                        <li>You can provide feedback on the bot's response by clicking the thumbs up or thumbs down button.</li>
                        <li>You can clear the chat history by clicking the clear history button.</li>
                        <li>You can logout by clicking the logout button.</li>
                    </ol>
                    <strong>Note:</strong> This is a demo application and the bot's responses may not be accurate.
                    <br />
                    <strong>Disclaimer:</strong> This application is for educational purposes only and is not intended for production use.
                    <br />
                    <strong>Contact:</strong> If you have any questions or feedback, please contact us at https://amankrs21.pages.dev
                </Typography>

            </DialogContent>
            <IconButton
                size='small'
                color='error'
                onClick={() => setOpen(false)}
                sx={{ position: 'absolute', top: 25, right: 30, border: '1px solid #D1D4DA' }}
            >
                <Close />
            </IconButton>
        </Dialog>
    );
}

ChatInfoPop.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
};
