// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { TwitterTimelineEmbed } from 'react-twitter-embed';

interface INewsProps {
	twitter: string;
}

const News: FC<INewsProps> = (props) => {
	const { twitter } = props;
	let profile = 'polkadot';
	if (twitter) {
		profile = twitter.split('/')[3];
	}
	return (
		<div className='bg-white drop-shadow-md p-4 lg:p-6 rounded-md h-[520px] lg:h-[550px]'>
			<h2 className='dashboard-heading mb-6'>News</h2>

			<div>
				<TwitterTimelineEmbed
					sourceType="profile"
					screenName={profile}
					options={ { height: 450 } }
					noHeader={true}
					noFooter={true}
				/>
			</div>
		</div>
	);
};

export default News;