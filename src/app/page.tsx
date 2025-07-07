'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/ui/button';

const HomePage = () => {
	const router = useRouter();

	return (
		<div className="flex h-full bg-yellow-400">
			<Button
				onClick={() => router.push('/fsw-donalds')}
				variant="outline"
				className="m-auto"
			>
				Acessar Self Checkout do Mc Donalds
			</Button>
		</div>
	);
};

export default HomePage;
