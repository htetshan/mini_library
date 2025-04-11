import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { memberId, bookId } = req.body;

    try {
      const transaction = await prisma.transaction.findFirst({
        where: {
          memberId,
          bookId,
          status: "borrowed",
        },
      });

      if (!transaction) {
        return res.status(404).json({ error: "No active borrow found" });
      }

      // Update the transaction to 'returned'
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "returned" },
      });

      // Update the book's borrowedCopies
      const book = await prisma.book.findUnique({ where: { id: bookId } });
      await prisma.book.update({
        where: { id: bookId },
        data: { borrowedCopies: book!.borrowedCopies - 1 },
      });

      res.status(200).json({ message: "Book returned successfully" });
    } catch (error) {
      res.status(400).json({ error: "Error returning book" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
