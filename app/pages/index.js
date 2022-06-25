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

export default function Home() {
  const { activeChain } = useNetwork();
  // keep track whether wallet is connected or not
  const { isConnected } = useConnect();
  // keep track of the number of tokenIds that have been minted
  const [tokenIdsMinted, setTokenIdsMinted] = useState('0');
  const [loading, setLoading] = useState(false);
  const [presaleStarted, setPresaleStarted] = useState(false);
  const [presaleEnded, setPresaleEnded] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const { data: signer } = useSigner();
  const provider = useProvider();
  const { data: account } = useAccount();

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
   * getOwner: calls the contract to retrieve the owner
   */
  const getOwner = async () => {
    try {
      // call the owner function from the contract
      const _owner = await providerContract.owner();
      if (account.address.toLowerCase() === _owner.toLowerCase()) {
        setIsOwner(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * checkIfPresaleStarted: checks if the presale has started by quering the `presaleStarted`
   * variable in the contract
   */
  const checkIfPresaleStarted = async () => {
    try {
      // Call `presaleStarted` from the contract
      const _presaleStarted = await providerContract.presaleStarted();
      if (!_presaleStarted) {
        await getOwner();
      }
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
    if (loading) {
      return <button className={styles.button}>Loading...</button>;
    }

    if (isOwner && !presaleStarted) {
      return <button className={styles.button}>Start Presale!</button>;
    }
  };

  useEffect(() => {
    if (isConnected) {
      console.log('isOwner:', isOwner);
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
      setInterval(async () => {
        await getTokenIdsMinted();
      }, 5 * 1000);
    }
  }, [activeChain, isConnected]);

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
