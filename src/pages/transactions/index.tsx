import React, { useState } from "react";
import { Button, TextField, Typography, Box } from "@mui/material";
import LayoutApp from "@/components/LayoutApp";
import { useAppSelector } from "@/store/hooks";

const IssueBookForm: React.FC = () => {
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

  const handleIssue = async () => {
    if (!issueMember || !issueBook) return;

    const res = await fetch("/api/transactions/borrow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ memberId: issueMember.id, bookId: issueBook.id }),
    });

    const dataFromServer = await res.json();
    if (res.ok) {
      alert("Book issued successfully!");
    } else {
      alert(dataFromServer.error || "Error issuing book.");
    }
  };

  const handleReturn = async () => {
    if (!returnMember || !returnBook) return;

    const res = await fetch("/api/transactions/return", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        memberId: returnMember.id,
        bookId: returnBook.id,
      }),
    });

    const dataFromServer = await res.json();
    if (res.ok) {
      alert("Book returned successfully!");
    } else {
      alert(dataFromServer.error || "Error returning book.");
    }
  };

  return (
    <LayoutApp>
      <Box p={2}>
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

      <Box p={2} mt={4}>
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
    </LayoutApp>
  );
};

export default IssueBookForm;
