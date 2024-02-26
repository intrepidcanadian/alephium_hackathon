import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider } from '@alephium/web3'
import { Update } from '../../artifacts/ts/scripts'

export const updateInterest = async (signerProvider: SignerProvider, tokenId: string): Promise<ExecuteScriptResult> => {
  return await Update.execute(signerProvider, {
    initialFields: {
      token: tokenId
    },
    attoAlphAmount: DUST_AMOUNT,
  })
}
