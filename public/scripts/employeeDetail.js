let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
});

function validateForm() {
	let form = document.forms["employeeDetails"];
	let error = document.getElementById("error");
	let errorMessage = document.getElementById("errorMessage");

	// let id = form["id"].value;
	// let employeeId = form["employeeId"].value;
	// let managerId = form["managerId"].value;
	let firstName = form["firstName"].value;
	let lastName = form["lastName"].value;
	let password = form["password"].value;
	let confirmPassword = form["confirmPassword"].value;
	// let employeeType = form["employeeType"].value;

	if (firstName === '') {
		error.style.display = "block";
		errorMessage.innerHTML = "First name cannot be Blank";
		return false;
	} else if (lastName === ''){
		error.style.display = "block";
		errorMessage.innerHTML = "Last Name Cannot be Blank";
		return false;
	} else if (password === ''){
		error.style.display = "block";
		errorMessage.innerHTML = "Password Cannot be Blank";
		return false;
	} else if (confirmPassword !== password){
		error.style.display = "block";
		errorMessage.innerHTML = "Passwords Must Match";
		return false;
	} else {
		return true;
	}
}

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call

	const saveActionElement = event.target;
	saveActionElement.disabled = true;

	// const newEmployeeId = employeeId.value;
	console.log(employeeId.value);
	const employeeIdIsDefined = employeeId.value != '';
	console.log(employeeIdIsDefined);
	const saveActionUrl = ('/api/employeeDetail/' + (employeeIdIsDefined ? employeeId.value : ''));
	const saveEmployeeRequest = {
		employeeId: '',
		firstName: firstName.value,
		lastName: lastName.value,
		password: password.value,
		classification: employeeType.value,
	};

	if(employeeIdIsDefined){
		console.log('employee is defined');
		ajaxPatch(saveActionUrl, saveEmployeeRequest, callbackResponse => {
			saveActionElement.disabled = false;
			if (isSuccessResponse(callbackResponse))
				displayEmployeeSavedAlertModal();
		});
	}
	else {
		console.log('employee not defined');
		ajaxPost(saveActionUrl, saveEmployeeRequest, callbackResponse => {
			saveActionElement.disabled = false;
			if (isSuccessResponse(callbackResponse)) {
				displayEmployeeSavedAlertModal();
				if (callbackResponse.data != null
					&& callbackResponse.data.employee != null
					&& callbackResponse.data.employee.id.trim() !== '') {
					// document.getElementById('deleteActionContainer').classList.remove('hidden');
					setEmployeeId(callbackResponse.data.employee.id);
				}
			}
		});
	}
	// displayEmployeeSavedAlertModal();
}

function displayEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer)
		clearTimeout(hideEmployeeSavedAlertTimer);

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = "none";
	savedAlertModalElement.style.display = "block";

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer)
		clearTimeout(hideEmployeeSavedAlertTimer);
	getSavedAlertModalElement().style.display = "none";
}
function getSavedAlertModalElement() {
	return document.getElementById('employeeSavedAlertModal');
}
function getEmployeeId() {
	return getEmployeeIdElement().value;
}
function setEmployeeId(employeeId) {
	getEmployeeIdElement().value = employeeId;
}
function getEmployeeIdElement() {
	return document.getElementById('employeeId');
}
// End save
