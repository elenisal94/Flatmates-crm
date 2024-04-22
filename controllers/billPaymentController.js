const { BillPayment, Tenant } = require('../schema.js');

exports.getAllBillPayments = async (req, res) => {
    try {
        const billPayments = await BillPayment.find();
        res.json(billPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createBillPayment = async (req, res) => {
    try {
        const newBillPayment = new BillPayment(req.body);
        await newBillPayment.save();

        const billPayments = await BillPayment.find({ tenant: newBillPayment.tenant });

        const totalBillPayments = billPayments.length;
        const completedBillPayments = billPayments.filter(payment => payment.datePaid).length;
        const pendingBillPayments = totalBillPayments - completedBillPayments;
        const lateBillPayments = billPayments.filter(payment => payment.dueDate < payment.datePaid).length;

        const allPaidBeforeToday = billPayments.every(billPayment => billPayment.datePaid < new Date());
        await Tenant.findByIdAndUpdate(newBillPayment.tenant, {
            billsPaid: allPaidBeforeToday,
            totalBillPayments,
            completedBillPayments,
            pendingBillPayments,
            lateBillPayments
        });

        res.status(201).json(newBillPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
