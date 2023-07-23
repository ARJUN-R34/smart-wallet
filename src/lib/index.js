const { ethers } = require('ethers');
const HDWalletProvider = require("@truffle/hdwallet-provider");
const SmartAccount = require("@biconomy/smart-account").default;
const { ChainId } = require("@biconomy/core-types");

const Constants = require('../constants');

// Create a public address and private key pair
function createSignerKeypair() {
    const signer = ethers.Wallet.createRandom();

    const response = {
        publicAddress: signer.address,
        seedPhrase: signer.mnemonic.phrase,
        privateKey: signer.privateKey
    }

    console.log('Signer Keys : ', response);
    return response;
}

// Get Smart Wallet Address from the above generated private key and public address
async function getSmartWalletAddress(privateKey, publicAddress) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const options = {
        activeNetworkId: ChainId.POLYGON_MUMBAI,
        supportedNetworksIds: [ChainId.POLYGON_MUMBAI]
    }

    let smartAccount = new SmartAccount(walletProvider, options);
    smartAccount = await smartAccount.init();

    const smartAccountAddress = await smartAccount.getSmartAccountAddress(publicAddress);

    console.log('Smart Account Address : ', smartAccountAddress);
    return { smartAccount, smartAccountAddress };
}

// Execute a smart contract function that increments a counter. Also deploys the smart wallet along with it
// Transfer some WETH (polygon mumbai) to the smart wallet before executing this function
async function updateCounter(smartAccount) {
    try {
        let iface = new ethers.utils.Interface(Constants.CounterABI);

        const data = iface.encodeFunctionData("incrementCount");

        const tx = await smartAccount.createUserPaidTransaction({
            transaction: {
                to: Constants.CounterContractAddress,
                value: '0x0',
                data,
            },
            chainId: ChainId.POLYGON_MUMBAI,
            feeQuote: {
                address: Constants.WMATICAddress,
                decimal: Constants.WMATICDecimal,
                symbol: Constants.WMATICSymbol,
                tokenGasPrice: 10,
            },
        });

        const response = await smartAccount.sendUserPaidTransaction({
            tx,
            chainId: ChainId.POLYGON_MUMBAI
        });

        console.log('Transaction Response : ', response);
        return response;
    } catch (error) {
        console.log(error);
    }
}

// Get the value of the counter from the smart contract
async function getCounterValue(privateKey) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const counterContract = new ethers.Contract(Constants.CounterContractAddress, Constants.CounterABI, walletProvider);
    const count = await counterContract.count();

    console.log('Counter Value : ', count.toString());
    return count.toString();
}

// Get the MATIC balance of the smart wallet
async function GetMATICBalance(privateKey, smartWalletAddress) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const balance = await walletProvider.getBalance(smartWalletAddress);

    console.log('Smart Wallet Balance : ', ethers.utils.formatEther(balance));
    return ethers.utils.formatEther(balance);
}

// Get the WETH balance of the smart wallet
async function refreshWMATICBalance(privateKey, smartWalletAddress) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const contract = new ethers.Contract(Constants.WMATICAddress, Constants.ERC20ABI, walletProvider);

    const balance = await contract.balanceOf(smartWalletAddress);

    console.log('WMATIC Balance : ', ethers.utils.formatEther(balance));
    return ethers.utils.formatEther(balance);
}

module.exports = {
    createSignerKeypair,
    getSmartWalletAddress,
    updateCounter,
    getCounterValue,
    GetMATICBalance,
    refreshWMATICBalance,
};