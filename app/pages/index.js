import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import {
  useNetwork,
  useConnect,
  useContract,
  useSigner,
  useProvider,
  useAccount
} from 'wagmi';
import { useEffect, useState } from 'react';
import { NFT_CONTRACT_ADDRESS, abi } from '../constants';
import { utils } from 'ethers';

export default function Home() {
  // keep track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState('0');
  const [loading, setLoading] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  // keep track of connected chain
  const { activeChain } = useNetwork();
  // keep track whether wallet is connected or not
  const { isConnected } = useConnect();
  // connected account
  const { data: account } = useAccount();
  const { data: signer } = useSigner();
  const provider = useProvider();

  // Contract instance for signing transactions
  const signerContract = useContract({
    addressOrName: NFT_CONTRACT_ADDRESS,
    contractInterface: abi,
    signerOrProvider: signer
  });

  // Contract instance for read-only
  const providerContract = useContract({
    addressOrName: NFT_CONTRACT_ADDRESS,
    contractInterface: abi,
    signerOrProvider: provider
  });

  /**
   * checkIfPresaleStarted: checks if the presale has started by quering the `presaleStarted`
   * variable in the contract
   */
  const checkIfPresaleStarted = async () => {
    try {
      // Call `presaleStarted` from the contract
      const _presaleStarted = await providerContract.presaleStarted();
      setPresaleStarted(_presaleStarted);
      return _presaleStarted;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * checkIfPresaleEnded: checks if the presale has ended by quering the `presaleEnded`
   * variable in the contract
   */
  const checkIfPresaleEnded = async () => {
    try {
      // Call `presaleStarted` from the contract
      const _presaleEnded = await providerContract.presaleEnded();
      // _presaleEnded is a Big Number, so we are using the lt(less than function) instead of `<`
      // Date.now()/1000 returns the current time in seconds
      // We compare if the _presaleEnded timestamp is less than the current time
      // which means presale has ended
      const hasEnded =
        _presaleEnded.lt(Math.floor(Date.now() / 1000)) &&
        !_presaleEnded.isZero();
      if (hasEnded) {
        setPresaleEnded(true);
      } else {
        setPresaleEnded(false);
      }
      return hasEnded;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  /**
   * getTokenIdsMinted: gets the number of tokenIds that have been minted
   */
  const getTokenIdsMinted = async () => {
    try {
      const _tokenIds = await providerContract.tokenIds();
      // _tokenIds is a `Big Number`
      setTokenIdsMinted(_tokenIds.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const startPresale = async () => {
    try {
      const tx = await signerContract.startPresale();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await checkIfPresaleStarted();
    } catch (error) {
      console.error(error);
    }
  };

  const presaleMint = async () => {
    try {
      const tx = await signerContract.presaleMint({
        // value signifies the cost of one crypto dev which is "0.001" eth.
        // We are parsing `0.001` string to ether using the utils library from ethers.js
        value: utils.parseEther('0.001')
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert('You successfully minted a Crypto Dev!');
    } catch (error) {
      console.error(error);
    }
  };

  const publicMint = async () => {
    try {
      const tx = await signerContract.mint({
        // value signifies the cost of one crypto dev which is "0.001" eth.
        // We are parsing `0.001` string to ether using the utils library from ethers.js
        value: utils.parseEther('0.001')
      });
      setLoading(true);
      await tx.wait();
      setLoading(false);
      window.alert('You successfully minted a Crypto Dev!');
    } catch (error) {
      console.error(error);
    }
  };

  const renderInfo = () => {
    if (isConnected) {
      if (activeChain && activeChain.network === 'goerli') {
        return (
          <div className={styles.description}>
            {tokenIdsMinted}/20 have been minted
          </div>
        );
      } else {
        return (
          <div
            className={
              styles.error
            }>{`Wrong Network ! Please switch to Goerli testnet`}</div>
        );
      }
    }
  };

  const renderButton = () => {
    if (isConnected && activeChain && activeChain.network === 'goerli') {
      if (loading) {
        return <button className={styles.button}>Loading...</button>;
      }

      if (isOwner && !presaleStarted) {
        return (
          <button className={styles.button} onClick={startPresale}>
            Start Presale!
          </button>
        );
      }

      if (!presaleStarted && !presaleEnded) {
        return (
          <div>
            <p className={styles.description}>Presale hasn't started!</p>
          </div>
        );
      }

      if (presaleStarted && !presaleEnded) {
        return (
          <div>
            <div className={styles.description}>
              Presale has started!!! If your address is whitelisted, Mint a
              Crypto Dev 🥳
            </div>
            <button className={styles.button} onClick={presaleMint}>
              Presale Mint 🚀
            </button>
          </div>
        );
      }

      if (presaleStarted && presaleEnded) {
        return (
          <button className={styles.button} onClick={publicMint}>
            Public Mint 🚀
          </button>
        );
      }
    }
  };

  useEffect(() => {
    /**
     * getOwner: calls the contract to retrieve the owner
     */
    const getOwner = async () => {
      try {
        // call the owner function from the contract
        const _owner = await providerContract.owner();
        if (account.address.toLowerCase() === _owner.toLowerCase()) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (error) {
        console.error(error);
      }
    };
    if (isConnected) {
      getOwner();
      const _presaleStarted = checkIfPresaleStarted();
      if (_presaleStarted) {
        checkIfPresaleEnded();
      }
      getTokenIdsMinted();

      // set an interval which gets called every 5 seconds to check presale has ended
      const presaleEndedInterval = setInterval(async () => {
        const _presaleStarted = await checkIfPresaleStarted();
        if (_presaleStarted) {
          const _presaleEnded = await checkIfPresaleEnded();
          if (_presaleEnded) {
            clearInterval(presaleEndedInterval);
          }
        }
      }, 5 * 1000);

      // set an interval to get the number of token Ids minted every 5 seconds
      const TokenIdsMintedInterval = setInterval(async () => {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }

    // clear all calls to setInterval
    return () => {
      clearInterval(presaleEndedInterval);
      clearInterval(TokenIdsMintedInterval);
    };
  }, [activeChain, isConnected, account]);

  return (
    <div>
      <Head>
        <title>Crypto Devs NFT</title>
        <meta name="description" content="NFT-Collection" />
        <link rel="icon" href="./favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to Crypto Devs NFT!</h1>
          <div className={styles.description}>
            It&apos;s an NFT collection for developers in Crypto
          </div>
          {renderInfo()}
          <ConnectButton />
          {renderButton()}
        </div>
        <div>
          <img
            src="./cryptodevs/0.svg"
            alt="crypto-devs-nft-logo"
            className={styles.image}
          />
        </div>
      </div>
      <footer className={styles.footer}>Made with &#10084; by josayko</footer>
    </div>
  );
}
