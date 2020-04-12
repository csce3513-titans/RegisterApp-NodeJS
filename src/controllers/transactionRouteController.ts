import { Request, Response } from 'express';
import * as Helper from './helpers/routeControllerHelper';
import { Resources, ResourceKey } from '../resourceLookup';
import { TransactionModel, queryById as queryTransactionById } from '../controllers/commands/models/transactionModel';
import { TransactionEntryModel, queryById as queryTransactionEntryById,
	queryByTransactionIdAndProductId } from '../controllers/commands/models/transactionEntryModel';
import { execute as validateActiveUserCommand } from './commands/activeUsers/validateActiveUserCommand';
import * as TransactionCreateCommand from './commands/transactions/transactionCreateCommand';
import { ViewNameLookup } from './lookups/routingLookup';
import { TransactionPageResponse, ApiResponse } from './typeDefinitions';
import { execute as createTransactionEntryCommand } from './commands/transactions/createTransactionEntryCommand';
import { execute as updateTransactionEntryCommand } from './commands/transactions/updateTransactionEntryCommand';
import { execute as closeTransactionCommand } from './commands/transactions/closeTransactionCommand';

export const getPage = async (req: Request, res: Response) => {
	if (await Helper.handleInvalidSession(req, res))
		return;

	try {
		const cashierId = (await validateActiveUserCommand((<Express.Session>req.session).id))!.data!.employeeId;

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

export const addTransactionEntry = async (req: Request, res: Response) => {
	try {
		if (await Helper.handleInvalidSession(req, res))
			return;

		const response = await createTransactionEntryCommand(req.params.transactionId, req.params.productCode);

		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const updateTransactionEntry = async (req: Request, res: Response) => {
	try {
		if (await Helper.handleInvalidSession(req, res))
			return;

		if (!req.body || !req.body.quantity || typeof req.body.quantity !== 'number' || req.body.quantity < 0)
			return res.status(400).json(<ApiResponse>{ errorMessage: Resources.getString(ResourceKey.TRANSACTION_UNABLE_TO_UPDATE) });

		const response = await updateTransactionEntryCommand(req.params.transactionId, req.params.productCode, req.body.quantity);

		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const closeTransaction = async (req: Request, res: Response) => {
	if (await Helper.handleInvalidApiSession(req, res))
		return;

	try {
		const user = (await validateActiveUserCommand((<Express.Session>req.session).id)).data!;

		const response = await closeTransactionCommand(req.params.transactionId, user.employeeId);

		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const removeTransactionEntry = async (req: Request, res: Response) => {
	try {
		if (await Helper.handleInvalidSession(req, res))
			return;

		const entry = await queryByTransactionIdAndProductId(req.params.transactionId, req.params.productId);

		res.send();
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};
