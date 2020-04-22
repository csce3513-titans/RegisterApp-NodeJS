import Sequelize from 'sequelize';
import { TransactionEntryModel } from '../models/transactionEntryModel';
import { queryById as queryTransactionById } from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';
import { mapTransactionEntryData } from './helpers/transactionHelper';
import { ProductModel } from '../models/productModel';

export const execute = async (transactionId: string): Promise<CommandResponse<TransactionEntry[]>> => {
	try {
		const transaction = await queryTransactionById(transactionId);
		if (!transaction)
			return <CommandResponse<TransactionEntry[]>>{
				status: 400,
				message: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_RESUME)
			};

		const transactionEntryModels = await TransactionEntryModel.findAll(<Sequelize.FindOptions>{
			where: {
				transactionId
			},
			include: [ProductModel]
		});
		return <CommandResponse<TransactionEntry[]>>{
			status: 200,
			data: transactionEntryModels.map(mapTransactionEntryData)
		};
	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_RESUME)
		};
	}
};
