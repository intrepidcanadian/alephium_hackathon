import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider, ONE_ALPH, ALPH_TOKEN_ID } from '@alephium/web3'
import { Deposit } from '../../artifacts/ts/scripts'

export const depositToken = async (signerProvider: SignerProvider, amount: string, tokenId: string): Promise<ExecuteScriptResult> => {
    console.log(BigInt(amount));
    console.log(DUST_AMOUNT);
    console.log(ONE_ALPH);
    console.log(ONE_ALPH * BigInt(amount));
    console.log(BigInt(ONE_ALPH))
    console.log(tokenId);

    return await Deposit.execute(signerProvider, {
    initialFields: {
      token: tokenId,
      amount: BigInt(amount)
    },
    attoAlphAmount: (ONE_ALPH * BigInt(amount) ) + DUST_AMOUNT,
    // tokens: [{ id: tokenId, amount: BigInt(amount)}]
  })  
}
