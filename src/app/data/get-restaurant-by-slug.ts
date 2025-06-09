import { notFound } from 'next/navigation';

import { prisma } from '@/lib/db/prisma';

const getRestaurantBySlug = async (slug: string) => {
	const restaurantSlug = await prisma.restaurant.findUnique({
		where: { slug },
		include: { menuCategories: { include: { products: true } } },
	});

	if (!restaurantSlug) return notFound();

	return restaurantSlug;
};

export default getRestaurantBySlug;
