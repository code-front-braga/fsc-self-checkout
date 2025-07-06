'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import z from 'zod';

import { Button } from '@/ui/button';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
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

import { isValidCpf, removeCpfPunctuation } from '../../menu/helpers/cpf';

const formSchema = z.object({
	cpf: z
		.string()
		.trim()
		.min(1, { message: 'O CPF é obrigatório' })
		.refine(value => isValidCpf(value), { message: 'CPF inválido.' }),
});

type FormSchema = z.infer<typeof formSchema>;

const CpfForm = () => {
	const form = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: { cpf: '' },
	});
	const { handleSubmit, control } = form;
	const router = useRouter();
	const { back, push } = router;
	const pathname = usePathname();

	const onSubmit = async (data: FormSchema) => {
		push(`${pathname}?cpf=${removeCpfPunctuation(data.cpf)}`);
	};

	const handleCancel = () => back();

	return (
		<Drawer open>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Visualizar Pedidos</DrawerTitle>
					<DrawerDescription>
						Insira seu CPF abaixo para visualizar seus pedidos.
					</DrawerDescription>
				</DrawerHeader>

				<Form {...form}>
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={control}
							name="cpf"
							render={({ field }) => (
								<FormItem className="px-4">
									<FormLabel>Seu CPF</FormLabel>
									<FormControl>
										<PatternFormat
											customInput={Input}
											{...field}
											placeholder="Digite seu CPF..."
											format="###.###.###-##"
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
								className="w-full rounded-full"
							>
								Confirmar
							</Button>
							<DrawerClose asChild>
								<Button
									variant="outline"
									onClick={handleCancel}
									className="w-full rounded-full"
								>
									Cancelar
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</form>
				</Form>
			</DrawerContent>
		</Drawer>
	);
};

export default CpfForm;
