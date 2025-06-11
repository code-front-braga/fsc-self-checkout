'use server';

import { notFound } from 'next/navigation';

import { prisma } from '@/lib/db/prisma';

const getProductsById = async (id: string) => {
	const product = await prisma.product.findUnique({ where: { id } });

	if (!product) return notFound();

	return product;
};

export default getProductsById;
