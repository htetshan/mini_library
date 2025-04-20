import { Box } from "@mui/material";
import { ReactNode, useEffect } from "react";
import TopBarApp from "./TopBarApp";
import SideBarApp from "./SideBarApp";
import { useAppDispatch } from "@/store/hooks";
import { setMembers } from "@/store/slices/memberSlice";

interface Props {
  children: ReactNode;
}

const LayoutApp = ({ children }: Props) => {
  const dispath = useAppDispatch();
  // Fetch members from the server
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${window.location.origin}/api/members`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dataFromServer = await response.json();
        const { members } = dataFromServer;
        dispath(setMembers(members));
      } catch (error) {
        console.error("Failed to fetch members", error);
      }
    };

    fetchMembers();
  }, []); // ✅ Empty array means run once when component mounts

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
      {/* Top Bar: 15% of the full screen height */}
      <Box sx={{ height: "9%", width: "100%" }}>
        <TopBarApp />
      </Box>

      {/* Content Area: 85% of the full screen height */}
      <Box sx={{ display: "flex", height: "91%", width: "100%" }}>
        {/* Sidebar: 1/4 of the width */}
        <Box sx={{ width: "17%", bgcolor: "#526D82" }}>
          <SideBarApp />
        </Box>
        <Box sx={{ width: "83%", bgcolor: "#9DB2BF", p: 1 }}>{children}</Box>

        {/* Main Content: 3/4 of the width */}
      </Box>
    </Box>
  );
};

export default LayoutApp;
