import LayoutApp from "@/components/LayoutApp";
import NewLayoutApp from "@/components/NewLayoutApp";
import { Box, Typography } from "@mui/material";

const hello = () => {
  return (
    <NewLayoutApp>
      <Typography variant="h4">
        Libraries store the energy that fuels the imagination.
      </Typography>
    </NewLayoutApp>
  );
};

export default hello;
