import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  // Fetch member details from the database
  const member = await prisma.member.findUnique({
    where: { id: Number(id) },
  });

  if (!member) {
    return res.status(404).json({ error: "Member not found" });
  }

  // Generate the member card as an image
  const width = 856; // 85.6mm in pixels (1mm = 10px for high resolution)
  const height = 540; // 54mm in pixels
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 5;
  ctx.strokeRect(0, 0, width, height);

  // Member Info
  ctx.fillStyle = "#000000";
  ctx.font = "bold 40px Arial";
  ctx.fillText(`Member ID: ${member.memberID}`, 50, 100);
  ctx.fillText(`Name: ${member.name}`, 50, 160);
  ctx.fillText(`Email: ${member.email}`, 50, 220);
  ctx.fillText(`Phone: ${member.phone}`, 50, 280);

  // Generate QR Code
  if (member.memberID) {
    const qrCodeDataURL = await QRCode.toDataURL(member.memberID);
    const qrCodeImage = await loadImage(qrCodeDataURL);
    ctx.drawImage(qrCodeImage, width - 200, height - 200, 150, 150);
  }

  // Convert canvas to PNG buffer
  const imageBuffer = canvas.toBuffer("image/png");

  // Send the PNG as a response
  res.setHeader("Content-Type", "image/png");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${member.name}_card.png`
  );
  res.send(imageBuffer);
}
