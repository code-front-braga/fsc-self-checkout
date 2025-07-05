'use client';

import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { useContext } from 'react';

import formatCurrency from '@/helpers/format-currency';
import { Button } from '@/ui/button';

import { CartContext, CartProduct } from '../contexts/cart';

interface CartProductProps {
	product: CartProduct;
}

const CartProductItem = ({ product }: CartProductProps) => {
	const { decreaseProductQuantity, increaseProductQuantity, removeProduct } =
		useContext(CartContext);

	return (
		<div className="flex items-center justify-between px-4">
			{/* Esquerda */}
			<div className="flex items-center gap-3">
				<div className="relative size-20 rounded-xl bg-gray-100">
					<Image src={product.imageUrl} alt={product.name} fill />
				</div>

				<div className="space-y-1">
					<p className="max-w-[90%] truncate text-xs">{product.name}</p>
					<p className="text-sm font-semibold">
						{formatCurrency(product.price)}
					</p>
					{/* Quantidade */}
					<div className="flex items-center gap-1 text-center">
						<Button
							onClick={() => decreaseProductQuantity(product.id)}
							variant="outline"
							className="size-7 rounded-lg"
						>
							<ChevronLeftIcon />
						</Button>
						<p className="w-7 text-xs">{product.quantity}</p>
						<Button
							onClick={() => increaseProductQuantity(product.id)}
							variant="destructive"
							className="size-7 rounded-lg"
						>
							<ChevronRightIcon />
						</Button>
					</div>
				</div>
			</div>
			{/* Botão deletar */}
			<Button
				onClick={() => removeProduct(product.id)}
				variant="outline"
				className="size-7 rounded-lg"
			>
				<TrashIcon />
			</Button>
		</div>
	);
};

export default CartProductItem;
