import { createCanvas, loadImage } from "canvas";
import QRCode from "qrcode";

export async function generateMemberCardPDF(member: {
  memberID: string;
  name: string;
  email: string;
  phone: string;
}) {
  const width = 85.6 * 3.78; // Convert mm to pixels (1 mm = 3.78 px)
  const height = 54 * 3.78;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Border
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, width, height);

  // Member Info
  ctx.fillStyle = "#000000";
  ctx.font = "bold 16px Arial";
  ctx.fillText(`Member ID: ${member.memberID}`, 10, 20);
  ctx.fillText(`Name: ${member.name}`, 10, 40);
  ctx.fillText(`Email: ${member.email}`, 10, 60);
  ctx.fillText(`Phone: ${member.phone}`, 10, 80);

  // Generate QR Code
  const qrCodeDataURL = await QRCode.toDataURL(member.memberID);
  const qrCodeImage = await loadImage(qrCodeDataURL);
  ctx.drawImage(qrCodeImage, width - 80, height - 80, 70, 70);

  // Convert canvas to PDF buffer
  const pdfBuffer = canvas.toBuffer("application/pdf");
  return pdfBuffer;
}
