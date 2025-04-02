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
import TaskTable from "./TaskTable";
import Header from "../tableUtils/Header";
import TaskForm from "../../forms/TaskForm";
import TaskStore from "../../stores/TaskStore";
import DrawerComponent from "../../layouts/GenericDrawer";

const TaskPage = observer(() => {
  const { tasks, selectedTask, open, refreshInfo } = TaskStore;
  useEffect(() => {
    if (refreshInfo) {
      TaskStore.fetchTasks();
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
              <Link
                underline="none"
                color="neutral"
                href="#some-link"
                aria-label="Home"
              >
                <HomeRoundedIcon />
              </Link>
              <Link
                underline="hover"
                color="neutral"
                href="#some-link"
                fontSize={12}
                fontWeight={500}
              >
                Dashboard
              </Link>
              <Typography color="primary" fontWeight={500} fontSize={12}>
                Tasks
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
              Tasks
            </Typography>
            <Button
              color="primary"
              startDecorator={<AddIcon />}
              size="sm"
              onClick={() => TaskStore.setupNewTask()}
            >
              Add Task
            </Button>
          </Box>
          <TaskTable
            tasks={tasks}
            onProfileClick={(task) => TaskStore.viewTask(task)}
            handleEditClick={(task) => TaskStore.editTask(task)}
            handleDelete={(task) => TaskStore.deleteTask(task)}
          />
        </Box>
      </Box>

      {open && (
        <DrawerComponent
          open={TaskStore.setOpen}
          onClose={() => TaskStore.handleClose()}
        >
          <TaskForm
            mode={TaskStore.mode}
            onSave={TaskStore.saveTask}
            entityData={selectedTask}
            entityName="task"
          />
        </DrawerComponent>
      )}
    </CssVarsProvider>
  );
});

export default TaskPage;
