// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
    const members = await prisma.member.findMany();
    res.status(200).json({ members });
    res.status(200).send("OK GET");
  } else if (method === "POST") {
    const { name, email, phone } = req.body;

    const isInvalid = !name || !email || !phone;

    if (isInvalid) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const member = await prisma.member.create({
      data: { name, email, phone },
    });

    //const menuCategoryMenu=await prisma.menuCategoryMenu.create({data:{menuId:menu.id,menuCategoryId:menuCategoryIds}})
    res.status(200).json({ member });
  } else if (method === "PUT") {
    const { id, ...payload } = req.body;
    const { name, email, phone } = payload;
    const isInvalid = !name || !email || !phone;

    if (isInvalid) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const exist = await prisma.member.findFirst({ where: { id } });
    if (!exist) {
      return res.status(400).json({ error: "Member Not Found" });
    }
    const updateMemberDb = await prisma.member.update({
      data: payload,
      where: { id },
    });

    res.status(200).json({ updateMemberDb });
  } else if (method === "DELETE") {
    const memberToDelete = Number(req.query.id);

    const exist = await prisma.member.findFirst({
      where: { id: memberToDelete },
    });
    if (!exist) {
      return res.status(400).json({ error: "Member Not Found" });
    }
    const memberDeleted = await prisma.member.delete({
      where: { id: memberToDelete },
    });
    const memberDeletedId = memberDeleted.id;
    res.status(200).json({ memberDeletedId });
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
  res.status(405).send("Invalid method");
}
