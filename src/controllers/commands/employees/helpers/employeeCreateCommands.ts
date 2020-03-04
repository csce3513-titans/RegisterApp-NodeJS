import Sequelize from 'sequelize';
import * as Helper from '../../helpers/helper';
import { EmployeeModel } from '../../models/employeeModel';
import * as EmployeeRepository from '../../models/employeeModel';
import { Resources, ResourceKey } from '../../../../resourceLookup';
import * as DatabaseConnection from '../../models/databaseConnection';
import { CommandResponse, Employee, EmployeeSaveRequest } from '../../../typeDefinitions';
import { EmployeeClassification } from '../../models/constants/entityTypes';
import {mapEmployeeData, validateSaveRequest} from './employeeHelper';

export const execute = async (
	saveEmployeeRequest: EmployeeSaveRequest,
	isInitialEmployee?: boolean
): Promise<CommandResponse<Employee>> => {
	const validationResponse: CommandResponse<Employee> =
		validateSaveRequest(saveEmployeeRequest);
	if (validationResponse.status !== 200)
		return Promise.reject(validationResponse);

	const employeeToCreate: EmployeeModel = <EmployeeModel>{
		active: saveEmployeeRequest.active || true,
		lastName: saveEmployeeRequest.lastName,
		password: Buffer.from(saveEmployeeRequest.password),
		firstName: saveEmployeeRequest.firstName,
		classification: isInitialEmployee ?
			EmployeeClassification.GeneralManager : saveEmployeeRequest.classification
	};

	let createTransaction: Sequelize.Transaction;

	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<EmployeeModel> => {
			createTransaction = createdTransaction;
			return EmployeeModel.create<EmployeeModel>(
				employeeToCreate,
				<Sequelize.CreateOptions>{
					transaction: createTransaction
				});
		}).then((createdEmployee: EmployeeModel): CommandResponse<Employee> => {
			createTransaction.commit();

			return <CommandResponse<Employee>>{
				status: 201,
				data: mapEmployeeData(createdEmployee)
			};
		}).catch((error: any): Promise<CommandResponse<Employee>> => {
			if (createTransaction != null)
				createTransaction.rollback();

			return Promise.reject(<CommandResponse<Employee>>{
				status: error.status || 500,
				message: error.message || Resources.getString(ResourceKey.EMPLOYEE_UNABLE_TO_SAVE)
			});
		});
};
