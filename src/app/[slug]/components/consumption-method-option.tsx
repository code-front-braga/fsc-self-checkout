import { ConsumptionMethod } from 'generated/prisma';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';

interface ConsumptionMethodOptionProps {
	slug: string;
	imageUrl: string;
	imageAlt: string;
	buttonText: string;
	option: ConsumptionMethod;
}

const ConsumptionMethodOption = ({
	slug,
	imageUrl,
	imageAlt,
	buttonText,
	option,
}: ConsumptionMethodOptionProps) => {
	return (
		<Card>
			<CardContent className="flex flex-col items-center gap-8 py-8">
				<div className="relative h-[80px] w-[80px]">
					<Image
						src={imageUrl}
						alt={imageAlt}
						fill
						className="object-contain"
					/>
				</div>
				<Button variant="secondary" className="rounded-full" asChild>
					<Link href={`/${slug}/menu?consumptionMethod=${option}`}>
						{buttonText}
					</Link>
				</Button>
			</CardContent>
		</Card>
	);
};

export default ConsumptionMethodOption;
