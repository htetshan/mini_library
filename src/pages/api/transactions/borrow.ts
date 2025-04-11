import { prisma } from "@/lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { memberId, bookId } = req.body;

    try {
      const book = await prisma.book.findUnique({
        where: { id: bookId },
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found" });
      }

      if (book.borrowedCopies >= book.totalCopies) {
        return res.status(400).json({ error: "No available copies left" });
      }

      // Create transaction
      await prisma.transaction.create({
        data: {
          memberId,
          bookId,
          status: "borrowed",
        },
      });

      // Update borrowed copies of the book
      await prisma.book.update({
        where: { id: bookId },
        data: { borrowedCopies: book.borrowedCopies + 1 },
      });

      res.status(200).json({ message: "Book borrowed successfully" });
    } catch (error) {
      res.status(400).json({ error: "Error borrowing book" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
