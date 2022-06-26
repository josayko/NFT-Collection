# NFT Collection - Hardhat

> An instance of this contract has been deployed on Ethereum Rinkeby testnet: https://rinkeby.etherscan.io/address/0xaeA146dF743d10d42F90d8DdBCB79e0D7f0255a2

## Install dependencies

```bash
$ cd NFT-Collection/hardhat
$ yarn
```

## Deployment

### Step 1. Run local node and set development acounts

> ⚠️ This step is not necesary if you deploy on testnet

```bash
$ yarn hardhat node
```

### Step 2. Set up deployer's account

#### Deployment on local node

Choose one of the hardhat node account and import its private key in a wallet, e.g. [Metamask](https://metamask.io/faqs/).

```bash
$ yarn hardhat accounts
```

#### Deployment on testnet

- Instead of importing a hardhat node account, you just need to set up an account in Metamask with Rinkeby testnet

### Step 3. Create `.env` file in `hardhat/` directory and set variables

> You need to create a new app on [Alchemy](https://www.alchemy.com) to get an ALCHEMY_API_KEY. Alternatively you can create an app on [Infura](https://infura.io). ACCOUNT_PRIVATE_KEY is the private key of the previous step

```bash
# hardhat/.env
ALCHEMY_API_KEY_URL=https://eth-rinkeby.alchemyapi.io/v2/<ALCHEMY_API_KEY>
RINKEBY_PRIVATE_KEY=<ACCOUNT_PRIVATE_KEY>
```

### Step 4. Compile the smart contract and run the deployment script

> You will need the deployed smart contract address

```bash
$ yarn hardhat compile
```

#### Deployment on local node

```bash
$ yarn hardhat run scripts/deploy.js --network localhost
```

#### Deployment on testnet

```bash
$ yarn hardhat run scripts/deploy.js --network rinkeby
```

### Step 5. Set the contract address and abi in `app/constants/index.js`

> abi value can be found in `hardhat/artifacts/contracts/CryptoDevs.sol/CryptoDevs.json`. Contract address is obtained from previous step.

```javascript
export const NFT_CONTRACT_ADDRESS = <YOUR_CONTRACT_ADDRESS>
export const abi = <YOUR_CONTRACT_ABI>
```

### Step 6. Run the [app](https://github.com/josayko/NFT-Collection)
