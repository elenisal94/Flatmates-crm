import { makeAutoObservable } from "mobx";
import axios from "axios";

class TenantStore {
  tenants = [];
  selectedTenant = null;
  open = false;
  refreshInfo = false;

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL = "http://localhost:5001";
    axios.defaults.withCredentials = true;
    this.fetchTenants(); // Fetch data on store initialization
  }

  // 🔹 Fetch all tenants
  async fetchTenants() {
    try {
      const response = await axios.get("/api/tenants");
      this.tenants = response.data;
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  }

  // 🔹 View a single tenant
  async viewTenant(tenant) {
    try {
      const response = await axios.get(`/api/tenants/${tenant._id}`);
      this.selectedTenant = response.data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details:", error);
    }
  }

  // 🔹 Edit a tenant
  async editTenant(tenant) {
    try {
      const response = await axios.get(`/api/tenants/${tenant._id}`);
      this.selectedTenant = response.data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details for editing:", error);
    }
  }

  // 🔹 Delete a tenant
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

  // 🔹 Add a new tenant
  setupNewTenant() {
    this.selectedTenant = null;
    this.open = true;
  }

  // 🔹 Close modal/drawer
  handleClose() {
    this.open = false;
    this.selectedTenant = null;
  }

  // 🔹 Save (Add/Edit) a tenant
  async saveTenant(tenantData) {
    console.log("saveTenant ran");
    try {
      if (this.selectedTenant) {
        // Edit the tenant if selectedTenant exists
        const response = await axios.put(
          `/api/tenants/${this.selectedTenant._id}`,
          tenantData
        );
        this.tenants = this.tenants.map((tenant) =>
          tenant._id === this.selectedTenant._id ? response.data : tenant
        );
      } else {
        // Add a new tenant if no selectedTenant
        const response = await axios.post("/api/tenants", tenantData);
        console.log("Tenant Added:", response.data);
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
