import { makeAutoObservable } from "mobx";
import axios from "axios";

class TenantStore {
  tenants = [];
  selectedTenant = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL =
      process.env.REACT_APP_API_URL || "http://localhost:5001";
    axios.defaults.withCredentials = true;
    this.fetchTenants();
  }

  async fetchTenants() {
    try {
      const response = await axios.get("/api/tenants");
      this.tenants = response.data;
      return Array.isArray(response.data)
        ? response.data
        : Object.values(response.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  }

  async viewTenant(tenant) {
    try {
      const response = await axios.get(`/api/tenants/${tenant._id}`);
      this.selectedTenant = response.data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details:", error);
    }
  }

  async editTenant(tenant) {
    try {
      const response = await axios.get(`/api/tenants/${tenant._id}`);
      this.selectedTenant = response.data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details for editing:", error);
    }
  }

  async deleteTenant(tenant) {
    try {
      const response = await axios.delete(`/api/tenants/${tenant._id}`);
      if (response.status === 200) {
        this.tenants = this.tenants.filter(
          (prevTenant) => prevTenant._id !== tenant._id
        );
        this.refreshInfo = true;
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete tenant:", error.message || error);
    }
  }

  setupNewTenant() {
    this.selectedTenant = null;
    this.mode = "add";
    this.open = true;
  }

  editTenant(tenant) {
    this.selectedTenant = tenant;
    this.mode = "edit";
    this.open = true;
  }

  viewTenant(tenant) {
    this.selectedTenant = tenant;
    this.mode = "view";
    this.open = true;
  }

  setOpen() {
    this.open = true;
  }

  handleClose() {
    this.open = false;
    this.selectedTenant = null;
    this.mode = "add";
  }

  async saveTenant(tenantData) {
    try {
      if (this.selectedTenant) {
        const response = await axios.put(
          `/api/tenants/${this.selectedTenant._id}`,
          tenantData
        );
        this.tenants = this.tenants.map((tenant) =>
          tenant._id === this.selectedTenant._id ? response.data : tenant
        );
      } else {
        const response = await axios.post("/api/tenants", tenantData);
        this.tenants = [...this.tenants, response.data];
      }

      this.refreshInfo = true;
      this.handleClose();
      await this.fetchTenants();
    } catch (error) {
      console.error("Failed to save tenant:", error);
    }
  }
}

export default new TenantStore();
