import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

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
      // Check if the member exists
      const member = await prisma.member.findUnique({
        where: { id: memberId },
      });

      if (!member) {
        return res.status(404).json({ error: "Member not found." });
      }

      // Check if the book exists and is available
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }

      if (!book.isAvailable) {
        return res
          .status(456)
          .json({ error: "Book is not available for borrowing." });
      }

      // Create the transaction
      const transaction = await prisma.transaction.create({
        data: {
          memberId,
          bookId,
          issuedAt: new Date(),
        },
      });

      // Mark the book as unavailable
      const updateAvailable = await prisma.book.update({
        where: { id: bookId },
        data: { isAvailable: false },
      });

      return res.status(200).json({
        message: "Transaction successful.",
        transaction,
        updateAvailable,
      });
    } catch (error) {
      console.error("Error processing transaction:", error);
      return res.status(500).json({ error: "Internal server error." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed." });
  }
}
