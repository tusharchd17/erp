import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const salesOrders = await prisma.salesOrder.findMany({ include: { items: true } });
        return res.status(200).json(salesOrders);
      }
      case "POST": {
        const { orderDate, customerName, items } = req.body;
        if (!orderDate || !customerName || !items || items.length === 0) {
          return res.status(400).json({ error: "Invalid input." });
        }
        const totalAmount = items.reduce((sum, item) => sum + item.totalPrice, 0);
        const salesOrder = await prisma.salesOrder.create({
          data: {
            orderDate: new Date(orderDate),
            customerName,
            totalAmount,
            status: "pending",
            items: {
              create: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                totalPrice: item.totalPrice,
              })),
            },
          },
        });
        return res.status(201).json(salesOrder);
      }
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error) {
    console.error("Error in /api/sales-orders:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}