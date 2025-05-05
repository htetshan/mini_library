import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { memberId, bookId } = req.body;

    // Validate input
    if (!memberId || !bookId) {
      return res
        .status(400)
        .json({ error: "Member ID and Book ID are required." });
    }

    try {
      // Find the active transaction for the member and book
      const transaction = await prisma.transaction.findFirst({
        where: {
          memberId,
          bookId,
          returnedAt: null, // Ensure the book is currently borrowed
        },
      });

      if (!transaction) {
        return res.status(404).json({
          error: "No active borrow transaction found for this book and member.",
        });
      }

      // Update the transaction to mark the book as returned
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { returnedAt: new Date() },
      });

      // Update the book to make it available
      const updateReturn = await prisma.book.update({
        where: { id: bookId },
        data: { isAvailable: true, borrowedMemberID: null },
      });
      const transactions = await prisma.transaction.findMany({
        include: {
          book: true, // Include book details
          member: true, // Include member details
        },
      });

      return res.status(200).json({ updateReturn, transactions });
    } catch (error) {
      console.error("Error returning book:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
