'use server';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { CreateProductInput } from '@/types/forms';

const CreateProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long'),
  price: z.number().positive('Price must be greater than zero'),
  stock: z.number().int().nonnegative('Stock cannot be negative').optional(),
  categoryId: z.number().int().positive('Category is required'),
});

export async function createProduct(input: CreateProductInput) {
  const validatedFields = CreateProductSchema.safeParse(input);
  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0];
    return { error: firstError as string };
  }
  const product = await prisma.product.create({
    data: {
      name: validatedFields.data.name,
      price: validatedFields.data.price,
      stock: validatedFields.data.stock ?? 100,
      categoryId: validatedFields.data.categoryId,
    },
  });
  revalidatePath('/products');
  revalidatePath('/admin');
  return { success: true, product };
}

export async function deleteProduct(productId: number) {
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath('/products');
  revalidatePath('/admin');
}
