'use client';

import { Prisma } from 'generated/prisma';
import { ClockIcon } from 'lucide-react';
import Image from 'next/image';
import { useContext, useState } from 'react';

import formatCurrency from '@/helpers/format-currency';
import { Button } from '@/ui/button';
import { ScrollArea, ScrollBar } from '@/ui/scroll-area';

import { CartContext } from '../contexts/cart';
import CartSheet from './cart-sheet';
import RestaurantProductsList from './restaurant-products-list';

interface RestarantCategoriesProps {
	restaurant: Prisma.RestaurantGetPayload<{
		include: { menuCategories: { include: { products: true } } };
	}>;
}

type MenuCategoriesWithProducts = Prisma.MenuCategoryGetPayload<{
	include: { products: true };
}>;

const RestarantCategories = ({ restaurant }: RestarantCategoriesProps) => {
	const [selectedCategory, setSelectedCategory] =
		useState<MenuCategoriesWithProducts>(restaurant.menuCategories[0]);
	const { products, total, toggleCart, totalQuantity } =
		useContext(CartContext);

	const handleCategoryClick = (category: MenuCategoriesWithProducts) => {
		setSelectedCategory(category);
	};

	const getCategoryButtonVariant = (category: MenuCategoriesWithProducts) => {
		return selectedCategory.id === category.id ? 'default' : 'secondary';
	};

	return (
		<div className="relative z-50 -mt-[1.5rem] rounded-t-3xl bg-white">
			<div className="p-5">
				<div className="flex items-center gap-3">
					<Image
						src={restaurant.avatarImageUrl}
						alt={restaurant.name}
						width={45}
						height={45}
					/>
					<div>
						<h2 className="text-lg font-semibold">{restaurant.name}</h2>
						<p className="text-xs opacity-55">{restaurant.description}</p>
					</div>
				</div>
				<div className="mt-3 flex items-center gap-1 text-xs text-green-500">
					<ClockIcon size={12} />
					<p>Aberto!</p>
				</div>
			</div>

			<ScrollArea className="w-full">
				<div className="flex w-max space-x-4 p-4 pt-0">
					{restaurant.menuCategories.map(category => (
						<Button
							key={category.id}
							variant={getCategoryButtonVariant(category)}
							size="sm"
							onClick={() => handleCategoryClick(category)}
							className="rounded-full"
						>
							{category.name}
						</Button>
					))}
				</div>

				<ScrollBar orientation="horizontal" />
			</ScrollArea>

			<h3 className="px-5 pt-2 font-semibold">{selectedCategory.name}</h3>
			<RestaurantProductsList products={selectedCategory.products} />

			{products.length > 0 && (
				<div className="fixed bottom-0 left-0 flex w-full items-center justify-between border-t bg-white px-5 py-3">
					<div>
						<p className="text-muted-foreground text-xs">Total dos pedidos</p>
						<p className="text-sm font-semibold">
							{formatCurrency(total)}
							<span className="text-muted-foreground text-xs font-normal">
								/ {totalQuantity} {totalQuantity ? 'itens' : 'item'}
							</span>
						</p>
					</div>
					<Button onClick={toggleCart}>Ver Sacola</Button>
					<CartSheet />
				</div>
			)}
		</div>
	);
};

export default RestarantCategories;
