import React from 'react';
import {Number256, prettifyAttoAlphAmount} from '@alephium/web3';

interface BalanceDisplayProps {
  balanceMap: Map<string, Number256>;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ balanceMap }) => {
  const formatBalance = (amount: Number256) => {
    return prettifyAttoAlphAmount(amount) ?? 'Loading...';
  };

  return (
    <div>
      <h2>Token Balances:</h2>
      <ul>
        {Array.from(balanceMap.entries()).map(([tokenId, balance]) => (
          <li key={tokenId}>
            Token ID: {tokenId}, Balance: {formatBalance(balance)}
          </li>
        ))}
      </ul>
    </div>
  );
};
