import { useQuery } from '@tanstack/react-query';
import { lookupKeys, discountKeys } from '@/lib/constants/price-lookup-keys';
import { siteSettings } from '@/lib/constants/site-settings';

type StripeProduct = {
	productId: string;
	priceId: string;
	name: string;
	amount: number;
	currency: string;
};

export type ServiceWithProduct = {
	order: number;
	enabled: boolean;
	lookupKey: string;
	product?: StripeProduct | null;
	defaultProduct?: StripeProduct | null;
};

// Random comment
async function fetchAdditionalServices() {
	const res = await fetch('/api/checkout-sessions/get');
	if (!res.ok) throw new Error('Failed fetching additional services');
	const data = await res.json();

	const activeDiscountKey = Object.entries(siteSettings).find(([_, enabled]) => enabled)?.[0] as keyof typeof discountKeys | undefined;

	const servicesArray: ServiceWithProduct[] = Object.values(lookupKeys.additional).map((service: any) => ({
		order: service.order,
		enabled: service.enabled ?? false,
		lookupKey: service.lookupKey,
		product: null,
		defaultProduct: null,
	}));

	servicesArray.forEach((service) => {
		const baseLookupKey = service.lookupKey;
		const discountSuffix = activeDiscountKey ? discountKeys[activeDiscountKey] : '';
		const discountedKey = `${baseLookupKey}_${discountSuffix}`;

		const defaultProduct = data.find((p: any) => p.lookupKey === baseLookupKey);
		if (defaultProduct) {
			service.defaultProduct = {
				productId: defaultProduct.productId,
				priceId: defaultProduct.priceId,
				name: defaultProduct.productName,
				amount: defaultProduct.unitAmount,
				currency: defaultProduct.currency,
			};
		}

		const productMatch = data.find((p: any) => p.lookupKey === discountedKey) || defaultProduct;

		if (productMatch) {
			service.product = {
				productId: productMatch.productId,
				priceId: productMatch.priceId,
				name: productMatch.productName,
				amount: productMatch.unitAmount,
				currency: productMatch.currency,
			};
		}
	});

	servicesArray.sort((a, b) => a.order - b.order);

	return servicesArray;
}

export function useAdditionalServices() {
	return useQuery({
		queryKey: ['additional-services'],
		queryFn: fetchAdditionalServices,
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
}
