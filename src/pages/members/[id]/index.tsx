// pages/members/[id]/index.tsx

import { GetServerSideProps } from "next";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Member } from "@prisma/client";
import { useState } from "react";
import { prisma } from "@/lib/prisma";

import { replaceMembers } from "@/store/slices/memberSlice";
import { useRouter } from "next/router";
import { config } from "@/config";
import NewLayoutApp from "@/components/NewLayoutApp";
import { showSnackBar } from "@/store/slices/snackBarSlice";
import { useAppDispatch } from "@/store/hooks";
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
  const dispatch = useAppDispatch();
  const [updateMember, setUpdateMember] = useState<Member | null>(member);

  if (!member) {
    return (
      <NewLayoutApp>
        <Box>404 Not Found</Box>
      </NewLayoutApp>
    );
  }

  const handleUpdate = async () => {
    const shouldUpdate =
      member.name !== updateMember?.name ||
      member.email !== updateMember?.email ||
      member.phone !== updateMember?.phone;
    if (shouldUpdate) {
      const response = await fetch(`${config.api_url}/members`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateMember),
      });
      const dataFromServer = await response.json();
      const { updateMemberDb } = dataFromServer;
      dispatch(replaceMembers(updateMemberDb));
      console.log("updateMember form DB", updateMember);
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "success",
          messages: "Member Updated Successfully",
        })
      );
      router.push("/members");
    } else {
      dispatch(
        showSnackBar({
          openState: true,
          successOrError: "error",
          messages: "Update failed: all fields are unchanged.",
        })
      );
    }
  };

  return (
    <NewLayoutApp>
      <main className="min-h-screen p-8 bg-white">
        <h1 className="text-2xl font-semibold mb-4">👤 Edit Members</h1>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Edit Member
          </Typography>
          <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
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
    </NewLayoutApp>
  );
};

export default EditMember;
