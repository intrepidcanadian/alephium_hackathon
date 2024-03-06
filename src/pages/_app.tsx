import { React, useState} from 'react';
import { AppProps } from 'next/app';
import '@/styles/globals.css';
import { AlephiumWalletProvider } from '@alephium/web3-react';
import { tokenFaucetConfig } from '@/services/utils'

import { AlephiumConnectButton } from '@alephium/web3-react'

// This is the custom App component to initialize pages
export default function MyApp({ Component, pageProps }: AppProps) {

  const [theme, setTheme] = useState('retro');

  return (
    <div>
    <div style = {{padding: "1rem", width: "100%",  alignContent: "center", alignItems: "center", justifyContent: "center", display: "flex", flexDirection: "column"}}>
      <select style = {{margin: "1rem"}} value={theme} onChange={(e) => setTheme(e.target.value)}>
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
        <AlephiumConnectButton />
        <Component {...pageProps} />
      </AlephiumWalletProvider>
    </div>
    </div>
  )
}
