import { Employee } from '../../../typeDefinitions';
import { EmployeeModel } from '../../models/employeeModel';
import { EmployeeClassification } from "../../models/constants/entityTypes";

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
	}
};

export const hashString = (toHash: string): string => {
	return ""; // TODO: Look at https://nodejs.org/docs/latest-v12.x/api/crypto.html#crypto_crypto_createhash_algorithm_options as one option
};

export const isElevatedUser = (employeeClassification: EmployeeClassification): boolean => {
	return false; // TODO: Determine if an employee is an elevated user by their classification
};
