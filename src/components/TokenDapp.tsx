import React, { useCallback } from 'react'
import { FC, useState, useEffect } from 'react'

import { formatPercent } from '@/hooks/format'
import { formatAccumulatedInterest } from '@/hooks/formataccumulatedinterest'

import styles from '../styles/Home.module.css'

// Transcription services
import { withdrawToken } from '@/services/token.withdraw'
import { depositToken } from '@/services/token.deposit'
import { updateInterest } from '@/services/token.update'

import { TxStatus } from './TxStatus'
import { useWallet, useBalance } from '@alephium/web3-react'

import { node, web3, contractIdFromAddress, addressFromContractId, binToHex, subContractId, prettifyAttoAlphAmount, fetchContractState} from "@alephium/web3"
import { TokenFaucetConfig } from '@/services/utils'
import { SetTargetUtilization, TokenFaucet } from 'artifacts/ts'

// we are passing in data from <TokenDapp config={tokenFaucetConfig} /> in nextjs-template/src/pages/index.tsx
// the tokenFaucetConfig is defined in nextjs-template/src/services/utils.ts
export const TokenDapp: FC<{
  config: TokenFaucetConfig
}> = ({ config }) => {
  const { signer, account } = useWallet()

  // wallet metrics
  const balanceinfo = useBalance()
  const [alphBalance, setAlphBalance] = useState<string>()
  const [currentTokenBalance, setTokenBalance] = useState<string>()

  const addressGroup = config.groupIndex
  const [withdrawAmount, setWithdrawAmount] = useState('')

  // transaction states
  const [depositAmount, setDepositAmount] = useState('')
  const [buySharesAmount, setBuyShares] = useState('')
  // const [sellSharesAmount, setSellShares] = useState('')

  const [ongoingTxId, setOngoingTxId] = useState<string>()

  // ledger states
  const [faucetTokenBalance, setFaucetTokenBalance] = useState('')
  const [tokenFaucetTotalSupply, setTokenFaucetTotalSupply] = useState('')
  const [totalTokenIssued, setTokenIssued] = useState('')
  const [totalutilization, setUtilization] = useState('')
  const [targetutilization, setTargetUtilization] = useState('')
  const [borrowinterest, setBorrowInterest] = useState('')
  const [baseborrowrate, setBaseBorrowRate] = useState('')
  const [refreshBalance, setRefreshBalance] = useState(false);
  const [accumulatedinterest, setAccumulatedInterest] = useState<string>()


  console.log('signer',signer)
  console.log('account',account)

  useEffect(() => {

    const { balance = {} } = balanceinfo;
    fetchtokenBalance()

    const currentAlph = balanceinfo.balance?.balanceHint
    console.log('currentAlph',currentAlph)
    setAlphBalance(currentAlph);

    if (balanceinfo.balance?.tokenBalances && Array.isArray(balanceinfo.balance?.tokenBalances)) {
      console.log('balances',balance)
      const tokenBalance = balanceinfo.balance?.tokenBalances.find(token => token.id === config.faucetTokenId)?.amount;
      console.log('Token balance amount', tokenBalance);
      setTokenBalance(tokenBalance);
    } else {
      console.log('Token balance array is not defined or does not have enough elements');
    }

  }, [balanceinfo, config.faucetTokenId, refreshBalance]);

    const fetchblocktimestamp = async () => {

      try {
        const nodeProvider = signer?.nodeProvider
        web3.setCurrentNodeProvider(nodeProvider)
        const tokenFaucet = TokenFaucet.at(config.tokenFaucetAddress)
        const blocktimestamp = (await tokenFaucet.methods.getBlockTimeStamp()).returns;
        const dateObject = new Date(Number(BigInt(blocktimestamp)));
        const delta = (await tokenFaucet.methods.getAccruedInterest()).returns;
        const lastblocktimestamp = (await tokenFaucet.methods.getLastBlockTimeStamp()).returns;

        console.log('Block timestamp:', dateObject);
        console.log('Block timestamp:', blocktimestamp);
        console.log('Accrued Interest:', BigInt(delta));
        console.log('Last Block Timestamp:', lastblocktimestamp);
      } catch (error) {
        console.error('Error fetching block timestamp:', error);
      }
    };

    fetchblocktimestamp();

    // const contractstate = fetchContractState(config.tokenFaucetAddress, config.tokenFaucetContractId)
    const fetchContractState = async () => {
      const nodeProvider = signer?.nodeProvider
      web3.setCurrentNodeProvider(nodeProvider)
      const tokenFaucet = TokenFaucet.at(config.tokenFaucetAddress)
      const contractState = await tokenFaucet.fetchState()

      console.log('contractstate',contractState)
    }

    fetchContractState();


  const fetchtokenBalance = async () => {

    // set up a node to look at the faucetAddress
    const nodeProvider = signer?.nodeProvider
    web3.setCurrentNodeProvider(nodeProvider)
    const tokenFaucet = TokenFaucet.at(config.tokenFaucetAddress)
    console.log('nodeProvider',nodeProvider)
    console.log('tokenFaucet',tokenFaucet)


    const tokenFaucetBalance = (await tokenFaucet.methods.getBalanceofTokens()).returns;
    const tokenFaucettotalSupply = (await tokenFaucet.methods.getTotalSupply()).returns;
    const tokenIssued = (await tokenFaucet.methods.getIssuedTokens()).returns;
    const utilization = (await tokenFaucet.methods.getUtilization()).returns;
    const currentborrowinterest = (await tokenFaucet.methods.getInterest()).returns;
    const accumulatedinterest = (await tokenFaucet.methods.getAccruedInterest()).returns;

    
    // bd7646562b7f46eb737d7fdeffd098fcf8f43f9b3a5860cf45ddb89af71e7b00
    const contractid = (await tokenFaucet.methods.getSelfContractId()).returns;
    // ff5556878a8552f40dd37208966abe2ba2518881ec945e7d7148f6d7b4f39ea3
    const contractidverification = (await tokenFaucet.methods.getDeployedContractID()).returns;
    // bd7646562b7f46eb737d7fdeffd098fcf8f43f9b3a5860cf45ddb89af71e7b00
    const selftokenid = (await tokenFaucet.methods.getSelfTokenId()).returns;
    // 27SXmdm4fqxaSd5L8NgaRBPr3UvCoqF31CoKPUiQejPNf
    const selfaddress = (await tokenFaucet.methods.getSelfAddress()).returns;
    const currenttargetutilization = (await tokenFaucet.methods.getTargetUtilization()).returns;
    const baseborrowrate = (await tokenFaucet.methods.getBaseBorrowRate()).returns;

    console.log('getSelfContractID', contractid)
    const contractaddressconversion = addressFromContractId(contractid)
    console.log('contract address', contractaddressconversion)
    console.log('addressFromContractId', binToHex(contractIdFromAddress(contractaddressconversion)))

    const subcontractid = subContractId(contractid, '00')
    console.log('this is subcontract Token Shares', subcontractid)
    const subcontractaddressconversion = addressFromContractId(subcontractid)
    console.log('subcontract address Token Shares', subcontractaddressconversion)
    console.log('subcontractaddressFromContractId Token Shares', binToHex(contractIdFromAddress(subcontractaddressconversion)))

    const TokenBalancesubcontractid = subContractId(subcontractid, '00')
    console.log('this is subcontract Token Balance', TokenBalancesubcontractid)
    const TokenBalancesubcontractidaddress = addressFromContractId(TokenBalancesubcontractid)
    console.log('subcontract address Token Balance', TokenBalancesubcontractidaddress)
    console.log('subcontract Token Balance', binToHex(contractIdFromAddress(TokenBalancesubcontractidaddress)))



    console.log('getDeployedcontractId', contractidverification)
    console.log('getSelftokenid', selftokenid)
    console.log('getSelfaddress', selfaddress)
    setFaucetTokenBalance(tokenFaucetBalance.toString());
    setTokenFaucetTotalSupply(tokenFaucettotalSupply.toString());
    setTokenIssued(tokenIssued.toString());
    setUtilization(utilization.toString());
    setTargetUtilization(currenttargetutilization.toString());
    setBorrowInterest(currentborrowinterest.toString());
    setBaseBorrowRate(baseborrowrate.toString());
    setAccumulatedInterest(accumulatedinterest.toString());


    console.log('tokenFaucetBalance', faucetTokenBalance,
    'tokenFaucettotalSupply', tokenFaucetTotalSupply, 
    'tokenIssued', totalTokenIssued,
    'currentborrowinterest', currentborrowinterest, 'utilization', utilization, 'targetutilization', targetutilization,
    'baseborrowrate', baseborrowrate)
  }

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signer) {
      console.log(withdrawAmount)
      const result = await withdrawToken(signer, withdrawAmount, config.faucetTokenId);
      setOngoingTxId(result.txId);
      fetchContractState();
    }
  }
  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (signer) {
      console.log(depositAmount)
      const result = await depositToken(signer, depositAmount, config.faucetTokenId);
      setOngoingTxId(result.txId)
      fetchContractState();
    }
  }

  const handleUpdateInterest = async (e) => {
    const result = await updateInterest(signer, config.faucetTokenId);
    console.log('result',result)
    fetchContractState();
  }

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
    <div className = "header__container">
      <h3>Wallet Statistics</h3>
      <div className = "header__container--walletstats">
        <p><b><u>Current Alph in Wallet:</u></b> {alphBalance}</p> 
        <p><b><u>Current Supply Token Balance:</u></b> {currentTokenBalance}</p>
      </div>
    </div>
    {ongoingTxId && <TxStatus txId={ongoingTxId} txStatusCallback={txStatusCallback} />}

    <h2 className={styles.title}>Supplying/Withdrawing Liquidity To Earn Hypothetical Interest {config.network}</h2>
            <ul>
              <li>Token Representing Alph Deposited Address: {config.tokenFaucetAddress}</li>
              <li>Token Id: {config.faucetTokenId} </li>
            </ul>
      <div className="columns">
        <form onSubmit={handleDepositSubmit}>
          <>
            <p>Mint aTokens and Supply Alph</p>
            <label htmlFor="deposit-amount">Amount</label>
            <input
              type="number"
              id="deposit-amount"
              name="amount"
              min="1"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)} />
            <br />
            <input type="submit" value="Supply Alph and Recieve aTokens" />
          </>
        </form>
        <form onSubmit={handleWithdrawSubmit}>
          <>
            <p>Return aTokens and Recieve Alph</p>
            <label htmlFor="withdraw-amount">Amount</label>
            <input
              type="number"
              id="transfer-amount"
              name="amount"
              min="1"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)} />
            <br />
            <input type="submit" value="Withdraw and Return aTokens" />
          </>
        </form>
        <button className = "button--updateinterest" onClick={handleUpdateInterest}>Update Interest Accrual</button>
      </div>
            <ul>
              <li><b>Borrowing Demand Assumed to be 20 ALPH for Utilization Calculations</b></li>
              <li>The Current Utilization is: {formatPercent(totalutilization)}</li>
              <li>The Target Utilization is: {formatPercent(targetutilization)}</li>
              <li>The Base Borrowing Interest Rate is: {formatPercent(baseborrowrate)}</li>
              <li><b>The Current Borrowing Interest Rate is: </b> <u>{formatPercent(borrowinterest)}</u></li>
              <li><b>The Accumulated Total Interest in ALPH: </b> <u>{formatAccumulatedInterest(accumulatedinterest)}</u></li>
              <li>In next iteration, the supply interest rate would be less than borrow interest rate and {formatPercent(borrowinterest)} would be multiplied by utilization ratio and {"(1 - Reserve Ratio)"}</li>
            </ul>
    </>
    )
  }

