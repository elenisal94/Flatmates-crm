const mongoose = require("mongoose");
require("dotenv").config();
const { Task, Tenant, RentPayment, BillPayment } = require("./schema.js");
const ObjectId = mongoose.Types.ObjectId;

let isConnected = false;

async function connectToDatabase() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
    });
    console.log("MongoDB connected");
    isConnected = true;
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

async function updateTenantStats(userId) {
  try {
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: new ObjectId(userId) } },
      {
        $group: {
          _id: "$assignedTo",
          totalTasks: { $sum: 1 },
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$completed", true] }, 1, 0] },
          },
          pendingTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$completed", false] },
                    { $gte: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$completed", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const rentStats = await RentPayment.aggregate([
      { $match: { tenant: new ObjectId(userId) } },
      {
        $group: {
          _id: "$tenant",
          totalRentPayments: { $sum: 1 },
          completedRentPayments: {
            $sum: { $cond: [{ $eq: ["$paymentMade", true] }, 1, 0] },
          },
          pendingRentPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $gte: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          lateRentPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const billStats = await BillPayment.aggregate([
      { $match: { tenant: new ObjectId(userId) } },
      {
        $group: {
          _id: "$tenant",
          totalBillPayments: { $sum: 1 },
          completedBillPayments: {
            $sum: { $cond: [{ $eq: ["$paymentMade", true] }, 1, 0] },
          },
          pendingBillPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $gte: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          lateBillPayments: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$paymentMade", false] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = {
      ...(taskStats[0] || {
        totalTasks: 0,
        completedTasks: 0,
        pendingTasks: 0,
        overdueTasks: 0,
      }),
      ...(rentStats[0] || {
        totalRentPayments: 0,
        completedRentPayments: 0,
        pendingRentPayments: 0,
        lateRentPayments: 0,
      }),
      ...(billStats[0] || {
        totalBillPayments: 0,
        completedBillPayments: 0,
        pendingBillPayments: 0,
        lateBillPayments: 0,
      }),
    };

    const updatedTenant = await Tenant.findByIdAndUpdate(
      userId,
      { $set: stats },
      { new: true }
    );

    // console.log(`Updated stats for user ${userId}:`, stats);

    return stats;
  } catch (error) {
    console.error("Error updating tenant stats:", error);
    return null;
  }
}

exports.handler = async (event) => {
  // console.log("Stats Lambda triggered with event:", event);

  const userId = event.userId || (event.body && JSON.parse(event.body).userId);

  if (!userId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Missing userId" }),
    };
  }

  try {
    await connectToDatabase();
    const stats = await updateTenantStats(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Tenant stats updated", stats }),
    };
  } catch (error) {
    console.error("Error in stats Lambda:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Error updating tenant stats" }),
    };
  }
};
