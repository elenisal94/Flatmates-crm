import React from 'react';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Sheet from '@mui/joy/Sheet';
import Button from '@mui/joy/Button';
import IconButton from '@mui/joy/IconButton';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const FiltersModal = ({ open, setOpen, renderFilters }) => (
    <>
        <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
        >
            <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
                <ModalClose />
                <Typography id="filter-modal" level="h2">
                    Filters
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {renderFilters()}
                    <Button color="primary" onClick={() => setOpen(false)}>
                        Submit
                    </Button>
                </Sheet>
            </ModalDialog>
        </Modal>
    </>
);

export default FiltersModal;
