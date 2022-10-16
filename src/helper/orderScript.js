import {isOnProduction} from "./IsOnProduction";

export default ({incrementId, totals, items  }) => {
	if (localStorage.getItem('orderId') !== incrementId && isOnProduction()) {
		window.dataLayer = window.dataLayer || [];
		window.dataLayer.push({
			event: 'purchase',
			transaction_id: incrementId,
			value: totals.grandTotal,
			tax: totals.taxAmount,
			shipping: totals.shippingAmount,
			currency: 'USD',
			items: items.map((item) => {
				return {
					item_id: item.sku,
					item_name: item.name,
					currency: 'USD',
					price: item.price,
					quantity:item.qty
				}
			})
		})
		localStorage.setItem('orderId', incrementId);
	}
}