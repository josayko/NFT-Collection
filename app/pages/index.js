import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
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
          <div className={styles.description}>/20 have been minted</div>
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
  )
}
