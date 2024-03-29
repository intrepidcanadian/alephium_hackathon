import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import styles from '@/styles/Home.module.css'

// import the AlephiumConnectButton and useWallet from the web3-react package
import { useWallet, AlephiumWalletProvider } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'


// components used for the dapp
import { TokenDapp } from '@/components/TokenDapp'

export default function Home() {

  const [accountdata, setAccountData] = useState(null);
  const [connectionStatusdata, setConnectionStatus] = useState(null);
  const wallet = useWallet()


  useEffect(() => {
    const fetchWalletData = async () => {
      const { connectionStatus, account } = wallet;
      setAccountData(account);
      setConnectionStatus(connectionStatus);
      
    };
  
    fetchWalletData();

  }, [wallet]);

  // the account of useWallet returns: the address of the wallet, publicKey, keyType, group, network
  console.log(accountdata);
  // this returns connected when connected with wallet
  console.log(connectionStatusdata)

  return (
    <>
        {!!accountdata && 
          <div style={{ borderTop: '2px solid #000', borderBottom: '2px solid #000', marginTop: '1rem', width: "100%" }}>
            <h1>Alephium Defi App</h1>
          </div> }
      
      <div className={styles.container}>
        {connectionStatusdata === 'connected' && (
          <>
            <h3>Wallet Information</h3>
            <ul>
              <li>Address of Wallet: {accountdata.address} </li>  
              <li>Public Key of Wallet: {accountdata.publicKey} </li> 
              <li>Current Status is: {connectionStatusdata} </li> 
              <li>Network is: {accountdata.network} </li>
            </ul>
          <TokenDapp config={tokenFaucetConfig} />
          </>
        )}
      </div>
    </>
  )
}

