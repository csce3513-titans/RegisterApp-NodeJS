import Sequelize from 'sequelize';
import * as Helper from '../helpers/helper';
import * as EmployeeModel from '../models/employeeModel';
import * as ActiveUserModel from '../models/activeUserModel';
import { CommandResponse } from '../../typeDefinitions';
import { Resources, ResourceKey } from '../../../resourceLookup';
import * as DatabaseConnection from '../models/databaseConnection';
import { SignInRequest } from '../../typeDefinitions';

const validateRequest = (signInRequest: SignInRequest): CommandResponse<void> => {
	let errorMessage = '';

	if (Helper.isBlankString(signInRequest.employeeId) || !Helper.isNumberString(signInRequest.employeeId))
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID);
	else if (Helper.isBlankString(signInRequest.password))
		errorMessage = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);

	return errorMessage === ''
		? <CommandResponse<void>>{ status: 200 }
		: <CommandResponse<void>>{
			status: 422,
			message: errorMessage
		};
};

export const execute = async (signInRequest: SignInRequest, session: Express.Session): Promise<CommandResponse<void>> => {
	const validationResponse: CommandResponse<void> = validateRequest(signInRequest);
	if (validationResponse.status !== 200)
		return validationResponse;

	let authTransaction: Sequelize.Transaction | null = null;

	try {
		authTransaction = await DatabaseConnection.createTransaction();

		const employeeResponse = await EmployeeModel.queryByEmployeeId(parseInt(signInRequest.employeeId, 10), authTransaction);
		if (employeeResponse == null || employeeResponse.password.toString() !== signInRequest.password)
			throw <CommandResponse<void>>{
				status: 403,
				message: Resources.getString(ResourceKey.USER_SIGN_IN_CREDENTIALS_INVALID)
			};

		const activeUserResponse = await ActiveUserModel.queryByEmployeeId(signInRequest.employeeId, authTransaction);
		if (activeUserResponse !== null) {
			activeUserResponse.set('sessionKey', session.id);
			await activeUserResponse.save();
		} else
			await ActiveUserModel.ActiveUserModel.create({
				id: employeeResponse.id,
				name: `${employeeResponse.firstName} ${employeeResponse.lastName}`,
				createdOn: new Date(),
				employeeId: employeeResponse.employeeId,
				sessionKey: session.id,
				classification: employeeResponse.classification
			});

		await authTransaction.commit();

		return <CommandResponse<void>>{ status: 204 };
	} catch (error) {
		if (authTransaction != null)
			authTransaction.rollback();

		throw <CommandResponse<void>>{
			status: error.status || 500,
			message: error.message || Resources.getString(ResourceKey.USER_UNABLE_TO_SIGN_IN)
		};
	}
};
