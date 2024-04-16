const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { Tenant, Task, RentPayment, BillPayment } = require('./schema.js');

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

// Tenant routes
app.get('/api/tenants', async (req, res) => {
    try {
        const tenants = await Tenant.find();
        res.json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/tenants', async (req, res) => {
    try {
        const newTenant = new Tenant(req.body);
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.put('/api/tenants/:id', async (req, res) => {
    const tenantId = req.params.id;
    try {
        const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, req.body, { new: true });
        res.json(updatedTenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/api/tenants/:id', async (req, res) => {
    const tenantId = req.params.id;
    try {
        const deletedTenant = await Tenant.findByIdAndDelete(tenantId);
        if (!deletedTenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Task routes, RentPayment routes, BillPayment routes can be similarly defined

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


app.post('/api/tasks', async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/rent-payments', async (req, res) => {
    try {
        const rentPayments = await RentPayment.find();
        res.json(rentPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/rent-payments', async (req, res) => {
    try {
        const newRentPayment = new RentPayment(req.body);
        await newRentPayment.save();
        res.status(201).json(newRentPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/api/bill-payments', async (req, res) => {
    try {
        const billPayments = await BillPayment.find();
        res.json(billPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.post('/api/bill-payments', async (req, res) => {
    try {
        const newBillPayment = new BillPayment(req.body);
        await newBillPayment.save();
        res.status(201).json(newBillPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
