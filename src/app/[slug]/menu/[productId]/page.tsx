import { notFound } from 'next/navigation';

import getProductsById from '@/app/data/get-products-by-id';

import ProductDetails from './components/product-details';
import ProductHeader from './components/product-header';

interface ProductPageProps {
	params: Promise<{ slug: string; productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
	const { slug, productId } = await params;
	const product = await getProductsById(productId);

	if (product.restaurant?.slug.toUpperCase() !== slug.toUpperCase())
		return notFound();

	return (
		<div className="flex h-full flex-col">
			<ProductHeader product={product} />
			<ProductDetails product={product} />
		</div>
	);
};

export default ProductPage;
