import React from "react";
import Table from "@mui/joy/Table";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ResizableTableCell from "../tableUtils/ResizableTableCell";
import RowMenu from "../tableUtils/RowMenu";

const TaskCells = ({
  tasks,
  selected,
  setSelected,
  order,
  setOrder,
  columnVisibility,
  onProfileClick,
  handleEditClick,
  handleDelete,
  stableSort,
  paginatedTasks,
  getPaymentStatus,
  getPaymentStartDecorator,
  getPaymentChipColor,
  getTaskStatus,
  getComparator,
  getTaskStartDecorator,
  getTaskChipColor,
}) => (
  <Table
    aria-labelledby="tableTitle"
    stickyHeader
    hoverRow
    noWrap={false}
    sx={{
      "--TableCell-headBackground": "var(--joy-palette-background-level1)",
      "--Table-headerUnderlineThickness": "1px",
      "--TableRow-hoverBackground": "var(--joy-palette-background-level1)",
      "--TableCell-paddingY": "4px",
      "--TableCell-paddingX": "8px",
      "& tr > *:last-child": {
        position: "sticky",
        right: 0,
        bgcolor: "var(--TableCell-headBackground)",
      },
    }}
  >
    <thead>
      <tr>
        <th
          style={{
            width: 48,
            textAlign: "center",
            padding: "12px 6px",
            borderRight: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        >
          <Checkbox
            size="sm"
            indeterminate={
              selected.length > 0 && selected.length !== tasks.length
            }
            checked={(selected?.length || 0) === (tasks?.length || 0)}
            onChange={(event) => {
              setSelected(
                event.target.checked ? tasks.map((task) => task._id) : []
              );
            }}
            color={
              (selected?.length || 0) > 0 ||
              (selected?.length || 0) === (tasks?.length || 0)
                ? "primary"
                : undefined
            }
            sx={{ verticalAlign: "text-bottom" }}
          />
        </th>
        <ResizableTableCell>
          <Link
            underline="none"
            color="primary"
            component="button"
            onClick={() => setOrder(order === "asc" ? "desc" : "asc")}
            fontWeight="lg"
            endDecorator={<ArrowDropDownIcon />}
            sx={{
              "& svg": {
                transition: "0.2s",
                transform: order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
              },
            }}
          >
            Title
          </Link>
        </ResizableTableCell>
        {columnVisibility.description && (
          <ResizableTableCell>Description</ResizableTableCell>
        )}
        {columnVisibility.assignedTo && (
          <ResizableTableCell>Assigned To</ResizableTableCell>
        )}
        {columnVisibility.dueDate && (
          <ResizableTableCell>Due Date</ResizableTableCell>
        )}
        {columnVisibility.completed && (
          <ResizableTableCell>Completed?</ResizableTableCell>
        )}
        <th
          aria-label="last"
          style={{
            width: 48,
            textAlign: "center",
            padding: "12px 6px",
            borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
          }}
        />
      </tr>
    </thead>
    <tbody>
      {stableSort(paginatedTasks, getComparator(order, "id")).map((task) => {
        const isItemSelected = selected.indexOf(task._id) !== -1;
        const taskStatus = getTaskStatus(task);
        return (
          <tr key={task._id}>
            <td className="table-cell" style={{ textAlign: "center" }}>
              <Checkbox
                size="sm"
                checked={isItemSelected}
                onChange={(event) => {
                  if (event.target.checked) {
                    setSelected((prevSelected) => [...prevSelected, task._id]);
                  } else {
                    setSelected((prevSelected) =>
                      prevSelected.filter((id) => id !== task._id)
                    );
                  }
                }}
                color={isItemSelected ? "primary" : undefined}
                sx={{ verticalAlign: "text-bottom" }}
              />
            </td>
            <td className="table-cell">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <div>
                  <Typography
                    fontWeight="lg"
                    level="body3"
                    textColor="text.primary"
                  >
                    <Link
                      href="#"
                      onClick={(event) => {
                        event.preventDefault();
                        onProfileClick(task);
                      }}
                    >
                      {`${task.title}`}
                    </Link>
                  </Typography>
                </div>
              </Box>
            </td>
            {columnVisibility.description && (
              <td className="table-cell">{task.description}</td>
            )}
            {columnVisibility.assignedTo && (
              <td className="table-cell">{task.assignedTo}</td>
            )}
            {columnVisibility.dueDate && (
              <td className="table-cell">{task.dueDate}</td>
            )}
            {columnVisibility.completed && (
              <td className="table-cell">{task.completed ? "Yes" : "No"}</td>
            )}
            {/* {columnVisibility.tasksStatus && (
                <td className="table-cell">
                  <Chip
                    variant="soft"
                    size="sm"
                    color={getTaskChipColor(taskStatus)}
                    startDecorator={getTaskStartDecorator(taskStatus)}
                  >
                    {taskStatus}
                  </Chip>
                </td>
              )}
              {columnVisibility.totalTasks && (
                <td className="table-cell">{task.totalTasks}</td>
              )}
              {columnVisibility.completedTasks && (
                <td className="table-cell">{task.completedTasks}</td>
              )}
              {columnVisibility.pendingTasks && (
                <td className="table-cell">{task.pendingTasks}</td>
              )}
              {columnVisibility.overdueTasks && (
                <td className="table-cell">{task.overdueTasks}</td>
              )} */}
            <td
              style={{
                textAlign: "center",
                borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                zIndex: "2",
              }}
            >
              <RowMenu
                onEdit={() => handleEditClick(task)}
                onDelete={() => handleDelete(task)}
                onProfile={() => onProfileClick(task)}
              />
            </td>
          </tr>
        );
      })}
    </tbody>
  </Table>
);

export default TaskCells;
