import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Breadcrumbs from "@mui/joy/Breadcrumbs";
import Link from "@mui/joy/Link";
import Typography from "@mui/joy/Typography";
import AddIcon from "@mui/icons-material/Add";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import BillsTable from "./BillsTable";
import Header from "../tableUtils/Header";
import BillPaymentForm from "../../forms/BillPaymentForm";
import BillPaymentStore from "../../stores/BillPaymentStore";
import DrawerComponent from "../../layouts/GenericDrawer";

const BillsPage = observer(() => {
  const { billPayments, selectedBillPayment, open, refreshInfo } =
    BillPaymentStore;

  useEffect(() => {
    if (refreshInfo) {
      BillPaymentStore.fetchBillPayments();
    }
  }, [refreshInfo]);

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <Box sx={{ display: "flex", minHeight: "100dvh" }}>
        <Header />
        <Box
          component="main"
          className="MainContent"
          sx={{
            px: { xs: 2, md: 6 },
            pt: {
              xs: "calc(12px + var(--Header-height))",
              sm: "calc(12px + var(--Header-height))",
              md: 3,
            },
            pb: { xs: 2, sm: 2, md: 3 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100dvh",
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Breadcrumbs
              size="sm"
              aria-label="breadcrumbs"
              separator={<ChevronRightRoundedIcon fontSize="sm" />}
              sx={{ pl: 0 }}
            >
              {/* <Link underline="none" color="neutral" href="#" aria-label="Home"> */}
              <HomeRoundedIcon />
              {/* </Link> */}
              {/* <Link
                underline="hover"
                color="neutral"
                href="#"
                fontSize={12}
                fontWeight={500}
              > */}
              <Typography color="secondary" fontWeight={500} fontSize={12}>
                Dashboard
              </Typography>
              {/* </Link> */}
              <Typography color="primary" fontWeight={500} fontSize={12}>
                Bill Payments
              </Typography>
            </Breadcrumbs>
          </Box>
          <Box
            sx={{
              display: "flex",
              mb: 1,
              gap: 1,
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "start", sm: "center" },
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            <Typography level="h2" component="h1">
              Bills
            </Typography>
            <Box
              sx={{
                width: { xs: "100%", sm: "auto" },
                display: "flex",
                justifyContent: { xs: "flex-end", sm: "flex-start" },
              }}
            >
              <Button
                color="primary"
                startDecorator={<AddIcon />}
                size="sm"
                onClick={() => BillPaymentStore.setupNewBillPayment()}
              >
                Add Bill
              </Button>
            </Box>
          </Box>
          <BillsTable
            billPayments={billPayments}
            onProfileClick={(billPayment) =>
              BillPaymentStore.viewBillPayment(billPayment)
            }
            handleEditClick={(billPayment) =>
              BillPaymentStore.editBillPayment(billPayment)
            }
            handleDelete={(billPayment) =>
              BillPaymentStore.deleteBillPayment(billPayment)
            }
          />
        </Box>
      </Box>

      {open && (
        <DrawerComponent
          open={BillPaymentStore.setOpen}
          onClose={() => BillPaymentStore.handleClose()}
        >
          <BillPaymentForm
            mode={BillPaymentStore.mode}
            onSave={BillPaymentStore.saveBillPayment}
            entityData={selectedBillPayment}
            entityName="bill payment"
          />
        </DrawerComponent>
      )}
    </CssVarsProvider>
  );
});

export default BillsPage;
