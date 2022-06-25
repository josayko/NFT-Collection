import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';

import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { chain, createClient, WagmiConfig } from 'wagmi';
import { configureChains } from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [chain.goerli, chain.rinkeby],
  [
    alchemyProvider({ priority: 0, alchemyId: process.env.ALCHEMY_ID }),
    publicProvider({ priority: 1 })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'Crypto Devs NFT',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
});

function MyApp({ Component, pageProps }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
