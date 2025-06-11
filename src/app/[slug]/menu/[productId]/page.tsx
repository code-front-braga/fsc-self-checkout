import getProductsById from '@/app/data/get-products-by-id';

import ProductHeader from './components/product-header';

interface ProductPageProps {
	params: Promise<{ slug: string; productId: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
	const { slug, productId } = await params;
	const product = await getProductsById(productId);

	return (
		<>
			<ProductHeader product={product} />
			<h1>Product Page</h1>
			{slug}
			{productId}
		</>
	);
};

export default ProductPage;
