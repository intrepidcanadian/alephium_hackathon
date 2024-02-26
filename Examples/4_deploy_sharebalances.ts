import { Deployer, DeployFunction, Network } from '@alephium/cli'
import { randomContractAddress, randomContractId } from '@alephium/web3-test'
import { Settings } from '../alephium.config'
import { SubjectSharesBalance } from '../artifacts/ts'

const deploySubjectSharesBalanceTemplate: DeployFunction<Settings> = async (
  deployer: Deployer,
  network: Network<Settings>
): Promise<void> => {
  const result = await deployer.deployContract(SubjectSharesBalance, {
    initialFields: {
      subject: randomContractAddress(),
      collateralContractId: randomContractId(),
      balance: 0n,
    }
  })
  console.log('SubjectSharesBalance template contract id: ' + result.contractInstance.contractId)
  console.log('SubjectSharesBalance template contract address: ' + result.contractInstance.address)
}

export default deploySubjectSharesBalanceTemplate