import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

// import the AlephiumConnectButton and useWallet from the web3-react package
import { AlephiumConnectButton, useWallet, AlephiumWalletProvider } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'


// components used for the dapp
import { TokenDapp } from '@/components/TokenDapp'
import { LendingDapp} from '@/components/LendingDapp'


export default function Home() {

  const [accountdata, setAccountData] = useState(null);
  const [connectionStatusdata, setConnectionStatus] = useState(null);

  const wallet = useWallet();

  useEffect(() => {

    const fetchWalletData = async () => {
      const {connectionStatus, account } = wallet;
      setAccountData(account);
      setConnectionStatus(connectionStatus);
    }

    fetchWalletData();

  }, [wallet])

  // the account of useWallet returns: the address of the wallet, publicKey, keyType, group, network
  console.log(accountdata);
  // this returns connected when connected with wallet
  console.log(connectionStatusdata)

  return (
    <>
      <div className={styles.container}>
    
          <AlephiumConnectButton />

        {!!accountdata && <div> 
          <h1>Address of Wallet: {accountdata.address} </h1>  
          <h1>Public Key of Wallet: {accountdata.publicKey} </h1> 
          <h2>Current Status is: {connectionStatusdata} </h2> 
          <h3>Network is: {accountdata.network} </h3>
          </div> }

        <Head>
          <title>Token Faucet</title>
        </Head>

        {connectionStatusdata === 'connected' && (
          <TokenDapp config={tokenFaucetConfig} />
        )}
      </div>
    </>
  )
}
