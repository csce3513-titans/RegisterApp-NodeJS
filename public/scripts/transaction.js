// transactionId is populated in the global scope at rendering time
// Be sure to include this transactionId in future AJAX calls to the backend!
// console.log(transactionId);

let hideProductAddedAlertTimer = undefined;

document.addEventListener('DOMContentLoaded', () => {

	getCompleteTransActionElement().addEventListener('click', completeTransaction);
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

function completeTransaction(){
	const completeTransActionUrl = ('/api/transaction/' + transactionId);
	const completeTransactionRequest = {
		transactionId
	};

	ajaxPost(completeTransActionUrl, completeTransactionRequest, callbackResponse => {
		if (isSuccessResponse(callbackResponse)){
			if (callbackResponse.data != null
				&& callbackResponse.data.redirectUrl != null
				&& callbackResponse.data.redirectUrl !== '')

				window.location.replace(callbackResponse.data.redirectUrl);
			else
				window.location.replace('/');
		}
		else
			displayError('Transaction not completed.');
	});
}

function addToCartActionClick(event){
	const searchResultElement = event.target.parentElement;
	const lookupcode = searchResultElement.querySelector('#lookupCodeElement').innerHTML;
	const price = Number(searchResultElement.querySelector('#priceElement').innerHTML.slice(1));

	const totalPriceElement = getCartTotalElement();

	const addToCartActionUrl = (`/api/transaction/${transactionId}/${lookupcode}`);

	const productInCart = document.getElementById(lookupcode);
	if (productInCart) {
		const quantity = Number(productInCart.childNodes[0].value) + 1;
		ajaxPut(addToCartActionUrl, { quantity }, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				// displayProductAddedAlertModal();
				productInCart.childNodes[0].value++;
				totalPriceElement.innerHTML = Number(totalPriceElement.innerHTML) + price;
			}
		});
	} else {
		ajaxPost(addToCartActionUrl, null, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				// displayProductAddedAlertModal();
				buildCartElements(lookupcode, price);
				totalPriceElement.innerHTML = Number(totalPriceElement.innerHTML) + price;
			}
		});
	}
}

function quantityChanged(cartItem, quantity) {
	if (isNaN(quantity)) return;

	if (quantity > 0) {
		ajaxPut(`/api/transaction/${transactionId}/${cartItem.id}`, { quantity }, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				reCalculateCartTotal();
			}

		});
	} else if (quantity === 0) {
		ajaxDelete(`/api/transaction/${transactionId}/${cartItem.id}`, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				cartItem.remove();
				reCalculateCartTotal();
			}
		})
	}
}

function removeFromCartActionClick(cartItem) {
	ajaxDelete(`/api/transaction/${transactionId}/${cartItem.id}`, callbackResponse => {
		if (isSuccessResponse(callbackResponse)) {
			const cartTotalElement = getCartTotalElement();
			const existingTotal = Number(cartTotalElement.innerHTML);
			const quantity = Number(cartItem.querySelector('#quantity').value);
			const price = Number(cartItem.querySelector('#price').innerHTML);

			cartTotalElement.innerHTML = existingTotal - (quantity * price);
			cartItem.remove();
		}
	})
}

function reCalculateCartTotal() {
	let newTotal = 0;
	const cart = getCart();
	cart.childNodes.forEach(cartItem => {
		if (cartItem.className === "cartItem") {
			const quantity = Number(cartItem.querySelector('#quantity').value);
			const price = Number(cartItem.querySelector('#price').innerHTML);

			newTotal += (quantity * price);
		}
	});
	getCartTotalElement().innerHTML = newTotal;
}

function buildCartElements(lookupCode, price) {
	const parent = getCart();

	let cartElement = document.createElement('li');
	cartElement.id = lookupCode;

	let quantityElement = document.createElement('input');
	quantityElement.value = 1;
	quantityElement.size = 1;
	quantityElement.type = 'number';
	quantityElement.onchange = () => quantityChanged(lookupCode, quantityElement.value);

	let removeFromCartElement = document.createElement('button');
	removeFromCartElement.innerHTML = 'Remove';
	removeFromCartElement.id = 'removeFromCart';
	removeFromCartElement.type = 'button';
	removeFromCartElement.onclick = () => removeFromCartActionClick(cartElement);

	let priceElement = document.createElement('p');
	priceElement.id = 'price';
	priceElement.innerHTML = price;
	priceElement.className = "hidden";

	let lookupCodeElement = document.createElement('span');
	lookupCodeElement.innerHTML = lookupCode;

	cartElement.insertAdjacentElement('afterbegin', lookupCodeElement);
	cartElement.insertAdjacentElement('afterbegin', quantityElement);
	cartElement.insertAdjacentElement('beforeend', removeFromCartElement);
	cartElement.appendChild(priceElement);

	parent.append(cartElement);
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

		let lookupCodeElement = document.createElement('p');
		lookupCodeElement.id = 'lookupCodeElement';
		lookupCodeElement.innerHTML = searchResult.lookupCode;

		let priceElement = document.createElement('p');
		priceElement.id = 'priceElement';
		priceElement.innerHTML = '$' + searchResult.price;

		let addToCartElement = document.createElement('button');
		addToCartElement.innerHTML = 'Add to Cart';
		addToCartElement.id = 'addToCart';
		addToCartElement.onclick = addToCartActionClick;

		searchResultElement.appendChild(lookupCodeElement)
		searchResultElement.appendChild(priceElement)
		searchResultElement.appendChild(addToCartElement);
		parent.appendChild(searchResultElement);
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
	// productAddedAlertModalElement.style.display = 'none';
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

function getCompleteTransActionElement() {
	return document.getElementById('completeTransactionButton');
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

function getCartTotalElement() {
	return document.getElementById('cartTotal');
}
