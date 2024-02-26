import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { randomContractAddress, randomContractId } from '@alephium/web3-test'
import { Settings } from '../alephium.config'
import { TokenSharesBalance } from '../artifacts/ts'

const deployTokenSharesBalanceTemplate: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(TokenSharesBalance, {
    initialFields: {
    // tokens that can be used as collateral or borrowed on
      tokencollateral: randomContractAddress(),
    //   bytevec
      tokensSharesContractId: randomContractId(),
      balance: 0n,
    }
  })
  console.log('TokenSharesBalance template contract id: ' + result.contractInstance.contractId)
  console.log('TokenSharesBalance template contract address: ' + result.contractInstance.address)
}

export default deployTokenSharesBalanceTemplate
