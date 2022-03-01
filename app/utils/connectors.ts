import { chain, defaultChains } from 'wagmi'
import { providers } from 'ethers'
import { InjectedConnector } from 'wagmi/connectors/injected'
// import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
// WalletLink disabled because coinbase sucks lmfao.
// see: https://github.com/tmm/wagmi/pull/64
// import { WalletLinkConnector } from 'wagmi/connectors/walletLink'

export const connectors = (infuraId: string) => ({ chainId }: { chainId?: number }) => {
    // const rpcUrl = defaultChains.find(chain => chain.id === chainId)?.rpcUrls?.[0] ?? chain.mainnet.rpcUrls[0]
    return [
        new InjectedConnector({
            chains: defaultChains,
            options: { shimDisconnect: true },
        }),
        // new WalletConnectConnector({
        //     chains: defaultChains,
        //     options: {
        //         infuraId,
        //         qrcode: true,
        //     }
        // }),
        // new WalletLinkConnector({
        //     chains: defaultChains,
        //     options: {
        //         appName: 'CrazyCryptoParty',
        //         jsonRpcUrl: `${rpcUrl}/${infuraId}`,
        //     }
        // }),
    ]
}

const isChainSupported = (chainId?: number) => {
    return defaultChains.some(chain => chain.id === chainId)
}

type ProviderConfig = { chainId?: number, infuraId?: string }

export const provider = ({ chainId, infuraId }: ProviderConfig) => {
    return providers.getDefaultProvider(
        isChainSupported(chainId) ? chainId : chain.mainnet.id,
        {
            // alchemy: alchemyId,
            // etherscan: etherscanApiKey,
            infura: infuraId,
        },
    )
}

export const webSocketProvider = ({ chainId, infuraId }: ProviderConfig) => {
    if (isChainSupported(chainId)) {
        return new providers.InfuraWebSocketProvider(chainId, infuraId)
    }
    return undefined
}