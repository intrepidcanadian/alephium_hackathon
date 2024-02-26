import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { randomContractAddress, randomContractId } from '@alephium/web3-test'
import { Settings } from '../alephium.config'
import { TokenShares } from '../artifacts/ts'

// This deploy function will be called by cli deployment tool automatically
// Note that deployment scripts should prefixed with numbers (starting from 0)
const deployTokenSharesTemplate: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(TokenShares, {
    initialFields: {
      tokenSharesBalanceTemplateId: '',
      tokencollateral: randomContractAddress(),
      collateralContractId: randomContractId(),
      subjectOwnBalance: 0n,
      supply: 0n,
    }
  })
  console.log('TokenShares template contract id: ' + result.contractInstance.contractId)
  console.log('TokenShares template contract address: ' + result.contractInstance.address)
}

export default deployTokenSharesTemplate
