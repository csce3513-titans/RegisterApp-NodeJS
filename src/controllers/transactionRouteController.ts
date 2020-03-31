import { Request, Response } from 'express';
import * as Helper from './helpers/routeControllerHelper';
import { Resources, ResourceKey } from '../resourceLookup';
import { TransactionModel, queryById as queryTransactionById } from '../controllers/commands/models/transactionModel';
import { TransactionEntryModel, queryById as queryTransactionEntryById,
	queryByTransactionIdAndProductId } from '../controllers/commands/models/transactionEntryModel';
import * as ValidateActiveUser from './commands/activeUsers/validateActiveUserCommand';
import * as TransactionCreateCommand from './commands/transactions/transactionCreateCommand';
import { ViewNameLookup, ParameterLookup, RouteLookup } from './lookups/routingLookup';
import { CommandResponse, TransactionPageResponse, TransactionResponse,
	Transaction, TransactionEntry, ApiResponse, ActiveUser } from './typeDefinitions';

export const getPage = async (req: Request, res: Response): Promise<void> => {
	try {
		const cashierId = (await ValidateActiveUser.execute((<Express.Session>req.session).id))!.data!.employeeId;

		const transactionId = (await TransactionCreateCommand.execute(cashierId))!.data!.id;
		return res.render(
			ViewNameLookup.Transaction,
			<TransactionPageResponse>{
				transactionId
			}
		);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const addTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	try {
		await ValidateActiveUser.execute((<Express.Session>req.session).id);

		const transaction = await queryTransactionById(req.params.transactionId);

		res.send();
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const updateTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	try {
		await ValidateActiveUser.execute((<Express.Session>req.session).id);

		const entry = await queryByTransactionIdAndProductId(req.params.transactionId, req.params.productId);

		res.send();
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const closeTransaction = async (req: Request, res: Response): Promise<void> => {
	try {
		await ValidateActiveUser.execute((<Express.Session>req.session).id);

		const transaction = await queryTransactionById(req.params.transactionId);

		res.send();
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const removeTransactionEntry = async (req: Request, res: Response): Promise<void> => {
	try {
		await ValidateActiveUser.execute((<Express.Session>req.session).id);

		const entry = await queryByTransactionIdAndProductId(req.params.transactionId, req.params.productId);

		res.send();
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};
