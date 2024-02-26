import { Deployer, DeployFunction, Network } from '@alephium/cli'

import { Settings } from '../alephium.config'
import { TokenFaucet } from '../artifacts/ts'

import { randomContractId } from '@alephium/web3-test'
import { randomContractAddress } from '@alephium/web3-test'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployFaucet: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  // Get settings
  const issueTokenAmount = network.settings.issueTokenAmount
  const issuedtokens = network.settings.issuedtokens
  const utilization = network.settings.utilization


  // link the two other subcontracts out to deployment
  const tokenSharesTemplateResult = deployer.getDeployContractResult('TokenShares')
  const tokenSharesBalanceTemplateResult = deployer.getDeployContractResult('TokenSharesBalance')

  const result = await deployer.deployContract(TokenFaucet, {

    // The amount of token to be issued
    issueTokenAmount: issueTokenAmount, 
    // The initial states of the faucet contract
    initialFields: {
      symbol: Buffer.from('TNY', 'utf8').toString('hex'),
      name: Buffer.from('Tony', 'utf8').toString('hex'),
      decimals: 0n,
      contractId: randomContractId(),

      lastblocktimestamp: 0n,
      accumulatedinterest: 0n,

      // 10000 as base to get everything to avoid floating rate arithmetic
      baseborrowrate: 100n,
      targetutilization: 5000n,

      // 100 supply through alephium.config.ts that are minted initially
      totalsupply: issueTokenAmount,
      
      // this is the balance of the tokens that are still remaining in the faucet. this starts off the same as issued tokenamount
      balanceofTokens: issueTokenAmount,

      // this is the tokens that are minted and not in the faucet. Starts off as zero.
      issuedtokens: issuedtokens,

      utilization: utilization,

      // this assigns the contractid of the deployed tokenshares (1) template and token balance (0)
      tokenSharesTemplateId: tokenSharesTemplateResult.contractInstance.contractId,
      tokenSharesBalanceTemplateId: tokenSharesBalanceTemplateResult.contractInstance.contractId,

      owner: deployer.account.address,
      totalProtocolFee: 0n,
      protocolFeePercent: network.settings.protocolFeePercent,
      subjectFeePercent: network.settings.subjectFeePercent
    }
  })
  console.log('Supplying and Depositing faucet contract id: ' + result.contractInstance.contractId)
  console.log('Supplying and Depositing faucet contract address: ' + result.contractInstance.address)
}

export default deployFaucet
