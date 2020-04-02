import { Request, Response } from 'express';
import { ApiResponse } from '../typeDefinitions';
import { ResourceKey, Resources } from '../../resourceLookup';
import { RouteLookup, QueryParameterLookup } from '../lookups/routingLookup';
import * as ValidateActiveUser from '../commands/activeUsers/validateActiveUserCommand';

const baseNoPermissionsRedirectUrl: string =
	'/?' + QueryParameterLookup.ErrorCode
	+ '=' + ResourceKey.USER_NO_PERMISSIONS;

const defaultNoPermissionsRedirectBaseLocation: string = RouteLookup.MainMenu;

export interface ApiErrorHints {
	defaultErrorMessage?: string;
	redirectBaseLocation?: string;
}

export const invalidSessionRedirectUrl: string = RouteLookup.SignIn
	+ '/?' + QueryParameterLookup.ErrorCode
	+ '=' + ResourceKey.USER_SESSION_NOT_ACTIVE;

export const buildNoPermissionsRedirectUrl = (redirectBaseLocation?: string): string => {
	return (redirectBaseLocation || defaultNoPermissionsRedirectBaseLocation) + baseNoPermissionsRedirectUrl;
};

export const handleInvalidSession = async (req: Request, res: Response): Promise<boolean> => {
	if (await checkInvalidSession(req)) {
		res.redirect(invalidSessionRedirectUrl);
		return true;
	}
	return false;
};

export const checkInvalidSession = async (req: Request): Promise<boolean> => {
	return ValidateActiveUser.execute((<Express.Session>req.session).id)
		.then(() => {
			return false;
		})
		.catch(() => {
			return true;
		});
};

export const processStartError = (
	error: any,
	res: Response,
	redirectBaseLocation?: string
): boolean => {
	let processedStartError: boolean;
	processedStartError = false;

	if ((error.status != null) && (error.status === 404)
		&& (error.message === Resources.getString(ResourceKey.USER_NOT_FOUND))) {

		res.redirect(invalidSessionRedirectUrl);
		processedStartError = true;
	} else if (error.status != null && error.status === 403 && error.message === Resources.getString(ResourceKey.USER_NO_PERMISSIONS)) {

		res.redirect(buildNoPermissionsRedirectUrl(redirectBaseLocation));
		processedStartError = true;
	}

	return processedStartError;
};

export const handleInvalidApiSession = async (req: Request, res: Response): Promise<boolean> => {
	if (!await checkInvalidSession(req))
		return false;

	res.status(404)
		.send(<ApiResponse>{
			redirectUrl: invalidSessionRedirectUrl,
			errorMessage: Resources.getString(ResourceKey.USER_SESSION_NOT_FOUND)
		});

	return true;
};

export const processApiError = (
	error: any,
	res: Response,
	errorHints?: ApiErrorHints
): void => {
	if (errorHints == null)
		errorHints = <ApiErrorHints>{ };

	if (error.status != null && error.status === 404 && error.message === Resources.getString(ResourceKey.USER_NOT_FOUND))
		res.status(error.status)
			.send(<ApiResponse>{
				redirectUrl: invalidSessionRedirectUrl,
				errorMessage:
					Resources.getString(ResourceKey.USER_SESSION_NOT_FOUND)
			});
	else if (error.status != null && error.status === 403 && error.message === Resources.getString(ResourceKey.USER_NO_PERMISSIONS))
		res.status(error.status)
			.send(<ApiResponse>{
				errorMessage: error.message,
				redirectUrl: buildNoPermissionsRedirectUrl(
					errorHints.redirectBaseLocation)
			});
	else
		res.status(error.status || 500)
			.send(<ApiResponse>{
				errorMessage: error.message || errorHints.defaultErrorMessage
			});
};
