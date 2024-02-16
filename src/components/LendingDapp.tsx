import React, { useCallback } from 'react'
import { FC, useState } from 'react'
import { useWallet } from '@alephium/web3-react'
import { node } from "@alephium/web3"
import { TokenFaucetConfig } from '@/services/utils'
import { useAvailableBalances } from '@/hooks/useAvailableBalance'
import { BalanceDisplay } from '@/components/BalanceDisplay'


interface LendingDappProps {
    config: TokenFaucetConfig;
  }
  
export const LendingDapp: FC<LendingDappProps> = ({ config }) => {
    const { signer, account } = useWallet()
    const { balance, updateBalanceForTx } = useAvailableBalances()

    console.log(config)
    console.log('signer',signer)
    console.log('account',account)
    console.log('balance',balance)
    console.log('balance',balance.get("39e70d7c5b2ec8aab652aaffa6d08bbd29c50d3cef0f01035805c812eee35c00"))
    console.log('updateBalanceForTx',updateBalanceForTx)
    
    return (
        <>
          {/* <h1>Address: {account?.address ?? 'Loading...'}</h1>
          <h2>Address Group: {config.groupIndex}</h2> */}
          {/* <BalanceDisplay balanceMap={balance} /> */}
        </>
      );
    };
  