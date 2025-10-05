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
    this.fetchTenants();
  }

  async fetchTenants() {
    try {
      const data = await apiRequest("get", "/api/tenants");
      this.tenants = Array.isArray(data) ? data : Object.values(data);
      return this.tenants;
    } catch (error) {
      console.error("Error fetching tenants:", error);
      return [];
    }
  }

  async viewTenant(tenant) {
    try {
      const data = await apiRequest("get", `/api/tenants/${tenant._id}`);
      this.selectedTenant = data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details:", error);
    }
  }

  async editTenant(tenant) {
    try {
      const data = await apiRequest("get", `/api/tenants/${tenant._id}`);
      this.selectedTenant = data;
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch tenant details for editing:", error);
    }
  }

  async deleteTenant(tenant) {
    try {
      const data = await apiRequest("delete", `/api/tenants/${tenant._id}`);
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
          "put",
          `/api/tenants/${this.selectedTenant._id}`,
          tenantData
        );
        this.tenants = this.tenants.map((tenant) =>
          tenant._id === this.selectedTenant._id ? updatedTenant : tenant
        );
      } else {
        const newTenant = await apiRequest("post", "/api/tenants", tenantData);
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
