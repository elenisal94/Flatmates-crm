const express = require("express");
const router = express.Router();

const {
  createTask,
  updateTask,
  getAllTasks,
  getSpecificTask,
  deleteTask,
} = require("../controllers/taskController");

const checkJwt = require("../middleware/auth");
const {
  createTaskValidation,
  updateTaskValidation,
} = require("../middleware/taskValidator");

router.get("/", checkJwt, getAllTasks);

router.post("/", checkJwt, createTaskValidation, createTask);

router.get("/:id", checkJwt, getSpecificTask);

router.put("/:id", checkJwt, updateTaskValidation, updateTask);

router.delete("/:id", checkJwt, deleteTask);

module.exports = router;
