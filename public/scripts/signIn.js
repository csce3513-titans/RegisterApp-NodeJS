document.addEventListener("DOMContentLoaded", () => {
	// TODO: Anything you want to do when the page is loaded?
});

function validateForm() {
	let employeeID = document.forms["signInForm"]["employee_id"].value;
	let password = document.forms["signInForm"]["password"].value;

	// Verify neither field is blank and employeeID is numeric
	if (employeeID !== "" && !isNaN(employeeID) && password !== "") {
		return true;
	} else {
		let errorMessage = "Both fields must be filled out and Employee ID must be numeric";
		document.getElementById("error").style.display = "block";
		document.getElementById("errorMessage").innerHTML = errorMessage;
		return false;
	}

}
