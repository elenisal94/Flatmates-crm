// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useForm } from 'react-hook-form';
// import Box from '@mui/joy/Box';
// import Drawer from '@mui/joy/Drawer';
// import Button from '@mui/joy/Button';
// import DialogTitle from '@mui/joy/DialogTitle';
// import Input from "@mui/joy/Input";
// import DialogContent from '@mui/joy/DialogContent';
// import ModalClose from '@mui/joy/ModalClose';
// import Divider from '@mui/joy/Divider';
// import FormControl from '@mui/joy/FormControl';
// import FormLabel from '@mui/joy/FormLabel';
// import FormHelperText from '@mui/joy/FormHelperText';
// import Stack from '@mui/joy/Stack';
// import Sheet from '@mui/joy/Sheet';
// import Typography from '@mui/joy/Typography';
// import CircularProgress from '@mui/joy/CircularProgress';
// import { useMediaQuery, useTheme } from '@mui/material';

// export default function DrawerFilters({ isEditing, setIsEditing, selectedTenant, open, onClose, setRefreshInfo }) {
//     const [isLoading, setIsLoading] = useState(false);

//     const {
//         register,
//         handleSubmit,
//         watch,
//         formState: { errors },
//     } = useForm()

//     const onSubmit = (data) => console.log(data)

//     const [tenantData, setTenantData] = useState(selectedTenant || {});
//     const [flat, setFlat] = useState('');
//     const [street, setStreet] = useState('');
//     const [city, setCity] = useState('');
//     const [postcode, setPostcode] = useState('');

//     useEffect(() => {
//         setTenantData(selectedTenant || {});
//         if (selectedTenant?.address) {
//             const { flat, street, city, postcode } = selectedTenant.address;
//             setFlat(flat || '');
//             setStreet(street || '');
//             setCity(city || '');
//             setPostcode(postcode || '');
//         }
//     }, [selectedTenant]);

//     const handleEditButtonClick = () => {
//         setIsEditing(true);
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;
//         if (name.startsWith('address.')) {
//             const fieldName = name.split('.')[1];
//             switch (fieldName) {
//                 case 'flat':
//                     setFlat(value);
//                     break;
//                 case 'street':
//                     setStreet(value);
//                     break;
//                 case 'city':
//                     setCity(value);
//                     break;
//                 case 'postcode':
//                     setPostcode(value);
//                     break;
//                 default:
//                     break;
//             }
//         } else {
//             setTenantData(prevData => ({ ...prevData, [name]: value }));
//         }
//     };

//     const handleBackButtonClick = () => {
//         setIsEditing(false);
//     }

//     const finalSubmit = async (e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         try {
//             const updatedAddress = { flat, street, city, postcode };
//             const updatedData = { ...tenantData, address: updatedAddress };
//             await axios.put(`http://localhost:5001/api/tenants/${tenantData._id}`, updatedData);
//             setTenantData(updatedData);

//         } catch (error) {
//             console.error(error);
//         } finally {
//             setIsLoading(false);
//             setIsEditing(false);
//             setRefreshInfo(true);
//         }
//     };

//     const theme = useTheme();
//     const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));

//     return (
//         <React.Fragment>
//             <Drawer
//                 size={isSmallScreen ? 'lg' : 'md'}
//                 variant="plain"
//                 anchor={isSmallScreen ? 'bottom' : 'right'}
//                 open={open}
//                 onClose={onClose}
//                 hideBackdrop={false}
//                 slotProps={{
//                     content: {
//                         sx: {
//                             bgcolor: 'transparent',
//                             p: { md: 3, sm: 0 },
//                             boxShadow: 'none',
//                             height: isSmallScreen ? '85vh' : '100%',
//                         },
//                     },
//                 }}
//                 ModalProps={{
//                     style: {
//                         pointerEvents: 'none',
//                     },
//                 }}
//             >
//                 <Sheet
//                     variant="outlined"
//                     sx={{
//                         borderRadius: 'md',
//                         p: 2,
//                         display: 'flex',
//                         flexDirection: 'column',
//                         gap: 2,
//                         height: '100%',
//                         overflow: 'auto',
//                     }}
//                 >
//                     <ModalClose />
//                     <DialogTitle>Tenant profile</DialogTitle>
//                     <DialogContent>
//                         {selectedTenant && (
//                             !isEditing ? (
//                                 <FormControl orientation="horizontal">
//                                     <Box sx={{ flex: 1, pr: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
//                                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                             <FormLabel sx={{ typography: 'title-sm' }}>
//                                                 Name
//                                             </FormLabel>
//                                             <FormHelperText sx={{ typography: 'body-sm' }}>
//                                                 {tenantData?.firstName} {tenantData?.lastName}
//                                             </FormHelperText>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                             <FormLabel sx={{ typography: 'title-sm' }}>
//                                                 Email
//                                             </FormLabel>
//                                             <FormHelperText sx={{ typography: 'body-sm' }}>
//                                                 {tenantData?.email}
//                                             </FormHelperText>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                             <FormLabel sx={{ typography: 'title-sm' }}>
//                                                 Phone
//                                             </FormLabel>
//                                             <FormHelperText sx={{ typography: 'body-sm' }}>
//                                                 {tenantData?.phone}
//                                             </FormHelperText>
//                                         </Box>
//                                         <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                             <FormLabel sx={{ typography: 'title-sm' }}>
//                                                 Adress
//                                             </FormLabel>
//                                             <FormHelperText sx={{ typography: 'body-sm' }}>
//                                                 {tenantData.address?.flat}, {selectedTenant.address?.street}, {tenantData.address?.city}, {tenantData.address?.postcode}
//                                             </FormHelperText>
//                                         </Box>
//                                     </Box>
//                                 </FormControl>
//                             ) : (
//                                 <form onSubmit={handleSubmit(onSubmit)}>
//                                     <FormControl>
//                                         <FormLabel>
//                                             First Name
//                                         </FormLabel>
//                                         <Input
//                                             name="firstName"
//                                             variant="outlined"
//                                             value={tenantData?.firstName || ""}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }}
//                                             placeholder="First name" />

