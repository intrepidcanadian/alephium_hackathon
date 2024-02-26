import React, {useState, useEffect} from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'

export default function App({ Component, pageProps }: AppProps) {

  const [theme, setTheme] = useState('retro')

  useEffect(() => {
  }, [theme])

  return (

      <div className = "wallet__button">
        <h1>Alephium Hackathon - Alph Dabbler - Supplying Alph into Interest Pool or Withdrawing Alph from Interest Pool</h1>
        <p>Choose a Connect Wallet Theme</p>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="simple-light">Simple Light</option>
          <option value="simple-dark">Simple Dark</option>
          <option value="web95">Web95</option>
          <option value="retro">Retro</option>
          <option value="soft">Soft</option>
          <option value="midnight">Midnight</option>
          <option value="minimal">Minimal</option>
          <option value="rounded">Rounded</option>
          <option value="nouns">Nouns</option>
      </select>
      
      <AlephiumWalletProvider theme={theme} network={tokenFaucetConfig.network} addressGroup={tokenFaucetConfig.groupIndex}>
        <Component {...pageProps} />
      </AlephiumWalletProvider>
      </div>
  
  )
}
