import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case "GET": {
        const products = await prisma.product.findMany();
        return res.status(200).json(products);
      }
      case "POST": {
        const { name, description, price, quantity } = req.body;
        if (!name || !description || price === undefined || quantity === undefined) {
          return res.status(400).json({ error: "All fields are required." });
        }
        const product = await prisma.product.create({
          data: { name, description, price: parseFloat(price), quantity: parseInt(quantity, 10) },
        });
        return res.status(201).json(product);
      }
      default:
        res.setHeader("Allow", ["GET", "POST"]);
        return res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error) {
    console.error("Error in /api/products:", error);
    res.status(500).json({ error: "Internal server error." });
  }
}
