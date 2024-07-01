/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearIcon from '@mui/icons-material/Clear';
import Pending from '@mui/icons-material/Pending';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ResizableTableCell from '../../tableUtils/ResizableTableCell';
import { ListItemText } from '@mui/material';
import CloseRounded from '@mui/icons-material/CloseRounded';
import '../../tableUtils/TableStyles.css';
import StatusFilter from '../../tableUtils/StatusFilter'

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) return -1;
    if (b[orderBy] > a[orderBy]) return 1;
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function RowMenu({ tenant, handleEditClick }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem onClick={() => handleEditClick(tenant)}>Edit</MenuItem>
                <Divider />
                <MenuItem color="danger">Delete</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function OrderTable({ tenants, onProfileClick, handleEditClick }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [rentStatusFilter, setRentStatusFilter] = useState([]);
    const [billStatusFilter, setBillStatusFilter] = useState([]);
    const [taskStatusFilter, setTaskStatusFilter] = useState([]);
    const itemsPerPage = 20;
    const [columnVisibility, setColumnVisibility] = useState({
        phone: true,
        email: true,
        address: true,
        rentStatus: true,
        totalRentPayments: true,
        completedRentPayments: true,
        pendingRentPayments: true,
        lateRentPayments: true,
        billsStatus: true,
        totalBillPayments: true,
        completedBillPayments: true,
        pendingBillPayments: true,
        lateBillPayments: true,
        tasksStatus: true,
        totalTasks: true,
        completedTasks: true,
        pendingTasks: true,
        overdueTasks: true
    });

    // const theme = useTheme();

    const columns = [
        { id: 'phone', label: 'Phone' },
        { id: 'email', label: 'Email' },
        { id: 'address', label: 'Address' },
        { id: 'rentStatus', label: 'Rent Status' },
        { id: 'totalRentPayments', label: 'Total Rent Payments' },
        { id: 'completedRentPayments', label: 'Completed Rent Payments' },
        { id: 'pendingRentPayments', label: 'Pending Rent Payments' },
        { id: 'lateRentPayments', label: 'Late Rent Payments' },
        { id: 'billsStatus', label: 'Bills Status' },
        { id: 'totalBillPayments', label: 'Total Bill Payments' },
        { id: 'completedBillPayments', label: 'Completed Bill Payments' },
        { id: 'pendingBillPayments', label: 'Pending Bill Payments' },
        { id: 'lateBillPayments', label: 'Late Bill Payments' },
        { id: 'tasksStatus', label: 'Tasks Status' },
        { id: 'totalTasks', label: 'Total Tasks' },
        { id: 'completedTasks', label: 'Completed Tasks' },
        { id: 'pendingTasks', label: 'Pending Tasks' },
        { id: 'overdueTasks', label: 'Overdue Tasks' }
    ];

    const rentOptions = [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'late', label: 'Late' },
    ];

    const billOptions = [
        { value: 'paid', label: 'Paid' },
        { value: 'pending', label: 'Pending' },
        { value: 'late', label: 'Late' },
    ];

    const taskOptions = [
        { value: 'completed', label: 'Completed' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'pending', label: 'Pending' },
        { value: 'no tasks', label: 'No tasks' },
    ];

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const clearStatusFilter = (setStatusFilter) => {
        setStatusFilter([]);
        setCurrentPage(1);
    };

    const getPaymentStatus = (paid, latePayments) => {
        if (paid) {
            return 'Paid';
        } else if (latePayments > 0) {
            return 'Late';
        } else {
            return 'Pending';
        }
    };

    const getTaskStatus = (tenant) => {
        if (tenant.completedTasks > 0 && tenant.completedTasks === tenant.totalTasks) {
            return 'Completed';
        } else if (tenant.overdueTasks > 0) {
            return 'Overdue';
        } else if (tenant.pendingTasks > 0) {
            return 'Pending';
        } else {
            return 'No Tasks';
        }
    };

    const filteredTenants = tenants.filter((tenant) => {
        const fullName = `${tenant.firstName ?? ''} ${tenant.lastName ?? ''}`.toLowerCase();
        const query = searchQuery.toLowerCase();
        const matchesQuery = (
            fullName.includes(query) ||
            tenant.email?.toLowerCase().includes(query) ||
            tenant.phone?.toLowerCase().includes(query) ||
            (tenant.address &&
                (tenant.address.flat + ' ' + tenant.address.street + ' ' + tenant.address.city + ' ' + tenant.address.postcode)
                    .toLowerCase()
                    .includes(query)
            ));

        const rentStatus = getPaymentStatus(tenant.rentPaid, tenant.lateRentPayments);
        const billStatus = getPaymentStatus(tenant.billsPaid, tenant.lateBillPayments);
        const taskStatus = getTaskStatus(tenant);
        const matchesRentStatus = !rentStatusFilter.length || rentStatusFilter.includes(rentStatus.toLowerCase());
        const matchesBillStatus = !billStatusFilter || billStatusFilter.length === 0 || billStatusFilter.includes(billStatus.toLowerCase());
        const matchesTaskStatus = !taskStatusFilter.length || taskStatusFilter.includes(taskStatus.toLowerCase());
        return matchesQuery && matchesRentStatus && matchesBillStatus && matchesTaskStatus;
    });


    const totalItems = filteredTenants.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    const handleStatusChange = (type) => (event, newValue) => {
        const updatedValue = Array.isArray(newValue) ? newValue : [newValue];
        switch (type) {
            case 'rent':
                setRentStatusFilter(updatedValue);
                break;
            case 'bill':
                setBillStatusFilter(updatedValue);
                break;
            case 'task':
                setTaskStatusFilter(updatedValue);
                break;
            default:
                break;
        }
        setCurrentPage(1);
    };


    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const paginatedTenants = stableSort(filteredTenants, getComparator(order, 'id')).slice(startIndex, endIndex);


    const getPaymentChipColor = (status) => {
        switch (status) {
            case 'Paid':
                return 'success';
            case 'Late':
                return 'danger';
            case 'Pending':
                return 'warning';
            default:
                return 'neutral';
        }
    };

    const getPaymentStartDecorator = (status) => {
        switch (status) {
            case 'Paid':
                return <CheckRoundedIcon sx={{ zIndex: -1 }} />;
            case 'Late':
                return <ErrorOutline sx={{ zIndex: -1 }} />;
            case 'Pending':
                return <Pending sx={{ zIndex: -1 }} />;
            default:
                return null;
        }
    };

    const getTaskChipColor = (status) => {
        switch (status) {
            case 'Completed':
                return 'success';
            case 'Overdue':
                return 'danger';
            case 'Pending':
                return 'warning';
            case 'No Tasks':
                return 'neutral';
            default:
                return 'neutral';
        }
    };

    const getTaskStartDecorator = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckRoundedIcon />;
            case 'Overdue':
                return <ErrorOutline />;
            case 'Pending':
                return <Pending />;
            case 'No Tasks':
                return null;
            default:
                return null;
        }
    };

    const handleColumnToggle = (columnId) => {
        setColumnVisibility((prevState) => ({
            ...prevState,
            [columnId]: !prevState[columnId]
        }));
    };


    const renderFilters = () => (
        <>
            <StatusFilter
                label="Rent status"
                options={rentOptions}
                filter={rentStatusFilter}
                onChange={handleStatusChange('rent')}
                clearFilter={() => clearStatusFilter(setRentStatusFilter)}
            />
            <StatusFilter
                label="Bill status"
                options={billOptions}
                filter={billStatusFilter}
                onChange={handleStatusChange('bill')}
                clearFilter={() => clearStatusFilter(setBillStatusFilter)}
            />
            <StatusFilter
                label="Task status"
                options={taskOptions}
                filter={taskStatusFilter}
                onChange={handleStatusChange('task')}
                clearFilter={() => clearStatusFilter(setTaskStatusFilter)}
            />
            <FormControl size="sm">
                <FormLabel>Visible columns list</FormLabel>
                <Select
                    multiple
                    placeholder="Selected Columns"
                    value={Object.keys(columnVisibility).filter((columnId) => columnVisibility[columnId])}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {columns.map((column) => (
                        <MenuItem key={column.id} value={column.id}>
                            <Checkbox
                                overlay
                                checked={columnVisibility[column.id]}
                                onChange={() => handleColumnToggle(column.id)}
                            />
                            <ListItemText primary={column.label} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </>
    );

    return (
        <>
            <Sheet
                className="SearchAndFilters-mobile"
                sx={{
                    display: { xs: 'flex', sm: 'none' },
                    my: 1,
                    gap: 1,
                }}
            >
                <Input
                    size="sm"
                    placeholder="Search"
                    startDecorator={<SearchIcon />}
                    sx={{ flexGrow: 1 }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    endDecorator={
                        searchQuery && (
                            <IconButton onClick={handleClearSearch}>
                                <ClearIcon />
                            </IconButton>
                        )
                    } />
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
            </Sheet>
            <Box
                className="SearchAndFilters-tabletUp"
                sx={{
                    borderRadius: 'sm',
                    py: 2,
                    display: { xs: 'none', sm: 'flex' },
                    flexWrap: 'wrap',
                    gap: 1.5,
                    '& > *': {
                        minWidth: { xs: '120px', md: '160px' },
                    },
                }}
            >
                <FormControl sx={{ flex: 1 }} size="sm">
                    <FormLabel>Search for tenant</FormLabel>
                    <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        endDecorator={
                            searchQuery && (
                                <IconButton onClick={handleClearSearch}>
                                    <ClearIcon />
                                </IconButton>
                            )
                        } />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    '--TableRow-stripeBackground': 'rgba(0 0 0 / 0.04)',
                    '--TableRow-hoverBackground': 'rgba(0 0 0 / 0.08)',
                    display: 'block',
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflowX: 'auto',
                    minHeight: 0,
                    '@media (max-width: 600px)': {
                        display: 'block',
                    },
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    noWrap={false}
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                        '& tr > *:last-child': {
                            position: 'sticky',
                            right: 0,
                            bgcolor: 'var(--TableCell-headBackground)',
                        }
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 48, textAlign: 'center', padding: '12px 6px', borderRight: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                <Checkbox
                                    size="sm"
                                    indeterminate={
                                        selected.length > 0 && selected.length !== tenants.length
                                    }
                                    checked={selected.length === tenants.length}
                                    onChange={(event) => {
                                        setSelected(
                                            event.target.checked ? tenants.map((tenant) => tenant._id) : [],
                                        );
                                    }}
                                    color={
                                        selected.length > 0 || selected.length === tenants.length
                                            ? 'primary'
                                            : undefined
                                    }
                                    sx={{ verticalAlign: 'text-bottom' }}
                                />
                            </th>
                            <ResizableTableCell>
                                <Link
                                    underline="none"
                                    color="primary"
                                    component="button"
                                    onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                                    fontWeight="lg"
                                    endDecorator={<ArrowDropDownIcon />}
                                    sx={{
                                        '& svg': {
                                            transition: '0.2s',
                                            transform:
                                                order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                                        },
                                    }}
                                >
                                    Tenant
                                </Link>
                            </ResizableTableCell>
                            {columnVisibility['phone'] && <ResizableTableCell>Phone</ResizableTableCell>}
                            {columnVisibility['email'] && <ResizableTableCell>Email</ResizableTableCell>}
                            {columnVisibility['address'] && <ResizableTableCell>Address</ResizableTableCell>}
                            {columnVisibility['rentStatus'] && <ResizableTableCell>Rent status</ResizableTableCell>}
                            {columnVisibility['totalRentPayments'] && <ResizableTableCell>Total rent payments</ResizableTableCell>}
                            {columnVisibility['completedRentPayments'] && <ResizableTableCell>Completed rent payments</ResizableTableCell>}
                            {columnVisibility['pendingRentPayments'] && <ResizableTableCell>Pending rent payments</ResizableTableCell>}
                            {columnVisibility['lateRentPayments'] && <ResizableTableCell>Late rent payments</ResizableTableCell>}
                            {columnVisibility['billsStatus'] && <ResizableTableCell>Bills status</ResizableTableCell>}
                            {columnVisibility['totalBillPayments'] && <ResizableTableCell>Total bill payments</ResizableTableCell>}
                            {columnVisibility['completedBillPayments'] && <ResizableTableCell>Completed bill payments</ResizableTableCell>}
                            {columnVisibility['pendingBillPayments'] && <ResizableTableCell>Pending bill payments</ResizableTableCell>}
                            {columnVisibility['lateBillPayments'] && <ResizableTableCell>Late bill payments</ResizableTableCell>}
                            {columnVisibility['tasksStatus'] && <ResizableTableCell>Tasks status</ResizableTableCell>}
                            {columnVisibility['totalTasks'] && <ResizableTableCell>Total tasks</ResizableTableCell>}
                            {columnVisibility['completedTasks'] && <ResizableTableCell>Completed tasks</ResizableTableCell>}
                            {columnVisibility['pendingTasks'] && <ResizableTableCell>Pending tasks</ResizableTableCell>}
                            {columnVisibility['overdueTasks'] && <ResizableTableCell>Overdue tasks</ResizableTableCell>}
                            <th aria-label="last" style={{ width: 48, textAlign: 'center', padding: '12px 6px', borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }} />
                        </tr>
                    </thead>
                    <tbody>
                        {stableSort(paginatedTenants, getComparator(order, 'id')).map((tenant) => {
                            const isItemSelected = selected.indexOf(tenant._id) !== -1;
                            const rentStatus = getPaymentStatus(tenant.rentPaid, tenant.lateRentPayments);
                            const billStatus = getPaymentStatus(tenant.billsPaid, tenant.lateBillPayments);
                            const taskStatus = getTaskStatus(tenant);

                            return (
                                <tr key={tenant._id}>
                                    <td className="table-cell" style={{ textAlign: 'center' }}>
                                        <Checkbox
                                            size="sm"
                                            checked={isItemSelected}
                                            onChange={(event) => {
                                                if (event.target.checked) {
                                                    setSelected((prevSelected) => [...prevSelected, tenant._id]);
                                                } else {
                                                    setSelected((prevSelected) =>
                                                        prevSelected.filter((id) => id !== tenant._id),
                                                    );
                                                }
                                            }}
                                            color={isItemSelected ? 'primary' : undefined}
                                            sx={{ verticalAlign: 'text-bottom' }}
                                        />
                                    </td>
                                    <td className="table-cell">
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <div>
                                                <Typography
                                                    fontWeight="lg"
                                                    level="body3"
                                                    textColor="text.primary"
                                                >
                                                    <Link
                                                        href="#"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            onProfileClick(tenant);
                                                        }}
                                                    >
                                                        {`${tenant.firstName} ${tenant.lastName}`}
                                                    </Link>
                                                </Typography>
                                            </div>
                                        </Box>
                                    </td>
                                    {columnVisibility.phone && (
                                        <td className="table-cell">{tenant.phone}</td>
                                    )}
                                    {columnVisibility.email && (
                                        <td className="table-cell">{tenant.email}</td>
                                    )}
                                    {columnVisibility.address && (
                                        <td className="table-cell">{`${tenant.address?.flat ? `${tenant.address.flat}, ` : ''}${tenant.address?.street ? `${tenant.address.street}, ` : ''}${tenant.address?.city ? `${tenant.address.city}, ` : ''}${tenant.address?.state ? `${tenant.address.state}, ` : ''}${tenant.address?.postcode || ''}`}</td>
                                    )}
                                    {columnVisibility.rentStatus && (
                                        <td className="table-cell">
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                startDecorator={getPaymentStartDecorator(rentStatus)}
                                                color={getPaymentChipColor(rentStatus)}
                                            >
                                                {rentStatus}
                                            </Chip>
                                        </td>
                                    )}
                                    {columnVisibility.totalRentPayments && (
                                        <td className="table-cell">{tenant.totalRentPayments}</td>
                                    )}
                                    {columnVisibility.completedRentPayments && (
                                        <td className="table-cell">{tenant.completedRentPayments}</td>
                                    )}
                                    {columnVisibility.pendingRentPayments && (
                                        <td className="table-cell">{tenant.pendingRentPayments}</td>
                                    )}
                                    {columnVisibility.lateRentPayments && (
                                        <td className="table-cell">{tenant.lateRentPayments}</td>
                                    )}
                                    {columnVisibility.billsStatus && (
                                        <td className="table-cell">
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                startDecorator={getPaymentStartDecorator(billStatus)}
                                                color={getPaymentChipColor(billStatus)}
                                            >
                                                {billStatus}
                                            </Chip>
                                        </td>
                                    )}
                                    {columnVisibility.totalBillPayments && (
                                        <td className="table-cell">{tenant.totalBillPayments}</td>
                                    )}
                                    {columnVisibility.completedBillPayments && (
                                        <td className="table-cell">{tenant.completedBillPayments}</td>
                                    )}
                                    {columnVisibility.pendingBillPayments && (
                                        <td className="table-cell">{tenant.pendingBillPayments}</td>
                                    )}
                                    {columnVisibility.lateBillPayments && (
                                        <td className="table-cell">{tenant.lateBillPayments}</td>
                                    )}
                                    {columnVisibility.tasksStatus && (
                                        <td className="table-cell">
                                            <Chip
                                                variant="soft"
                                                size="sm"
                                                startDecorator={getTaskStartDecorator}
                                                color={getTaskChipColor(taskStatus)}
                                            >
                                                {taskStatus}
                                            </Chip>
                                        </td>
                                    )}
                                    {columnVisibility.totalTasks && (
                                        <td className="table-cell">{tenant.totalTasks}</td>
                                    )}
                                    {columnVisibility.completedTasks && (
                                        <td className="table-cell">{tenant.completedTasks}</td>
                                    )}
                                    {columnVisibility.pendingTasks && (
                                        <td className="table-cell">{tenant.pendingTasks}</td>
                                    )}
                                    {columnVisibility.overdueTasks && (
                                        <td className="table-cell">{tenant.overdueTasks}</td>
                                    )}
                                    <td style={{ textAlign: 'center', borderLeft: '1px solid rgba(0, 0, 0, 0.1)', zIndex: '2' }}>
                                        <RowMenu tenant={tenant} handleEditClick={handleEditClick} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </Sheet>
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
}
