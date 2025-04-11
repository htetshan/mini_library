// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const method = req.method;
  if (method === "GET") {
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
    res.status(200).send("OK PUT");
  } else if (method === "DELETE") {
    res.status(200).send("OK DELETE");
  }
  res.status(405).send("Invalid method");
}
