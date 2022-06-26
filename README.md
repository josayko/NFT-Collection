# NFT Collection

A Dapp for launching an NFT collection.
Owner of the deployed contract can start presale, then only whithelisted addresses from [Whitelist Dapp](https://github.com/josayko/Whitelist-Dapp)
can mint during a certain period of time (default to 5 minutes).
After presale ends, anyone can public mint an NFT.

> This project is heavily inspired by [LearnWeb3DAO - NFT Collection](https://github.com/LearnWeb3DAO/NFT-Collection)

- This project differs from the original with the use of [`Rainbow Kit`](https://github.com/rainbow-me/rainbow) and [`wagmi`](https://github.com/tmm/wagmi) instead of `web3Modal` with `ethers`. Moreover, some errors handling and improvements has been added: clearInterval in useEffect return, reactivity when switching between accounts or wrong network, etc...

- The app has been deployed with Vercel at
  https://nft-collection-josayko.vercel.app/, and the max supply has been set to 20 NFTs
- You can deploy a new instance of the smart contract and run the frontend app locally if the max supply has been reached

## Get started

#### Prerequisites

- `node` >= 16, `yarn` >= 1.22

#### Clone repository

```bash
$ git clone https://github.com/josayko/NFT-Collection.git
```

#### Install dependencies

```bash
$ cd NFT-Collection/app
$ yarn
```

#### Run locally

```bash
$ yarn build
$ yarn start
```

> App is running on http://localhost:3000

## How to deploy a new instance of the smart contract

- Check this project's [hardhat directory](https://github.com/josayko/NFT-Collection/tree/main/hardhat)

## Author

- Jonny Saykosy <josayko@pm.me>

## License & copyright

© Jonny Saykosy

Licensed under the [MIT License](LICENSE).
