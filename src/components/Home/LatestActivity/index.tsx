// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Tabs } from 'antd';
import Link from 'next/link';
import { ILatestActivityPosts } from 'pages';
import { ILatestActivityPostsListingResponse } from 'pages/api/v1/latest-activity/on-chain-posts';
import React, { FC, useState } from 'react';
import CountBadgePill from 'src/ui-components/CountBadgePill';
import styled from 'styled-components';

import { ProposalType } from '~src/global/proposalType';
import { IApiResponse } from '~src/types';

import { getColumns } from './columns';
import PostsTable from './PostsTable';

interface ILatestActivityProps {
	latestPosts: {
		all?: IApiResponse<ILatestActivityPostsListingResponse>;
	} & ILatestActivityPosts;
	className?: string
}
type TCapitalizeFn = (str: string, lower?: boolean) => string;
const capitalize: TCapitalizeFn = (str, lower = false) =>
	(lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());

const getLabel = (key: 'all' | ProposalType): string => {
	if (key === ProposalType.COUNCIL_MOTIONS) {
		return 'Motions';
	} else if (key === ProposalType.DEMOCRACY_PROPOSALS) {
		return 'Proposals';
	} else if (key === ProposalType.TREASURY_PROPOSALS) {
		return 'Treasury Proposals';
	}
	return capitalize(key);
};

const LatestActivity: FC<ILatestActivityProps> = ({ className, latestPosts }) => {

	const [currentTab, setCurrentTab] = useState('all');
	const tabItems = (
			Object.entries(latestPosts) as [key: 'all' | ProposalType, value: IApiResponse<ILatestActivityPostsListingResponse>][]
	).map(([key, value]) => {
		const label = getLabel(key);
		return {
			children: (
				<PostsTable
					count={value?.data?.count || 0}
					posts={value?.data?.posts}
					error={value?.error || ''}
					columns={getColumns(key)}
					type={key}
				/>
			),
			key: key === ProposalType.REFERENDUMS? 'referenda': label.toLowerCase().split(' ').join('-'),
			label: <CountBadgePill label={label} count={value?.data?.count} />
		};
	});

	return (
		<div className={`${className} bg-white drop-shadow-md p-4 lg:p-6 rounded-md`}>
			<div className="flex justify-between items-center">
				<h2 className='dashboard-heading mb-6'>Latest Activity</h2>
				{currentTab !== 'all' && <Link className='text-sidebarBlue font-medium hover:text-pink_primary py-0.5 px-2 rounded-lg' href={`/${currentTab}`}>View all</Link>}
			</div>
			<Tabs
				className='ant-tabs-tab-bg-white text-sidebarBlue font-medium'
				type="card"
				items={tabItems}
				onChange={(key) => setCurrentTab(key)}
			/>
		</div>
	);
};

export default styled(LatestActivity)`
	th {
		color: var(--navBlue) !important;
	}

	td.ant-table-cell {
		color: var(--sidebarBlue) !important;
	}

	tr:nth-child(2n) td {
    background-color: #fbfbfb !important;
	}

	tr {
		cursor: pointer !important;
	}

	.ant-tabs-tab-bg-white .ant-tabs-tab:not(.ant-tabs-tab-active) {
		background-color: white;
		border-top-color: white;
		border-left-color: white;
		border-right-color: white;
		border-bottom-color: #E1E6EB;
	}

	.ant-tabs-tab-bg-white .ant-tabs-tab-active{
		border-top-color: #E1E6EB;
		border-left-color: #E1E6EB;
		border-right-color: #E1E6EB;
		border-radius: 6px 6px 0 0 !important;
	}

	.ant-tabs-tab-bg-white .ant-tabs-nav:before{
		border-bottom: 1px solid #E1E6EB;
	}
`;