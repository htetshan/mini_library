import NewLayoutApp from "@/components/NewLayoutApp";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMembers, removeMembers } from "@/store/slices/memberSlice";
import { showSnackBar } from "@/store/slices/snackBarSlice";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Member } from "@prisma/client";
import Link from "next/link";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function MembersPage() {
  const dispatch = useAppDispatch();
  const { members } = useAppSelector((state) => state.members);
  const displayMembers = members;
  const { books } = useAppSelector((state) => state.books);
  const [newMember, setNewMember] = useState<User>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const validateName = (name: string) => {
    return name.trim().length >= 3; // Name must be at least 3 characters long
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{10,11}$/; // Validates a 10-11 digit phone number
    return phoneRegex.test(phone);
  };

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);

  if (!members) {
    return (
      <NewLayoutApp>
        <Box>404 Not Found</Box>
      </NewLayoutApp>
    );
  }

  // Handle adding a new member
  const handleAddMember = async () => {
    let isValid = true as boolean;

    // Validate name
    if (!validateName(newMember.name)) {
      setErrors((prev) => ({
        ...prev,
        name: "Name must be at least 3 characters long",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, name: "" }));
    }

    // Validate email
    if (!validateEmail(newMember.email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Invalid email format:eg.test@gmail.com",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    // Validate phone
    if (!validatePhone(newMember.phone)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Invalid phone number format:eg.09-000 111 222",
      }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }

    if (isValid) {
      try {
        const response = await fetch(`${config.api_url}/members`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newMember),
        });
        const dataFromServer = await response.json();
        const { member } = dataFromServer;
        if (!response.ok) {
          // Handle API error
          dispatch(
            showSnackBar({
              openState: true,
              successOrError: "error",
              messages:
                "A member with this email or phone number already exists.",
            })
          );
          return;
        }
        dispatch(addMembers(member));
        setNewMember({ name: "", email: "", phone: "" }); // Reset form
      } catch (error) {
        console.error("Error downloading member card:", error);
        alert("Failed to create member");
      }
    }
  };

  const handleDeleteMember = async () => {
    if (memberToDelete !== null) {
      const BorrowedMember = books.find(
        (item) => item.borrowedMemberID === memberToDelete
      );
      if (BorrowedMember) {
        dispatch(
          showSnackBar({
            openState: true,
            successOrError: "error",
            messages: "Cannot delete a member that is currently borrowed book.",
          }),
          setOpenDelete(false)
        );
        return;
        // Exit the function
      }
      const response = await fetch(
        `${config.api_url}/members?id=${memberToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(memberToDelete),
        }
      );
      const dataFromServer = await response.json();
      if (!response.ok) {
        // Handle API error
        dispatch(
          showSnackBar({
            openState: true,
            successOrError: "error",
            messages: "Cannot delete a member that is currently borrowed book.",
          }),
          setOpenDelete(false)
        );
        return;
      }
      dispatch(removeMembers(memberToDelete));
      setOpenDelete(false);
    }
  };

  const handleDownloadMemberCard = async (member: Member) => {
    try {
      const response = await fetch(
        `${config.api_url}/members/${member.id}/download`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download member card.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${member.name}_card.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading member card:", error);
      alert("Failed to download member card. Please try again.");
    }
  };

  return (
    <NewLayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <Typography variant="h4" gutterBottom>
          👤 Members
        </Typography>
        {/* Add Member Form */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Add Member
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
            <TextField
              label="Name"
              variant="outlined"
              value={newMember.name}
              error={!!errors.name}
              helperText={errors.name}
              onChange={(e) =>
                setNewMember({ ...newMember, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              variant="outlined"
              value={newMember.email}
              error={!!errors.email}
              helperText={errors.email}
              onChange={(e) =>
                setNewMember({ ...newMember, email: e.target.value })
              }
            />
            <TextField
              label="Phone"
              variant="outlined"
              value={newMember.phone}
              error={!!errors.phone}
              helperText={errors.phone}
              onChange={(e) =>
                setNewMember({ ...newMember, phone: e.target.value })
              }
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddMember}
            >
              Add Member
            </Button>
          </Box>
        </Box>

        {/* Members List */}
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Members List
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: 2,
              Height: 442,
              mb: 5,

              //overflowY: "auto",
            }}
          >
            {displayMembers.map((member) => (
              <Card key={member.id} sx={{ maxWidth: 345 }}>
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {`MemberID:  ${member.memberID}`}
                  </Typography>
                  <Typography gutterBottom variant="h6" component="div">
                    {`Name:  ${member.name}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`Email:  ${member.email}`}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {`Phone:  ${member.phone}`}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Link href={`/members/${member.id}`}>
                    <Button size="small" variant="outlined" color="primary">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    size="small"
                    variant="outlined"
                    color="error"
                    onClick={() => {
                      setOpenDelete(true);
                      setMemberToDelete(member.id); // Store member ID to delete
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => handleDownloadMemberCard(member)}
                  >
                    Generate
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>

          {/* Delete Dialog */}
        </Box>

        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Delete Member</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this member?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button onClick={handleDeleteMember}>Yes</Button>
          </DialogActions>
        </Dialog>
      </main>
    </NewLayoutApp>
  );
}
