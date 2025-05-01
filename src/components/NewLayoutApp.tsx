import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import DescriptionIcon from "@mui/icons-material/Description";
import { useRouter } from "next/router";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { appFetchServer } from "@/store/slices/appSlice";
import HomeIcon from "@mui/icons-material/Home";
import BookIcon from "@mui/icons-material/Book";
import RememberMeIcon from "@mui/icons-material/RememberMe";
import ChangeCircleIcon from "@mui/icons-material/ChangeCircle";
interface LayoutProps {
  children: React.ReactNode;
}

export default function NewLayoutApp({ children }: LayoutProps) {
  const dispath = useAppDispatch();
  const { init } = useAppSelector((state) => state.app);
  const { books } = useAppSelector((state) => state.books);
  // Fetch members from the server
  React.useEffect(() => {
    if (!init) {
      dispath(appFetchServer());
    }
  }, [books]);
  /*
  interface Router {
    pathname: string;
    searchParams?: URLSearchParams;
    navigate?: Navigate;
    Link: React.ComponentType<LinkProps>;  'next/link က Link နဲ routing ရ ပြီ'
     }

  router?: Router;

}

*/

  const nextRouter = useRouter();

  return (
    <AppProvider
      branding={{
        logo: <img src="/Library_logo.png" alt="mini" />,
        title: "Mini Library Management",
        homeUrl: "/",
      }}
      navigation={[
        { segment: "", title: "Home", icon: <HomeIcon /> },
        { segment: "books", title: "Books", icon: <BookIcon /> },
        { segment: "members", title: "Members", icon: <RememberMeIcon /> },
        {
          segment: "transactions",
          title: "Transactions",
          icon: <ChangeCircleIcon />,
        },
      ]}
      router={{ pathname: nextRouter.pathname, Link }}
    >
      <DashboardLayout>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Render the actual page */}
          <Box sx={{ p: 4 }}>{children}</Box>
        </Box>
      </DashboardLayout>
    </AppProvider>
  );
}
