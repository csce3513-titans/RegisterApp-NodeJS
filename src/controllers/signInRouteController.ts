import { Request, Response } from 'express';
import { ViewNameLookup, RouteLookup } from '../controllers/lookups/routingLookup';
import { checkInvalidSession } from './helpers/routeControllerHelper';
import * as ActiveEmployeeExistsQuery from './commands/employees/activeEmployeeExistsQuery';
import * as SignInCommand from './commands/employees/employeeSignInCommand';
import * as ClearActiveUserCommand from './commands/activeUsers/clearActiveUserCommand';
import { SignInRequest, ApiResponse } from './typeDefinitions';

export const getView = async (req: Request, res: Response): Promise<void> => {
	try {
		if ((await ActiveEmployeeExistsQuery.query()).data === false)
			return res.redirect(RouteLookup.EmployeeDetail);

		if (await checkInvalidSession(req))
			return res.render(ViewNameLookup.SignIn);

		return res.redirect(RouteLookup.MainMenu);

	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
	try {
		if (!req.session)
			throw new Error('Session does not exist');

		await SignInCommand.execute(<SignInRequest>{
			employeeId: req.body.employeeId,
			password: req.body.password
		}, req.session);

		return res.redirect(RouteLookup.MainMenu);
	} catch (error) {
		res.status(error.status).render(ViewNameLookup.SignIn, <ApiResponse>{
			errorMessage: error.message
		});
	}
};

export const clearActiveUser = async (req: Request, res: Response): Promise<void> => {
	try {
		if (req.session)
			await ClearActiveUserCommand.execute(req.session.id);

		res.status(204).send(<ApiResponse>{
			redirectUrl: RouteLookup.SignIn
		});
	} catch (error) {
		res.status(error.status).send(<ApiResponse>{
			redirectUrl: RouteLookup.SignIn,
			errorMessage: error.message
		});
	}
};
