import { makeAutoObservable } from "mobx";
import axios from "axios";

class TaskStore {
  tasks = [];
  selectedTask = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL = "http://localhost:5001";
    axios.defaults.withCredentials = true;
    this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const response = await axios.get("/api/tasks");
      this.tasks = response.data;
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async viewTask(task) {
    try {
      const response = await axios.get(`/api/tasks/${task._id}`);
      this.selectedTask = response.data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch task details:", error);
    }
  }

  async editTask(task) {
    try {
      const response = await axios.get(`/api/tasks/${task._id}`);
      this.selectedTask = response.data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch task details for editing:", error);
    }
  }

  async deleteTask(task) {
    try {
      const response = await axios.delete(`/api/tasks/${task._id}`);
      if (response.status === 200) {
        this.tasks = this.tasks.filter((prevTask) => prevTask._id !== task._id);
        this.refreshInfo = true;
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete task:", error.message || error);
    }
  }

  setupNewTask() {
    this.selectedTask = null;
    this.mode = "add";
    this.open = true;
  }

  editTask(task) {
    this.selectedTask = task;
    this.mode = "edit";
    this.open = true;
  }

  viewTask(task) {
    this.selectedTask = task;
    this.mode = "view";
    this.open = true;
  }

  setOpen() {
    this.open = true;
  }

  handleClose() {
    this.open = false;
    this.selectedTask = null;
    this.mode = "add";
  }

  async saveTask(taskData) {
    try {
      if (this.selectedTask) {
        const response = await axios.put(
          `/api/tasks/${this.selectedTask._id}`,
          taskData
        );
        this.tasks = this.tasks.map((task) =>
          task._id === this.selectedTask._id ? response.data : task
        );
      } else {
        const response = await axios.post("/api/tasks", taskData);
        this.tasks = [...this.tasks, response.data];
      }

      this.refreshInfo = true;
      this.handleClose();
      await this.fetchTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
    }
  }
}

export default new TaskStore();
