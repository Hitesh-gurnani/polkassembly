// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CheckCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import { DeriveAccountFlags, DeriveAccountRegistration } from '@polkadot/api-derive/types';
import { Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';

const StyledPopup = styled.div`
font-size: sm;
color: var(--grey_primary);
list-style: none;
padding: 1rem;

li {
	margin-bottom: 0.3rem;
}

.desc {
	font-weight: 500;
	margin-right: 0.3rem;
}

.judgments {
	display: inline list-item;
}
`;

interface Props {
	className?: string,
	address: string,
	identity: DeriveAccountRegistration,
	flags?: DeriveAccountFlags,
	web3Name?: string
}

const IdentityBadge = ({ className, address, identity, flags, web3Name }: Props) => {
	const judgements = identity.judgements.filter(([, judgement]): boolean => !judgement.isFeePaid);
	const isGood = judgements.some(([, judgement]): boolean => judgement.isKnownGood || judgement.isReasonable);
	const isBad = judgements.some(([, judgement]): boolean => judgement.isErroneous || judgement.isLowQuality);

	const color: 'brown' | 'green' | 'grey' = isGood ? 'green' : isBad ? 'brown' : 'grey';
	const CouncilEmoji = () => <span aria-label="council member" className='-mt-1' role="img">👑</span>;
	const infoElem = <span className='flex items-center'>
		{isGood ? <CheckCircleFilled style={ { color } } /> : <MinusCircleFilled style={ { color } } />}
		<span className='w-1'></span>
		{flags?.isCouncil && <CouncilEmoji/>}
	</span>;

	const displayJudgements = JSON.stringify(judgements.map(([,jud]) => jud.toString()));

	const popupContent = <StyledPopup>
		{identity?.legal && <li><span className='desc'>legal:</span>{identity.legal}</li>}
		{identity?.email && <li><span className='desc'>email:</span>{identity.email}</li>}
		{identity?.judgements?.length > 0 && <li><span className='desc'>judgements:</span><span className='judgments'>{displayJudgements}</span></li>}
		{identity?.pgp && <li><span className='desc'>pgp:</span>{identity.pgp}</li>}
		{identity?.riot && <li><span className='desc'>riot:</span>{identity.riot}</li>}
		{identity?.twitter && <li><span className='desc'>twitter:</span>{identity.twitter}</li>}
		{identity?.web && <li><span className='desc'>web:</span>{identity.web}</li>}
		{flags?.isCouncil && <li><span className='desc'>Council member</span><CouncilEmoji/></li>}
		{<li><span className='desc'><a href={`https://polkaverse.com/accounts/${address}`} target='_blank' rel='noreferrer'>Polkaverse Profile</a></span></li>}
		{web3Name && <li><span className='desc'><a href={`https://w3n.id/${web3Name}`} target='_blank' rel='noreferrer'>Web3 Name Profile</a></span></li>}
	</StyledPopup>;

	return <div className={className}>
		<Tooltip color='#fff' title={popupContent}>
			{infoElem}
		</Tooltip>
	</div>;
};

export default styled(IdentityBadge)`
	display: inline;

	i.green.circle.icon {
		color: green_primary !important;
	}

	i.grey.circle.icon {
		color: grey_primary !important;
	}
`;
