require('@nomicfoundation/hardhat-toolbox');

module.exports = {
	solidity: '0.8.4',
	paths: {
		sources: './src/lib/smart-contract/contracts',
		tests: './src/lib/smart-contract/test',
		cache: './src/lib/smart-contract/cache',
		artifacts: './src/lib/smart-contract/artifacts'
	},
	networks: {
		hardhat: {
			chainId: 1337
		}
	}
};
