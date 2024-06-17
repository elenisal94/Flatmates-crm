const request = require('supertest');
const express = require('express');
const tenantRoutes = require('./routes/tenantRoutes'); // Import your tenantRoutes module

// Create a mock Express app
const app = express();
app.use(express.json()); // If your routes use JSON parsing middleware

// Use your tenantRoutes middleware
app.use('/api/tenants', tenantRoutes);

describe('Test /api/tenants route', () => {
    test('It should respond with status 200', async () => {
        // Send a GET request to /api/tenants
        const response = await request(app).get('/api/tenants');

        // Verify that the response status is 200
        expect(response.statusCode).toBe(200);
    }, 10000);
});
