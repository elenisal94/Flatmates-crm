const { Task, Tenant } = require('../schema.js');

exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};


exports.createTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        const findAllTasks = await Task.find({ assignedTo: newTask.assignedTo });
        const totalTasks = findAllTasks.length;
        const completedTasks = findAllTasks.filter(task => task.completed).length;
        const pendingTasks = findAllTasks.filter(task => !task.completed).length;
        const overdueTasks = findAllTasks.filter(task => !task.completed && task.dueDate < new Date()).length;
        await Tenant.findByIdAndUpdate(newTask.assignedTo, {
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
        });
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// router.put('/tasks/:id', async (req, res) => {
//     const taskId = req.params.id;
//     try {
//         const updatedTask = await Task.findByIdAndUpdate(taskId, req.body, { new: true });
//         res.json(updatedTask);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// });
