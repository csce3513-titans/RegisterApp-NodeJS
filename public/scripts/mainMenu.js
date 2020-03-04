document.addEventListener("DOMContentLoaded", () => {
	const transactionButton = document.getElementById("startTransactionButton");
	const productListButton = document.getElementById("productListButton");

	const cashierReportButton = document.getElementById("cashierReportButton");
	const employeeDetailsButton = document.getElementById("employeeDetailsButton");
	const salesReportButton = document.getElementById("salesReportButton");

	transactionButton.addEventListener("click", missingFunctionalityError);
	productListButton.addEventListener("click", function(){ console.log('Product Button Clicked.'); location.assign("http://localhost:15100/productListing"); });

	cashierReportButton.addEventListener("click", missingFunctionalityError);
	salesReportButton.addEventListener("click", missingFunctionalityError);
	employeeDetailsButton.addEventListener("click", function(){ location.assign("http://localhost:15100/employeeDetail") });
});

function missingFunctionalityError() {
	let errorMessage = "Functionality has not yet been implemented.";
	document.getElementById("error").style.display = "block";
	document.getElementById("errorMessage").innerHTML = errorMessage;
}

function clearMissingFunctionalityError() {
	document.getElementById("error").style.display = "none";
	document.getElementById("errorMessage").innerHTML = '';
}
