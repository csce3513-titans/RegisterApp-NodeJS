import { queryByTransactionId } from '../models/transactionEntryModel';
import { ProductModel, queryById} from '../models/productModel';
import { queryById as queryTransactionById, TransactionTypes } from '../models/transactionModel';
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

		if (cashierId !== transaction.cashierId) 
			return <CommandResponse<TransactionEntry>>{
				status: 403,
				message: Resources.getString(ResourceKey.USER_NO_PERMISSIONS)
			};

		const entries = await queryByTransactionId(transaction.id);
		const products: Record<string, ProductModel> = { };
		for (const entry of entries) {
			const product = await queryById(entry.productId);
			if (!product || (transaction.type === TransactionTypes.SALE && entry.quantity > product.count))
				return <CommandResponse<TransactionEntry>>{
					status: 400,
					message: Resources.getString(ResourceKey.TRANSACTION_NOT_ENOUGH_IN_STOCK)
				};

			products[entry.id] = product;
		}

		for (const entry of entries) {
			if (transaction.type === TransactionTypes.SALE)
				products[entry.id].count -= entry.quantity;
			else if (transaction.type === TransactionTypes.RETURN)
				products[entry.id].count += entry.quantity;

			await products[entry.id].save();
		}

		transaction.completed = true;
		await transaction.save();

		return <CommandResponse<TransactionEntry>>{ status: 200 };
	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_COMPLETE)
		};
	}
};
