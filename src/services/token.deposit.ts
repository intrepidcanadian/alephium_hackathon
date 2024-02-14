import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3'
import { Deposit } from '../../artifacts/ts/scripts'

export const depositToken = async (signerProvider: SignerProvider, amount: string, tokenId: string): Promise<ExecuteScriptResult> => {
  return await Deposit.execute(signerProvider, {
    initialFields: {
      token: tokenId,
      amount: BigInt(amount)
    },
    attoAlphAmount: DUST_AMOUNT,
  })
}
