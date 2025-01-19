import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const salesOrder = await prisma.salesOrder.findUnique({
          where: { id: id as string },
          include: { items: true },
        });
        if (!salesOrder) return res.status(404).json({ error: "Sales order not found." });
        return res.status(200).json(salesOrder);
      }
      case "PUT": {
        const { status } = req.body;
        if (!status) return res.status(400).json({ error: "Status is required." });
        const updatedOrder = await prisma.salesOrder.update({
          where: { id: id as string },
          data: { status },
        });
        return res.status(200).json(updatedOrder);
      }
      default:
        res.setHeader("Allow", ["GET", "PUT"]);
        return res.status(405).json({ error: `Method ${method} not allowed.` });
    }
 