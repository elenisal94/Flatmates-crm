import axios from 'axios';
import { Controller } from "react-hook-form";
// import ReactDatePicker from "react-datepicker";
import { FormControl, FormHelperText, InputLabel, TextField, MenuItem, Select, Grid, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/en-gb';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import React from 'react';

const AddBillPayment = ({ setBillPayments, tenants, setRefreshInfo, handleSubmit, errors, control, reset, formState }) => {


    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:5001/api/bill-payments', data);
            setBillPayments(prevBills => [...prevBills, response.data]);
            setRefreshInfo(true);
            reset();
        } catch (error) {
            console.error(error);
        }
    };


    const handleChange = (event) => {
        const value = event.target.value;
        const isPaymentMade = value === "true" ? true : false;
        console.log("Payment made:", isPaymentMade);
    };

    return (
        <div>
            <h2>Add Bill Payment</h2>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
                <form onSubmit={handleSubmit((billPayments) => onSubmit(billPayments))}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={errors.tenant}>
                                <InputLabel htmlFor="tenant">Tenant</InputLabel>
                                <Controller
                                    name="tenant"
                                    control={control}
                                    rules={{ required: "This field is required!" }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            id="tenant"
                                            {...field}
                                            label="Tenant"
                                        >
                                            <MenuItem value="">Select Tenant</MenuItem>
                                            {tenants.map(tenant => (
                                                <MenuItem key={tenant._id} value={tenant._id}>
                                                    {tenant.firstName} {tenant.lastName}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                                <FormHelperText sx={{ color: 'red' }}>{errors.tenant && errors.tenant.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={errors.billType}>
                                <InputLabel htmlFor="billType">Bill Type</InputLabel>
                                <Controller
                                    name="billType"
                                    control={control}
                                    rules={{ required: "This field is required!" }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            id="billType"
                                            {...field}
                                            label="Bill Type"
                                        >
                                            <MenuItem value="">Select Bill Type</MenuItem>
                                            <MenuItem value="Electricity">Electricity</MenuItem>
                                            <MenuItem value="Water">Water</MenuItem>
                                            <MenuItem value="Gas">Gas</MenuItem>
                                            <MenuItem value="Council Tax">Council Tax</MenuItem>
                                        </Select>
                                    )}
                                />
                                <FormHelperText sx={{ color: 'red' }}>{errors.billType && errors.billType.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={errors.amount}>
                                <Controller
                                    name="amount"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: "This field is required!" }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            variant="outlined"
                                            id="amount"
                                            label="Amount"
                                            type="number"
                                        />
                                    )}
                                />
                                <FormHelperText sx={{ color: 'red' }}>{errors.amount && errors.amount.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={errors.dueDate}>
                                <Controller
                                    name="dueDate"
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Due Date"
                                            {...field}
                                            selected={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                                {errors.dueDate && <FormHelperText error>This field is required!</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={errors.paymentMade}>
                                <InputLabel htmlFor="paymentMade">Payment made?</InputLabel>
                                <Controller
                                    name="paymentMade"
                                    control={control}
                                    rules={{ required: "This field is required!" }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select
                                            id="paymentMade"
                                            {...field}
                                            label="Payment made?"
                                        >
                                            <MenuItem value="">Select if payment was made</MenuItem>
                                            <MenuItem value="true">Yes, payment was made</MenuItem>
                                            <MenuItem value="false">No, payment was not made yet</MenuItem>
                                        </Select>
                                    )}
                                />
                                <FormHelperText sx={{ color: 'red' }}>{errors.paymentMade && errors.paymentMade.message}</FormHelperText>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth error={errors.datePaid}>
                                <Controller
                                    name="datePaid"
                                    control={control}
                                    rules={{ required: true }}
                                    defaultValue={null}
                                    render={({ field }) => (
                                        <DatePicker
                                            label="Date Paid"
                                            {...field}
                                            selected={field.value ? new Date(field.value) : null}
                                            onChange={(date) => field.onChange(date)}
                                        />
                                    )}
                                />
                                {errors.datePaid && <FormHelperText error>This field is required!</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button variant="contained" type="submit">Add Bill Payment</Button>
                        </Grid>
                    </Grid>
                </form>
            </LocalizationProvider>
        </div>
    );
};

export default AddBillPayment;
