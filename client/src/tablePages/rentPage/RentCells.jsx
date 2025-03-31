import Table from "@mui/joy/Table";
import Checkbox from "@mui/joy/Checkbox";
import Chip from "@mui/joy/Chip";
import Box from "@mui/joy/Box";
import Typography from "@mui/joy/Typography";
import Link from "@mui/joy/Link";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ResizableTableCell from "../tableUtils/ResizableTableCell";
import RowMenu from "../tableUtils/RowMenu";
import dayjs from "dayjs";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Pending from "@mui/icons-material/Pending";
import ErrorOutline from "@mui/icons-material/ErrorOutline";

const RentCells = ({
  rentPayments,
  selected,
  setSelected,
  order,
  getFullName,
  setOrder,
  columnVisibility,
  onProfileClick,
  handleEditClick,
  handleDelete,
  stableSort,
  paginatedRent,
  getRentStatus,
  getComparator,
}) => {
  const getRentChipColor = (status) => {
    console.log("getrentchipcolor ran");
    switch (status) {
      case "Paid":
        return "success";
      case "Overdue":
        return "danger";
      case "Pending":
        return "warning";
      case "No status detected":
        return "neutral";
      default:
        return "neutral";
    }
  };

  const getRentStartDecorator = (paymentMade) => {
    switch (paymentMade) {
      case "Paid":
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

  return (
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
                selected.length > 0 && selected.length !== rentPayments.length
              }
              checked={(selected?.length || 0) === (rentPayments?.length || 0)}
              onChange={(event) => {
                setSelected(
                  event.target.checked
                    ? rentPayments.map((rent) => rent._id)
                    : []
                );
              }}
              color={
                (selected?.length || 0) > 0 ||
                (selected?.length || 0) === (rentPayments?.length || 0)
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
                  transform:
                    order === "desc" ? "rotate(0deg)" : "rotate(180deg)",
                },
              }}
            >
              Tenant
            </Link>
          </ResizableTableCell>
          {columnVisibility.amount && (
            <ResizableTableCell>Amount</ResizableTableCell>
          )}
          {columnVisibility.dueDate && (
            <ResizableTableCell>Due Date</ResizableTableCell>
          )}
          {columnVisibility.datePaid && (
            <ResizableTableCell>Date Paid</ResizableTableCell>
          )}
          {columnVisibility.paymentMade && (
            <ResizableTableCell>Payment Made?</ResizableTableCell>
          )}
          {columnVisibility.rentStatus && (
            <ResizableTableCell>Rent status</ResizableTableCell>
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
        {stableSort(paginatedRent, getComparator(order, "id")).map((rent) => {
          const isItemSelected = selected.indexOf(rent._id) !== -1;
          const rentStatus = getRentStatus(rent);
          return (
            <tr key={rent._id}>
              <td className="table-cell" style={{ textAlign: "center" }}>
                <Checkbox
                  size="sm"
                  checked={isItemSelected}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelected((prevSelected) => [
                        ...prevSelected,
                        rent._id,
                      ]);
                    } else {
                      setSelected((prevSelected) =>
                        prevSelected.filter((id) => id !== rent._id)
                      );
                    }
                  }}
                  color={isItemSelected ? "primary" : undefined}
                  sx={{ verticalAlign: "text-bottom" }}
                />
              </td>
              <td className="table-cell">
                <Typography
                  fontWeight="lg"
                  level="body3"
                  textColor="text.primary"
                >
                  {getFullName(rent?.tenant?._id)}
                </Typography>
              </td>
              {columnVisibility.amount && (
                <td className="table-cell">£{rent.amount.toFixed(2)}</td>
              )}
              {columnVisibility.dueDate && (
                <td className="table-cell">
                  {dayjs(rent.dueDate).format("DD-MM-YYYY")}
                </td>
              )}
              {columnVisibility.datePaid && (
                <td className="table-cell">
                  {rent.datePaid
                    ? dayjs(rent.datePaid).format("DD-MM-YYYY")
                    : "N/A"}
                </td>
              )}
              {columnVisibility.paymentMade && (
                <td className="table-cell">
                  {rent.paymentMade ? "Yes" : "No"}
                </td>
              )}
              {columnVisibility.rentStatus && (
                <td className="table-cell">
                  <Chip
                    variant="soft"
                    size="sm"
                    color={getRentChipColor(rentStatus)}
                    startDecorator={getRentStartDecorator(rentStatus)}
                  >
                    {rentStatus}
                  </Chip>
                </td>
              )}
              <td
                style={{
                  textAlign: "center",
                  borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                  zIndex: "2",
                }}
              >
                <RowMenu
                  onEdit={() => handleEditClick(rent)}
                  onDelete={() => handleDelete(rent)}
                  onProfile={() => onProfileClick(rent)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default RentCells;
