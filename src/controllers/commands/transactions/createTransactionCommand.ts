import { TransactionModel } from '../models/transactionModel';
import {CommandResponse, Transaction} from '../../typeDefinitions';
import {ResourceKey, Resources} from '../../../resourceLookup';

export const execute = async (cashierId: string): Promise<CommandResponse<Transaction>> => {
	return TransactionModel.create(<TransactionModel>{
		cashierId,
		completed: false
	}).then((createdTransaction: TransactionModel): CommandResponse<Transaction> => {
		return <CommandResponse<Transaction>>{
			data: <Transaction>{
				id: createdTransaction.id,
				createdOn: createdTransaction.createdOn,
				employeeId: createdTransaction.cashierId
			},
			status: 201
		};
	}).catch((error: any): Promise<CommandResponse<Transaction>> => {
		return Promise.reject(<CommandResponse<Transaction>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_CREATE)
		});
	});
};
