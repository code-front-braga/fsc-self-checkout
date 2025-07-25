'use client';

import { Product } from 'generated/prisma';
import { ChevronLeftIcon, ScrollTextIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/ui/button';

interface ProductHeaderProps {
	product: Pick<Product, 'imageUrl' | 'name'>;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
	const { slug } = useParams<{ slug: string }>();
	const { back, push } = useRouter();

	const handleBackClick = () => back();
	const handleOrdersClick = () => push(`/${slug}/orders`);

	return (
		<div className="relative min-h-[300px] w-full">
			<Button
				onClick={handleBackClick}
				variant="secondary"
				size="icon"
				className="absolute top-4 left-4 z-50 rounded-full"
			>
				<ChevronLeftIcon />
			</Button>

			<Image
				src={product.imageUrl}
				alt={product.name}
				fill
				className="object-contain"
			/>

			<Button
				onClick={handleOrdersClick}
				variant="secondary"
				size="icon"
				className="absolute top-4 right-4 z-50 rounded-full"
			>
				<ScrollTextIcon />
			</Button>
		</div>
	);
};

export default ProductHeader;
