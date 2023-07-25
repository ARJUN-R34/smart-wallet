# EIP 4337 Smart Wallet PoC

A wallet loaded with dankness from the depths of the web3 space. Normies choose to call it Smart Wallet a.k.a. ERC 4337 wallet. Powered by Biconomy.


Dank Wallet
===


## Beginners Guide

ERC-4337 is a standard that aims to solve the UX problems with traditional wallets without any modification to the protocol/consensus layer.

Traditional wallets are generated using the ECDSA (Elliptic Curve Digital Signature Algorithm) to generate a public & private key pair and the public address is derived from the public key. These wallets can only sign and broadcast a transaction to the chain and cannot perform smart contract-like functionalities.

Account Abstraction as it is popularly known, is a way of bringing contract-like functionality to EOAs (Externally Owned Accounts) without having to manage an EOA and Smart Contract separately.

If you are new to EIP 4337, [this is a good start!](https://medium.com/@itsarjn/whatthefork-eip4337-e4c4ed0e1d35)


Run the PoC
---

To run the PoC on your local machine,

1. Clone this repo and go the directory using ```git clone https://github.com/ARJUN-R34/smart-wallet && cd smart-wallet``` 
2. Enter the run command using ```npm run start```
3. Visit `http://localhost:3000` to interact with the FE.
---

Run Test
---

To run the test cases,

1. Follow step 1 from the previous section.
2. Run the tests using ```npm run test```
---

>


> **Warning**
> This is just a PoC and the code is not intended to be used on production systems.

> **Note**
> This repo will be updated continuously and would appreciate any feedback or discussions around smart wallets. PRs are also welcome ❤️

###### tags: `Blockchain` `Smart Wallets` `EVM` `EIP-4337` `Ethereum`
