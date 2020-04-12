// transactionId is populated in the global scope at rendering time
// Be sure to include this transactionId in future AJAX calls to the backend!
// console.log(transactionId);

let hideProductAddedAlertTimer = undefined;

document.addEventListener('DOMContentLoaded', () => {

	// getCheckoutActionElement().addEventListener('click', checkoutActionClick);
	// getAddToCartActionElement().addEventListener('click', addToCartActionClick);
	getProductSearchElement().addEventListener('input', searchForProducts);
	getCancelTransactionButton().addEventListener("click", cancelTransaction);

});

function cancelTransaction(){
	ajaxDelete(`/api/transaction/${transactionId}`, response => {
		if (isSuccessResponse(response)) {
			window.location.replace('/mainMenu');
		}
	});
}

function addToCartActionClick(lookupcode){
	const addToCartActionUrl = (`/api/transaction/${transactionId}/${lookupcode}`);

	const productInCart = document.getElementById(lookupcode);
	if (productInCart) {
		const quantity = Number(productInCart.childNodes[0].value) + 1;
		ajaxPut(addToCartActionUrl, { quantity }, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				// displayProductAddedAlertModal();
				productInCart.childNodes[0].value++;
			}
		});
	} else {
		ajaxPost(addToCartActionUrl, null, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				// displayProductAddedAlertModal();
				buildCartElements(lookupcode);
			}
		});
	}
}

function quantityChanged(item, value){
	if(value != null && value > 0){
		const transactionIdIsDefined = transactionId != null && transactionId.trim() !== '';
		const addToCartActionUrl = ('/api/transaction/' + (transactionIdIsDefined ? transactionId : ''));
		const addTransactionRequest = {
			price: 10,
			quantity: value,
			productId: item,
			transactionId
		};

		ajaxPut(addToCartActionUrl, addTransactionRequest, callbackResponse => {
			if (isSuccessResponse(callbackResponse))
				displayProductAddedAlertModal();
		});
	}

}

function removeFromCartActionClick(item){
	let elementToRemove = document.getElementById(item);
	const parent = getCart();
	parent.removeChild(elementToRemove);
}

function buildCartElements(item){
	const parent = getCart();
	let quantityElement = document.createElement('input');
	let cartElement = document.createElement('li');
	let removeFromCartElement = document.createElement('button');
	let spanElement = document.createElement('span');
	quantityElement.value = 1;
	quantityElement.size = 1;
	quantityElement.type = 'number';
	quantityElement.onchange = function(){
		quantityChanged(item, quantityElement.value);
	};
	cartElement.id = item;
	spanElement.innerHTML = item;
	removeFromCartElement.innerHTML = 'Remove';
	removeFromCartElement.id = 'removeFromCart';
	removeFromCartElement.type = 'button';
	removeFromCartElement.onclick = function(){
		removeFromCartActionClick(cartElement.id);
	};
	cartElement.insertAdjacentElement('afterbegin', spanElement);
	cartElement.insertAdjacentElement('afterbegin', quantityElement);
	cartElement.insertAdjacentElement('beforeend', removeFromCartElement);

	parent.append(cartElement);
}

function checkoutActionClick(event){

}

function searchForProducts() {
	removeSearchResultElements();
	if (this.value !== '') {
		ajaxGet(`/api/productListing/${this.value}`, response => {
			buildSearchResultElements(response.data);
		});
	}
}

function buildSearchResultElements(searchResults) {
	const parent = getProductSearchResultContainer();
	searchResults.forEach(searchResult => {
		let searchResultElement = document.createElement('li');
		let addToCartElement = document.createElement('button');
		searchResultElement.innerHTML = searchResult;
		addToCartElement.innerHTML = 'Add to Cart';
		addToCartElement.id = 'addToCart';
		addToCartElement.value = searchResult;
		addToCartElement.type = 'button';
		addToCartElement.onclick = function(){
			addToCartActionClick(addToCartElement.value);
		};
		parent.appendChild(searchResultElement).appendChild(addToCartElement);
	});
}

function removeSearchResultElements() {
	const parent = getProductSearchResultContainer();
	while (parent.firstChild) {
		parent.firstChild.remove();
	}
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
function getAddToCartActionElement() {
	return document.getElementById('addToCart');
}

function getProductId() {
	return getProductIdElement().value;
}
function getProductPrice() {
	return getProductPriceElement().value;
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

function getProductSearchElement() {
	return document.getElementById('search');
}

function getProductSearchResultContainer() {
	return document.getElementById('searchResults');
}

function getCancelTransactionButton() {
	return document.getElementById('cancelTransactionButton');
}
