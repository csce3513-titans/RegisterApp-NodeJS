import { TransactionEntryModel, queryByTransactionId } from '../models/transactionEntryModel';
import { ProductModel, queryByLookupCode } from '../models/productModel';
import {queryById as queryTransactionById, TransactionModel, TransactionTypes} from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';

export const execute = async (transactionId: string, cashierId: string) => {
	try {
		const transaction = await queryTransactionById(transactionId);
		if (!transaction)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_COMPLETE)
			};

		if (cashierId !== transaction.cashierId) // TODO: Should probably allow managers to do this
			return <CommandResponse<TransactionEntry>>{
				status: 403,
				message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
			};

		await TransactionEntryModel.destroy({
			where: {
				transactionId
			}
		});

		await TransactionModel.destroy({
			where: {
				id: transactionId
			}
		});

		return <CommandResponse<TransactionEntry>>{ status: 204 };
	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_CREATE)
		};
	}
};
