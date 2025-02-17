// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import Address from './Address';
import TopicTag from './TopicTag';

interface Props {
	address: string
	topic?: string
	username?: string;
}

const OnchainCreationLabel = ({ address, topic, username }:Props ) => {
	return (
		<div className='flex justify-between min-[340px]:flex-row min-[340px]:items-center text-xs text-navBlue w-full min-[340px]:w-auto'>
			<div className='flex items-center'>
				{
					username || address?
						<>
							<div>By:</div>
							{
								address?
									<Address
										address={address}
										className='address ml-1.5'
										displayInline={true}
									/>
									: <span
										className='mx-1.5'
									>
										{username}
									</span>
							}
						</>
						: null
				}
			</div>
			{
				topic?
					<div className='flex items-center'>
						<div className='mr-1.5 ml-auto hidden min-[340px]:flex'>from</div>
						<TopicTag topic={topic} />
					</div>
					: null
			}
		</div>
	);
};

export default OnchainCreationLabel;
