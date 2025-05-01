import PropTypes from 'prop-types';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

export default function Chunks({ open, setOpen, data }) {
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
            <DialogTitle>{data?.name ?? 'No Name'}</DialogTitle>
            <DialogContent
                sx={{
                    margin: 2,
                    display: 'flex',
                    alignItems: 'center',
                    flexDirection: 'column',
                    backgroundColor: 'inherit',
                }}
            >
                <div style={{ width: '100%', maxHeight: '400px', overflowY: 'auto' }}>
                    {data?.items?.map((item) => (
                        <div key={item.id} style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                            {item.content}
                        </div>
                    ))}
                </div>
            </DialogContent>
        </Dialog>
    )
}


Chunks.propTypes = {
    open: PropTypes.bool.isRequired,
    setOpen: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
};
