import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { Alert, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hideSnackBar } from "@/store/slices/snackBarSlice";

export default function AppSnackBar() {
  const dispatch = useAppDispatch();
  const { openState, successOrError, messages } = useAppSelector(
    (state) => state.appsnackbar
  );

  return (
    <Box>
      <Snackbar
        open={openState}
        autoHideDuration={3000}
        onClose={() => dispatch(hideSnackBar())}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => dispatch(hideSnackBar())}
          severity={successOrError}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {messages}
        </Alert>
      </Snackbar>
    </Box>
  );
}
