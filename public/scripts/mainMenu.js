document.addEventListener("DOMContentLoaded", () => {
	const transactionButton = document.getElementById("startTransactionButton");
	const cashierReportButton = document.getElementById("cashierReportButton");
	const productListButton = document.getElementById("productListButton");
	const employeeDetailsButton = document.getElementById("employeeDetailsButton");
	const salesReportButton = document.getElementById("salesReportButton");

	transactionButton.addEventListener("click", missingFunctionalityError);
	cashierReportButton.addEventListener("click", missingFunctionalityError);
	salesReportButton.addEventListener("click", missingFunctionalityError);

	productListButton.addEventListener("click", clearMissingFunctionalityError);
	employeeDetailsButton.addEventListener("click", clearMissingFunctionalityError);
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
