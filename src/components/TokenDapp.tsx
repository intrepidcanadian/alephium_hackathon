import React, { useCallback } from 'react'
import { FC, useState, useEffect } from 'react'
import styles from '../styles/Home.module.css'
import { withdrawToken } from '@/services/token.service'
import { depositToken } from '@/services/token.deposit'
import { TxStatus } from './TxStatus'
import { useWallet, useBalance} from '@alephium/web3-react'
import { node, DUST_AMOUNT, prettifyAttoAlphAmount, ONE_ALPH } from "@alephium/web3"
import { TokenFaucetConfig } from '@/services/utils'
import { LendingDapp} from '@/components/LendingDapp'

export const TokenDapp: FC<{
  config: TokenFaucetConfig
}> = ({ config }) => {
  const { signer, account } = useWallet()
  const addressGroup = config.groupIndex
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [ongoingTxId, setOngoingTxId] = useState<string>()
  const { balance } = useBalance()

  console.log('balance', balance)

  if (signer) {
    // const groupBalance = balance.get(config.tokenFaucetAddress)
    // const groupBalance2 = balance.get(config.faucetTokenId)
    // What is the difference between faucet address and token id?
    console.log("groupBalance", config.tokenFaucetAddress)
    console.log("groupBalance2", config.faucetTokenId)
    console.log(addressGroup)
  }

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
            <p>PublicKey: {account?.publicKey ?? '???'}</p>
            <p>Maximum 2 tokens can be withdrawn at a time.</p>
            <table>
              <thead>
                <tr>
                  <td>id</td>
                  <th>group</th>
                </tr>
              </thead>
              <tbody>
                <tr key={addressGroup} style={{ background: 'red', color: 'white' }}>
                  <td>{config.faucetTokenId}</td>
                  <td>{addressGroup}</td>
                </tr>
              </tbody>
            </table>
            <label htmlFor="withdraw-amount">Amount</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              max="2"
              min="1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
            />
            <br />  
            <input type="submit" value="Send Me Token" />
          </>
        </form>
      </div>

      <div className="columns">
        <form onSubmit={handleDepositSubmit}>
          <>
            <h2 className={styles.title}>Deposit into Alephium Token Faucet on {config.network}</h2>
            <p>PublicKey: {account?.publicKey ?? '???'}</p>
            <p>Maximum 2 tokens can be deposit at a time.</p>
            <table>
              <thead>
                <tr>
                  <td>id</td>
                  <th>group</th>
                </tr>
              </thead>
              <tbody>
                <tr key={addressGroup} style={{ background: 'red', color: 'white' }}>
                  <td>{config.faucetTokenId}</td>
                  <td>{addressGroup}</td>
                </tr>
              </tbody>
            </table>
            <label htmlFor="deposit-amount">Amount</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              max="2"
              min="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
            />
            <br />  
            <input type="submit" value="Deposit Token" />
          </>
        </form>
      </div>
      {/* <LendingDapp config={config} /> */}
    </>
  )
}
