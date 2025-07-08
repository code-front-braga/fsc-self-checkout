import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

import { prisma } from '@/lib/db/prisma';

export async function POST(request: Request) {
	if (!process.env.STRIPE_SECRET_KEY) {
		throw new Error('Missin Stripe secret key');
	}
	const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
		apiVersion: '2025-06-30.basil',
	});
	const signature = request.headers.get('stripe-signature');
	if (!signature) {
		return NextResponse.error();
	}

	const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_KEY;
	if (!webhookSecret) {
		throw new Error('Missin Stripe webhook secret key');
	}
	const text = await request.text();
	const event = stripe.webhooks.constructEvent(text, signature, webhookSecret);

	switch (event.type) {
		case 'checkout.session.completed':
			{
				const orderId = event.data.object.metadata?.orderId;
				if (!orderId) {
					return NextResponse.json({ received: true });
				}
				const order = await prisma.order.update({
					where: { id: Number(orderId) },
					data: { status: 'PAYMENT_CONFIRMED' },
					include: { restaurant: { select: { slug: true } } },
				});

				revalidatePath(`/${order.restaurant?.slug}/orders`);
			}
			break;

		case 'charge.failed':
			{
				const orderId = event.data.object.metadata?.orderId;
				if (!orderId) {
					return NextResponse.json({ received: true });
				}
				const order = await prisma.order.update({
					where: { id: Number(orderId) },
					data: { status: 'PAYMENT_FAILED' },
					include: { restaurant: { select: { slug: true } } },
				});

				revalidatePath(`/${order.restaurant?.slug}/orders`);
			}
			break;
	}

	return NextResponse.json({
		received: true,
	});
}
