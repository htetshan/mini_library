import LayoutApp from "@/components/LayoutApp";
import { Box, Button, TextField, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
}

export default function MembersPage() {
  const router = useRouter();
  const [newUser, setNewUser] = useState<User>({
    name: "",
    email: "",
    phone: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    phone: "",
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const phoneRegex = /^[0-9]{11}$/; // Validates a 10-digit phone number
    return phoneRegex.test(phone);
  };

  const handleOnClick = async () => {
    let isValid = true;

    if (!validateEmail(newUser.email)) {
      setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }

    if (!validatePhone(newUser.phone)) {
      setErrors((prev) => ({ ...prev, phone: "Invalid phone number format" }));
      isValid = false;
    } else {
      setErrors((prev) => ({ ...prev, phone: "" }));
    }
    if (isValid) {
      console.log("add members");
      console.log("user:", newUser);
    }

    const response = await fetch("http://localhost:3000/api/members", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...newUser }),
    });
    const dataFromServer = await response.json();
    const { member } = dataFromServer;
    console.log("member:", member);
  };

  return (
    <LayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <h1 className="text-2xl font-semibold mb-4">👤 Members</h1>

        <Box
          sx={{ display: "flex", flexDirection: "column", width: 350, p: 2 }}
        >
          <Typography>Add Members</Typography>
          <TextField
            sx={{ mb: 1 }}
            variant="outlined"
            label="Name"
            onChange={(eve) =>
              setNewUser({ ...newUser, name: eve.target.value })
            }
          />
          <TextField
            sx={{ mb: 1 }}
            variant="outlined"
            label="Email"
            error={!!errors.email}
            helperText={errors.email}
            onChange={(eve) =>
              setNewUser({ ...newUser, email: eve.target.value })
            }
          />
          <TextField
            sx={{ mb: 2 }}
            variant="outlined"
            label="Phone Number"
            error={!!errors.phone}
            helperText={errors.phone}
            onChange={(eve) =>
              setNewUser({ ...newUser, phone: eve.target.value })
            }
          />
          <Box>
            <Button
              variant="outlined"
              sx={{ width: "fit-content" }}
              onClick={() => router.push("/")}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ width: "fit-content" }}
              onClick={handleOnClick}
            >
              Add member
            </Button>
          </Box>
        </Box>

        {/*         <Link href="/" className="text-blue-600 underline mt-4 inline-block">
          ← Back to Dashboard
        </Link> */}
      </main>
    </LayoutApp>
  );
}
