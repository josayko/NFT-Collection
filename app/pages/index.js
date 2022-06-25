import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useNetwork, useConnect } from 'wagmi';
import { useEffect, useState } from 'react';

export default function Home() {
  // wagmi hooks
  const { activeChain } = useNetwork();

  // keep track whether wallet is connected or not
  const { isConnected } = useConnect();

  const connectWallet = () => {
    if (isConnected) {
      if (activeChain && activeChain.network === 'goerli') {
        console.log('OK connected to Goerli');
      } else {
        console.log('Wrong Network');
      }
    } else {
      console.log('Not Connected');
    }
  };

  const renderInfo = () => {
    if (isConnected) {
      if (activeChain && activeChain.network === 'goerli') {
        return <div className={styles.description}>/20 have been minted</div>;
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

  useEffect(() => {
    connectWallet();
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
