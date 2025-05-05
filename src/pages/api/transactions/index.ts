import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const transactions = await prisma.transaction.findMany({
        include: {
          book: true, // Include book details
          member: true, // Include member details
        },
      });

      res.status(200).json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ error: "Failed to fetch transactions." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
