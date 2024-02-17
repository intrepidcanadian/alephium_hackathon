import React from 'react'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { AlephiumWalletProvider } from '@alephium/web3-react'
import { tokenFaucetConfig } from '@/services/utils'

export default function App({ Component, pageProps }: AppProps) {

  return (
    
      <AlephiumWalletProvider theme="retro" network={tokenFaucetConfig.network} addressGroup={tokenFaucetConfig.groupIndex}>
        <Component {...pageProps} />
      </AlephiumWalletProvider>
  
  )
}

// The type of theme 
// export type ProviderTheme = 'simple-light' | 'simple-dark' | 'web95' | 'retro' | 'soft' | 'midnight' | 'minimal' | 'rounded' | 'nouns';