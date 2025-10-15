const { Task, Tenant } = require("../schema.js");
const { SQSClient, SendMessageCommand } = require("@aws-sdk/client-sqs");

const sqs = new SQSClient({ region: process.env.AWS_REGION });
const STATS_QUEUE_URL = process.env.STATS_QUEUE_URL;

// Helper to send a message to the stats update queue
async function enqueueTenantStatsUpdate(tenantId, userId) {
  try {
    const message = {
      tenantId,
      userId,
      timestamp: new Date().toISOString(),
      source: "taskController",
    };

    await sqs.send(
      new SendMessageCommand({
        QueueUrl: STATS_QUEUE_URL,
        MessageBody: JSON.stringify(message),
      })
    );

    console.log(
      `📬 Sent stats update for tenant ${tenantId} from taskController`
    );
  } catch (err) {
    console.error("Failed to enqueue tenant stats update:", err);
  }
}

// Get all tasks for the current user
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.auth.sub });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get a specific task
exports.getSpecificTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const task = await Task.findOne({ _id: taskId, userId: req.auth.sub });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const newTask = new Task({ ...req.body, userId: req.auth.sub });
    await newTask.save();

    if (newTask.assignedTo) {
      await enqueueTenantStatsUpdate(newTask.assignedTo, req.auth.sub);
    }

    res.status(201).json(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, userId: req.auth.sub },
      req.body,
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (updatedTask.assignedTo) {
      await enqueueTenantStatsUpdate(updatedTask.assignedTo, req.auth.sub);
    }

    res.json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: taskId,
      userId: req.auth.sub,
    });

    if (!deletedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (deletedTask.assignedTo) {
      await enqueueTenantStatsUpdate(deletedTask.assignedTo, req.auth.sub);
    }

    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
