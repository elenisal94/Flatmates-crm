import { Box, Drawer, CssBaseline, Card, CardContent, Typography, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PersistentDrawerRight({ selectedTenant, open, onClose }) {
    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: 300,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: 300,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="right"
                open={open}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '8px', position: 'relative' }}>
                    <IconButton onClick={onClose} style={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </div>
                {selectedTenant && (
                    <Card>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Profile Information
                            </Typography>
                            <Typography variant="body1">
                                <strong>Name:</strong> {selectedTenant.firstName} {selectedTenant.lastName}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Email:</strong> {selectedTenant.email}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Phone:</strong> {selectedTenant.phone}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Address:</strong> {selectedTenant.address?.flat}, {selectedTenant.address?.street}, {selectedTenant.address?.city}, {selectedTenant.address?.postcode}
                            </Typography>
                            <Divider />
                            <Typography variant="body1">
                                <strong>Rent Paid:</strong> {selectedTenant.rentPaid ? 'Yes' : 'No'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Total Rent Payments:</strong> {selectedTenant.totalRentPayments}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Completed Rent Payments:</strong> {selectedTenant.completedRentPayments}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Pending Rent Payments:</strong> {selectedTenant.pendingRentPayments}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Late Rent Payments:</strong> {selectedTenant.lateRentPayments}
                            </Typography>
                            <Divider />
                            <Typography variant="body1">
                                <strong>Bills Paid:</strong> {selectedTenant.billsPaid ? ' Yes' : 'No'}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Total Bill Payments:</strong> {selectedTenant.totalBillPayments}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Completed Bill Payments:</strong> {selectedTenant.completedBillPayments}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Pending Bill Payments:</strong> {selectedTenant.pendingBillPayments}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Late Bill Payments:</strong> {selectedTenant.lateBillPayments}
                            </Typography>
                            <Divider />
                            <Typography variant="body1">
                                <strong>Total Tasks:</strong> {selectedTenant.totalTasks}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Completed Tasks:</strong> {selectedTenant.completedTasks}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Pending Tasks:</strong> {selectedTenant.pendingTasks}
                            </Typography>
                            <Typography variant="body1">
                                <strong>Overdue Tasks:</strong> {selectedTenant.overdueTasks}
                            </Typography>
                        </CardContent>
                    </Card>
                )}
            </Drawer>
        </Box>
    );
}
