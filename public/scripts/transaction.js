// transactionId is populated in the global scope at rendering time
// Be sure to include this transactionId in future AJAX calls to the backend!
// console.log(transactionId);

let hideProductAddedAlertTimer = undefined;

document.addEventListener('DOMContentLoaded', () => {
	getCompleteTransActionElement().addEventListener('click', completeTransaction);
	getProductSearchElement().addEventListener('input', searchForProducts);
	getCancelTransactionButton().addEventListener("click", cancelTransaction);

	// Re-populate an unfinished transaction's cart
	if (transactionEntries) {
		transactionEntries.forEach(entry => {
			buildCartElements(entry.lookupCode, Number(entry.price), Number(entry.quantity));
		});
	}

	reCalculateCartTotal();
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
	const totalItemsElement = getNumbItemsElement();

	const addToCartActionUrl = (`/api/transaction/${transactionId}/${lookupcode}`);

	const productInCart = document.getElementById(lookupcode);
	if (productInCart) {
		const quantity = Number(productInCart.childNodes[1].value) + 1;
		ajaxPut(addToCartActionUrl, { quantity }, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				// displayProductAddedAlertModal();
				productInCart.childNodes[1].value = quantity;
				totalPriceElement.innerHTML = Number(totalPriceElement.innerHTML) + price;
				if(Number(totalItemsElement.innerHTML == 0)){
					totalItemsElement.innerHTML = Number(totalItemsElement.innerHTML) + 2;
				}
				else{
					totalItemsElement.innerHTML = Number(totalItemsElement.innerHTML) + 1;
				}
				updateLineTotal(productInCart);
			}
		});
	} else {
		ajaxPost(addToCartActionUrl, null, callbackResponse => {
			if (isSuccessResponse(callbackResponse)) {
				// displayProductAddedAlertModal();
				buildCartElements(lookupcode, price, 1);
				totalPriceElement.innerHTML = Number(totalPriceElement.innerHTML) + price;
				totalItemsElement.innerHTML = Number(totalItemsElement.innerHTML) + 1;
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
				updateLineTotal(cartItem);
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
			const numbItemsElement = getNumbItemsElement();
			const existingTotal = Number(cartTotalElement.innerHTML);
			const existingCount = Number(numbItemsElement.innerHTML);
			const quantity = Number(cartItem.querySelector('#quantity').value);
			const price = Number(cartItem.querySelector('#price').innerHTML);

			cartTotalElement.innerHTML = existingTotal - (quantity * price);
			numbItemsElement.innerHTML = existingCount - (quantity);
			if(cartTotalElement.innerHTML < 0 || numbItemsElement.innerHTML < 0){
				cartTotalElement.innerHTML = 0;
				numbItemsElement.innerHTML = 0;
			}
			cartItem.remove();
		}
	})
}

function reCalculateCartTotal() {
	let newTotal = 0;
	let newCount = 0;
	const cart = getCart();
	cart.childNodes.forEach(cartItem => {
		if (cartItem.className === "cartItem") {
			const quantity = Number(cartItem.querySelector('#quantity').value);
			const price = Number(cartItem.querySelector('#price').innerHTML);

			newTotal += (quantity * price);
			newCount += quantity;
		}
	});
	getCartTotalElement().innerHTML = newTotal;
	getNumbItemsElement().innerHTML = newCount;
}

function updateLineTotal(cartElement) {
	const price = cartElement.childNodes[4].innerHTML;
	const quantity = cartElement.childNodes[1].value;
	cartElement.childNodes[0].innerHTML = `$${price * quantity}    `;
}

function buildCartElements(lookupCode, price, quantity) {
	const parent = getCart();

	let cartElement = document.createElement('li');
	cartElement.id = lookupCode;
	cartElement.className = "cartItem";
	cartElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

	let quantityElement = document.createElement('input');
	quantityElement.id = "quantity";
	quantityElement.classList.add("cart-quantity");
	quantityElement.value = quantity || 1;
	quantityElement.size = 1;
	quantityElement.maxLength = 3;
	quantityElement.type = 'number';
	quantityElement.onchange = () => quantityChanged(cartElement, Number(quantityElement.value));

	let removeFromCartElement = document.createElement('button');
	removeFromCartElement.innerHTML = '✕';
	removeFromCartElement.classList.add("btn", "btn-danger");
	removeFromCartElement.id = 'removeFromCart';
	removeFromCartElement.type = 'button';
	removeFromCartElement.onclick = () => removeFromCartActionClick(cartElement);

	let priceElement = document.createElement('p');
	priceElement.id = 'price';
	priceElement.innerHTML = price;
	priceElement.className = "hidden";

	let lookupCodeElement = document.createElement('span');
	lookupCodeElement.innerHTML = lookupCode;

	let lineTotalElement = document.createElement('span');
	lineTotalElement.id = 'lineTotal';
	// lineTotalElement.className = "hidden";
	lineTotalElement.innerHTML = `$${price * quantity}    `;

	cartElement.insertAdjacentElement('afterbegin', quantityElement);
	cartElement.insertAdjacentElement('afterbegin', lookupCodeElement);
	cartElement.insertAdjacentElement('afterbegin', lineTotalElement);
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
		searchResultElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

		let lookupCodeElement = document.createElement('p');
		lookupCodeElement.id = 'lookupCodeElement';
		lookupCodeElement.innerHTML = searchResult.lookupCode;
		lookupCodeElement.classList.add("transactionSearchResult");

		let priceElement = document.createElement('p');
		priceElement.id = 'priceElement';
		priceElement.innerHTML = '$' + searchResult.price;
		priceElement.classList.add("transactionSearchResult");

		let addToCartElement = document.createElement('button');
		addToCartElement.classList.add("btn", "btn-primary");
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
function getNumbItemsElement() {
	return document.getElementById('numbItems');
}
