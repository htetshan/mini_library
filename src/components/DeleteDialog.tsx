import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface Props {
  openDelete: boolean;
  setOpenDelete: Dispatch<SetStateAction<boolean>>;
  title: string;
  context: string;
  handleDelete: () => void;
}
const DeleteDialog = ({
  openDelete,
  setOpenDelete,
  title,
  context,
  handleDelete,
}: Props) => {
  return (
    <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>{context}</DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
        <Button onClick={handleDelete}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
