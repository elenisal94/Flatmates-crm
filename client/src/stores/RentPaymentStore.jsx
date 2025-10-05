import { makeAutoObservable } from "mobx";
import { apiRequest } from "../helpers/apiRequest";

class RentPaymentStore {
  rentPayments = [];
  selectedRentPayment = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
    this.fetchRentPayments();
  }

  async fetchRentPayments() {
    const response = await apiRequest("/rent-payments", "GET");
    if (response) {
      this.rentPayments = response;
    }
  }

  async viewRentPayment(rentPayment) {
    const response = await apiRequest(
      `/rent-payments/${rentPayment._id}`,
      "GET"
    );
    if (response) {
      this.selectedRentPayment = response;
      this.mode = "view";
      this.open = true;
    }
  }

  async editRentPayment(rentPayment) {
    const response = await apiRequest(
      `/rent-payments/${rentPayment._id}`,
      "GET"
    );
    if (response) {
      this.selectedRentPayment = response;
      this.mode = "edit";
      this.open = true;
    }
  }

  async deleteRentPayment(rentPayment) {
    const response = await apiRequest(
      `/rent-payments/${rentPayment._id}`,
      "DELETE"
    );
    if (response !== null) {
      this.rentPayments = this.rentPayments.filter(
        (prevRentPayment) => prevRentPayment._id !== rentPayment._id
      );
      this.refreshInfo = true;
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
    if (this.selectedRentPayment) {
      const response = await apiRequest(
        `/rent-payments/${this.selectedRentPayment._id}`,
        "PUT",
        rentPaymentData
      );
      if (response) {
        this.rentPayments = this.rentPayments.map((rentPayment) =>
          rentPayment._id === this.selectedRentPayment._id
            ? response
            : rentPayment
        );
      }
    } else {
      const response = await apiRequest(
        "/rent-payments",
        "POST",
        rentPaymentData
      );
      if (response) {
        this.rentPayments = [...this.rentPayments, response];
      }
    }

    this.refreshInfo = true;
    this.handleClose();
    await this.fetchRentPayments();
  }
}

export default new RentPaymentStore();
