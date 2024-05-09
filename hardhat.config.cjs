require('@nomicfoundation/hardhat-toolbox');

module.exports = {
	solidity: '0.8.4',
	paths: {
		sources: './smart-contract/contracts',
		tests: './smart-contract/test',
		cache: './smart-contract/cache',
		artifacts: './smart-contract/artifacts'
	},
	networks: {
		hardhat: {
			chainId: 1337
		}
	}
};
