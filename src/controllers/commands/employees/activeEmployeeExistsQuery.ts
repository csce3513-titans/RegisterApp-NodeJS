import { EmployeeModel, queryActiveExists } from '../models/employeeModel';
import { CommandResponse } from '../../typeDefinitions';

export const query = async (): Promise<CommandResponse<boolean>> => {
	return queryActiveExists().then((queriedEmployee: EmployeeModel | null): CommandResponse<boolean> => {
		return <CommandResponse<boolean>>{
			status: 200,
			data: queriedEmployee !== null
		};
	});
};
