const mongoose = require("mongoose");
require("dotenv").config();
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
  // console.log("SQS event received:", JSON.stringify(event, null, 2));

  try {
    await connectToDatabase();

    for (const record of event.Records) {
      try {
        const body = JSON.parse(record.body);

        if (!body.tenantId) {
          console.warn("No tenantId found in message:", record.body);
          continue;
        }

        // console.log(`Updating stats for tenant ${body.tenantId}`);
        await updateTenantStats(body.tenantId);
        // console.log(`Stats updated for tenant ${body.tenantId}`);
      } catch (err) {
        console.error("Error processing record:", record, err);
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Tenant stats updated successfully" }),
    };
  } catch (err) {
    console.error("Error in stats Lambda:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error handling tenant stats" }),
    };
  }
};
