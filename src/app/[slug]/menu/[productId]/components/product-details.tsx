'use client';

import { Prisma } from 'generated/prisma';
import { ChefHatIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useContext, useState } from 'react';

import formatCurrency from '@/helpers/format-currency';
import { Button } from '@/ui/button';
import { ScrollArea } from '@/ui/scroll-area';

import CartSheet from '../../components/cart-sheet';
import { CartContext } from '../../contexts/cart';

interface ProductDetails {
	product: Prisma.ProductGetPayload<{
		include: { restaurant: { select: { name: true; avatarImageUrl: true } } };
	}>;
}

const ProductDetails = ({ product }: ProductDetails) => {
	const { toggleCart } = useContext(CartContext);
	const [quantity, setQuantity] = useState<number>(1);
	const handleDecreaseQuantity = () => {
		setQuantity(prev => {
			if (prev === 1) return 1;

			return prev - 1;
		});
	};

	const handleIncreaseQuantity = () => {
		setQuantity(prev => prev + 1);
	};

	const handleAddToCart = () => {
		toggleCart();
	};

	return (
		<>
			<div className="relative z-50 mt-[-1.5rem] flex flex-auto flex-col overflow-hidden rounded-t-3xl p-5">
				<div className="flex-auto overflow-hidden">
					<div className="flex items-center gap-1.5">
						<Image
							src={product.restaurant?.avatarImageUrl ?? ''}
							alt={product.restaurant?.name ?? ''}
							width={16}
							height={16}
							className="rounded-full"
						/>
						<p className="text-muted-foreground text-xs">
							{product.restaurant?.name}
						</p>
					</div>
					<h2 className="mt-1 text-xl font-semibold">{product.name}</h2>

					<div className="mt-3 flex items-center justify-between">
						<h3 className="text-xl font-semibold">
							{formatCurrency(product.price)}
						</h3>
						<div className="flex items-center gap-3 text-center">
							<Button
								onClick={handleDecreaseQuantity}
								variant="outline"
								className="h-8 w-8 rounded-xl"
							>
								<ChevronLeftIcon />
							</Button>
							<p className="w-4">{quantity}</p>
							<Button
								onClick={handleIncreaseQuantity}
								variant="destructive"
								className="h-8 w-8 rounded-xl"
							>
								<ChevronRightIcon />
							</Button>
						</div>
					</div>

					<ScrollArea className="mb-4 h-full">
						<div className="mt-6 space-y-3">
							<h4 className="font-semibold">Sobre</h4>
							<p className="text-muted-foreground text-sm">
								{product.description}
							</p>
						</div>

						<div className="mt-6 space-y-3">
							<div className="flex items-center gap-1">
								<ChefHatIcon size={18} />I
								<h4 className="font-semibold">Ingredientes</h4>
							</div>
							<ul className="text-muted-foreground list-disc px-5 text-sm">
								{product.ingredients.map(ingredient => (
									<li key={ingredient}>{ingredient}</li>
								))}
							</ul>
						</div>
					</ScrollArea>
				</div>

				<Button onClick={handleAddToCart} className="w-full rounded-full">
					Adicionar à sacola
				</Button>
			</div>

			<CartSheet />
		</>
	);
};

export default ProductDetails;
