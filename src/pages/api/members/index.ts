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
  }

  if (method === "POST") {
    const { name, email, phone } = req.body;

    const isInvalid = !name || !email || !phone;
    if (isInvalid) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // 🔸 Generate unique memberID here
    const memberID = await generateRandomMemberID();

    const member = await prisma.member.create({
      data: { name, email, phone, memberID },
    });

    return res.status(200).json({ member });
  }

  if (method === "PUT") {
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
  }

  if (method === "DELETE") {
    const memberToDelete = Number(req.query.id);

    const exist = await prisma.member.findFirst({
      where: { id: memberToDelete },
    });
    if (!exist) {
      return res.status(400).json({ error: "Member Not Found" });
    }

    const memberDeleted = await prisma.member.delete({
      where: { id: memberToDelete },
    });

    return res.status(200).json({ memberDeletedId: memberDeleted.id });
  }

  res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
