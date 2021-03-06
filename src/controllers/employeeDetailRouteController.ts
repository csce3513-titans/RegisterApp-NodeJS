import { Request, Response } from 'express';
import * as Helper from './helpers/routeControllerHelper';
import { Resources, ResourceKey } from '../resourceLookup';
import * as EmployeeHelper from './commands/employees/helpers/employeeHelper';
import * as ValidateActiveUser from './commands/activeUsers/validateActiveUserCommand';
import { CommandResponse, Employee, EmployeeSaveRequest, EmployeeSaveResponse, ActiveUser } from './typeDefinitions';
import { ViewNameLookup, RouteLookup, QueryParameterLookup} from '../controllers/lookups/routingLookup';
import * as ActiveEmployeeExistsQuery from './commands/employees/activeEmployeeExistsQuery';
import * as EmployeeQuery from './commands/employees/helpers/employeeQuery';
import * as EmployeeUpdate from './commands/employees/helpers/employeeUpdateCommand';
import * as EmployeeCreate from './commands/employees/helpers/employeeCreateCommands';

interface CanCreateEmployee {
	employeeExists: boolean;
	isElevatedUser: boolean;
}

const determineCanCreateEmployee = async (req: Request): Promise<CanCreateEmployee> => {
	let employeeExists = false;
	return ActiveEmployeeExistsQuery.query()
		.then((employeeExistsResponse: CommandResponse<boolean>): Promise<CommandResponse<ActiveUser>> => {
			employeeExists = employeeExistsResponse.data || false;
			return ValidateActiveUser.execute((<Express.Session>req.session).id);
		}).then((activeUserResponse: CommandResponse<ActiveUser>): Promise<CanCreateEmployee> => {
			return Promise.resolve(<CanCreateEmployee>{
				employeeExists,
				isElevatedUser: activeUserResponse.data && activeUserResponse.data.classification > 101
			});
		}).catch((error: any): Promise<CanCreateEmployee> => {
			return Promise.resolve(<CanCreateEmployee>{
				employeeExists,
				isElevatedUser: false
			});
		});
};

export const start = async (req: Request, res: Response): Promise<void> => {
	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): void => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser)
				return res.redirect(Helper.buildNoPermissionsRedirectUrl());
			else if(!canCreateEmployee.employeeExists || canCreateEmployee.isElevatedUser)
				return res.render(ViewNameLookup.EmployeeDetail, {
					isInitialEmployee: !canCreateEmployee.employeeExists
				});

			else if(!ValidateActiveUser.execute((<Express.Session>req.session).id))
				return res.redirect(ViewNameLookup.SignIn);


			return res.redirect(ViewNameLookup.MainMenu);
		}).catch((error: any): void => {
			res.sendStatus(500);
		});
};

export const startWithEmployee = async (req: Request, res: Response): Promise<void> => {
	if (await Helper.handleInvalidSession(req, res))
		return;

	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then((activeUserCommandResponse: CommandResponse<ActiveUser>): Promise<void> => {
			if (!EmployeeHelper.isElevatedUser((<ActiveUser>activeUserCommandResponse.data).classification)) {
				res.redirect(ViewNameLookup.MainMenu);
				return Promise.reject(<CommandResponse<Employee>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});
			}
			if(activeUserCommandResponse.status !== 200)
				res.redirect(ViewNameLookup.SignIn);

			else
			if(!EmployeeQuery.queryById((<Express.Session>req.session).id)){
				// Does not exist
			} else
				res.render(ViewNameLookup.EmployeeDetail, req.body);
			return Promise.resolve();
		}).then((/* Some employee details */): void => {
			return res.render(ViewNameLookup.EmployeeDetail, req.body);
		}).catch((error: any): void => {
			// Handle any errors that occurred
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
	let employeeExists: boolean;

	return determineCanCreateEmployee(req)
		.then((canCreateEmployee: CanCreateEmployee): Promise<CommandResponse<Employee>> => {
			if (canCreateEmployee.employeeExists
				&& !canCreateEmployee.isElevatedUser)

				return Promise.reject(<CommandResponse<boolean>>{
					status: 403,
					message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
				});

			employeeExists = canCreateEmployee.employeeExists;

			return performSave(req.body, !employeeExists);
		}).then((saveEmployeeCommandResponse: CommandResponse<Employee>): void => {
			const response: EmployeeSaveResponse = <EmployeeSaveResponse>{
				employee: <Employee>saveEmployeeCommandResponse.data
			};

			if (!employeeExists)
				response.redirectUrl = RouteLookup.SignIn
					+ '?' + QueryParameterLookup.EmployeeId
					+ '=' + (<Employee>saveEmployeeCommandResponse.data).employeeId;


			res.status(saveEmployeeCommandResponse.status)
				.send(response);
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
	saveEmployee(req, res, EmployeeUpdate.execute);
};

export const createEmployee = async (req: Request, res: Response): Promise<void> => {
	saveEmployee(req, res, EmployeeCreate.execute);
};