//                                     </FormControl>
//                                     {errors[`firstName-${selectedTenant?._id}`] && <span>This field is required</span>}
//                                     <FormControl>
//                                         <FormLabel>
//                                             Last Name
//                                         </FormLabel>
//                                         <Input
//                                             name="lastName"
//                                             variant="outlined"
//                                             value={tenantData?.lastName}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                     <FormControl required>
//                                         <FormLabel>
//                                             Email
//                                         </FormLabel>
//                                         <Input
//                                             name="email"
//                                             value={tenantData?.email}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                     <FormControl>
//                                         <FormLabel>
//                                             Phone
//                                         </FormLabel>
//                                         <Input
//                                             name="phone"
//                                             variant="outlined"
//                                             value={tenantData?.phone}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                     <FormControl>
//                                         <FormLabel>
//                                             Flat
//                                         </FormLabel>
//                                         <Input
//                                             name="address.flat"
//                                             variant="outlined"
//                                             value={flat}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                     <FormControl>
//                                         <FormLabel>
//                                             Street
//                                         </FormLabel>
//                                         <Input
//                                             name="address.street"
//                                             variant="outlined"
//                                             value={street}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                     <FormControl>
//                                         <FormLabel>
//                                             City
//                                         </FormLabel>
//                                         <Input
//                                             name="address.city"
//                                             variant="outlined"
//                                             value={city}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                     <FormControl>
//                                         <FormLabel>
//                                             Postcode
//                                         </FormLabel>
//                                         <Input
//                                             name="address.postcode"
//                                             variant="outlined"
//                                             value={postcode}
//                                             onChange={handleInputChange}
//                                             fullWidth
//                                             sx={{ marginBottom: 1 }} />

//                                     </FormControl>
//                                 </form>
//                             )
//                         )}

//                         <Divider />
//                         <Typography level="title-md" fontWeight="bold" sx={{ mt: 2 }}>
//                             Rent information
//                         </Typography>
//                         <Box sx={{ flex: 1, pr: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Rent Paid
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.rentPaid ? 'Yes' : 'No'}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Total Rent Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.totalRentPayments}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Completed Rent Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.completedRentPayments}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Pending Rent Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.pendingRentPayments}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Late Rent Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.lateRentPayments}
//                                 </FormHelperText>
//                             </Box>
//                         </Box>
//                         <Divider />
//                         <Typography level="title-md" fontWeight="bold" sx={{ mt: 2 }}>
//                             Bill information
//                         </Typography>
//                         <Box sx={{ flex: 1, pr: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Bills Paid
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.billsPaid ? 'Yes' : 'No'}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Total Bill Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.totalBillPayments}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Completed Bill Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.completedBillPayments}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Pending Bill Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.pendingBillPayments}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Late Bill Payments
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.lateBillPayments}
//                                 </FormHelperText>
//                             </Box>
//                         </Box>
//                         <Divider />
//                         <Typography level="title-md" fontWeight="bold" sx={{ mt: 2 }}>
//                             Task information
//                         </Typography>
//                         <Box sx={{ flex: 1, pr: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Total Tasks
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.totalTasks}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Completed Tasks
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.completedTasks}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Pending Tasks
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.pendingTasks}
//                                 </FormHelperText>
//                             </Box>
//                             <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//                                 <FormLabel sx={{ typography: 'title-sm' }}>
//                                     Overdue Tasks
//                                 </FormLabel>
//                                 <FormHelperText sx={{ typography: 'body-sm' }}>
//                                     {selectedTenant?.overdueTasks}
//                                 </FormHelperText>
//                             </Box>
//                         </Box>
//                     </DialogContent>
//                     <Stack
//                         direction="row"
//                         justifyContent="space-between"
//                         useFlexGap
//                         spacing={1}
//                     >
//                         {!isEditing ? '' :
//                             <Button
//                                 variant="outlined"
//                                 color="neutral"
//                                 onClick={handleBackButtonClick}>
//                                 Back
//                             </Button>}
//                         {!isEditing ? <Button color="warning" variant="soft" sx={{ marginLeft: 'auto' }} onClick={handleEditButtonClick}>Edit tenant info</Button> : <Button onClick={finalSubmit}>
//                             {isLoading ? <CircularProgress /> : "Save Changes"}
//                         </Button>}
//                     </Stack>
//                 </Sheet>
//             </Drawer>
//         </React.Fragment >
//     );
// }