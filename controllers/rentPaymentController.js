const { RentPayment, Tenant } = require('../schema.js');

exports.getAllRentPayments = async (req, res) => {
    try {
        const rentPayments = await RentPayment.find();
        res.json(rentPayments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.createRentPayment = async (req, res) => {
    try {
        const newRentPayment = new RentPayment(req.body);
        await newRentPayment.save();
        const rentPayments = await RentPayment.find({ tenant: newRentPayment.tenant });

        const totalRentPayments = rentPayments.length;
        const completedRentPayments = rentPayments.filter(payment => payment.datePaid).length;
        const pendingRentPayments = totalRentPayments - completedRentPayments;
        const lateRentPayments = rentPayments.filter(payment => payment.dueDate < payment.datePaid).length;

        const allPaidBeforeToday = rentPayments.every(rentPayment => rentPayment.datePaid < new Date());
        await Tenant.findByIdAndUpdate(newRentPayment.tenant, {
            rentPaid: allPaidBeforeToday,
            totalRentPayments,
            completedRentPayments,
            pendingRentPayments,
            lateRentPayments
        });
        res.status(201).json(newRentPayment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
