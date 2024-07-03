import React, { useRef, useState, useEffect } from 'react';
import { Box } from '@mui/joy';

const ResizableTableCell = ({ children }) => {
    const cellRef = useRef(null);
    const [width, setWidth] = useState(150);
    const [isResizing, setIsResizing] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (isResizing) {
                const newWidth = e.clientX - cellRef.current.getBoundingClientRect().left;
                const minWidth = 120;
                const maxWidth = 500;
                setWidth(newWidth < minWidth ? minWidth : (newWidth > maxWidth ? maxWidth : newWidth));
            }
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };

        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);

    const handleMouseDown = () => {
        setIsResizing(true);
    };

    return (
        <Box
            component="th"
            ref={cellRef}
            sx={{
                position: 'relative',
                width,
                cursor: 'col-resize',
                userSelect: 'none',
                padding: '8px',
                borderRight: '1px solid rgba(0, 0, 0, 0.1)',
                boxSizing: 'border-box',
                whiteSpace: 'normal',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                overflow: 'hidden',
                '@media (max-width: 900px)': {
                    width: '100px',
                },
                '@media (min-width: 600px)': {
                    width,
                },
            }}
            onMouseDown={handleMouseDown}
        >
            <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word', overflowWrap: 'break-word' }}>
                {children}
            </Box>
            {isResizing && (
                <Box
                    sx={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: '5px',
                        cursor: 'col-resize',
                        zIndex: 1,
                    }}
                />
            )}
        </Box>
    );
};

export default ResizableTableCell;
