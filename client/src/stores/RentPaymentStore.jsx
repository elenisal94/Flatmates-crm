import { makeAutoObservable } from "mobx";
import axios from "axios";

class RentPaymentStore {
  rentPayments = [];
  selectedRentPayment = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL =
      process.env.REACT_APP_API_URL || "http://localhost:5001";
    axios.defaults.withCredentials = true;
    this.fetchRentPayments();
  }

  async fetchRentPayments() {
    try {
      const response = await axios.get("/api/rent-payments");
      this.rentPayments = response.data;
    } catch (error) {
      console.error("Error fetching rent payments:", error);
    }
  }

  async viewRentPayment(rentPayment) {
    try {
      const response = await axios.get(`/api/rent-payments/${rentPayment._id}`);
      this.selectedRentPayment = response.data;
      this.mode = "view";
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch rent payment details:", error);
    }
  }

  async editRentPayment(rentPayment) {
    try {
      const response = await axios.get(`/api/rent-payments/${rentPayment._id}`);
      this.selectedRentPayment = response.data;
      this.mode = "edit";
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch rent payment details for editing:", error);
    }
  }

  async deleteRentPayment(rentPayment) {
    try {
      const response = await axios.delete(
        `/api/rent-payments/${rentPayment._id}`
      );
      if (response.status === 200) {
        this.rentPayments = this.rentPayments.filter(
          (prevRentPayment) => prevRentPayment._id !== rentPayment._id
        );
        this.refreshInfo = true;
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete rent payment:", error.message || error);
    }
  }

  setupNewRentPayment() {
    this.selectedRentPayment = null;
    this.mode = "add";
    this.open = true;
  }

  setOpen() {
    this.open = true;
  }

  handleClose() {
    this.open = false;
    this.selectedRentPayment = null;
    this.mode = "add";
  }

  async saveRentPayment(rentPaymentData) {
    try {
      if (this.selectedRentPayment) {
        const response = await axios.put(
          `/api/rent-payments/${this.selectedRentPayment._id}`,
          rentPaymentData
        );
        this.rentPayments = this.rentPayments.map((rentPayment) =>
          rentPayment._id === this.selectedRentPayment._id
            ? response.data
            : rentPayment
        );
      } else {
        const response = await axios.post(
          "/api/rent-payments",
          rentPaymentData
        );
        this.rentPayments = [...this.rentPayments, response.data];
      }

      this.refreshInfo = true;
      this.handleClose();
      await this.fetchRentPayments();
    } catch (error) {
      console.error("Failed to save rent payment:", error);
    }
  }
}

const rentPaymentStore = new RentPaymentStore();
export default rentPaymentStore;
