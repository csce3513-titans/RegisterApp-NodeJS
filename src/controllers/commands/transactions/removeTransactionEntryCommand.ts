import { TransactionEntryModel } from '../models/transactionEntryModel';
import * as Helper from '../helpers/helper';
import { queryByLookupCode } from '../models/productModel';
import { queryById as queryTransactionById } from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';

export const execute = async (transactionId: string, productCode: string) => {
	if (Helper.isBlankString(productCode) || Helper.isBlankString(transactionId))
		return <CommandResponse<void>>{ status: 204 };

	try {
		const transaction = await queryTransactionById(transactionId);
		if (!transaction)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_REMOVE)
			};

		const product = await queryByLookupCode(productCode);
		if (!product)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_REMOVE)
			};

		const entry = await TransactionEntryModel.findOne({ where: { transactionId, productId: product.id } });
		if (!entry)
			return <CommandResponse<TransactionEntry>>{
				status: 404,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_REMOVE)
			};

		await entry.destroy();

		return <CommandResponse<TransactionEntry>>{ status: 200 };

	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_REMOVE)
		};
	}
};
