import React from 'react';
import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const Pagination = ({
    currentPage,
    totalPages,
    handlePreviousPage,
    handleNextPage,
    startIndex,
    endIndex,
    totalItems,
}) => (
    <>
        <Box
            className="Pagination-mobile"
            sx={{
                display: { xs: 'none', sm: 'none' },
                alignItems: 'center',
                gap: 1,
                justifyContent: 'flex-end',
            }}
        >
            <IconButton size="sm" variant="outlined" color="neutral">
                <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton size="sm" variant="outlined" color="neutral">
                <KeyboardArrowRightIcon />
            </IconButton>
        </Box>
        <Box
            className="Pagination-tabletUp"
            sx={{
                borderTop: '1px solid',
                borderColor: 'neutral.outlinedBorder',
                bgcolor: 'background.level1',
                display: { xs: 'flex', sm: 'flex' },
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 2,
                py: 1,
                borderRadius: '0 0 var(--joy-radius-sm) var(--joy-radius-sm)',
            }}
        >
            <Typography
                level="body2"
                sx={{ fontWeight: 'initial', color: 'text.secondary' }}
            >
                {`${startIndex + 1}-${endIndex} of ${totalItems}`}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton size="sm" variant="outlined" color="neutral" onClick={handlePreviousPage} disabled={currentPage === 1}>
                    <KeyboardArrowLeftIcon />
                </IconButton>
                <IconButton size="sm" variant="outlined" color="neutral" onClick={handleNextPage} disabled={currentPage === totalPages}>
                    <KeyboardArrowRightIcon />
                </IconButton>
            </Box>
        </Box>
    </>
);

export default Pagination;
