import '@/styles/globals.css';

import { Inter } from 'next/font/google';

import { CartProvider } from './[slug]/menu/contexts/cart';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${inter.className} antialiased`}>
				<CartProvider>{children}</CartProvider>
			</body>
		</html>
	);
}
