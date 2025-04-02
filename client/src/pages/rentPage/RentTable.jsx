import React, { useState, useEffect } from "react";
import Box from "@mui/joy/Box";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Select from "@mui/joy/Select";
import Sheet from "@mui/joy/Sheet";
import Checkbox from "@mui/joy/Checkbox";
import IconButton from "@mui/joy/IconButton";
import MenuItem from "@mui/joy/MenuItem";
import SearchIcon from "@mui/icons-material/Search";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import ClearIcon from "@mui/icons-material/Clear";
import Pending from "@mui/icons-material/Pending";
import ErrorOutline from "@mui/icons-material/ErrorOutline";
import { ListItemText } from "@mui/material";
import "../tableUtils/TableStyles.css";
import StatusFilter from "../tableUtils/StatusFilter";
import SearchInput from "../tableUtils/SearchInput";
import FiltersModal from "../tableUtils/FiltersModal";
import RentCells from "./RentCells";
import Pagination from "../tableUtils/Pagination";
import TenantStore from "../../stores/TenantStore";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) return -1;
  if (b[orderBy] > a[orderBy]) return 1;
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function RentTable({
  rentPayments,
  onProfileClick,
  handleEditClick,
  handleDelete,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [order, setOrder] = useState("desc");
  const [selected, setSelected] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rentStatusFilter, setRentStatusFilter] = useState([]);
  const itemsPerPage = 20;
  const [columnVisibility, setColumnVisibility] = useState({
    tenant: true,
    amount: true,
    dueDate: true,
    datePaid: true,
    paymentMade: true,
    rentStatus: true,
  });

  const columns = [
    { id: "tenant", label: "Tenant" },
    { id: "amount", label: "Amount" },
    { id: "dueDate", label: "Due Date" },
    { id: "datePaid", label: "Date Paid" },
    { id: "paymentMade", label: "Payment Made" },
  ];

  const rentOptions = [
    { value: "paid", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "pending", label: "Pending" },
  ];

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const clearStatusFilter = (setStatusFilter) => {
    setStatusFilter([]);
    setCurrentPage(1);
  };

  const getRentStatus = (rent) => {
    if (rent.paymentMade) {
      return "Paid";
    } else if (!rent?.paymentMade && new Date(rent.dueDate) < new Date()) {
      return "Overdue";
    } else if (!rent?.paymentMade && new Date(rent.dueDate) > new Date()) {
      return "Pending";
    } else {
      return "No status detected";
    }
  };

  useEffect(() => {
    TenantStore.fetchTenants();
  }, []);

  const getFullName = (tenantId) => {
    const tenants = TenantStore.tenants;
    if (!tenantId) return "Unassigned";

    const tenant = tenants.find(
      (t) => t?._id?.toString() === tenantId?.toString()
    );

    return tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unassigned";
  };

  const filteredRent = (rentPayments || []).filter((rent) => {
    const tenantName = getFullName(rent?.tenant?._id);
    const amount = `${rent?.amount ?? ""}`.toLowerCase();
    const dueDate = `${rent?.dueDate ?? ""}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      tenantName.toLowerCase().includes(query) ||
      amount.includes(query) ||
      dueDate.includes(query);
    const rentStatus = getRentStatus(rent);
    const matchesRentStatus =
      !rentStatusFilter.length ||
      rentStatusFilter.includes(rentStatus.toLowerCase());
    return matchesQuery && matchesRentStatus;
  });

  const totalItems = filteredRent.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handleStatusChange = (type) => (event, newValue) => {
    const updatedValue = Array.isArray(newValue) ? newValue : [newValue];
    switch (type) {
      case "rent":
        setRentStatusFilter(updatedValue);
        break;
      default:
        break;
    }
    setCurrentPage(1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const paginatedRent = stableSort(
    filteredRent,
    getComparator(order, "id")
  ).slice(startIndex, endIndex);

  const getPaymentChipColor = (status) => {
    switch (status) {
      case "Paid":
        return "success";
      case "Overdue":
        return "danger";
      case "Pending":
        return "warning";
      default:
        return "neutral";
    }
  };

  const getPaymentStartDecorator = (status) => {
    switch (status) {
      case "Paid":
        return <CheckRoundedIcon />;
      case "Overdue":
        return <ErrorOutline />;
      case "Pending":
        return <Pending />;
      default:
        return null;
    }
  };

  const handleColumnToggle = (columnId) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [columnId]: !prevState[columnId],
    }));
  };

  const renderFilters = () => (
    <>
      <StatusFilter
        label="Rent status"
        options={rentOptions}
        filter={rentStatusFilter}
        onChange={handleStatusChange("rent")}
        clearFilter={() => clearStatusFilter(setRentStatusFilter)}
      />
      <FormControl size="sm">
        <FormLabel>Visible columns</FormLabel>
        <Select
          multiple
          placeholder="See Columns"
          value={Object.keys(columnVisibility).filter(
            (columnId) => columnVisibility[columnId]
          )}
          renderValue={(selected) => selected.join(", ")}
        >
          {columns.map((column) => (
            <MenuItem key={column.id} value={column.id}>
              <Checkbox
                overlay
                checked={columnVisibility[column.id]}
                onChange={() => handleColumnToggle(column.id)}
              />
              <ListItemText primary={column.label} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </>
  );

  return (
    <>
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{
          display: { xs: "flex", sm: "none" },
          my: 1,
          gap: 1,
        }}
      >
        <SearchInput
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleClearSearch={handleClearSearch}
        />
        <FiltersModal
          open={open}
          setOpen={setOpen}
          renderFilters={renderFilters}
        />
      </Sheet>
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: "sm",
          py: 2,
          display: { xs: "none", sm: "flex" },
          flexWrap: "wrap",
          gap: 1.5,
          "& > *": {
            minWidth: { xs: "120px", md: "160px" },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Search rents</FormLabel>
          <Input
            size="sm"
            placeholder="Search"
            startDecorator={<SearchIcon />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            endDecorator={
              searchQuery && (
                <IconButton onClick={handleClearSearch}>
                  <ClearIcon />
                </IconButton>
              )
            }
          />
        </FormControl>
        {renderFilters()}
      </Box>
      <Sheet
        className="RentTableContainer"
        variant="outlined"
        sx={{
          "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
          "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
          display: "block",
          width: "100%",
          borderRadius: "sm",
          flexShrink: 1,
          overflowX: "auto",
          minHeight: 0,
          "@media (max-width: 600px)": {
            display: "block",
          },
        }}
      >
        <RentCells
          rentPayments={rentPayments}
          getFullName={getFullName}
          selected={selected}
          setSelected={setSelected}
          columnVisibility={columnVisibility}
          onProfileClick={onProfileClick}
          handleEditClick={handleEditClick}
          handleDelete={handleDelete}
          stableSort={stableSort}
          order={order}
          setOrder={setOrder}
          paginatedRent={paginatedRent}
          getRentStatus={getRentStatus}
          getPaymentStartDecorator={getPaymentStartDecorator}
          getPaymentChipColor={getPaymentChipColor}
          getComparator={getComparator}
        />
      </Sheet>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handlePreviousPage={handlePreviousPage}
        handleNextPage={handleNextPage}
        startIndex={startIndex}
        endIndex={endIndex}
        totalItems={totalItems}
      />
    </>
  );
}
