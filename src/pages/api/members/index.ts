// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

// 🔸 ADD THIS FUNCTION AT THE TOP
async function generateRandomMemberID(): Promise<string> {
  let memberID: string = "";
  let exists = true;

  while (exists) {
    const rand = Math.floor(Math.random() * 999) + 1;
    memberID = `M${rand.toString().padStart(3, "0")}`;
    const existing = await prisma.member.findUnique({ where: { memberID } });
    if (!existing) exists = false;
  }

  return memberID;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;

  if (method === "GET") {
    const members = await prisma.member.findMany();
    return res.status(200).json({ members });
  } else if (method === "POST") {
    const { name, email, phone } = req.body;

    // Validate input
    const isInvalid = !name || !email || !phone;
    if (isInvalid) {
      return res.status(400).json({ error: "All fields are required" });
    }

    try {
      // Check if email or phone already exists
      const existingMember = await prisma.member.findFirst({
        where: {
          OR: [
            { email }, // Check for duplicate email
            { phone }, // Check for duplicate phone
          ],
        },
      });

      if (existingMember) {
        return res.status(400).json({
          error: "A member with this email or phone number already exists.",
        });
      }

      // Generate unique memberID
      const memberID = await generateRandomMemberID();

      // Create the new member
      const member = await prisma.member.create({
        data: { name, email, phone, memberID },
      });

      return res.status(200).json({ member });
    } catch (error) {
      console.error("Error creating member:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else if (method === "PUT") {
    const { id, ...payload } = req.body;
    const { name, email, phone } = payload;
    const isInvalid = !name || !email || !phone;
    if (isInvalid) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const exist = await prisma.member.findFirst({ where: { id } });
    if (!exist) {
      return res.status(400).json({ error: "Member Not Found" });
    }

    const updateMemberDb = await prisma.member.update({
      data: payload,
      where: { id },
    });

    return res.status(200).json({ updateMemberDb });
  } else if (method === "DELETE") {
    const memberToDelete = Number(req.query.id) as number;
    const borrowedMem = await prisma.book.findFirst({
      where: { borrowedMemberID: memberToDelete },
    });
    if (borrowedMem)
      return res.status(400).json({
        error: "Cannot delete a member that is currently borrowed book.",
      });

    //if (memberToDelete) return res.status(200).send("error");
    // Check if the member exists
    const exist = await prisma.member.findFirst({
      where: { id: memberToDelete },
    });
    if (!exist) {
      return res.status(400).json({ error: "Member Not Found" });
    }

    // Check if the member has borrowed any books
    const borrowedBooks = await prisma.book.findMany({
      where: { borrowedMemberID: memberToDelete },
    });

    if (borrowedBooks.length > 0) {
      return res
        .status(400)
        .json({ error: "Cannot delete a member who has borrowed books." });
    }

    // Proceed with deletion if no borrowed books are found
    const memberDeleted = await prisma.member.update({
      where: { id: memberToDelete },
      data: { isArchived: true },
    });

    return res.status(200).json({ message: "Member deleted successfully." });
  }

  return res.status(405).end(`Method  Not Allowed`);
}
