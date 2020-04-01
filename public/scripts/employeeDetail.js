let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("employeeSave").addEventListener("click", event => {
		let firstName = document.getElementById("firstName").value;
		let lastName = document.getElementById("lastName").value;
		let password = document.getElementById("password").value;
		let confirmPassword = document.getElementById("confirmPassword").value;
		let employeeType = document.getElementById("employeeType").value;
		if (firstName == '') {
			let errorMessage = "First name cannot be Blank";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		} else if (lastName == '') {
			let errorMessage = "Last Name Cannot be Blank";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		} else if (password == '') {
			let errorMessage = "Password Cannot be Blank";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		} else if (confirmPassword != password) {
			let errorMessage = "Passwords Must Match";
			document.getElementById("error").style.display = "block";
			document.getElementById("errorMessage").innerHTML = errorMessage;
			return false;
		} else {
			saveActionClick(event);
			return true;
		}
	});
});

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call

	const saveActionElement = event.target;
	saveActionElement.disabled = true;

	const employeeId = getEmployeeId();
	const employeeIdIsDefined = employeeId.trim() !== '';
	const saveActionUrl = ('/api/employeeDetail/' + (employeeIdIsDefined ? employeeId : ''));
	const saveEmployeeRequest = {
		id: employeeId,
		managerId: getEmployeeManagerId(),
		lastName: getEmployeeLastNameEditElement().value,
		password: getEmployeePasswordEditElement().value,
		firstName: getEmployeeFirstNameEditElement().value,
		classification: getEmployeeTypeSelectElement().value
	};

	if(employeeIdIsDefined){
		ajaxPatch(saveActionUrl, saveEmployeeRequest, callbackResponse => {
			saveActionElement.disabled = false;
			if (isSuccessResponse(callbackResponse))
				completeSaveAction(callbackResponse);
		});
	}
	else {
		ajaxPost(saveActionUrl, saveEmployeeRequest, callbackResponse => {
			saveActionElement.disabled = false;
			if (isSuccessResponse(callbackResponse)) {
				completeSaveAction(callbackResponse);

				// if (callbackResponse.data != null
				// 	&& callbackResponse.data.employee != null
				// 	&& callbackResponse.data.employee.id.trim() !== '') {
				// 	// document.getElementById('deleteActionContainer').classList.remove('hidden');
				// 	setEmployeeId(callbackResponse.data.employee.id);
				// 	location.replace(callbackResponse.data.target === '' ? '' : callbackResponse.data.target);
				// }
			}
		});
	}
	// displayEmployeeSavedAlertModal();
}

function completeSaveAction(callbackResponse) {
	if (callbackResponse.data == null) {
		return;
	}

	if ((callbackResponse.data.redirectUrl != null)
		&& (callbackResponse.data.redirectUrl !== "")) {

		window.location.replace('/' + callbackResponse.data.redirectUrl);
		return;
	}

	displayEmployeeSavedAlertModal();

	const employeeEmployeeIdElement = getEmployeeEmployeeIdElement();
	const employeeEmployeeIdRowElement = employeeEmployeeIdElement.closest("tr");
	if (employeeEmployeeIdRowElement.classList.contains("hidden")) {
		setEmployeeId(callbackResponse.data.employee.id);
		employeeEmployeeIdElement.value = callbackResponse.data.employee.employeeId;
		employeeEmployeeIdRowElement.classList.remove("hidden");
	}
}

function displayEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer)
		clearTimeout(hideEmployeeSavedAlertTimer);

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = 'none';
	savedAlertModalElement.style.display = 'block';

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer)
		clearTimeout(hideEmployeeSavedAlertTimer);
	getSavedAlertModalElement().style.display = 'none';
}
function getEmployeeId() {
	return document.getElementById('id').value;
}
function setEmployeeId(employeeId) {
	document.getElementById('id').value = employeeId;
}

function getEmployeeManagerId() {
	return document.getElementById('managerId').value;
}

function getEmployeeEmployeeId() {
	return getEmployeeEmployeeIdElement().value;
}
function getEmployeeEmployeeIdElement() {
	return document.getElementById('employeeId');
}

function getSavedAlertModalElement() {
	return document.getElementById('employeeSavedAlertModal');
}

function getEmployeeFirstNameEditElement() {
	return document.getElementById('firstName');
}

function getEmployeeLastNameEditElement() {
	return document.getElementById('lastName');
}

function getEmployeePasswordEditElement() {
	return document.getElementById('password');
}

function getEmployeeConfirmPassword() {
	return document.getElementById('confirmPassword').value;
}

function getEmployeeTypeSelectElement() {
	return document.getElementById('employeeType');
}
// End save
