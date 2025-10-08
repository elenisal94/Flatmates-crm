import { makeAutoObservable } from "mobx";
import { apiRequest } from "../helpers/apiRequest";

class TenantStore {
  tenants = [];
  selectedTenant = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
  }

  async fetchTenants() {
    try {
      const data = await apiRequest("/api/tenants", "GET");
      this.tenants = Array.isArray(data) ? data : Object.values(data);
      return this.tenants;
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  }

  async viewTenant(tenant) {
    try {
      const data = await apiRequest(`/api/tenants/${tenant._id}`, "GET");
      this.selectedTenant = data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details:", error);
    }
  }

  async editTenant(tenant) {
    try {
      const data = await apiRequest(`/api/tenants/${tenant._id}`, "GET");
      this.selectedTenant = data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details for editing:", error);
    }
  }

  async deleteTenant(tenant) {
    try {
      const data = await apiRequest(`/api/tenants/${tenant._id}`, "DELETE");
      this.tenants = this.tenants.filter(
        (prevTenant) => prevTenant._id !== tenant._id
      );
      this.refreshInfo = true;
    } catch (error) {
      console.error("Failed to delete tenant:", error);
    }
  }

  setupNewTenant() {
    this.selectedTenant = null;
    this.mode = "add";
    this.open = true;
  }

  editTenantMode(tenant) {
    this.selectedTenant = tenant;
    this.mode = "edit";
    this.open = true;
  }

  viewTenantMode(tenant) {
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
        const updatedTenant = await apiRequest(
          `/api/tenants/${this.selectedTenant._id}`,
          "PUT",
          tenantData
        );
        this.tenants = this.tenants.map((tenant) =>
          tenant._id === this.selectedTenant._id ? updatedTenant : tenant
        );
      } else {
        const newTenant = await apiRequest("/api/tenants", "POST", tenantData);
        this.tenants = [...this.tenants, newTenant];
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
