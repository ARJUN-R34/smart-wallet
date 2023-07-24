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

    return { smartAccount, smartAccountAddress };
}

// Execute a smart contract function that increments a counter. Also deploys the smart wallet along with it
// Transfer some WMATIC (polygon mumbai) to the smart wallet before executing this function
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

        console.log('Update Counter Tx Response : ', response);
        return response;
    } catch (error) {
        console.log(error);
        return error;
    }
}

// Get the value of the counter from the smart contract
async function getCounterValue(privateKey) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const counterContract = new ethers.Contract(Constants.CounterContractAddress, Constants.CounterABI, walletProvider);
    const count = await counterContract.count();

    return count;
}

// Get the MATIC balance of the smart wallet
async function GetMATICBalance(privateKey, smartWalletAddress) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const balance = await walletProvider.getBalance(smartWalletAddress);

    return ethers.utils.formatEther(balance);
}

// Get the WMATIC balance of the smart wallet
async function getWMATICBalance(privateKey, smartWalletAddress) {
    const provider = new HDWalletProvider(privateKey.slice(2), Constants.RPC);
    const walletProvider = new ethers.providers.Web3Provider(provider);

    const contract = new ethers.Contract(Constants.WMATICAddress, Constants.ERC20ABI, walletProvider);

    const balance = await contract.balanceOf(smartWalletAddress);

    return ethers.utils.formatEther(balance);
}

// Perform a batch transaction
// Need to ensure sufficient USDC balance in the smart wallet before executing this function
async function sendBatchERC20Transaction({ smartAccount, address1, amount1, address2, amount2 }) {
    let txns = [];

    let erc20Interface = new ethers.utils.Interface(Constants.ERC20ABI);

    const transfer1Data = erc20Interface.encodeFunctionData(
        "transfer",
        [address1, amount1]
    );

    const transfer2Data = erc20Interface.encodeFunctionData(
        "transfer",
        [address2, amount2]
    );

    const transfer1Tx = {
        to: Constants.WMATICAddress,
        value: '0x0',
        data: transfer1Data,
    };

    const transfer2Tx = {
        to: Constants.WMATICAddress,
        value: '0x0',
        data: transfer2Data,
    };

    txns.push(transfer1Tx);
    txns.push(transfer2Tx);

    // Get fee quotes
    const feeQuotes = await smartAccount.getFeeQuotesForBatch({ transactions: txns });

    // Create transaction
    const transaction = await smartAccount.createUserPaidTransactionBatch({
        transactions: txns,
        feeQuote: {
            address: Constants.USDCAddress,
            decimal: Constants.USDCDecimal,
            symbol: Constants.USDCSymbol,
            tokenGasPrice: 10,
        },
    });

    const response = await smartAccount.sendUserPaidTransaction({ tx: transaction });

    console.log('Batch Tx Response : ', response);
    return response;
}

module.exports = {
    createSignerKeypair,
    getSmartWalletAddress,
    updateCounter,
    getCounterValue,
    GetMATICBalance,
    getWMATICBalance,
    sendBatchERC20Transaction,
};
