import LayoutApp from "@/components/LayoutApp";
import NewLayoutApp from "@/components/NewLayoutApp";
import { Box, Typography } from "@mui/material";

const hello = () => {
  return (
    <NewLayoutApp>
      <Typography variant="h2">
        A library is not a luxury but one of the necessities of life.
      </Typography>
    </NewLayoutApp>
  );
};

export default hello;
