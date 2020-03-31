import { TransactionEntryModel } from '../models/transactionEntryModel';
import { queryByLookupCode } from '../models/productModel';
import { queryById as queryTransactionById } from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';

export const execute = async (transactionId: string, productCode: string) => {
	try {
		const transaction = await queryTransactionById(transactionId);
		if (!transaction)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_ADD)
			};

		const product = await queryByLookupCode(productCode);
		if (!product)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_ADD)
			};

		const entry = await TransactionEntryModel.create({
			price: product.price,
			quantity: 1,
			productId: product.id,
			transactionId
		});

		return <CommandResponse<TransactionEntry>>{
			status: 201,
			data: <TransactionEntry>{
				id: entry.id,
				price: entry.price,
				quantity: entry.quantity,
				productId: entry.productId,
				transactionId: entry.transactionId,
				createdOn: entry.createdOn
			}
		};
	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_ADD)
		};
	}
};
