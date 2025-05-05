import { IncomingForm } from "formidable";
import fs from "fs";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

export const config = {
  api: {
    bodyParser: false,
  },
};
async function generateRandomBookID(): Promise<string> {
  let bookID: string = "";
  let exists = true;

  while (exists) {
    const rand = Math.floor(Math.random() * 9999) + 1; // Generate a random number between 1 and 9999
    bookID = `B${rand.toString().padStart(4, "0")}`; // Format as "B0001", "B1234", etc.
    const existing = await prisma.book.findUnique({ where: { bookID } }); // Check if the bookID exists in the database
    if (!existing) exists = false; // If no existing book is found, exit the loop
  }

  return bookID;
}

const uploadDir = path.join(process.cwd(), "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    res.status(200).send("OK GET");
  } else if (req.method === "POST") {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload failed." });

      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const author = Array.isArray(fields.author)
        ? fields.author[0]
        : fields.author;
      const category = Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category;
      const imageFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;

      if (!name || !author || !category || !imageFile) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      const bookID = await generateRandomBookID(); // Generate a unique bookID

      const fileName = path.basename(imageFile.filepath);
      const imageUrl = "/uploads/" + fileName;

      const newBook = await prisma.book.create({
        data: {
          bookID, // Save the generated bookID
          name,
          author,
          category,
          imageUrl,
        },
      });

      return res.status(200).json({ book: newBook });
    });
  } else if (req.method === "PUT") {
    const form = new IncomingForm({
      uploadDir,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) return res.status(500).json({ error: "Upload failed." });

      const id = Array.isArray(fields.id) ? fields.id[0] : fields.id;
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const author = Array.isArray(fields.author)
        ? fields.author[0]
        : fields.author;
      const category = Array.isArray(fields.category)
        ? fields.category[0]
        : fields.category;
      const imageFile = Array.isArray(files.image)
        ? files.image[0]
        : files.image;

      if (!id || !name || !author || !category) {
        return res.status(400).json({ error: "Missing required fields." });
      }

      let imageUrl;
      if (imageFile) {
        const fileName = path.basename(imageFile.filepath);
        imageUrl = "/uploads/" + fileName;
      }

      const updatedBook = await prisma.book.update({
        where: { id: Number(id) },
        data: {
          name,
          author,
          category,
          ...(imageUrl && { imageUrl }),
        },
      });

      return res.status(200).json({ book: updatedBook });
    });
  } else if (req.method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Book ID is required." });
    }

    try {
      // Find the book to get the image URL
      const book = await prisma.book.findUnique({
        where: { id: Number(id) },
      });

      if (!book) {
        return res.status(404).json({ error: "Book not found." });
      }

      // Delete the image file if it exists
      if (book.imageUrl) {
        const imagePath = path.join(process.cwd(), "public", book.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath); // Remove the image file
        }
      }

      // Delete the book from the database
      const deletedBook = await prisma.book.update({
        where: { id: Number(id) },
        data: { isArchived: true },
      });

      return res
        .status(200)
        .json({ message: "Book deleted successfully.", deletedBook });
    } catch (error) {
      console.error("Error deleting book:", error);
      return res.status(500).json({ error: "Failed to delete book." });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
