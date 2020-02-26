document.addEventListener("DOMContentLoaded", () => {
	const transactionButton = document.getElementById("startTransactionButton");
	const cashierReportButton = document.getElementById("cashierReportButton");

	transactionButton.addEventListener("click", missingFunctionalityError);
	cashierReportButton.addEventListener("click", missingFunctionalityError);
});

function missingFunctionalityError() {
	let errorMessage = "Functionality has not yet been implemented.";
	document.getElementById("error").style.display = "block";
	document.getElementById("errorMessage").innerHTML = errorMessage;
}
