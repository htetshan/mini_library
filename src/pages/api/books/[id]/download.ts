import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Fetch book details from the database
  const book = await prisma.book.findUnique({
    where: { id: Number(id) },
  });

  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  // Adjusted dimensions for a compact card
  const width = 400; // Fixed width for the card
  const height = 150; // Fixed height for the card
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // Book Info (Name)
  ctx.fillStyle = "#000000";
  ctx.font = "bold 20px Arial";
  ctx.fillText(`Book Name: ${book.name}`, 20, height / 2 - 20); // Centered vertically

  if (book.bookID) {
    // Generate QR Code
    const qrCodeDataURL = await QRCode.toDataURL(book.bookID);
    const qrCodeImage = await loadImage(qrCodeDataURL);

    // Draw QR Code on the right side
    const qrSize = 80; // Fixed size for the QR code
    ctx.drawImage(
      qrCodeImage,
      width - qrSize - 20,
      height / 2 - qrSize / 2,
      qrSize,
      qrSize
    );
  }

  // Convert canvas to PNG buffer
  const imageBuffer = canvas.toBuffer("image/png");

  // Send the PNG as a response
  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${book.name}_card.png`
  );
  res.send(imageBuffer);
}
