let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("employeeSave").addEventListener("click", event =>{
		let firstName = document.getElementById("firstName").value;
		let lastName = document.getElementById("lastName").value;
		let password = document.getElementById("password").value;
		let confirmPassword = document.getElementById("confirmPassword").value;
		let employeeType = document.getElementById("employeeType").value;
		if(firstName == ''){
			let errorMessage = "First name cannot be Blank";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		}
		else if(lastName == ''){
			let errorMessage = "Last Name Cannot be Blank";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		}
		else if(password == ''){
			let errorMessage = "Password Cannot be Blank";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		}
		else if(confirmPassword != password){
			let errorMessage = "Passwords Must Match";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		}
		else
			saveActionClick(event);
	});
});

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
