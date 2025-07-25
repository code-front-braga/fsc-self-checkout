'use client';

import { useContext, useState } from 'react';

import formatCurrency from '@/helpers/format-currency';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/ui/sheet';

import { CartContext } from '../contexts/cart';
import CartProductItem from './cart-product-item';
import FinishOrderDialog from './finish-order-dialog';

const CartSheet = () => {
	const [finishOrderDialogIsOpen, setFinishOrderDialogIsOpen] =
		useState<boolean>(false);
	const { isOpen, toggleCart, products, total } = useContext(CartContext);

	return (
		<Sheet open={isOpen} onOpenChange={toggleCart}>
			<SheetContent className="w-[80%]">
				<SheetHeader>
					<SheetTitle className="text-left">Sacola</SheetTitle>
				</SheetHeader>

				<div className="flex h-full flex-col px-4 py-5">
					<div className="flex-auto space-y-6">
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
					<Button
						onClick={() => setFinishOrderDialogIsOpen(true)}
						className="w-full rounded-full"
					>
						Finalizar Pedido
					</Button>

					<FinishOrderDialog
						open={finishOrderDialogIsOpen}
						onOpenChange={setFinishOrderDialogIsOpen}
					/>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default CartSheet;
