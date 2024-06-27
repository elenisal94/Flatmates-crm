import React from 'react';
import { Select, Box } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Option from '@mui/joy/Option';

const StatusFilter = ({ label, options, value, onChange, clearFilter }) => (
    <FormControl size="sm">
        <FormLabel>{label}</FormLabel>
        <Select
            multiple
            size="sm"
            placeholder={`Filter ${label.toLowerCase()}`}
            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            value={value}
            onChange={onChange}
            {...(value.length > 0 && {
                endDecorator: (
                    <IconButton
                        size="sm"
                        onClick={clearFilter}
                    >
                        <CloseRounded />
                    </IconButton>
                ),
                indicator: null,
            })}
            renderValue={(value) => (
                <Box sx={{ display: 'flex', gap: '0.25rem' }}>
                    {value.map((selectedOption) => (
                        <Chip
                            key={selectedOption.value}
                            variant="soft"
                            color="primary">
                            {selectedOption.label}
                        </Chip>
                    ))}
                </Box>
            )}
            sx={{
                minWidth: '15rem',
                borderRadius: '4px',
            }}
        >
            {options.map((option) => (
                <Option key={option.value} value={option.value}>
                    {option.label}
                </Option>
            ))}
        </Select>
    </FormControl>
);

export default StatusFilter;
