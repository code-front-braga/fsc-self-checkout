'use client';

import { useContext } from 'react';

import formatCurrency from '@/helpers/format-currency';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/ui/sheet';

import { CartContext } from '../contexts/cart';
import CartProductItem from './cart-product-item';

const CartSheet = () => {
	const { isOpen, toggleCart, products, total } = useContext(CartContext);

	return (
		<Sheet open={isOpen} onOpenChange={toggleCart}>
			<SheetContent className="w-[80%]">
				<SheetHeader>
					<SheetTitle className="text-left">Sacola</SheetTitle>
				</SheetHeader>

				<div className="flex h-full flex-col px-4 py-5">
					<div className="flex-auto">
						{products.map(product => (
							<CartProductItem key={product.id} product={product} />
						))}
					</div>
					<Card className="mb-6">
						<CardContent className="p-2">
							<div className="flex justify-between">
								<p className="text-muted-foreground text-sm">Total</p>
								<p className="text-sm font-semibold">{formatCurrency(total)}</p>
							</div>
						</CardContent>
					</Card>
					<Button className="w-full rounded-full">Finalizar Pedido</Button>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default CartSheet;
