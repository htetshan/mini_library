import { Box } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import TopBarApp from "./TopBarApp";
import SideBarApp from "./SideBarApp";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appFetchServer } from "@/store/slices/appSlice";

interface Props {
  children: ReactNode;
}

const LayoutApp = ({ children }: Props) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false); // State to manage sidebar collapse
  const dispatch = useAppDispatch();
  const { init } = useAppSelector((state) => state.app);
  // Fetch members from the server
  useEffect(() => {
    if (!init) {
      dispatch(appFetchServer());
    }
  }, []);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Top Bar */}
      <Box sx={{ height: "9%", width: "100%" }}>
        <TopBarApp
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
      </Box>

      {/* Content Area */}
      <Box sx={{ display: "flex", height: "91%", width: "100%" }}>
        {/* Sidebar */}
        <Box
          sx={{
            width: isSidebarCollapsed ? "5%" : "17%", // Adjust width based on collapse state
            bgcolor: "#526D82",
            transition: "width 0.3s ease",
          }}
        >
          <SideBarApp isSidebarCollapsed={isSidebarCollapsed} />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            width: isSidebarCollapsed ? "95%" : "83%", // Adjust width based on collapse state
            bgcolor: "#9DB2BF",
            p: 1,
            overflowY: "auto", // Enable scrolling for main content
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default LayoutApp;
