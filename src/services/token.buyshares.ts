import { DUST_AMOUNT, ExecuteScriptResult, SignerProvider, subContractId } from '@alephium/web3'
import { BuyShares } from '../../artifacts/ts/scripts'

export const buyShares = async (signerProvider: SignerProvider, amount: string, tokenId: string): Promise<ExecuteScriptResult> => 

{
    
        return await BuyShares.execute(signerProvider, {
        initialFields: {
            subject: tokenId,
            amount: BigInt(amount),
            totalPayment: BigInt(amount),
            borrowing: subContractId,
        },
        attoAlphAmount: DUST_AMOUNT,
    })
}
