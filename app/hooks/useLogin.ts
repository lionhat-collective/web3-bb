import { useCallback } from "react"
import { SiweMessage } from "siwe"
import { useAccount, useNetwork, UserRejectedRequestError, useSignMessage } from "wagmi"

export function useLogin() {
    const [{ data: accountData }] = useAccount()
    const [{ data: networkData }] = useNetwork()
    const [, signMessage] = useSignMessage()

    return useCallback(async (nonce: string) => {
        try {
            const address = accountData?.address
            const chainId = networkData?.chain?.id
            if (
                typeof address === 'undefined' ||
                typeof chainId === 'undefined'
            ) {
                return {
                    message: null,
                    signature: null,
                }
            }
            const message = new SiweMessage({
                domain: window.location.host,
                address,
                statement: `Sign into CrazyCryptoParty`,
                uri: window.location.origin,
                version: '1',
                chainId,
                nonce,
            })
            const signature = await signMessage({
                message: message.prepareMessage()
            })
            if (signature.error) {
                throw signature.error
            }
            return {
                message,
                signature: signature.data
            }
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
    }, [accountData, networkData, signMessage])
}