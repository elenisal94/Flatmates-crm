import React from 'react';
import Table from '@mui/joy/Table';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Link from '@mui/joy/Link';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ResizableTableCell from '../../tableUtils/ResizableTableCell';
import RowMenu from '../../tableUtils/RowMenu';

const TenantTableCells = ({
    tenants, selected, setSelected, order, setOrder,
    columnVisibility, onProfileClick, handleEditClick,
    stableSort, paginatedTenants,
    getPaymentStatus, getPaymentStartDecorator,
    getPaymentChipColor, getTaskStatus, getComparator,
    getTaskStartDecorator, getTaskChipColor
}) => (
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
                {columnVisibility.phone && <ResizableTableCell>Phone</ResizableTableCell>}
                {columnVisibility.email && <ResizableTableCell>Email</ResizableTableCell>}
                {columnVisibility.address && <ResizableTableCell>Address</ResizableTableCell>}
                {columnVisibility.rentStatus && <ResizableTableCell>Rent status</ResizableTableCell>}
                {columnVisibility.totalRentPayments && <ResizableTableCell>Total rent payments</ResizableTableCell>}
                {columnVisibility.completedRentPayments && <ResizableTableCell>Completed rent payments</ResizableTableCell>}
                {columnVisibility.pendingRentPayments && <ResizableTableCell>Pending rent payments</ResizableTableCell>}
                {columnVisibility.lateRentPayments && <ResizableTableCell>Late rent payments</ResizableTableCell>}
                {columnVisibility.billsStatus && <ResizableTableCell>Bills status</ResizableTableCell>}
                {columnVisibility.totalBillPayments && <ResizableTableCell>Total bill payments</ResizableTableCell>}
                {columnVisibility.completedBillPayments && <ResizableTableCell>Completed bill payments</ResizableTableCell>}
                {columnVisibility.pendingBillPayments && <ResizableTableCell>Pending bill payments</ResizableTableCell>}
                {columnVisibility.lateBillPayments && <ResizableTableCell>Late bill payments</ResizableTableCell>}
                {columnVisibility.tasksStatus && <ResizableTableCell>Tasks status</ResizableTableCell>}
                {columnVisibility.totalTasks && <ResizableTableCell>Total tasks</ResizableTableCell>}
                {columnVisibility.completedTasks && <ResizableTableCell>Completed tasks</ResizableTableCell>}
                {columnVisibility.pendingTasks && <ResizableTableCell>Pending tasks</ResizableTableCell>}
                {columnVisibility.overdueTasks && <ResizableTableCell>Overdue tasks</ResizableTableCell>}
                <th aria-label="last" style={{ width: 48, textAlign: 'center', padding: '12px 6px', borderLeft: '1px solid rgba(0, 0, 0, 0.1)' }} />
            </tr>
        </thead>
        <tbody>
            {stableSort(paginatedTenants, getComparator(order, 'id')).map((tenant) => {
                const isItemSelected = selected.indexOf(tenant._id) !== -1;
                const rentStatus = getPaymentStatus(tenant.rentPaid, tenant.lateRentPayments);
                const billStatus = getPaymentStatus(tenant.billsPaid, tenant.lateBillPayments);
                const taskStatus = getTaskStatus(tenant);
                console.log('Paginated Tenants', paginatedTenants)
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
                                    color={getPaymentChipColor(rentStatus)}
                                    startDecorator={getPaymentStartDecorator(rentStatus)}
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
                                    color={getPaymentChipColor(billStatus)}
                                    startDecorator={getPaymentStartDecorator(billStatus)}
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
                                    color={getTaskChipColor(taskStatus)}
                                    startDecorator={getTaskStartDecorator(taskStatus)}
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
                            <RowMenu
                                onEdit={() => handleEditClick(tenant)}
                                onProfile={() => onProfileClick(tenant)}
                            />
                        </td>
                    </tr>
                );
            })}
        </tbody>
    </Table>
);

export default TenantTableCells;
