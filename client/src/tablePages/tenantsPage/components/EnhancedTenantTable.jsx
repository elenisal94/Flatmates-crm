import React, { useState } from 'react';
import Box from '@mui/joy/Box';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton from '@mui/joy/IconButton';
import MenuItem from '@mui/joy/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import ClearIcon from '@mui/icons-material/Clear';
import Pending from '@mui/icons-material/Pending';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { ListItemText } from '@mui/material';
import '../../tableUtils/TableStyles.css';
import StatusFilter from '../../tableUtils/StatusFilter'
import SearchInput from '../../tableUtils/SearchInput'
import FiltersModal from '../../tableUtils/FiltersModal'
import TenantTableCells from './TenantTableCells'
import Pagination from '../../tableUtils/Pagination'

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


export default function EnhancedTenantTable({ tenants, onProfileClick, handleEditClick, handleDelete }) {
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
                <FormLabel>Visible columns</FormLabel>
                <Select
                    multiple
                    placeholder="See Columns"
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
                <SearchInput
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleClearSearch={handleClearSearch}
                />
                <FiltersModal open={open} setOpen={setOpen} renderFilters={
                    renderFilters} />
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
                className="TenantTableContainer"
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
                <TenantTableCells
                    tenants={tenants}
                    selected={selected}
                    setSelected={setSelected}
                    columnVisibility={columnVisibility}
                    onProfileClick={onProfileClick}
                    handleEditClick={handleEditClick}
                    handleDelete= {handleDelete}
                    stableSort={stableSort}
                    order={order}
                    setOrder={setOrder}
                    paginatedTenants={paginatedTenants}
                    getPaymentStatus={getPaymentStatus}
                    getPaymentStartDecorator={getPaymentStartDecorator}
                    getPaymentChipColor={getPaymentChipColor}
                    getTaskStatus={getTaskStatus}
                    getTaskStartDecorator={getTaskStartDecorator}
                    getTaskChipColor={getTaskChipColor}
                    getComparator={getComparator}
                />
            </Sheet>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                handlePreviousPage={handlePreviousPage}
                handleNextPage={handleNextPage}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
            />
        </>
    );
}
