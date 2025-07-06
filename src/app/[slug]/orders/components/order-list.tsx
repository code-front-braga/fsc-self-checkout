import { OrderStatus, Prisma } from 'generated/prisma';
import { ChevronLeftIcon, ScrollTextIcon } from 'lucide-react';
import Image from 'next/image';

import formatCurrency from '@/helpers/format-currency';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Separator } from '@/ui/separator';

interface OrderListProps {
	orders: Prisma.OrderGetPayload<{
		include: {
			restaurant: { select: { name: true; avatarImageUrl: true } };
			orderProducts: { include: { product: true } };
		};
	}>[];
}

const OrderList = ({ orders }: OrderListProps) => {
	const getStatusLabel = (status: OrderStatus) => {
		if (status === 'FINISHED') return 'Finalizado';
		if (status === 'IN_PREPARATION') return 'Em preparo';
		if (status === 'PENDING') return 'Pendente';
	};

	return (
		<div className="space-y-6 p-6">
			<Button size="icon" variant="secondary" className="rounded-full">
				<ChevronLeftIcon />
			</Button>
			<div className="flex items-center gap-3">
				<ScrollTextIcon />
				<h2 className="text-lg font-semibold">Meus Pedidos</h2>
			</div>
			{orders.map(order => (
				<Card key={order.id}>
					<CardContent className="space-y-4 p-5">
						<div
							className={`w-fit rounded-full px-2 py-1 text-xs font-semibold ${order.status === OrderStatus.FINISHED ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-500'}`}
						>
							{getStatusLabel(order.status)}
						</div>
						<div className="flex items-center gap-2">
							<div className="relative size-5">
								<Image
									src={order.restaurant?.avatarImageUrl as string}
									alt={order.restaurant?.name as string}
									fill
									className="rounded-sm"
								/>
							</div>
							<p className="text-sm font-semibold">{order.restaurant?.name}</p>
						</div>
						<Separator />
						<div className="space-y-2">
							{order.orderProducts.map(orderProduct => (
								<div key={orderProduct.id} className="flex items-center gap-2">
									<div className="flex size-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
										{orderProduct.quantity}
									</div>
									<p className="text-sm">{orderProduct.product?.name}</p>
								</div>
							))}
						</div>
						<Separator />
						<p className="text-sm font-medium">{formatCurrency(order.total)}</p>
					</CardContent>
				</Card>
			))}
		</div>
	);
};

export default OrderList;
