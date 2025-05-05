import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateBook } from "@/store/slices/bookSlice";
import { useRouter } from "next/router";
import NewLayoutApp from "@/components/NewLayoutApp";
import { config } from "@/config";
import { setTransactions } from "@/store/slices/transactionSlice";
import { showSnackBar } from "@/store/slices/snackBarSlice";

const IssueBookForm: React.FC = () => {
  const dispatch = useAppDispatch();
  // States for Issue Book Form
  const [issueMemberID, setIssueMemberID] = useState<string | null>(null);
  const [issueBookID, setIssueBookID] = useState<string | null>(null);

  const { members } = useAppSelector((state) => state.members);
  const issueMember = members.find((item) => item.memberID === issueMemberID);

  const { books } = useAppSelector((state) => state.books);
  const issueBook = books.find((item) => item.bookID === issueBookID);

  // States for Return Book Form
  const [returnMemberID, setReturnMemberID] = useState<string | null>(null);
  const [returnBookID, setReturnBookID] = useState<string | null>(null);

  const returnMember = members.find((item) => item.memberID === returnMemberID);
  const returnBook = books.find((item) => item.bookID === returnBookID);
  const router = useRouter();
  const handleIssue = async () => {
    if (!issueMember || !issueBook) {
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "error",
          messages: "Invalid Member ID or Book ID.",
        })
      );
      return;
    }

    const res = await fetch(`${config.api_url}/transactions/issue`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: issueMember.id, bookId: issueBook.id }),
    });

    const dataFromServer = await res.json();
    console.log(dataFromServer);

    const { updateIssue, transactions } = dataFromServer;

    if (res.ok) {
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "success",
          messages: "Book issued successfully!",
        })
      );

      dispatch(updateBook(updateIssue));
      dispatch(setTransactions(transactions));
      router.push("/books");
    } else {
      //console.log(dataFromServer.error);
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "error",
          messages: `${dataFromServer.error}`,
        })
      );

      //  alert(dataFromServer.error || "Error issuing book.");
    }
  };

  const handleReturn = async () => {
    if (!returnMember || !returnBook) {
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "error",
          messages: "Invalid Member ID or Book ID.",
        })
      );
      return;
    }

    const res = await fetch(`${config.api_url}/transactions/return`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId: returnMember.id,
        bookId: returnBook.id,
      }),
    });

    const dataFromServer = await res.json();
    const { updateReturn, transactions } = dataFromServer;
    if (res.ok) {
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "success",
          messages: "Book returned successfully!",
        })
      );

      dispatch(updateBook(updateReturn));
      dispatch(setTransactions(transactions));

      router.push("/books");
    } else {
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "error",
          messages: `${dataFromServer.error}`,
        })
      );
      //alert(dataFromServer.error || "Error returning book.");
    }
  };

  return (
    <NewLayoutApp>
      <Box p={2} sx={{ maxWidth: 444 }}>
        {/* Issue Book Form */}
        <Typography variant="h6">Issue Book</Typography>
        <TextField
          fullWidth
          label="Member ID"
          value={issueMemberID ?? ""}
          onChange={(e) => setIssueMemberID(e.target.value)}
          margin="normal"
        ></TextField>

        <TextField
          fullWidth
          label="Book ID"
          value={issueBookID ?? ""}
          onChange={(e) => setIssueBookID(e.target.value)}
          margin="normal"
        ></TextField>

        <Button variant="contained" onClick={handleIssue}>
          Issue
        </Button>
      </Box>

      <Box p={2} mt={4} sx={{ maxWidth: 444 }}>
        {/* Return Book Form */}
        <Typography variant="h6">Return Book</Typography>
        <TextField
          fullWidth
          label="Member ID"
          value={returnMemberID ?? ""}
          onChange={(e) => setReturnMemberID(e.target.value)}
          margin="normal"
        ></TextField>

        <TextField
          fullWidth
          label="Book ID"
          value={returnBookID ?? ""}
          onChange={(e) => setReturnBookID(e.target.value)}
          margin="normal"
        ></TextField>

        <Button variant="contained" color="secondary" onClick={handleReturn}>
          Return
        </Button>
      </Box>
    </NewLayoutApp>
  );
};

export default IssueBookForm;
