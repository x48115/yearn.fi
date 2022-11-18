import React, {ReactElement, useMemo} from 'react';
import Link from 'next/link';
import {format, toAddress} from '@yearn-finance/web-lib/utils';
import {ImageWithFallback} from 'components/common/ImageWithFallback';
import IconChevronPlain from 'components/icons/IconChevronPlain';
import {useWallet} from 'contexts/useWallet';
import {ETH_TOKEN_ADDRESS, WETH_TOKEN_ADDRESS} from 'utils/constants';

import type {TYearnVault} from 'types/yearn';

function	VaultRowHead({
	sortBy,
	sortDirection,
	onSort
}: {
	sortBy: string,
	sortDirection: string,
	onSort: (sortBy: string, sortDirection: string) => void
}): ReactElement {

	function	renderChevron(shouldSortBy: boolean, _sortDirection: string): ReactElement {
		if (shouldSortBy && _sortDirection === 'desc') {
			return <IconChevronPlain className={'h-4 w-4 min-w-[16px] cursor-pointer text-neutral-500'} />;
		}
		if (shouldSortBy && _sortDirection === 'asc') {
			return <IconChevronPlain className={'h-4 w-4 min-w-[16px] rotate-180 cursor-pointer text-neutral-500'} />;
		}
		return <IconChevronPlain className={'h-4 w-4 min-w-[16px] cursor-pointer text-neutral-200/40 transition-colors group-hover:text-neutral-500'} />;
	}

	return (
		<div className={'mb-2 hidden w-full grid-cols-8 px-10 md:grid'}>
			<p className={'col-span-3 text-start text-base text-neutral-400'}>{'Token'}</p>
			<div className={'col-span-5 grid grid-cols-8'}>
				<button
					onClick={(): void => onSort('apy', sortBy === 'apy' ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc')}
					className={'group col-span-1 flex flex-row items-center justify-end space-x-1'}>
					<p className={'text-end text-base text-neutral-400'}>
						{'APY'}
					</p>
					{renderChevron(sortBy === 'apy', sortDirection)}
				</button>

				<button
					onClick={(): void => onSort('available', sortBy === 'available' ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc')}
					className={'group col-span-2 flex flex-row items-center justify-end space-x-1 px-7'}>
					<p className={'text-end text-base text-neutral-400'}>
						{'Available'}
					</p>
					{renderChevron(sortBy === 'available', sortDirection)}
				</button>

				<button
					onClick={(): void => onSort('deposited', sortBy === 'deposited' ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc')}
					className={'group col-span-2 flex flex-row items-center justify-end space-x-1 pl-7 pr-12'}>
					<p className={'text-end text-base text-neutral-400'}>
						{'Deposited'}
					</p>
					{renderChevron(sortBy === 'deposited', sortDirection)}
				</button>

				<button
					onClick={(): void => onSort('tvl', sortBy === 'tvl' ? (sortDirection === 'desc' ? 'asc' : 'desc') : 'desc')}
					className={'group col-span-2 flex flex-row items-center justify-end space-x-1 px-7'}>
					<p className={'text-end text-base text-neutral-400'}>
						{'TVL'}
					</p>
					{renderChevron(sortBy === 'tvl', sortDirection)}
				</button>

				<p className={'col-span-1 text-end text-base text-neutral-400'}>{'Risk'}</p>
			</div>
		</div>
	);
}

function	VaultRow({currentVault}: {currentVault: TYearnVault}): ReactElement {
	const	{balances} = useWallet();

	const	availableToDeposit = useMemo((): number => {
		if (toAddress(currentVault.token.address) === WETH_TOKEN_ADDRESS) {
			const	ethPlusWEth = (
				(balances[toAddress(WETH_TOKEN_ADDRESS)]?.normalized || 0)
				+
				(balances[toAddress(ETH_TOKEN_ADDRESS)]?.normalized || 0)
			);
			return ethPlusWEth;
		}
		return balances[toAddress(currentVault.token.address)]?.normalized || 0;
	}, [balances, currentVault.token.address]);

	const	deposited = useMemo((): number => {
		return balances[toAddress(currentVault.address)]?.normalized || 0;
	}, [balances, currentVault.address]);

	const	vaultName = useMemo((): string => {
		return currentVault.display_name || currentVault.name || currentVault.formated_name || 'unknown';
	}, [currentVault.display_name, currentVault.name, currentVault.formated_name]);

	const	availableToDepositRatio = useMemo((): number => {
		if (currentVault.details.depositLimit === '0') {
			return 100;
		}
		const	normalizedTotalAssets = format.toNormalizedValue(currentVault.tvl.total_assets, currentVault.token.decimals);
		const	normalizedDepositLimit = format.toNormalizedValue(currentVault.details.depositLimit, currentVault.token.decimals);
		return (normalizedTotalAssets / normalizedDepositLimit * 100);
	}, [currentVault.details.depositLimit, currentVault.token.decimals, currentVault.tvl.total_assets]);

	return (
		<Link key={`${currentVault.address}`} href={`/vaults/${toAddress(currentVault.address)}`}>
			<div className={'grid w-full cursor-pointer grid-cols-1 border-t border-neutral-200 py-2 px-10 transition-colors hover:bg-neutral-300 md:grid-cols-8 md:border-none'}>
				<div className={'col-span-3 mb-2 flex flex-row items-center justify-between md:mb-0'}>
					<div className={'flex flex-row items-center space-x-0 md:space-x-6'}>
						<div className={'hidden h-8 w-8 rounded-full bg-neutral-200 md:flex md:h-10 md:w-10'}>
							<ImageWithFallback
								alt={vaultName}
								width={40}
								height={40}
								quality={90}
								src={`${process.env.BASE_YEARN_ASSETS_URI}/1/${toAddress(currentVault.token.address)}/logo-128.png`}
								loading={'eager'} />
						</div>
						<p>{vaultName}</p>
					</div>
				</div>

				<div className={'col-span-5 grid grid-cols-8'}>
					<div className={'col-span-1 flex h-14 flex-row justify-end pt-4'}>
						<b className={'text-end text-base tabular-nums text-neutral-900'}>
							{`${format.amount((currentVault.apy?.net_apy || 0) * 100, 2, 2)}%`}
						</b>
					</div>

					<div className={'col-span-2 flex h-14 flex-row justify-end px-7 pt-4'}>
						<p className={`text-base tabular-nums ${availableToDeposit === 0 ? 'text-neutral-400' : 'text-neutral-900'}`}>
							{`${format.amount(availableToDeposit, 2, 2)}`}
						</p>
					</div>

					<div className={'col-span-2 flex h-14 flex-row justify-end pt-4 pl-7 pr-12'}>
						<p className={`text-base tabular-nums ${deposited === 0 ? 'text-neutral-400' : 'text-neutral-900'}`}>
							{`${format.amount(deposited, 2, 2)}`}
						</p>
					</div>

					<div className={'col-span-2 hidden h-14 flex-col items-end px-7 pt-4 md:flex'}>
						<p className={'text-base tabular-nums text-neutral-900'}>
							{`$ ${format.amount(currentVault.tvl?.tvl || 0, 0, 0)}`}
						</p>
						<div className={'relative mt-1 h-1 w-full bg-neutral-400'}>
							<div
								className={'absolute left-0 top-0 h-1 w-full bg-neutral-900'}
								style={{width: `${availableToDepositRatio}%`}} />
						</div>
					</div>

					<div className={'col-span-1 flex h-14 flex-row items-center justify-end'}>
						<div className={'flex flex-row space-x-4'}>
							{'Low'}
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}

export {VaultRow, VaultRowHead};
