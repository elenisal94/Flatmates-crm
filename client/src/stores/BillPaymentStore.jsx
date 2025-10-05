import { makeAutoObservable } from "mobx";
import { apiRequest } from "../helpers/apiRequest";

class BillPaymentStore {
  billPayments = [];
  selectedBillPayment = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
    this.fetchBillPayments();
  }

  async fetchBillPayments() {
    const response = await apiRequest("/bill-payments", "GET");
    if (response) {
      this.billPayments = response;
    }
  }

  async viewBillPayment(billPayment) {
    const response = await apiRequest(
      `/bill-payments/${billPayment._id}`,
      "GET"
    );
    if (response) {
      this.selectedBillPayment = response;
      this.mode = "view";
      this.open = true;
    }
  }

  async editBillPayment(billPayment) {
    const response = await apiRequest(
      `/bill-payments/${billPayment._id}`,
      "GET"
    );
    if (response) {
      this.selectedBillPayment = response;
      this.mode = "edit";
      this.open = true;
    }
  }

  async deleteBillPayment(billPayment) {
    const response = await apiRequest(
      `/bill-payments/${billPayment._id}`,
      "DELETE"
    );
    if (response !== null) {
      this.billPayments = this.billPayments.filter(
        (prevBillPayment) => prevBillPayment._id !== billPayment._id
      );
      this.refreshInfo = true;
    }
  }

  setupNewBillPayment() {
    this.selectedBillPayment = null;
    this.mode = "add";
    this.open = true;
  }

  setOpen() {
    this.open = true;
  }

  handleClose() {
    this.open = false;
    this.selectedBillPayment = null;
    this.mode = "add";
  }

  async saveBillPayment(billPaymentData) {
    if (this.selectedBillPayment) {
      const response = await apiRequest(
        `/bill-payments/${this.selectedBillPayment._id}`,
        "PUT",
        billPaymentData
      );
      if (response) {
        this.billPayments = this.billPayments.map((billPayment) =>
          billPayment._id === this.selectedBillPayment._id
            ? response
            : billPayment
        );
      }
    } else {
      const response = await apiRequest(
        "/bill-payments",
        "POST",
        billPaymentData
      );
      if (response) {
        this.billPayments = [...this.billPayments, response];
      }
    }

    this.refreshInfo = true;
    this.handleClose();
    await this.fetchBillPayments();
  }
}

export default new BillPaymentStore();
