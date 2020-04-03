// transactionId is populated in the global scope at rendering time
// Be sure to include this transactionId in future AJAX calls to the backend!
console.log(transactionId);

let hideProductAddedAlertTimer = undefined;

document.addEventListener('DOMContentLoaded', () => {

	getCheckoutActionElement().addEventListener('click', checkoutActionClick);
	getCancelActionElement().addEventListener('click', cancelActionClick);
	getAddToCartActionElement().addEventListener('click', addToCartActionClick);

});

function addToCartActionClick(event){

	const addToCartActionElement = event.target;
	addToCartActionElement.disable = true;

	const transactionIdIsDefined = transactionId != null && transactionId.trim() !== '';
	const productId = getProductId();
	const productIdIsDefined = productId != null && productId.trim() !== '';
	const addToCartActionUrl = ('/api/transaction/' + (transactionIdIsDefined ? transactionId : ''));
	const addTransactionRequest = {
		price: getProductPrice(),
		quantity: 1,
		productId,
		transactionId
	};

	if (transactionIdIsDefined)
		ajaxPut(addToCartActionUrl, addTransactionRequest, callbackResponse => {
			addToCartActionElement.disabled = false;

			if (isSuccessResponse(callbackResponse))
				displayProductAddedAlertModal();
		});
	else
		ajaxPost(addToCartActionUrl, addTransactionRequest, callbackResponse => {
			addToCartActionElement.disabled = false;

			if (isSuccessResponse(callbackResponse)) {
				displayProductAddedAlertModal();
			}
		});
}

function checkoutActionClick(event){

}

function cancelActionClick(event){

}

function displayProductAddedAlertModal() {
	if (hideProductAddedAlertTimer)
		clearTimeout(hideProductAddedAlertTimer);

	const productAddedAlertModalElement = getProductAddedAlertModalElement();
	productAddedAlertModalElement.style.display = 'none';
	productAddedAlertModalElement.style.display = 'block';

	hideProductAddedAlertTimer = setTimeout(hideProductAddedAlertModal, 1200);
}

function hideProductAddedAlertModal() {
	if (hideProductAddedAlertTimer)
		clearTimeout(hideProductAddedAlertTimer);

	getProductAddedAlertModalElement().style.display = 'none';
}


// Getters and setters
function getProductAddedAlertModalElement() {
	return document.getElementById('productAddedAlertModal');
}

function getCheckoutActionElement() {
	return document.getElementById('checkoutButton');
}
function getAddActionElement() {
	return document.getElementById('addToCartButton');
}

function getCancelActionElement() {
	return document.getElementById('cancelButton');
}

function getProductId() {
	return getProductIdElement().value;
}
function getProductPrice() {
	return getProductPriceElement().value;
}
function getTransactionId() {
	return getTransactionIdElement().value;
}
function getCart() {
	return document.getElementById('cart');
}

function getProductIdElement() {
	return document.getElementById('productId');
}
function getProductPriceElement() {
	return document.getElementById('productPrice');
}
function getTransactionIdElement() {
	return document.getElementById('transactionId');
}

function getProductLookupCode() {
	return getProductLookupCodeElement().value;
}
function getProductLookupCodeElement() {
	return document.getElementById('productLookupCode');
}

function getProductCount() {
	return Number(getProductCountElement().value);
}
function getProductCountElement() {
	return document.getElementById('productCount');
}
