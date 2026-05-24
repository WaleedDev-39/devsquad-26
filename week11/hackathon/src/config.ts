import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'

export const kasplexTestnet = defineChain({
  id: 167012,
  name: 'Kasplex zkEVM Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Kaspa',
    symbol: 'KAS',
  },
  rpcUrls: {
    default: { http: ['https://rpc.kasplextest.xyz'] },
    public: { http: ['https://rpc.kasplextest.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.testnet.kasplextest.xyz' },
  },
})

export const config = createConfig({
  chains: [kasplexTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [kasplexTestnet.id]: http(),
  },
})
