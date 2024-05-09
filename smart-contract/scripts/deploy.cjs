/* eslint-disable @typescript-eslint/no-var-requires */
const hre = require('hardhat');
const BigNumber = require('bignumber.js');

async function main() {
	const [deployer] = await hre.ethers.getSigners();
	console.log('\nStart Deploy----------------------------------------');
	console.log('Network:', hre.network.name);
	console.log('Deploying contracts with the account:', deployer.address);
	const startingBalance = await deployer.provider.getBalance(deployer.address);
	console.log(
		'Account starting balance:',
		new BigNumber(hre.ethers.formatEther(startingBalance)).toString() + ' ETH'
	);

	// We get the contract to deploy
	console.log('\n----------------------------------------------------');
	console.log('CertificateManager');
	const CertificateManager = await hre.ethers.getContractFactory('CertificateManager');
	const certificateManager = await CertificateManager.deploy();
	await certificateManager.waitForDeployment();
	console.log('Deployed to:', certificateManager.target);
	console.log('----------------------------------------------------');

	const endingBalance = await deployer.provider.getBalance(deployer.address);
	console.log(
		'\nAccount ending balance:',
		new BigNumber(hre.ethers.formatEther(endingBalance)).toString() + ' ETH'
	);
	console.log('End Deploy------------------------------------------');
}

main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
