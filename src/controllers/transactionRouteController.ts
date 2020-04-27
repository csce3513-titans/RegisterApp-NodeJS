import { Request, Response } from 'express';
import * as Helper from './helpers/routeControllerHelper';
import { Resources, ResourceKey } from '../resourceLookup';
import { ViewNameLookup } from './lookups/routingLookup';
import { TransactionPageResponse, ApiResponse } from './typeDefinitions';
import { execute as getTransactionEntriesCommand} from './commands/transactions/getTransactionEntriesCommand';
import { execute as getUnfinishedTransactionCommand } from './commands/transactions/getUnfinishedTransactionCommand';
import { execute as transactionCreateCommand } from './commands/transactions/createTransactionCommand';
import { execute as validateActiveUserCommand } from './commands/activeUsers/validateActiveUserCommand';
import { execute as createTransactionEntryCommand } from './commands/transactions/createTransactionEntryCommand';
import { execute as updateTransactionEntryCommand } from './commands/transactions/updateTransactionEntryCommand';
import { execute as cancelTransactionCommand } from './commands/transactions/cancelTransactionCommand';
import { execute as completeTransactionCommand } from './commands/transactions/completeTransactionCommand';
import { execute as removeTransactionEntryCommand } from './commands/transactions/removeTransactionEntryCommand';

export const getPage = async (req: Request, res: Response) => {
	try {
		if (await Helper.handleInvalidSession(req, res))
			return;

		const cashierId = (await validateActiveUserCommand((<Express.Session>req.session).id))!.data!.employeeId;
		const unfinishedTransactionId = (await getUnfinishedTransactionCommand(cashierId))?.data?.id;

		if (unfinishedTransactionId) {
			const transactionEntries = (await getTransactionEntriesCommand(unfinishedTransactionId))!.data;
			return res.render(
				ViewNameLookup.Transaction,
				<TransactionPageResponse>{
					transactionId: unfinishedTransactionId,
					transactionEntries
				}
			);
		}

		const newTransactionId = (await transactionCreateCommand(cashierId))!.data!.id;
		return res.render(
			ViewNameLookup.Transaction,
			<TransactionPageResponse>{
				transactionId: newTransactionId
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

export const completeTransaction = async (req: Request, res: Response) => {
	try {
		const user = (await validateActiveUserCommand((<Express.Session>req.session).id)).data!;

		const response = await completeTransactionCommand(req.params.transactionId, user.employeeId);

		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const cancelTransaction = async (req: Request, res: Response) => {
	if (await Helper.handleInvalidApiSession(req, res))
		return;

	try {
		const user = (await validateActiveUserCommand((<Express.Session>req.session).id)).data!;

		const response = await cancelTransactionCommand(req.params.transactionId, user.employeeId);

		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};

export const removeTransactionEntry = async (req: Request, res: Response) => {
	try {
		if (await Helper.handleInvalidSession(req, res))
			return;

		const response = await removeTransactionEntryCommand(req.params.transactionId, req.params.productCode);

		res.status(response.status).send(response.message ? { errorMessage: response.message } : response.data);
	} catch (error) {
		return Helper.processApiError(error, res);
	}
};
