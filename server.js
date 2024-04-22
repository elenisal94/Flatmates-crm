const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Tenant, Task, RentPayment, BillPayment } = require('./schema.js');
const tenantRoutes = require('./routes/tenantRoutes');
const taskRoutes = require('./routes/taskRoutes');
const rentPaymentRoutes = require('./routes/rentPaymentRoutes');
const billPaymentRoutes = require('./routes/billPaymentRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/crm-db', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

app.use('/api/tenants', tenantRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/rent-payments', rentPaymentRoutes);
app.use('/api/bill-payments', billPaymentRoutes);

// app.get('/api/rent-payments', async (req, res) => {
//     try {
//         const rentPayments = await RentPayment.find();
//         res.json(rentPayments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// app.post('/api/rent-payments', async (req, res) => {
//     try {
//         const newRentPayment = new RentPayment(req.body);
//         await newRentPayment.save();
//         res.status(201).json(newRentPayment);
//         const rentPayments = await RentPayment.find({ tenant: newRentPayment.tenant });
//         const allPaidBeforeToday = rentPayments.every(rentPayment => rentPayment.datePaid < new Date());
//         console.log('are all bills paid', allPaidBeforeToday)
//         if (allPaidBeforeToday) {
//             await Tenant.findByIdAndUpdate(newRentPayment.tenant, { rentPaid: true });
//         } else {
//             await Tenant.findByIdAndUpdate(newRentPayment.tenant, { rentPaid: false });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// app.get('/api/bill-payments', async (req, res) => {
//     try {
//         const billPayments = await BillPayment.find();
//         res.json(billPayments);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

// app.post('/api/bill-payments', async (req, res) => {
//     try {
//         const newBillPayment = new BillPayment(req.body);
//         await newBillPayment.save();
//         res.status(201).json(newBillPayment);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
