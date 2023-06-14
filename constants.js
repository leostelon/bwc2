export const PrimaryGrey = "#828488"

export const ChainsConfig = {
	CELO_TESTNET: {
		chainId: 44787,
		chainName: "Celo (Alfajores Testnet)",
		nativeCurrency: { name: "CELO", symbol: "CELO", decimals: 18 },
		rpcUrls: ["https://alfajores-forno.celo-testnet.org"],
		blockExplorerUrls: ["https://alfajores-blockscout.celo-testnet.org"],
	},
	POLYGON_TESTNET: {
		chainId: 80001,
		rpcUrls: ["https://matic-mumbai.chainstacklabs.com"],
		chainName: "Polygon Testnet",
		nativeCurrency: {
			name: "tMATIC",
			symbol: "tMATIC",
			decimals: 18,
		},
		blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
	},
};

export const CONTRACT_ADDRESS = "0xDacC8A1b4571693DFfe2A898fc7De10e2d355e1F";