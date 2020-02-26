import Sequelize from 'sequelize';
import * as Helper from '../../helpers/helper';
import { EmployeeModel } from '../../models/employeeModel';
import * as EmployeeRepository from '../../models/employeeModel';
import { Resources, ResourceKey } from '../../../../resourceLookup';
import * as DatabaseConnection from '../../models/databaseConnection';
import { CommandResponse, Employee, EmployeeSaveRequest } from '../../../typeDefinitions';
import { EmployeeClassification } from '../../models/constants/entityTypes';

const validateSaveRequest = (
	saveEmployeeRequest: EmployeeSaveRequest
): CommandResponse<Employee> => {
	let errorMessage = '';

	if (Helper.isBlankString(saveEmployeeRequest.firstName)){
        errorMessage = Resources.getString(ResourceKey.EMPLOYEE_FIRST_NAME_INVALID);
    }
    else if (Helper.isBlankString(saveEmployeeRequest.lastName)){
        errorMessage = Resources.getString(ResourceKey.EMPLOYEE_LAST_NAME_INVALID);
    }
    else if (Helper.isBlankString(saveEmployeeRequest.password)){
        errorMessage = Resources.getString(ResourceKey.EMPLOYEE_PASSWORD_INVALID);
    }

    // If this is the first employee, make manager
    if(saveEmployeeRequest.isInitialEmployee) {
        saveEmployeeRequest.classification = EmployeeClassification.GeneralManager;
    }

	return errorMessage === ''
		? <CommandResponse<Employee>>{ status: 200 }
		: <CommandResponse<Employee>>{
			status: 422,
			message: errorMessage
		};
};



export const execute = async (
	saveEmployeeRequest: EmployeeSaveRequest
): Promise<CommandResponse<Employee>> => {
	const validationResponse: CommandResponse<Employee> =
		validateSaveRequest(saveEmployeeRequest);
	if (validationResponse.status !== 200)
		return Promise.reject(validationResponse);

	const employeeToCreate: EmployeeModel = <EmployeeModel>{
        active: saveEmployeeRequest.active,
        lastName: saveEmployeeRequest.lastName,
        password: Buffer.from(saveEmployeeRequest.password),
        firstName: saveEmployeeRequest.firstName,
        managerId: saveEmployeeRequest.managerId,
        // employeeId: 1,                                  FIXME: what to do about dynamic employee IDs?
        classification: saveEmployeeRequest.isInitialEmployee ? 
            EmployeeClassification.GeneralManager : saveEmployeeRequest.classification,
	};

    let createEmployee: Sequelize.Transaction;
    

    // The instructions say use existing EmployeeModel.create(), yet no method exists. Will ask questions about
    /* copy/pasted how it was done for the products for future reference
	return DatabaseConnection.createTransaction()
		.then((createdTransaction: Sequelize.Transaction): Promise<ProductModel | null> => {
			createTransaction = createdTransaction;

			return ProductRepository.queryByLookupCode(
				saveProductRequest.lookupCode,
				createTransaction);
		}).then((queriedProduct: (ProductModel | null)): Promise<ProductModel> => {
			if (queriedProduct != null)
				return Promise.reject(<CommandResponse<Product>>{
					status: 409,
					message: Resources.getString(ResourceKey.PRODUCT_LOOKUP_CODE_CONFLICT)
				});

			return ProductModel.create(
				productToCreate,
				<Sequelize.CreateOptions>{
					transaction: createTransaction
				});
		}).then((createdProduct: ProductModel): CommandResponse<Product> => {
			createTransaction.commit();

			return <CommandResponse<Product>>{
				status: 201,
				data: <Product>{
					id: createdProduct.id,
					count: createdProduct.count,
					lookupCode: createdProduct.lookupCode,
					createdOn: Helper.formatDate(createdProduct.createdOn)
				}
			};
		}).catch((error: any): Promise<CommandResponse<Product>> => {
			if (createTransaction != null)
				createTransaction.rollback();

			return Promise.reject(<CommandResponse<Product>>{
				status: error.status || 500,
				message: error.message || Resources.getString(ResourceKey.PRODUCT_UNABLE_TO_SAVE)
			});
        });
        
        */

        // Temporary Error 
        return Promise.reject(<CommandResponse<Employee>>{
            status: 500,
            message: Resources.getString(ResourceKey.EMPLOYEE_EMPLOYEE_ID_INVALID)
        });
};
