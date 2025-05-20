import { Typography } from '@mui/material'
import React from 'react'

export default function Account() {
    return (
        <div style={{ marginTop: '80px' }}>
            <Typography color='primary' variant='h4' sx={{ fontWeight: 600, textAlign: 'center', marginTop: '20px' }}>
                This page is under construction, please check back later.
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 400, textAlign: 'center', marginTop: '10px' }}>
                We are working hard to bring you the best experience possible.
            </Typography>
            <Typography variant='h6' sx={{ fontWeight: 400, textAlign: 'center', marginTop: '10px' }}>
                Thank you for your patience!
            </Typography>
            <Typography color='secondary' variant='h6' sx={{ fontWeight: 400, textAlign: 'center', marginTop: '10px' }}>
                ~ Aman Singh
            </Typography>
        </div>
    )
}
