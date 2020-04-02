import { TransactionEntryModel } from '../models/transactionEntryModel';
import { queryByLookupCode } from '../models/productModel';
import { queryById as queryTransactionById } from '../models/transactionModel';
import { CommandResponse, TransactionEntry } from '../../typeDefinitions';
import { ResourceKey, Resources } from '../../../resourceLookup';

/*
    TODO: Query the active cart, query the item ID in the cart, if item exists
    then remove the item, if not we should ignore the command or make note of the
    rare case in a log
 */

// export const execute = async () => {

// };
