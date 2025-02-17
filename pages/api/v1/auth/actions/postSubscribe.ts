// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { NextApiRequest, NextApiResponse } from 'next';

import withErrorHandling from '~src/api-middlewares/withErrorHandling';
import { isFirestoreProposalTypeValid, isValidNetwork } from '~src/api-utils';
import { networkDocRef } from '~src/api-utils/firestore_refs';
import authServiceInstance, { NOTIFICATION_DEFAULTS } from '~src/auth/auth';
import { ChangeResponseType, IUserPreference, MessageType } from '~src/auth/types';
import getTokenFromReq from '~src/auth/utils/getTokenFromReq';
import messages from '~src/auth/utils/messages';
import { offChainProposalTypes } from '~src/global/proposalType';

async function handler(req: NextApiRequest, res: NextApiResponse<ChangeResponseType | MessageType>) {
	if (req.method !== 'POST') return res.status(405).json({ message: 'Invalid request method, POST required.' });

	const network = String(req.headers['x-network']);
	if(!network || !isValidNetwork(network)) res.status(400).json({ message: 'Invalid network in request header' });

	const { post_id, proposalType } = req.body;

	const strProposalType = String(proposalType);
	if (!isFirestoreProposalTypeValid(strProposalType)) {
		return res.status(400).json({ message: `The proposal type "${proposalType}" is invalid.` });
	}
	if(!post_id) return res.status(400).json({ message: 'Missing parameters in request body' });

	const token = getTokenFromReq(req);
	if(!token) return res.status(400).json({ message: 'Invalid token' });

	const user = await authServiceInstance.GetUser(token);

	if(!user) return res.status(400).json({ message: messages.USER_NOT_FOUND });
	if (!user.email_verified) return res.status(400).json({ message: messages.SUBSCRIPTION_EMAIL_UNVERIFIED });

	const userPreferenceRef = networkDocRef(network).collection('user_preferences').doc(String(user.id));
	const userPreference = await userPreferenceRef.get();

	const strPostId = String(post_id);
	if (!userPreference.exists) {
		await userPreferenceRef.set({
			notification_settings: NOTIFICATION_DEFAULTS,
			post_subscriptions: {
				[strProposalType]: [strPostId]
			},
			user_id: user.id
		}).then(() => {
			return res.status(200).json({ message: messages.SUBSCRIPTION_SUCCESSFUL });
		}).catch((error) => {
			console.log(' Error while adding subscription : ', error);
			return res.status(400).json({ message: 'Error while adding subscription.' });
		});
	} else {
		const data = userPreference.data() as IUserPreference;

		const notification_settings = data?.notification_settings;
		if (offChainProposalTypes.includes(strProposalType) && !notification_settings?.post_created) {
			return res.status(400).json({ message: 'Restricted subscribe to the post because of "Subscribe to post you created" is off.' });
		}
		if (!notification_settings?.post_participated) {
			return res.status(400).json({ message: 'Restricted subscribe to the post because of "Subscribe to post you participate in" is off.' });
		}

		const post_subscriptions = data?.post_subscriptions || {};
		const proposalTypePostSubscriptions = post_subscriptions?.[strProposalType as keyof typeof data.post_subscriptions] || [];
		if(proposalTypePostSubscriptions?.some((id) => String(id) === strPostId)) return res.status(400).json({ message: messages.SUBSCRIPTION_ALREADY_EXISTS });

		proposalTypePostSubscriptions.push(strPostId);
		await userPreferenceRef.update({
			post_subscriptions: {
				...post_subscriptions,
				[strProposalType]: proposalTypePostSubscriptions
			}
		}).then(() => {
			return res.status(200).json({ message: messages.SUBSCRIPTION_SUCCESSFUL });
		}).catch((error) => {
			console.log(' Error while adding subscription : ', error);
			return res.status(400).json({ message: 'Error while adding subscription.' });
		});
	}

}

export default withErrorHandling(handler);
