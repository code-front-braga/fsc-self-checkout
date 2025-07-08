'use server';

import { ConsumptionMethod } from 'generated/prisma';
import { revalidatePath } from 'next/cache';

import { prisma } from '@/lib/db/prisma';

import { removeCpfPunctuation } from '../helpers/cpf';

interface CreateOrderInput {
	customerName: string;
	customerCpf: string;
	products: Array<{ id: string; quantity: number }>;
	consumptionMethod: ConsumptionMethod;
	slug: string;
}

export const createOrder = async (input: CreateOrderInput) => {
	const restaurant = await prisma.restaurant.findUnique({
		where: { slug: input.slug },
	});
	if (!restaurant) {
		throw new Error('Restaurante não encontrado.');
	}
	const productsWithPrices = await prisma.product.findMany({
		where: {
			id: {
				in: input.products.map(product => product.id),
			},
		},
	});
	const productsWithPricesAndQuantities = input.products.map(product => ({
		productId: product.id,
		quantity: product.quantity,
		price: productsWithPrices.find(p => p.id === product.id)!.price,
	}));
	const order = await prisma.order.create({
		data: {
			status: 'PENDING',
			customerName: input.customerName,
			customerCpf: removeCpfPunctuation(input.customerCpf),
			orderProducts: {
				createMany: {
					data: productsWithPricesAndQuantities,
				},
			},
			total: productsWithPricesAndQuantities.reduce(
				(acc, product) => acc + product.price * product.quantity,
				0,
			),
			consumptionMethod: input.consumptionMethod,
			restaurantId: restaurant.id,
		},
	});

	revalidatePath(`/${input.slug}/orders`);
	// redirect(
	// 	`/${input.slug}/orders?cpf=${removeCpfPunctuation(input.customerCpf)}`,
	// );
	return order;
};
