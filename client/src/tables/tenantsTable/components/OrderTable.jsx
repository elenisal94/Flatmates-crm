/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
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
import Pending from '@mui/icons-material/Pending';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

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

function RowMenu({ tenants }) {
    return (
        <Dropdown>
            <MenuButton
                slots={{ root: IconButton }}
                slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
            >
                <MoreHorizRoundedIcon />
            </MenuButton>
            <Menu size="sm" sx={{ minWidth: 140 }}>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Rename</MenuItem>
                <MenuItem>Move</MenuItem>
                <Divider />
                <MenuItem color="danger">Delete</MenuItem>
            </Menu>
        </Dropdown>
    );
}

export default function OrderTable({ tenants }) {
    const [order, setOrder] = useState('desc');
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);

    const getPaymentStatus = (paid, latePayments) => {
        if (paid) {
            return 'Paid';
        } else if (latePayments > 0) {
            return 'Late';
        } else {
            return 'Pending';
        }
    };

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
                return <CheckRoundedIcon />;
            case 'Late':
                return <ErrorOutline />;
            case 'Pending':
                return <Pending />;
            default:
                return null;
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

    const renderFilters = () => (
        <>
            <FormControl size="sm">
                <FormLabel>Status</FormLabel>
                <Select
                    size="sm"
                    placeholder="Filter by status"
                    slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
                >
                    <Option value="paid">Paid</Option>
                    <Option value="pending">Pending</Option>
                    <Option value="late">Late</Option>
                </Select>
            </FormControl>
            <FormControl size="sm">
                <FormLabel>Category</FormLabel>
                <Select size="sm" placeholder="All">
                    <Option value="all">All</Option>
                    <Option value="refund">Refund</Option>
                    <Option value="purchase">Purchase</Option>
                    <Option value="debit">Debit</Option>
                </Select>
            </FormControl>
            <FormControl size="sm">
                <FormLabel>Tenant</FormLabel>
                <Select size="sm" placeholder="All">
                    <Option value="all">All</Option>
                    <Option value="olivia">Olivia Rhye</Option>
                    <Option value="steve">Steve Hampton</Option>
                    <Option value="ciaran">Ciaran Murray</Option>
                    <Option value="marina">Marina Macdonald</Option>
                    <Option value="charles">Charles Fulton</Option>
                    <Option value="jay">Jay Hoper</Option>
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
                />
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
                    <Input size="sm" placeholder="Search" startDecorator={<SearchIcon />} />
                </FormControl>
                {renderFilters()}
            </Box>
            <Sheet
                className="OrderTableContainer"
                variant="outlined"
                sx={{
                    display: { xs: 'none', sm: 'initial' },
                    width: '100%',
                    borderRadius: 'sm',
                    flexShrink: 1,
                    overflow: 'auto',
                    minHeight: 0,
                }}
            >
                <Table
                    aria-labelledby="tableTitle"
                    stickyHeader
                    hoverRow
                    sx={{
                        '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
                        '--Table-headerUnderlineThickness': '1px',
                        '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
                        '--TableCell-paddingY': '4px',
                        '--TableCell-paddingX': '8px',
                    }}
                >
                    <thead>
                        <tr>
                            <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
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
                            <th style={{ width: 120, padding: '12px 6px' }}>
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
                            </th>
                            <th style={{ width: 160, padding: '12px 6px' }}>Phone</th>
                            <th style={{ width: 160, padding: '12px 6px' }}>Email</th>
                            <th style={{ width: 160, padding: '12px 6px' }}>Address</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Rent status</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Total rent payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Completed rent payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Pending rent payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Late rent payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Bills status</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Total bill payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Completed bill payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Pending bill payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Late bill payments</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Tasks status</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Total tasks</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Completed tasks</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Pending tasks</th>
                            <th style={{ width: 140, padding: '12px 6px' }}>Overdue tasks</th>
                            <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                                <RowMenu />
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {stableSort(tenants, getComparator(order, 'id')).map((tenant) => {
                            const isItemSelected = selected.indexOf(tenant._id) !== -1;
                            const rentStatus = getPaymentStatus(tenant.rentPaid, tenant.lateRentPayments);
                            const billStatus = getPaymentStatus(tenant.billsPaid, tenant.lateBillPayments);
                            const taskStatus = getTaskStatus(tenant);

                            return (
                                <tr key={tenant._id}>
                                    <td style={{ textAlign: 'center' }}>
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
                                    <td>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {/* <Avatar size="sm">{tenant.customer.initial}</Avatar> */}
                                            <div>
                                                <Typography
                                                    fontWeight="lg"
                                                    level="body3"
                                                    textColor="text.primary"
                                                >
                                                    {tenant.firstName} {tenant.lastName}
                                                </Typography>
                                            </div>
                                        </Box>
                                    </td>
                                    <td>{tenant.phone}</td>
                                    <td>{tenant.email}</td>
                                    <td>{`${tenant.address?.flat ? `${tenant.address.flat}, ` : ''}${tenant.address?.street ? `${tenant.address.street}, ` : ''}${tenant.address?.city ? `${tenant.address.city}, ` : ''}${tenant.address?.state ? `${tenant.address.state}, ` : ''}${tenant.address?.postcode || ''}`}</td>                                    <td>
                                        <Chip
                                            variant="soft"
                                            size="sm"
                                            startDecorator={getPaymentStartDecorator(rentStatus)}
                                            color={getPaymentChipColor(rentStatus)}
                                        >
                                            {rentStatus}
                                        </Chip>
                                    </td>
                                    <td>{tenant.totalRentPayments}</td>
                                    <td>{tenant.completedRentPayments}</td>
                                    <td>{tenant.pendingRentPayments}</td>
                                    <td>{tenant.lateRentPayments}</td>
                                    <td>
                                        <Chip
                                            variant="soft"
                                            size="sm"
                                            startDecorator={getPaymentStartDecorator(billStatus)}
                                            color={getPaymentChipColor(billStatus)}
                                        >
                                            {billStatus}
                                        </Chip>
                                    </td>
                                    <td>{tenant.totalBillPayments}</td>
                                    <td>{tenant.completedBillPayments}</td>
                                    <td>{tenant.pendingBillPayments}</td>
                                    <td>{tenant.lateBillPayments}</td>
                                    <td><Chip
                                        variant="soft"
                                        size="sm"
                                        startDecorator={getTaskStartDecorator}
                                        color={getTaskChipColor(taskStatus)}
                                    >
                                        {taskStatus}
                                    </Chip></td>
                                    <td>
                                        {tenant.totalTasks}
                                    </td>
                                    <td>
                                        {tenant.completedTasks}
                                    </td>
                                    <td>
                                        {tenant.pendingTasks}
                                    </td>
                                    <td>
                                        {tenant.overdueTasks}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <RowMenu />
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
                    display: { xs: 'flex', sm: 'none' },
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
                    display: { xs: 'none', sm: 'flex' },
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
                    1-5 of 30
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton size="sm" variant="outlined" color="neutral">
                        <KeyboardArrowLeftIcon />
                    </IconButton>
                    <IconButton size="sm" variant="outlined" color="neutral">
                        <KeyboardArrowRightIcon />
                    </IconButton>
                </Box>
            </Box>
        </>
    );
}
