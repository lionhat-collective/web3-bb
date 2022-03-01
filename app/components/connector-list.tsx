import { useCallback, useEffect, useState } from "react";
import { Connector, useConnect } from "wagmi";

type ConnectorListProps = {
    onConnect?: (connector: Connector) => Promise<void> | void
    onError?: (error: Error) => Promise<void> | void
}

export function ConnectorList({ onConnect, onError }: ConnectorListProps) {
    const [hasMounted, setMounted] = useState(false)
    const [{ data, error }, connect] = useConnect()
    const handleClick = useCallback((connector: Connector) => async () => {
        await connect(connector)
        if (onConnect) {
            await onConnect(connector)
        }
    }, [connect, onConnect])
    useEffect(() => {
        if (onError && error) {
            onError(error)
        }
    }, [error, onError])
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return (
        <>
            {data.connectors.map(connector => (
                <button
                    key={connector.id}
                    onClick={handleClick(connector)}
                    disabled={!connector.ready}
                    className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {connector.name}
                    {!connector.ready && ' (unsupported)'}
                </button>
            ))}
        </>
    )
}