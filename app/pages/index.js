import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function Home() {
  return (
    <div>
      <ConnectButton></ConnectButton>
    </div>
  )
}
