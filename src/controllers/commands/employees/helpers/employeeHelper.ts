import { EmployeeClassification } from '../../models/constants/entityTypes';
import {CommandResponse, Employee, EmployeeSaveRequest} from '../../../typeDefinitions';
import { EmployeeModel } from '../../models/employeeModel';
import * as Helper from '../../helpers/helper';
import {ResourceKey, Resources} from '../../../../resourceLookup';

export const hashString = (toHash: string): string => {
	return '';
};

export const isElevatedUser = (employeeClassification: EmployeeClassification): boolean => {
	return false;
};

export const validateSaveRequest = (
	saveEmployeeRequest: EmployeeSaveRequest
): CommandResponse<Employee> => {
	let errorMessage = '';

	if (Helper.isBlankString(saveEmployeeRequest.firstName))
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);

	else if (Helper.isBlankString(saveEmployeeRequest.lastName))
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);

	else if (Helper.isBlankString(saveEmployeeRequest.password))
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);


	// If this is the first employee, make manager
	if(saveEmployeeRequest.isInitialEmployee)
		saveEmployeeRequest.classification = EmployeeClassification.GeneralManager;


	return errorMessage === ''
		? <CommandResponse<Employee>>{ status: 200 }
		: <CommandResponse<Employee>>{
			status: 422,
			message: errorMessage
		};
};

export const mapEmployeeData = (queriedEmployee: EmployeeModel): Employee => {
	return <Employee>{
		id: queriedEmployee.id,
		active: queriedEmployee.active,
		lastName: queriedEmployee.lastName,
		password: queriedEmployee.password,
		createdOn: queriedEmployee.createdOn,
		firstName: queriedEmployee.firstName,
		managerId: queriedEmployee.managerId,
		employeeId: queriedEmployee.employeeId.toString(),
		classification: queriedEmployee.classification
	};
};
