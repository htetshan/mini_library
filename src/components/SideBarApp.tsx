import BookIcon from "@mui/icons-material/Book";
import RememberMeIcon from "@mui/icons-material/RememberMe";
import DashboardIcon from "@mui/icons-material/Dashboard";
import {
  Box,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";
const SideBarApp = () => {
  const sideBarItem = [
    { id: 1, name: "Dashboard", link: "/", icon: <DashboardIcon /> },
    { id: 2, name: "Books", link: "/books", icon: <BookIcon /> },
    { id: 3, name: "Members", link: "/members", icon: <RememberMeIcon /> },
  ];
  return (
    <Box>
      {sideBarItem.map((item) => (
        <Link href={item.link} key={item.id} style={{ textDecoration: "none" }}>
          <ListItem sx={{ color: "#DDE6ED" }} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: "#27374D" }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
      <Divider />
    </Box>
  );
};

export default SideBarApp;
