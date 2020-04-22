import Sequelize from 'sequelize';
import { TransactionModel } from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';

export const execute = async (cashierId: string): Promise<CommandResponse<TransactionModel | null>> => {
	try {
		const unfinishedTransaction = await TransactionModel.findOne(<Sequelize.FindOptions>{
			where: {
				cashierId,
				completed: false
			}
		});
		return <CommandResponse<TransactionModel | null>>{
			status: 200,
			data: unfinishedTransaction
		};
	} catch (error) {
		throw <CommandResponse<TransactionEntry>>{
			status: error.status ?? 500,
			message: error.message ?? Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_RESUME)
		};
	}
};
