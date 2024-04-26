const { Tenant } = require('../schema.js');

exports.getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.find();
        res.json(tenants);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getSpecificTenant = async (req, res) => {
    const tenantId = req.params.id;
    try {
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(tenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.createTenant = async (req, res) => {
    try {
        const newTenant = new Tenant(req.body);
        await newTenant.save();
        res.status(201).json(newTenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateTenant = async (req, res) => {
    const tenantId = req.params.id;
    try {
        const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, req.body, { new: true });
        res.json(updatedTenant);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteTenant = async (req, res) => {
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
};