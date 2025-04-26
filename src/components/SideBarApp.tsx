import BookIcon from "@mui/icons-material/Book";
import RememberMeIcon from "@mui/icons-material/RememberMe";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
import {
  Box,
  Divider,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const SideBarApp = ({
  isSidebarCollapsed,
}: {
  isSidebarCollapsed: boolean;
}) => {
  const sideBarItem = [
    { id: 1, name: "Books", link: "/books", icon: <BookIcon /> },
    { id: 2, name: "Members", link: "/members", icon: <RememberMeIcon /> },
    {
      id: 3,
      name: "Transactions",
      link: "/transactions",
      icon: <ChangeCircleIcon />,
    },
  ];

  return (
    <Box>
      {sideBarItem.map((item) => (
        <Link href={item.link} key={item.id} style={{ textDecoration: "none" }}>
          <ListItem sx={{ color: "#DDE6ED" }} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{ color: "#27374D" }}>{item.icon}</ListItemIcon>
              {!isSidebarCollapsed && <ListItemText primary={item.name} />}{" "}
              {/* Show text only when expanded */}
            </ListItemButton>
          </ListItem>
        </Link>
      ))}
      <Divider />
    </Box>
  );
};

export default SideBarApp;
