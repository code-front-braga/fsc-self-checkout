import { notFound } from 'next/navigation';

import getRestaurantBySlug from '@/app/data/get-restaurant-by-slug';

import RestarantCategories from './components/restaurant-categories';
import RestaurantHeader from './components/restaurant-header';

interface RestaurantMenuPageProps {
	params: Promise<{ slug: string }>;
	searchParams: Promise<{ consumptionMethod: string }>;
}

const isConsumptionMethodValid = (consumptionMethod: string) => {
	return ['DINE_IN', 'TAKEAWAY'].includes(consumptionMethod.toUpperCase());
};

const RestaurantMenuPage = async ({
	params,
	searchParams,
}: RestaurantMenuPageProps) => {
	const { slug } = await params;
	const { consumptionMethod } = await searchParams;

	if (!isConsumptionMethodValid(consumptionMethod)) return notFound();

	const restaurant = await getRestaurantBySlug(slug);

	return (
		<div>
			<RestaurantHeader restaurant={restaurant} />
			<RestarantCategories restaurant={restaurant} />
		</div>
	);
};

export default RestaurantMenuPage;
