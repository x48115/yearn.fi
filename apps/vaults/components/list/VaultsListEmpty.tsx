import {useAppSettings} from '@vaults/contexts/useAppSettings';
import {Button} from '@yearn-finance/web-lib/components/Button';
import {useChainID} from '@yearn-finance/web-lib/hooks/useChainID';
import {isZero} from '@yearn-finance/web-lib/utils/isZero';
import {getNetwork} from '@yearn-finance/web-lib/utils/wagmi/utils';

import type {ReactElement} from 'react';
import type {TYDaemonVaults} from '@common/schemas/yDaemonVaultsSchemas';

export function VaultsListEmpty({
	sortedVaultsToDisplay,
	currentCategory,
	isLoading
}: {
	sortedVaultsToDisplay: TYDaemonVaults,
	currentCategory: string,
	isLoading: boolean
}): ReactElement {
	const {safeChainID} = useChainID();
	const {searchValue, category, set_category} = useAppSettings();

	if (isLoading && isZero(sortedVaultsToDisplay.length)) {
		return (
			<div className={'flex h-96 w-full flex-col items-center justify-center px-10 py-2'}>
				<b className={'text-lg'}>{'Fetching Vaults'}</b>
				<p className={'text-neutral-600'}>{'Vaults will appear soon. Please wait. Beep boop.'}</p>
				<div className={'flex h-10 items-center justify-center'}>
					<span className={'loader'} />
				</div>
			</div>
		);
	}
	if (!isLoading && isZero(sortedVaultsToDisplay.length) && currentCategory === 'Holdings') {
		return (
			<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center px-10 py-2 md:w-3/4'}>
				<b className={'text-center text-lg'}>{'Well this is awkward...'}</b>
				<p className={'text-center text-neutral-600'}>
					{'You don\'t appear to have any deposits in our Vaults. There\'s an easy way to change that 😏'}
				</p>
			</div>
		);
	}
	if (!isLoading && isZero(sortedVaultsToDisplay.length) && safeChainID !== 1) {
		const chainName = getNetwork(safeChainID)?.name || 'this network';
		return (
			<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center px-10 py-2 md:w-3/4'}>
				<b className={'text-center text-lg'}>{'👀 Where Vaults ser?'}</b>
				<p className={'text-center text-neutral-600'}>
					{`It seems we don’t have ${currentCategory} on ${chainName} (yet). Feel free to check out other vaults on ${chainName} or change network. New Vaults and strategies are added often, so check back later. Don’t be a stranger.`}
				</p>
			</div>
		);
	}
	if (!isLoading && isZero(sortedVaultsToDisplay.length)) {
		return (
			<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center gap-4 px-10 py-2 md:w-3/4'}>
				<b className={'text-center text-lg'}>{'No data, reeeeeeeeeeee'}</b>
				{category === 'All Vaults' ?
					<p className={'text-center text-neutral-600'}>{`The vault "${searchValue}" does not exist`}</p> :
					<>
						<p className={'text-center text-neutral-600'}>
							{`There doesn’t seem to be anything here. It might be because you searched for a token in the ${currentCategory} category, or because there’s a rodent infestation in our server room. You check the search box, we’ll check the rodents. Deal?`}
						</p>
						<Button
							className={'w-full md:w-48'}
							onClick={(): void => set_category('All Vaults')}>
							{'Search all vaults'}
						</Button>
					</>
				}
			</div>
		);
	}
	return <div />;
}

export function VaultListEmptyExternalMigration(): ReactElement {
	return (
		<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center px-10 py-2 md:w-3/4'}>
			<b className={'text-center text-lg'}>{'We looked under the cushions...'}</b>
			<p className={'text-center text-neutral-600'}>
				{'Looks like you don\'t have any tokens to migrate. That could mean that you\'re already earning the best risk-adjusted yields in DeFi (go you), or you don\'t have any vault tokens at all. In which case... you know what to do.'}
			</p>
		</div>
	);
}

export function VaultsListEmptyFactory({
	sortedVaultsToDisplay,
	currentCategory,
	isLoading
}: {
	sortedVaultsToDisplay: TYDaemonVaults,
	currentCategory: string,
	isLoading: boolean
}): ReactElement {
	const {safeChainID} = useChainID();

	if (isLoading && isZero(sortedVaultsToDisplay.length)) {
		return (
			<div className={'flex h-96 w-full flex-col items-center justify-center px-10 py-2'}>
				<b className={'text-lg'}>{'Fetching Vaults'}</b>
				<p className={'text-neutral-600'}>{'Vaults will appear soon. Please wait. Beep boop.'}</p>
				<div className={'flex h-10 items-center justify-center'}>
					<span className={'loader'} />
				</div>
			</div>
		);
	} if (!isLoading && isZero(sortedVaultsToDisplay.length) && currentCategory === 'Holdings') {
		return (
			<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center px-10 py-2 md:w-3/4'}>
				<b className={'text-center text-lg'}>{'Well this is awkward...'}</b>
				<p className={'text-center text-neutral-600'}>
					{'You don\'t appear to have any deposits in our Factory Vaults. There\'s an easy way to change that 😏'}
				</p>
			</div>
		);
	} if (!isLoading && isZero(sortedVaultsToDisplay.length) && safeChainID !== 1) {
		const chainName = getNetwork(safeChainID)?.name || 'this network';
		return (
			<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center px-10 py-2 md:w-3/4'}>
				<b className={'text-center text-lg'}>{'👀 Where Vaults ser?'}</b>
				<p className={'text-center text-neutral-600'}>
					{`It seems we don’t have ${currentCategory} on ${chainName} (yet). Feel free to check out other vaults on ${chainName} or change network. New Vaults and strategies are added often, so check back later. Don’t be a stranger.`}
				</p>
			</div>
		);
	} if (!isLoading && isZero(sortedVaultsToDisplay.length)) {
		return (
			<div className={'mx-auto flex h-96 w-full flex-col items-center justify-center px-10 py-2 md:w-3/4'}>
				<b className={'text-center text-lg'}>{'No data, reeeeeeeeeeee'}</b>
				<p className={'text-center text-neutral-600'}>
					{'There doesn’t seem to be anything here. It might be because you searched for a token in the wrong category, or because there’s a rodent infestation in our server room. You check the search box, we’ll check the rodents. Deal?'}
				</p>
			</div>
		);
	}
	return <div />;
}
