import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query; // Extract the product ID from the URL
  const { method } = req;

  try {
    switch (method) {
      // Handle GET request: Get a single product
      case 'GET': {
        const product = await prisma.product.findUnique({
          where: { id: id as string },
        });

        if (!product) {
          return res.status(404).json({ error: 'Product not found.' });
        }

        return res.status(200).json(product);
      }

      // Handle PUT request: Update a product
      case 'PUT': {
        const { name, description, price, quantity } = req.body;

        // Validate input fields
        if (!name || !description || price === undefined || quantity === undefined) {
          return res.status(400).json({ error: 'All fields are required.' });
        }

        const updatedProduct = await prisma.product.update({
          where: { id: id as string },
          data: {
            name,
            description,
            price: parseFloat(price),
            quantity: parseInt(quantity, 10),
          },
        });

        return res.status(200).json(updatedProduct);
      }

      // Handle DELETE request: Delete a product
      case 'DELETE': {
        await prisma.product.delete({
          where: { id: id as string },
        });

        return res.status(204).end(); // No content
      }

      // Method not allowed
      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ error: `Method ${method} not allowed.` });
    }
  } catch (error) {
    console.error('Error handling /api/products/[id]:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}
