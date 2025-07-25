'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { loadStripe } from '@stripe/stripe-js';
import { ConsumptionMethod } from 'generated/prisma';
import { Loader2 } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { z } from 'zod';

import { Button } from '@/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/ui/drawer';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/ui/form';
import { Input } from '@/ui/input';

import { createOrder } from '../actions/create-order';
import { createStripeCheckout } from '../actions/create-stripe-checkout';
import { CartContext } from '../contexts/cart';
import { isValidCpf } from '../helpers/cpf';

const formSchema = z.object({
	name: z.string().trim().min(1, { message: 'O nome é obrigatório.' }),
	cpf: z
		.string()
		.trim()
		.min(1, { message: 'O CPF é obrigatório' })
		.refine(value => isValidCpf(value), { message: 'CPF inválido.' }),
});

type FormSchema = z.infer<typeof formSchema>;

interface FinishOrderDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
	const { slug } = useParams<{ slug: string }>();
	const { products } = useContext(CartContext);
	const searchParams = useSearchParams();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: { name: '', cpf: '' },
		shouldUnregister: true,
	});
	const { handleSubmit, control } = form;

	const onSubmit = async (data: FormSchema) => {
		try {
			setIsLoading(true);
			const consumptionMethod = searchParams.get(
				'consumptionMethod',
			) as ConsumptionMethod;

			const order = await createOrder({
				consumptionMethod,
				customerCpf: data.cpf,
				customerName: data.name,
				products,
				slug,
			});
			const stripeCheckoutResult = await createStripeCheckout({
				products,
				orderId: order.id,
				slug,
				consumptionMethod,
				cpf: data.cpf,
			});
			if (!stripeCheckoutResult) return;
			const { sessionId } = stripeCheckoutResult;
			if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) return;
			const stripe = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY,
			);
			stripe?.redirectToCheckout({
				sessionId: sessionId,
			});
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Drawer open={open} onOpenChange={onOpenChange}>
			<DrawerTrigger asChild></DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Finalizar Pedido</DrawerTitle>
					<DrawerDescription>
						Insira suas informações abaixo para finalizar o seu pedido
					</DrawerDescription>
				</DrawerHeader>
				<div className="p-5">
					<Form {...form}>
						<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								name="name"
								control={control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Seu Nome</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Digite seu nome..." />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								name="cpf"
								control={control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Seu CPF</FormLabel>
										<FormControl>
											<PatternFormat
												placeholder="Digite seu CPF..."
												format="###.###.###-##"
												customInput={Input}
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<DrawerFooter className="p-0">
								<Button
									type="submit"
									variant="destructive"
									disabled={isLoading}
									className="rounded-full"
								>
									{isLoading && <Loader2 className="animate-spin" />}
									Finalizar
								</Button>
								<DrawerClose asChild>
									<Button variant="outline" className="w-full rounded-full">
										Cancelar
									</Button>
								</DrawerClose>
							</DrawerFooter>
						</form>
					</Form>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default FinishOrderDialog;
