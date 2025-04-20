// pages/members/[id]/index.tsx

import { GetServerSideProps } from "next";
import LayoutApp from "@/components/LayoutApp";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Member } from "@prisma/client";
import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { useAppDispatch } from "@/store/hooks";
import { replaceMembers } from "@/store/slices/memberSlice";
import { useRouter } from "next/router";
// make sure you have prisma instance

interface Props {
  member: Member | null;
}
// This function runs on the server before rendering the page
export const getServerSideProps: GetServerSideProps = async (context) => {
  // Get the "id" from the members/index.tsx URL, like /member/5 -> id = 5
  const id = Number(context.params?.id);

  // Look for a member in the database with that id
  const member = await prisma.member.findUnique({
    where: { id },
  });

  // Send the found member (or null if not found) to the page as a prop
  return {
    props: {
      member, // "??" means "use null if member is undefined"
    },
  };
};

const EditMember = ({ member }: Props) => {
  const router = useRouter();
  const dispath = useAppDispatch();
  const [updateMember, setUpdateMember] = useState<Member | null>(member);

  if (!member) {
    return (
      <LayoutApp>
        <Box>404 Not Found</Box>
      </LayoutApp>
    );
  }

  const handleUpdate = async () => {
    const shouldUpdate =
      member.name !== updateMember?.name ||
      member.email !== updateMember?.email ||
      member.phone !== updateMember?.phone;
    if (shouldUpdate) {
      const response = await fetch("http://localhost:3000/api/members", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateMember),
      });
      const dataFromServer = await response.json();
      const { updateMemberDb } = dataFromServer;
      dispath(replaceMembers(updateMemberDb));
      console.log("updateMember form DB", updateMember);

      router.push("/members");
    }
  };

  return (
    <LayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <h1 className="text-2xl font-semibold mb-4">👤 Edit Members</h1>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Member
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
            <TextField
              label="Name"
              variant="outlined"
              value={updateMember?.name ?? ""}
              onChange={(e) =>
                setUpdateMember({
                  ...updateMember!,
                  name: e.target.value,
                })
              }
            />
            <TextField
              label="Email"
              variant="outlined"
              value={updateMember?.email ?? ""}
              onChange={(e) =>
                setUpdateMember({
                  ...updateMember!,
                  email: e.target.value,
                })
              }
            />
            <TextField
              label="Phone"
              variant="outlined"
              value={updateMember?.phone ?? ""}
              onChange={(e) =>
                setUpdateMember({
                  ...updateMember!,
                  phone: e.target.value,
                })
              }
            />
            <Button variant="contained" color="primary" onClick={handleUpdate}>
              Edit Member
            </Button>
          </Box>
        </Box>
      </main>
    </LayoutApp>
  );
};

export default EditMember;
