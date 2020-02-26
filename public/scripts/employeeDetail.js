let hideEmployeeSavedAlertTimer = undefined;

document.addEventListener("DOMContentLoaded", () => {
	button.getElementById("employeeSave").addEventListener("click", event =>{
		if(event.firstName == ''){
			alert ("First Name Cannot be Blank");
			break;
		}
		if(event.lastName == ''){
			alert ("Last Name Cannot be Blank");
			break;
		}
		if(event.password == ''){
			alert ("Password Cannot be Blank");
			break;
		}
		if(event.confirmPassword != event.password){
			alert ("Passwords Must Match");
			break;
		}
		if(event.employeeType != 'Cashier' || 'Shift Manager' || 'General Manager'){
			alert ("An Employee type Must be selected");
			break;
		}
		else{
			saveActionClick(event);
		}
	}); 
	// TODO: Things that need doing when the view is loaded
});

// Save
function saveActionClick(event) {
	// TODO: Actually save the employee via an AJAX call

	const saveActionElement = event.target;
	saveActionElement.disabled = true;

	const employeeId = getEmployeeId();
	const employeeIdIsDefined = employeeId != null && employeeId.trim() !== '';
	const saveActionUrl = ('/api/employeeDetail/' + (employeeIdIsDefined ? employeeId : ''));
	const saveEmployeeRequest = {
		id: employeeId,
	};

	if(employeeIdIsDefined){
		ajaxPut(saveActionUrl, saveEmployeeRequest, callbackResponse => {
			saveActionElement.disabled = false;

			if (isSuccessResponse(callbackResponse))
				displayEmployeeSavedAlertModal();
		});

	}
	else
		ajaxPost(saveActionUrl, saveEmployeeRequest, callbackResponse => {
			saveActionElement.disabled = false;

			if (isSuccessResponse(callbackResponse)) {
				displayEmployeeSavedAlertModal();

				if (callbackResponse.data != null
					&& callbackResponse.data.employee != null
					&& callbackResponse.data.employee.id.trim() !== '') {
					// document.getElementById('deleteActionContainer').classList.remove('hidden');

					setEmployeeId(callbackResponse.data.employee.id.trim());
				}
			}
		});

	// displayEmployeeSavedAlertModal();
}

function displayEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	const savedAlertModalElement = getSavedAlertModalElement();
	savedAlertModalElement.style.display = "none";
	savedAlertModalElement.style.display = "block";

	hideEmployeeSavedAlertTimer = setTimeout(hideEmployeeSavedAlertModal, 1200);
}

function hideEmployeeSavedAlertModal() {
	if (hideEmployeeSavedAlertTimer) {
		clearTimeout(hideEmployeeSavedAlertTimer);
	}

	getSavedAlertModalElement().style.display = "none";
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
