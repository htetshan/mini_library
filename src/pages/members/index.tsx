import LayoutApp from "@/components/LayoutApp";
import { config } from "@/config";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { addMembers, removeMembers } from "@/store/slices/memberSlice";
import {
  Box,
  Button,
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
      <LayoutApp>
        <Box>404 Not Found</Box>
      </LayoutApp>
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
      const response = await fetch(`${config.api_url}/members`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newMember),
      });
      const dataFromServer = await response.json();
      const { member } = dataFromServer;
      dispatch(addMembers(member));
      setNewMember({ name: "", email: "", phone: "" }); // Reset form
    }
  };

  const handleDeleteMember = async () => {
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
    const { memberDeletedId } = dataFromServer;
    dispatch(removeMembers(memberDeletedId));
    setOpenDelete(false);
  };

  const handleDownloadCard = async (member: Member) => {
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
    <LayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <h1 className="text-2xl font-semibold mb-4">👤 Members</h1>

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
        <Box
          sx={{
            maxHeight: "500px", // Set a fixed height for the table container
            overflowY: "auto", // Enable vertical scrolling
            border: "1px solid #ccc", // Optional: Add a border for better visibility
            borderRadius: "4px",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Members List
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Actions</TableCell>
                <TableCell>Generate Member Card</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>{member.memberID}</TableCell>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{member.phone}</TableCell>
                  <TableCell>
                    <Link href={`/members/${member.id}`}>
                      <Button variant="outlined" color="primary" sx={{ mr: 1 }}>
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        setOpenDelete(true);
                        setMemberToDelete(member.id);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="success"
                      onClick={() => handleDownloadCard(member)}
                    >
                      Generate
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
    </LayoutApp>
  );
}
