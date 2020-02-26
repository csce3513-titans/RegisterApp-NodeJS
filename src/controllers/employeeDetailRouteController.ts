import { Request, Response } from 'express';
import * as Helper from './helpers/routeControllerHelper';
import { Resources, ResourceKey } from '../resourceLookup';
import * as EmployeeHelper from './commands/employees/helpers/employeeHelper';
import * as ValidateActiveUser from './commands/activeUsers/validateActiveUserCommand';
import { CommandResponse, Employee, EmployeeSaveRequest, ActiveUser } from './typeDefinitions';
import { ViewNameLookup, RouteLookup } from '../controllers/lookups/routingLookup';
// import * as ActiveEmployeeExistsQuery from './commands/employees/activeEmployeeExistsQuery';
import * as EmployeeQuery from './commands/employees/helpers/employeeQuery';

interface CanCreateEmployee {
	employeeExists: boolean;
	isElevatedUser: boolean;
}

const determineCanCreateEmployee = async (req: Request): Promise<CanCreateEmployee> => {
	// TODO: Logic to determine if the user associated with the current session
	//  is able to create an employee
	try {
		if ((await ActiveEmployeeExistsQuery.query()).data === false)
			// return req.redirect(ViewNameLookup.EmployeeDetail);
			return <CanCreateEmployee>{ employeeExists: false, isElevatedUser: true };

		// return req.render(ViewNameLookup.SignIn);
	} catch (error) {
		console.error(error);
		// req.sendStatus(500);
	}
	return <CanCreateEmployee>{ employeeExists: false, isElevatedUser: false };
};

export const start = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}
	

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): void => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser) {

				return res.redirect(Helper.buildNoPermissionsRedirectUrl());
			}
			else if(!canCreateEmployee.employeeExists || canCreateEmployee.isElevatedUser){
				return res.render(ViewNameLookup.EmployeeDetail);
			}
			else{
				return res.redirect(ViewNameLookup.MainMenu);
			}
			// TODO: Serve up the page
		}).catch((error: any): void => {
			res.sendStatus(500);
			// TODO: Handle any errors that occurred
		});
};

export const startWithEmployee = async (req: Request, res: Response): Promise<void> => {
	if (Helper.handleInvalidSession(req, res)) {
		return;
	}

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<void> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				return Promise.reject(<CommandResponse<Employee>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}
			

			// TODO: Query the employee details using the request route parameter
			return Promise.resolve();
		}).then((/* TODO: Some employee details */): void => {
			// TODO: Serve up the page
			return res.render(ViewNameLookup.EmployeeDetail);
		}).catch((error: any): void => {
			// TODO: Handle any errors that occurred
		});
};

const saveEmployee = async (
	req: Request,
	res: Response,
	performSave: (
		employeeSaveRequest: EmployeeSaveRequest,
		isInitialEmployee?: boolean
	) => Promise<CommandResponse<Employee>>
): Promise<void> => {

	if (Helper.handleInvalidApiSession(req, res)) {
		return;
	}

	let employeeExists: boolean;

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): Promise<CommandResponse<Employee>> => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser) {

				return Promise.reject(<CommandResponse<boolean>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}

			employeeExists = canCreateEmployee.employeeExists;

			return performSave(req.body, !employeeExists);
		}).then((saveEmployeeCommandResponse: CommandResponse<Employee>): void => {
			// TODO: Handle the save response and send a response to the HTTP request
		}).catch((error: any): void => {
			return Helper.processApiError(
				error,
				res,
				<Helper.ApiErrorHints>{
					defaultErrorMessage: Resources.getString(
						ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
				});
		});
};

export const updateEmployee = async (req: Request, res: Response): Promise<void> => {
	return; // TODO: invoke saveEmployee() with the appropriate save functionality
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
	return; // TODO: invoke saveEmployee() with the appropriate save functionality
};
