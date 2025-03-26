import { makeAutoObservable } from "mobx";
import axios from "axios";

class BillPaymentStore {
  billPayments = [];
  selectedBillPayment = null;
  open = false;
  refreshInfo = false;
  mode = "add";

  constructor() {
    makeAutoObservable(this);
    axios.defaults.baseURL = "http://localhost:5001";
    axios.defaults.withCredentials = true;
    this.fetchBillPayments();
  }

  async fetchBillPayments() {
    try {
      const response = await axios.get("/api/bill-payments");
      this.billPayments = response.data;
    } catch (error) {
      console.error("Error fetching bill payments:", error);
    }
  }

  async viewBillPayment(billPayment) {
    try {
      const response = await axios.get(`/api/bill-payments/${billPayment._id}`);
      this.selectedBillPayment = response.data;
      this.mode = "view";
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch bill payment details:", error);
    }
  }

  async editBillPayment(billPayment) {
    try {
      const response = await axios.get(`/api/bill-payments/${billPayment._id}`);
      this.selectedBillPayment = response.data;
      this.mode = "edit";
      this.open = true;
    } catch (error) {
      console.error("Failed to fetch bill payment details for editing:", error);
    }
  }

  async deleteBillPayment(billPayment) {
    try {
      const response = await axios.delete(
        `/api/bill-payments/${billPayment._id}`
      );
      if (response.status === 200) {
        this.billPayments = this.billPayments.filter(
          (prevBillPayment) => prevBillPayment._id !== billPayment._id
        );
        this.refreshInfo = true;
      } else {
        console.warn(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to delete bill payment:", error.message || error);
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
    try {
      if (this.selectedBillPayment) {
        const response = await axios.put(
          `/api/bill-payments/${this.selectedBillPayment._id}`,
          billPaymentData
        );
        this.billPayments = this.billPayments.map((billPayment) =>
          billPayment._id === this.selectedBillPayment._id
            ? response.data
            : billPayment
        );
      } else {
        const response = await axios.post(
          "/api/bill-payments",
          billPaymentData
        );
        this.billPayments = [...this.billPayments, response.data];
      }

      this.refreshInfo = true;
      this.handleClose();
      await this.fetchBillPayments();
    } catch (error) {
      console.error("Failed to save bill payment:", error);
    }
  }
}

const billPaymentStore = new BillPaymentStore();
export default billPaymentStore;
