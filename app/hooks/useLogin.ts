import { useCallback } from "react"
import { SiweMessage } from "siwe"
import { Connector, useConnect, UserRejectedRequestError } from "wagmi"

export type LoginReturnType = {
    message: SiweMessage
    signature: string
}
type Login = (nonce: string, connector: Connector) => unknown

type OnConnectFn = (data: LoginReturnType) => Promise<void> | void

type UseLoginReturnType = [connectors: Connector[], login: Login]

export function useLogin(onConnect: OnConnectFn): UseLoginReturnType {
    const [{ data, error }, connect] = useConnect()
    const login = useCallback<Login>(async (nonce, connector: Connector) => {
        try {
            const connectorResponse = await connect(connector)
            if (!connectorResponse.data) {
                throw connectorResponse.error ?? new Error("Something went wrong")
            }
            const { account, chain } = connectorResponse.data
            const address = account
            const chainId = chain?.id
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: `Sign into Web3BB`,
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce,
            })
            const signer = await connector.getSigner()
            const signature = await signer.signMessage(message.prepareMessage())
            return onConnect({
                message,
                signature,
            })
        } catch (err) {
            if (err instanceof Error) {
                throw err.message
            } else if (err instanceof UserRejectedRequestError) {
                throw 'Please sign with your wallet to log in. It does not cost any gas.'
            } else {
                console.error(err)
                throw 'Something went wrong. Please try again.'
            }
        }
    }, [connect, onConnect])
    return [data.connectors, login]
}