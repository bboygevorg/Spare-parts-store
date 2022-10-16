export const replaceId = (productId) => {
	let splited = productId.split("_");
	splited.shift();
	return splited.join("_");
}