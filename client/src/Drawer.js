import { useState, useEffect } from 'react';
import { Box, Drawer, CssBaseline, Card, CardContent, Typography, Divider, CircularProgress, IconButton, Button, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function PersistentDrawerRight({ selectedTenant, open, onClose, setRefreshInfo }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    const onSubmit = (data) => console.log(data)

    const [tenantData, setTenantData] = useState(selectedTenant || {});
    const [flat, setFlat] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [postcode, setPostcode] = useState('');

    useEffect(() => {
        setTenantData(selectedTenant || {});
        if (selectedTenant?.address) {
            const { flat, street, city, postcode } = selectedTenant.address;
            setFlat(flat || '');
            setStreet(street || '');
            setCity(city || '');
            setPostcode(postcode || '');
        }
        setIsEditing(false);
    }, [selectedTenant]);

    const handleEditButtonClick = () => {
        setIsEditing(true);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const fieldName = name.split('.')[1];
            switch (fieldName) {
                case 'flat':
                    setFlat(value);
                    break;
                case 'street':
                    setStreet(value);
                    break;
                case 'city':
                    setCity(value);
                    break;
                case 'postcode':
                    setPostcode(value);
                    break;
                default:
                    break;
            }
        } else {
            setTenantData(prevData => ({ ...prevData, [name]: value }));
        }
    };

    const handleBackButtonClick = () => {
        setIsEditing(false);
    }

    const finalSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const updatedAddress = { flat, street, city, postcode };
            const updatedData = { ...tenantData, address: updatedAddress };
            await axios.put(`http://localhost:5001/api/tenants/${tenantData._id}`, updatedData);
            setTenantData(updatedData);

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
            setIsEditing(false);
            setRefreshInfo(true);
        }
    };

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
                            {!isEditing ? (
                                <>
                                    <Typography variant="h5" gutterBottom>
                                        Profile Information
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Name:</strong> {tenantData?.firstName} {tenantData?.lastName}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Email:</strong> {tenantData?.email}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Phone:</strong> {tenantData?.phone}
                                    </Typography>
                                    <Typography variant="body1">
                                        <strong>Address:</strong> {tenantData.address?.flat}, {selectedTenant.address?.street}, {tenantData.address?.city}, {tenantData.address?.postcode}
                                    </Typography>
                                    <Box mt={2} mb={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button margin="dense" color="primary" variant="contained" size="small" onClick={handleEditButtonClick}>Edit Details</Button>
                                    </Box>
                                </>
                            ) : (
                                <>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <TextField
                                            name="firstName"
                                            {...register(`firstName-${selectedTenant?._id}`, { required: true })}
                                            label="First Name"
                                            variant="outlined"
                                            value={tenantData?.firstName || ""}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                            placeholder="First name"
                                        />
                                        {errors[`firstName-${selectedTenant?._id}`] && <span>This field is required</span>}
                                        <TextField
                                            name="lastName"
                                            label="Last Name"
                                            variant="outlined"
                                            value={tenantData?.lastName}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <TextField
                                            name="email"
                                            label="Email"
                                            value={tenantData?.email}
                                            onChange={handleInputChange}
                                            required
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        // helperText={error ? "Required field." : ""}
                                        />
                                        <TextField
                                            name="phone"
                                            label="Phone"
                                            variant="outlined"
                                            value={tenantData?.phone}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <TextField
                                            name="address.flat"
                                            label="Flat"
                                            variant="outlined"
                                            value={flat}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <TextField
                                            name="address.street"
                                            label="Street"
                                            variant="outlined"
                                            value={street}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <TextField
                                            name="address.city"
                                            label="City"
                                            variant="outlined"
                                            value={city}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <TextField
                                            name="address.postcode"
                                            label="Postcode"
                                            variant="outlined"
                                            value={postcode}
                                            onChange={handleInputChange}
                                            fullWidth
                                            sx={{ marginBottom: 1 }}
                                        />
                                        <Box mt={2} mb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <Button color="primary" margin="dense" onClick={handleBackButtonClick}>
                                                Back
                                            </Button>
                                            <Button color="primary" variant="contained" margin="dense" onClick={finalSubmit}>
                                                {isLoading ? <CircularProgress size={24} /> : "Save Changes"}
                                            </Button>
                                        </Box>
                                    </form>
                                </>
                            )}
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
