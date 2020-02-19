import { Resources, ResourceKey } from '../../../resourceLookup';
import * as ActiveUserRepository from '../models/activeUserModel';
import { CommandResponse } from '../../typeDefinitions';

export const execute = async (sessionKey: string): Promise<CommandResponse<void>> => {
	const queriedActiveUser = await ActiveUserRepository.queryBySessionKey(sessionKey);
	if (!queriedActiveUser)
		throw <CommandResponse<void>>{
			status: 404,
			message: Resources.getString(ResourceKey.USER_NOT_FOUND)
		};

	await queriedActiveUser.destroy();

	return <CommandResponse<void>>{ status: 204 };
};
