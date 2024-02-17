import React, { useCallback } from 'react'
import { FC, useState, useEffect } from 'react'

import styles from '../styles/Home.module.css'

import { withdrawToken } from '@/services/token.service'
import { depositToken } from '@/services/token.deposit'

import { TxStatus } from './TxStatus'
import { useWallet, useBalance } from '@alephium/web3-react'

import { node, DUST_AMOUNT, prettifyAttoAlphAmount, ONE_ALPH, web3} from "@alephium/web3"
import { TokenFaucetConfig } from '@/services/utils'
import { TokenFaucet } from 'artifacts/ts'

// we are passing in data from <TokenDapp config={tokenFaucetConfig} /> in nextjs-template/src/pages/index.tsx
// the tokenFaucetConfig is defined in nextjs-template/src/services/utils.ts
export const TokenDapp: FC<{
  config: TokenFaucetConfig
}> = ({ config }) => {
  const { signer, account } = useWallet()
  const addressGroup = config.groupIndex
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [ongoingTxId, setOngoingTxId] = useState<string>()
  
  const balanceinfo = useBalance()

  const [currentTokenBalance, setTokenBalance] = useState("")
  const [faucetTokenBalance, setFaucetTokenBalance] = useState("")
  const [tokenFaucetTotalSupply, setTokenFaucetTotalSupply] = useState("")

  console.log('signer',signer)
  console.log('account',account)


  const fetchtokenBalance = async () => {

    const nodeProvider = signer?.nodeProvider
    console.log('nodeProvider',nodeProvider)
    web3.setCurrentNodeProvider(nodeProvider)
    const tokenFaucet = TokenFaucet.at(config.tokenFaucetAddress)
    console.log('tokenFaucet',tokenFaucet)
    const tokenFaucetBalance = (await tokenFaucet.methods.balance()).returns;
    const tokenFaucettotalSupply = (await tokenFaucet.methods.getTotalSupply()).returns;
    setFaucetTokenBalance(BigInt(tokenFaucetBalance).toLocaleString())
    setTokenFaucetTotalSupply(BigInt(tokenFaucettotalSupply).toLocaleString())

    console.log('tokenFaucetBalance', faucetTokenBalance, 'tokenFaucettotalSupply', tokenFaucetTotalSupply)
  }

  fetchtokenBalance()

 
  useEffect(() => {
    const { balance = {} } = balanceinfo;
  
    if (balance.tokenBalances && Array.isArray(balance.tokenBalances)) {
      console.log('balances',balance)
      const tokenBalance = balance.tokenBalances.find(token => token.id === config.faucetTokenId)?.amount;
      console.log('Token balance amount', tokenBalance);
      setTokenBalance(tokenBalance);
    } else {
      console.log('Token balance array is not defined or does not have enough elements');
    }

  }, [balanceinfo, config.faucetTokenId]);




  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signer) {
      console.log(withdrawAmount)
      const result = await withdrawToken(signer, withdrawAmount, config.faucetTokenId)
      setOngoingTxId(result.txId)
    }
  }

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signer) {

      const depositAmountInSmallestUnit = BigInt(Math.floor(parseFloat(depositAmount) * 1e18));
      const adjustedAmount = depositAmountInSmallestUnit + BigInt(DUST_AMOUNT);

      console.log("depositAmount", depositAmount)
      console.log("depositAmountInSmallestUnit", depositAmountInSmallestUnit)
      console.log("prettyprettifyAttoAlphAmount(depositAmountInSmallestUnit)", prettifyAttoAlphAmount(depositAmountInSmallestUnit))
      console.log("prettyprettifyAttoAlphAmount(DUST_AMOUNT)", prettifyAttoAlphAmount(DUST_AMOUNT))
      console.log("DUST_AMOUNT", DUST_AMOUNT)
      console.log("BigInt(depositAmount)", BigInt(depositAmount))
      console.log("adjustedAmount", adjustedAmount)
      console.log("adjustedAmount.toString()", adjustedAmount.toString())


      const result = await depositToken(signer, depositAmount, config.faucetTokenId);
      setOngoingTxId(result.txId);
    }
  };

  const txStatusCallback = useCallback(async (status: node.TxStatus, numberOfChecks: number): Promise<any> => {
    if (
      (status.type === 'Confirmed' && numberOfChecks > 2) ||
      (status.type === 'TxNotFound' && numberOfChecks > 3)
    ) {
      setOngoingTxId(undefined)
    }

    return Promise.resolve()
  }, [setOngoingTxId])

  console.log("ongoing..", ongoingTxId)
  return (
    <>
      {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback} />}

      <div className="columns">
        <form onSubmit={handleWithdrawSubmit}>
          <>
            <h2 className={styles.title}>Alephium Token Faucet on {config.network}</h2>
            <p>Own PublicKey: {account?.publicKey ?? '???'}</p>
            <p>Own Address: {account?.address ?? '???'}</p>
            <p>Token Faucet Address: {config.tokenFaucetAddress}</p>
            <p>Token Id: {config.faucetTokenId} </p>
            <table>
              <thead>
                <tr>
                  <td>token id</td>
                  <th>group</th>
                  <th>amount of tokens owned</th>
                  <th>amount of tokens in faucet</th>
                  <th>total supply of tokens in faucet</th>
                </tr>
              </thead>
              <tbody>
                <tr key={addressGroup}>
                  <td>{config.faucetTokenId}</td>
                  <td>{addressGroup}</td>
                  <td>{currentTokenBalance}</td>
                  <td>{faucetTokenBalance}</td>
                  <td>{tokenFaucetTotalSupply}</td>
                </tr>
              </tbody>
            </table>
            <label htmlFor="withdraw-amount">Amount</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              min="1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <br />  
            <input type="submit" value="Send Me Token" />
          </>
        </form>
      </div>
    </>
  )
}
