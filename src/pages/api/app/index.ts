// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const members = await prisma.member.findMany({
    where: { isArchived: false },
  });
  const books = await prisma.book.findMany({ where: { isArchived: false } });
  const transactions = await prisma.transaction.findMany({
    where: { isArchived: false },
    include: {
      book: true, // Include book details
      member: true, // Include member details
    },
  });
  if (!members || !books) {
    res.status(400).json({ error: "404 not found" });
  }
  res.status(200).json({ members, books, transactions });
}
