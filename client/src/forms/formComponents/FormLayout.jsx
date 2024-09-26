import React from 'react';
import { Box, Stack, DialogTitle } from '@mui/joy/';

const FormLayout = ({ title, children }) => {
    return (
        <Box>
            <DialogTitle sx={{ mb: 3 }}>{title}</DialogTitle>
            <Stack spacing={2}>
                {children}
            </Stack>
        </Box>
    );
};

export default FormLayout;
