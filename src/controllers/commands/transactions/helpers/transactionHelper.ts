import { TransactionEntryModel } from '../../models/transactionEntryModel';

export const mapTransactionEntryData = (entry: TransactionEntryModel | any) => {
	return {
		price: entry.price,
		quantity: entry.quantity,
		productId: entry.productId,
		transactionId: entry.transactionId,
		id: entry.id,
		createdOn: entry.createdOn,
		lookupCode: entry?.ProductModel?.lookupCode // populated using JOIN with product table
	};
};
