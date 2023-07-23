const Lib = require('./src/lib');

async function test() {
    const signerKeypair = Lib.createSignerKeypair();

    const smartWalletAddress = await Lib.getSmartWalletAddress(signerKeypair.privateKey, signerKeypair.publicAddress);

    const getCounterValue1 = await Lib.getCounterValue(signerKeypair.privateKey);
}

test()
    .then(() => { console.log('Done'); process.exit(1); })
    .catch(error => console.log(error))
