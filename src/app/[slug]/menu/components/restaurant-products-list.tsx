import { Product } from 'generated/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

import formatCurrency from '@/helpers/format-currency';

interface RestaurantProductsList {
	products: Product[];
}

const RestaurantProductsList = ({ products }: RestaurantProductsList) => {
	const { slug } = useParams<{ slug: string }>();
	const searchParams = useSearchParams();
	const consumptionMethod = searchParams.get('consumptionMethod');

	return (
		<div className="space-y-3 px-5">
			{products.map(product => (
				<Link
					key={product.id}
					href={`/${slug}/menu/${product.id}?consumptionMethod=${consumptionMethod}`}
					className="flex items-center justify-between gap-10 border-b py-3"
				>
					<div>
						<h3 className="text-sm font-medium">{product.name}</h3>
						<p className="text-muted-foreground line-clamp-2 text-sm">
							{product.description}
						</p>
						<p className="pt-3 text-sm font-semibold">
							{formatCurrency(product.price)}
						</p>
					</div>

					<div className="relative min-h-[82px] min-w-[120px]">
						<Image
							src={product.imageUrl}
							alt={product.name}
							fill
							className="rounded-lg object-contain"
						/>
					</div>
				</Link>
			))}
		</div>
	);
};

export default RestaurantProductsList;
