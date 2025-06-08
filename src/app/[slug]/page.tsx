import Image from 'next/image';

import getRestaurantBySlug from '../data/get-restaurant-by-slug';
import ConsumptionMethodOption from './components/consumption-method-option';

interface RestaurantPageProps {
	params: Promise<{ slug: string }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
	const { slug } = await params;

	const restaurant = await getRestaurantBySlug(slug);

	return (
		<div className="flex h-screen flex-col items-center justify-center px-6 pt-24">
			<div className="flex flex-col items-center gap-2">
				<Image
					src={restaurant.avatarImageUrl}
					alt={restaurant.name}
					width={82}
					height={82}
				/>
				<h2>{restaurant.name}</h2>
			</div>
			<div className="space-y-2 pt-24 text-center">
				<h3 className="text-2xl font-semibold">Seja bem-vindo!</h3>
				<p>
					Escolha como prefere aproveitar sua refeição. Estamos oferecendo
					praticidade e sabor em cada detalhe!
				</p>
			</div>
			<div className="grid grid-cols-2 gap-4 pt-14">
				<ConsumptionMethodOption
					option="DINE_IN"
					slug={slug}
					buttonText="Para comer aqui"
					imageAlt="Comer aqui"
					imageUrl="/dinein.png"
				/>
				<ConsumptionMethodOption
					slug={slug}
					option="TAKEAWAY"
					buttonText="Para levar"
					imageAlt="Para levar"
					imageUrl="/takeaway.png"
				/>
			</div>
		</div>
	);
};

export default RestaurantPage;
