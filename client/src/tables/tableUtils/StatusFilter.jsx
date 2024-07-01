import React from 'react';
import Select from '@mui/joy/Select';
import Box from '@mui/joy/Box';
import CloseRounded from '@mui/icons-material/CloseRounded';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Option from '@mui/joy/Option';

const StatusFilter = ({
    label, options = [], filter = [], onChange, clearFilter
}) => (
    <FormControl
        size="sm"
    >
        <FormLabel>{label}</FormLabel>
        <Select
            multiple
            size="sm"
            placeholder={`Filter ${label.toLowerCase()}`}
            slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
            value={filter}
            onChange={onChange}
            {...(filter.length > 0 && {
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
            renderValue={(filter) => (
                <Box
                    sx={{ display: 'flex', gap: '0.25rem' }}
                >
                    {filter.map((selectedOption) => (
                        <Chip
                            key={selectedOption}
                            variant="soft"
                            color="primary"
                        >
                            {selectedOption.label}
                        </Chip>
                    ))}
                </Box>
            )}
            sx={{
                minWidth: '15rem',
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
