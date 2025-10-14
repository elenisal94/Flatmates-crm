const mongoose = require("mongoose");
require("dotenv").config();
const { Tenant } = require("./schema.js");
const { updateTenantStats } = require("./tenantStatsHelper");

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
    // console.log("MongoDB connected");
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

exports.handler = async (event) => {
  // console.log("Lambda event:", event);

  try {
    await connectToDatabase();

    const tenants = await Tenant.find();
    // console.log(`Found ${tenants.length} tenants`);

    for (const tenant of tenants) {
      try {
        await updateTenantStats(tenant._id);
        // console.log(`Updated stats for tenant ${tenant._id}`);
      } catch (err) {
        console.error(`Failed to update stats for tenant ${tenant._id}`, err);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Tenant stats updated successfully" }),
    };
  } catch (err) {
    console.error("Error in Lambda:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error handling tenant stats" }),
    };
  }
};
