import { makeAutoObservable } from "mobx";
import { apiRequest } from "../helpers/apiRequest";

class TaskStore {
  tasks = [];
  selectedTask = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTasks() {
    const response = await apiRequest("/api/tasks", "GET");
    if (response) {
      this.tasks = response;
    }
  }

  async viewTask(task) {
    const response = await apiRequest(`/api/tasks/${task._id}`, "GET");
    if (response) {
      this.selectedTask = response;
      this.open = true;
      this.mode = "view";
    }
  }

  async editTask(task) {
    const response = await apiRequest(`/api/tasks/${task._id}`, "GET");
    if (response) {
      this.selectedTask = response;
      this.open = true;
      this.mode = "edit";
    }
  }

  async deleteTask(task) {
    const response = await apiRequest(`/api/tasks/${task._id}`, "DELETE");
    if (response !== null) {
      this.tasks = this.tasks.filter((prevTask) => prevTask._id !== task._id);
      this.refreshInfo = true;
    }
  }

  setupNewTask() {
    this.selectedTask = null;
    this.mode = "add";
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
    const formattedTaskData = { ...taskData };

    if (this.selectedTask) {
      const response = await apiRequest(
        `/api/tasks/${this.selectedTask._id}`,
        "PUT",
        formattedTaskData
      );
      if (response) {
        this.tasks = this.tasks.map((task) =>
          task._id === this.selectedTask._id ? response : task
        );
      }
    } else {
      const response = await apiRequest(
        "/api/tasks",
        "POST",
        formattedTaskData
      );
      if (response) {
        this.tasks = [...this.tasks, response];
      }
    }

    this.refreshInfo = true;
    this.handleClose();
    await this.fetchTasks();
  }
}

export default new TaskStore();
