import React from 'react';
import Dropdown from '@mui/joy/Dropdown';
import MenuButton from '@mui/joy/MenuButton';
import IconButton from '@mui/joy/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import Divider from '@mui/joy/Divider';

function RowMenu({ onEdit, onDelete }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem onClick={onEdit}>Edit</MenuItem>
                <Divider />
                <MenuItem onClick={onDelete} color="danger">Delete</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default RowMenu;
