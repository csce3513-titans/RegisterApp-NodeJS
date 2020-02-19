import { Employee } from '../../../typeDefinitions';
import { EmployeeModel } from '../../models/employeeModel';

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
