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

const BillsCells = ({
  billPayments,
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
  paginatedBills,
  getBillStatus,
  getComparator,
}) => {
  const getBillChipColor = (status) => {
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

  const getBillStartDecorator = (paymentMade) => {
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
                selected.length > 0 && selected.length !== billPayments.length
              }
              checked={(selected?.length || 0) === (billPayments?.length || 0)}
              onChange={(event) => {
                setSelected(
                  event.target.checked
                    ? billPayments.map((bill) => bill._id)
                    : []
                );
              }}
              color={
                (selected?.length || 0) > 0 ||
                (selected?.length || 0) === (billPayments?.length || 0)
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
              Bill Type
            </Link>
          </ResizableTableCell>
          {columnVisibility.tenant && (
            <ResizableTableCell>Tenant</ResizableTableCell>
          )}
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
          {columnVisibility.billStatus && (
            <ResizableTableCell>Bill status</ResizableTableCell>
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
        {stableSort(paginatedBills, getComparator(order, "id")).map((bill) => {
          const isItemSelected = selected.indexOf(bill._id) !== -1;
          const billStatus = getBillStatus(bill);
          return (
            <tr key={bill._id}>
              <td className="table-cell" style={{ textAlign: "center" }}>
                <Checkbox
                  size="sm"
                  checked={isItemSelected}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelected((prevSelected) => [
                        ...prevSelected,
                        bill._id,
                      ]);
                    } else {
                      setSelected((prevSelected) =>
                        prevSelected.filter((id) => id !== bill._id)
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
                  {bill.billType}
                </Typography>
              </td>
              {columnVisibility.tenant && (
                <td className="table-cell">{getFullName(bill?.tenant?._id)}</td>
              )}
              {columnVisibility.amount && (
                <td className="table-cell">£{bill.amount.toFixed(2)}</td>
              )}
              {columnVisibility.dueDate && (
                <td className="table-cell">
                  {dayjs(bill.dueDate).format("DD-MM-YYYY")}
                </td>
              )}
              {columnVisibility.datePaid && (
                <td className="table-cell">
                  {bill.datePaid
                    ? dayjs(bill.datePaid).format("DD-MM-YYYY")
                    : "N/A"}
                </td>
              )}
              {columnVisibility.paymentMade && (
                <td className="table-cell">
                  {bill.paymentMade ? "Yes" : "No"}
                </td>
              )}
              {columnVisibility.billStatus && (
                <td className="table-cell">
                  <Chip
                    variant="soft"
                    size="sm"
                    color={getBillChipColor(billStatus)}
                    startDecorator={getBillStartDecorator(billStatus)}
                  >
                    {billStatus}
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
                  onEdit={() => handleEditClick(bill)}
                  onDelete={() => handleDelete(bill)}
                  onProfile={() => onProfileClick(bill)}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default BillsCells;
