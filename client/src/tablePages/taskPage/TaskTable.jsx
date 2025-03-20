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
import TaskCells from "./TaskCells";
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

export default function TaskTable({
  tasks,
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
  const [billStatusFilter, setBillStatusFilter] = useState([]);
  const [taskStatusFilter, setTaskStatusFilter] = useState([]);
  const itemsPerPage = 20;
  const [columnVisibility, setColumnVisibility] = useState({
    title: true,
    description: true,
    assignedTo: true,
    dueDate: true,
    completed: true,
    tasksStatus: true,
  });

  const columns = [
    { id: "title", label: "Title" },
    { id: "description", label: "Description" },
    { id: "assignedTo", label: "Assigned To" },
    { id: "dueDate", label: "Due Date" },
    { id: "completed", label: "Completed?" },
    { id: "tasksStatus", label: "Status" },
  ];

  const taskOptions = [
    { value: "completed", label: "Completed" },
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

  const getTaskStatus = (task) => {
    if (task.completed) {
      return "Completed";
    } else if (!task.completed && new Date(task.dueDate) < new Date()) {
      return "Overdue";
    } else if (!task.completed && new Date(task.dueDate) > new Date()) {
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
    const tenant = tenants.find(
      (t) => t._id.toString() === tenantId.toString()
    );
    return tenant ? `${tenant.firstName} ${tenant.lastName}` : "Unassigned"; // ✅ Fallback
  };

  const filteredTasks = (tasks || []).filter((task) => {
    const title = `${task.title ?? ""}`.toLowerCase();
    const description = `${task.description ?? ""}`.toLowerCase();
    const assignedToName = getFullName(task.assignedTo);
    const query = searchQuery.toLowerCase();
    const matchesQuery =
      title.includes(query) ||
      description.includes(query) ||
      assignedToName.toLowerCase().includes(query);
    const taskStatus = getTaskStatus(task);
    const matchesTaskStatus =
      !taskStatusFilter.length ||
      taskStatusFilter.includes(taskStatus.toLowerCase());
    return matchesQuery && matchesTaskStatus;
  });

  const totalItems = filteredTasks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const handleStatusChange = (type) => (event, newValue) => {
    const updatedValue = Array.isArray(newValue) ? newValue : [newValue];
    switch (type) {
      case "task":
        setTaskStatusFilter(updatedValue);
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

  const paginatedTasks = stableSort(
    filteredTasks,
    getComparator(order, "id")
  ).slice(startIndex, endIndex);

  const getTaskChipColor = (status) => {
    switch (status) {
      case "Completed":
        return "success";
      case "Overdue":
        return "danger";
      case "Pending":
        return "warning";
      case "No Tasks":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getTaskStartDecorator = (status) => {
    switch (status) {
      case "Completed":
        return <CheckRoundedIcon />;
      case "Overdue":
        return <ErrorOutline />;
      case "Pending":
        return <Pending />;
      case "No Tasks":
        return null;
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
        label="Task status"
        options={taskOptions}
        filter={taskStatusFilter}
        onChange={handleStatusChange("task")}
        clearFilter={() => clearStatusFilter(setTaskStatusFilter)}
      />
      <FormControl size="sm">
        <FormLabel>Visible columns</FormLabel>
        <Select
          multiple
          placeholder="See Columns"
          value={Object.keys(columnVisibility).filter(
            (columnId) => columnVisibility[columnId]
          )}
          input={<Input />}
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
          <FormLabel>Search tasks</FormLabel>
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
        className="TaskTableContainer"
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
        <TaskCells
          tasks={tasks}
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
          paginatedTasks={paginatedTasks}
          getTaskStatus={getTaskStatus}
          getTaskStartDecorator={getTaskStartDecorator}
          getTaskChipColor={getTaskChipColor}
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
