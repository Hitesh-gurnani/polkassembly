// Copyright 2019-2025 @polkassembly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useState, useEffect, FC } from 'react';
import { Helmet } from 'react-helmet';

const ClientOnly: FC<any> = ({ children }) => {
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);
	if (!hasMounted) {
		return null;
	}
	return <> {children} </>;
};
export default ClientOnly;

const Search: FC<{ network: string }> = (props) => {
	const { network } = props;
	return (
		<>
			<Helmet>
				<script
					async
					src="https://cse.google.com/cse.js?cx=27ceb2d02ebf44c39"
				>
				</script>
			</Helmet>
			<div className="gcse-search" data-as_sitesearch={ ['moonbase', 'moonbeam', 'moonriver', 'kilt'].includes(network) ? `${network}.polkassembly.network` : `${network}.polkassembly.io` }></div>
		</>
	);
};
export { Search };
