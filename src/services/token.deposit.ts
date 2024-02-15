import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider, prettifyAttoAlphAmount } from '@alephium/web3'
import { Deposit } from '../../artifacts/ts/scripts'

export const depositToken = async (signerProvider: SignerProvider, amount: string, tokenId: string): Promise<ExecuteScriptResult> => {
    console.log(amount);
    console.log(DUST_AMOUNT);

    return await Deposit.execute(signerProvider, {
    initialFields: {
      token: tokenId,
      amount: BigInt(amount * ONE_ALPH)
    },
    attoAlphAmount: amount + DUST_AMOUNT,
  })
}
