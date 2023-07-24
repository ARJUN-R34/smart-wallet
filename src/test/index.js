const { expect } = require("chai");

const Library = require('../lib');
const Constants = require('./constants');

let smartAccount;

describe('Generate Smart Wallet Address', function() {
    it('Create a signer wallet keypair', async () => {
        const signer = Library.createSignerKeypair();

        expect(signer).to.be.an('object');
        expect(signer).to.have.property('privateKey');
        expect(signer).to.have.property('publicAddress');
        expect(signer).to.have.property('seedPhrase');
    });

    it('Get the address of the smart wallet', async () => {
        const address = await Library.getSmartWalletAddress(Constants.PRIVATE_KEY, Constants.PUBLIC_ADDRESS);
        smartAccount = address.smartAccount;

        expect(address).to.be.an('object');
        expect(address).to.have.property('smartAccount');
        expect(address).to.have.property('smartAccountAddress');
        expect(address.smartAccountAddress).to.equal(Constants.SMART_WALLET_ADDRESS);
    });
});

describe('Execute Smart Contract by paying gas fees in WMATIC', async () => {

    let counterValue = 0;

    it('Should ensure that MATIC balance is 0', async () => {
        const balance = await Library.GetMATICBalance(Constants.PRIVATE_KEY, Constants.SMART_WALLET_ADDRESS);

        expect(parseFloat(balance)).to.equal(0);
    });

    it('Should ensure that WMATIC balance is more than 0', async () => {
        const balance = await Library.getWMATICBalance(Constants.PRIVATE_KEY, Constants.SMART_WALLET_ADDRESS);

        expect(parseFloat(balance)).to.be.greaterThan(0);
    });

    it('Should ensure that the counter value is more than 0', async () => {
        const value = await Library.getCounterValue(Constants.PRIVATE_KEY);
        counterValue = parseInt(value);

        expect(parseInt(value)).to.be.greaterThan(0);
    });

    it('Should increment the counter value', async () => {
        const response = await Library.updateCounter(smartAccount);

        expect(response).to.be.an('string').and.satisfy(msg => msg.startsWith('0x'));
    });

    it('Should ensure that the counter value has increased', () => {
        setTimeout(async () => {
            const value = await Library.getCounterValue(Constants.PRIVATE_KEY);
            expect(parseInt(value)).to.be.greaterThan(counterValue);
        }, 10000);
    });
});

describe('Execute Batch Transaction and pay gas fees in WMATIC', async () => {
    it('Should ensure that MATIC balance is 0', async () => {
        const balance = await Library.GetMATICBalance(Constants.PRIVATE_KEY, Constants.SMART_WALLET_ADDRESS);

        expect(parseFloat(balance)).to.equal(0);
    });

    it('Should ensure that WMATIC balance is more than 0', async () => {
        const balance = await Library.getWMATICBalance(Constants.PRIVATE_KEY, Constants.SMART_WALLET_ADDRESS);

        expect(parseFloat(balance)).to.be.greaterThan(0);
    });

    it('Should perform a batch transaction', async () => {
        const response = await Library.sendBatchERC20Transaction({ 
            smartAccount,
            address1: Constants.BATCH_TX_RECIPIENT_1,
            amount1: Constants.BATCH_TX_AMOUNT_1,
            address2: Constants.BATCH_TX_RECIPIENT_2,
            amount2: Constants.BATCH_TX_AMOUNT_2,
        });

        expect(response).to.be.an('string').and.satisfy(msg => msg.startsWith('0x'));
    });
});