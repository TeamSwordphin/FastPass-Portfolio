import dotenv from 'dotenv';
import Stripe from 'stripe';

dotenv.config({
	path: '.env.local',
});

function getEnvVar(key: string): string {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
}

// Initialize Stripe clients for live and sandbox environments
const liveStripe = new Stripe(getEnvVar('STRIPE_LIVE_SECRET_KEY'), {
	apiVersion: '2025-08-27.basil',
});

const sandboxStripe = new Stripe(getEnvVar('STRIPE_SECRET_KEY'), {
	apiVersion: '2025-08-27.basil',
});

// Function to clone Products, Entitlement Features, Product Features, Prices, and their relations
async function cloneStripeProductsToSandbox() {
	try {
		console.log('Starting to clone Stripe products, entitlement features, product features, prices, and relations to sandbox...');

		// Fetch all Products from live
		const allLiveProducts = [];
		for await (const product of liveStripe.products.list({ limit: 100 })) {
			allLiveProducts.push(product);
		}

		console.log(`Fetched ${allLiveProducts.length} products from live.`);

		// Fetch all Prices from live
		const allLivePrices = [];
		for await (const price of liveStripe.prices.list({ limit: 100 })) {
			allLivePrices.push(price);
		}

		console.log(`Fetched ${allLivePrices.length} prices from live.`);

		// Create a map of live Product IDs to their Price IDs
		const productPriceMap: Record<string, string[]> = {};
		for (const product of allLiveProducts) {
			const productPrices = await liveStripe.prices.list({ product: product.id, limit: 100 });
			productPriceMap[product.id] = productPrices.data.map((p: any) => p.id);
		}

		// Fetch existing products in sandbox to avoid duplicates
		const existingProducts: Record<string, string> = {};
		for await (const product of sandboxStripe.products.list({ limit: 100 })) {
			existingProducts[product.name] = product.id;
		}

		// Create Products in sandbox (or use existing)
		const productIdMap: Record<string, string> = {};
		console.log(`Creating ${allLiveProducts.length} products in sandbox...`);
		for (const product of allLiveProducts) {
			let productId: string;
			if (existingProducts[product.name]) {
				productId = existingProducts[product.name];
				console.log(`Using existing product: ${product.name} (${productId})`);
			} else {
				const createdProduct = await sandboxStripe.products.create({
					name: product.name,
					description: product.description ?? undefined,
					active: product.active,
					images: product.images,
					metadata: product.metadata,
					package_dimensions: product.package_dimensions ?? undefined,
					shippable: product.shippable ?? undefined,
					statement_descriptor: product.statement_descriptor ?? undefined,
					tax_code: (product.tax_code as string) ?? undefined,
					type: product.type,
					unit_label: product.unit_label ?? undefined,
					url: product.url ?? undefined,
				});
				productId = createdProduct.id;
				console.log(`Created new product: ${product.name} (${productId})`);
			}
			productIdMap[product.id] = productId;
		}

		console.log(`Processed ${Object.keys(productIdMap).length} products in sandbox.`);

		// Clone Entitlement Features
		console.log('Cloning entitlement features...');
		const allLiveFeatures = [];
		for await (const feature of liveStripe.entitlements.features.list({ limit: 100 })) {
			allLiveFeatures.push(feature);
		}
		console.log(`Fetched ${allLiveFeatures.length} entitlement features from live.`);

		// Fetch existing features in sandbox to avoid duplicates
		const existingFeatures: Record<string, string> = {};
		for await (const feature of sandboxStripe.entitlements.features.list({ limit: 100 })) {
			existingFeatures[feature.lookup_key] = feature.id;
		}

		// Create Features in sandbox (or use existing)
		const featureIdMap: Record<string, string> = {};
		for (const feature of allLiveFeatures) {
			let featureId: string;
			if (existingFeatures[feature.lookup_key]) {
				featureId = existingFeatures[feature.lookup_key];
				console.log(`Using existing feature: ${feature.name} (${featureId})`);
			} else {
				const createdFeature = await sandboxStripe.entitlements.features.create({
					name: feature.name,
					lookup_key: feature.lookup_key,
					metadata: feature.metadata,
				});
				featureId = createdFeature.id;
				console.log(`Created new feature: ${feature.name} (${featureId})`);
			}
			featureIdMap[feature.id] = featureId;
		}
		console.log(`Processed ${Object.keys(featureIdMap).length} entitlement features in sandbox.`);

		// Clone Product Features
		console.log('Cloning product features...');
		for (const liveProductId of Object.keys(productIdMap)) {
			const sandboxProductId = productIdMap[liveProductId];
			try {
				const liveProductFeatures = await liveStripe.products.listFeatures(liveProductId, {
					limit: 100,
				});
				console.log(`Fetched ${liveProductFeatures.data.length} product features for product ${liveProductId}`);

				for (const productFeature of liveProductFeatures.data) {
					const liveFeatureId = productFeature.entitlement_feature.id;
					const sandboxFeatureId = featureIdMap[liveFeatureId];
					if (!sandboxFeatureId) {
						console.log(`Skipping product feature for unknown feature ${liveFeatureId}`);
						continue;
					}

					try {
						await sandboxStripe.products.createFeature(sandboxProductId, {
							entitlement_feature: sandboxFeatureId,
						});
						console.log(`Created product feature for sandbox product ${sandboxProductId} with feature ${sandboxFeatureId}`);
					} catch (error: any) {
						if (error.code === 'resource_already_exists') {
							console.log(`Product feature already exists for sandbox product ${sandboxProductId} with feature ${sandboxFeatureId}`);
						} else {
							console.error(`Error creating product feature for product ${sandboxProductId} with feature ${sandboxFeatureId}:`, error.message);
						}
					}
				}
			} catch (error: any) {
				console.error(`Error fetching product features for product ${liveProductId}:`, error.message);
			}
		}
		console.log('Finished cloning product features.');

		// Fetch existing prices in sandbox to avoid duplicates
		const existingPrices: Record<string, string> = {};
		for await (const price of sandboxStripe.prices.list({ limit: 100 })) {
			if (price.lookup_key) {
				existingPrices[price.lookup_key] = price.id;
			}
		}

		// Create Prices in sandbox (or use existing)
		const priceIdMap: Record<string, string> = {};
		console.log(`Creating ${allLivePrices.length} prices in sandbox...`);
		for (const price of allLivePrices) {
			let priceId: string;
			if (price.lookup_key && existingPrices[price.lookup_key]) {
				priceId = existingPrices[price.lookup_key];
				console.log(`Using existing price: ${price.lookup_key} (${priceId})`);
			} else {
				const createdPrice = await sandboxStripe.prices.create({
					currency: price.currency,
					unit_amount: price.unit_amount ?? undefined,
					product: productIdMap[price.product as string],
					nickname: price.nickname ?? undefined,
					lookup_key: price.lookup_key ?? undefined,
					metadata: price.metadata,
					recurring: price.recurring
						? {
								...price.recurring,
								meter: price.recurring.meter ?? undefined,
								trial_period_days: price.recurring.trial_period_days ?? undefined,
							}
						: undefined,
					tax_behavior: price.tax_behavior ?? undefined,
				});
				priceId = createdPrice.id;
				console.log(`Created new price: ${price.lookup_key || price.nickname} (${priceId})`);
			}
			priceIdMap[price.id] = priceId;
		}

		console.log(`Processed ${Object.keys(priceIdMap).length} prices in sandbox.`);

		// Update productPriceMap to use sandbox product ids and price ids
		const updatedProductPriceMap: Record<string, string[]> = {};
		for (const liveProductId in productPriceMap) {
			const sandboxProductId = productIdMap[liveProductId];
			updatedProductPriceMap[sandboxProductId] = productPriceMap[liveProductId].map((livePriceId) => priceIdMap[livePriceId]);
		}

		// Prices are associated with products during creation
		console.log('Prices are associated with products during creation.');
		// No additional association needed

		// Clone billing portal configurations
		console.log('Cloning billing portal configurations...');
		const configurations = [];
		for await (const config of liveStripe.billingPortal.configurations.list({ limit: 100 })) {
			configurations.push(config);
		}
		console.log(`Fetched ${configurations.length} portal configurations.`);
		let configCount = 0;
		for (const config of configurations) {
			console.log('Original config features:', JSON.stringify(config.features, null, 2));
			const newFeatures = config.features
				? {
						...config.features,
						subscription_update: config.features.subscription_update
							? {
									...config.features.subscription_update,
									products:
										(config.features.subscription_update.products || []).length > 0
											? (config.features.subscription_update.products || []).map((product) => ({
													...product,
													product: productIdMap[product.product] || product.product,
													adjustable_quantity: product.adjustable_quantity
														? {
																...product.adjustable_quantity,
																maximum: product.adjustable_quantity.maximum ?? undefined,
																minimum: product.adjustable_quantity.minimum ?? undefined,
															}
														: undefined,
												}))
											: Object.values(productIdMap).map((sandboxProductId) => ({
													product: sandboxProductId,
													prices: updatedProductPriceMap[sandboxProductId] || [],
													adjustable_quantity: { enabled: false },
												})),
								}
							: {
									products: Object.values(productIdMap).map((sandboxProductId) => ({
										product: sandboxProductId,
										prices: updatedProductPriceMap[sandboxProductId] || [],
										adjustable_quantity: { enabled: false },
									})),
									default_allowed_updates: [],
									enabled: false,
									proration_behavior: 'create_prorations',
									schedule_at_period_end: false,
								},
					}
				: undefined;
			console.log('New features:', JSON.stringify(newFeatures, null, 2));
			const newConfig = await sandboxStripe.billingPortal.configurations.create({
				business_profile: config.business_profile
					? {
							...(config.business_profile.headline && {
								headline: config.business_profile.headline,
							}),
							...(config.business_profile.privacy_policy_url && {
								privacy_policy_url: config.business_profile.privacy_policy_url,
							}),
							...(config.business_profile.terms_of_service_url && {
								terms_of_service_url: config.business_profile.terms_of_service_url,
							}),
						}
					: undefined,
				features: newFeatures as any,
				default_return_url: config.default_return_url,
				metadata: config.metadata ?? undefined,
			});
			configCount++;
			console.log(`Created portal configuration: ${newConfig.id}`);
		}
		console.log(`Created ${configCount} portal configurations.`);

		console.log('Successfully cloned Products, Prices, Portal Configurations, and relations to sandbox.');
	} catch (error) {
		console.error('Error cloning to sandbox:', error);
		process.exit(1);
	}
}

// Run the script
cloneStripeProductsToSandbox();
