import { TransactionEntryModel } from '../models/transactionEntryModel';
import { queryByLookupCode } from '../models/productModel';
import { queryById as queryTransactionById, TransactionTypes } from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';

export const execute = async (transactionId: string, productCode: string, quantity: number) => {
	try {
		const transaction = await queryTransactionById(transactionId);
		if (!transaction)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_UPDATE)
			};

		const product = await queryByLookupCode(productCode);
		if (!product)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_UPDATE)
			};

		if (transaction.type === TransactionTypes.SALE && product.count)
			return <CommandResponse<TransactionEntry>>{
				status: 400,
				message: Resources.getString(ResourceKey.TRANSACTION_NOT_ENOUGH_IN_STOCK)
			};

		const entry = await TransactionEntryModel.findOne({ where: { transactionId, productId: product.id } });
		if (!entry)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_UPDATE)
			};

		entry.quantity = quantity;
		entry.price = product.price;

		await entry.save();

		return <CommandResponse<TransactionEntry>>{ status: 200 };
	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_ADD)
		};
	}
};
