import { useEffect, useState } from "react";
import { Connector } from "wagmi";

type ConnectorListProps = {
    connectors: Connector[]
    onClick: (connector: Connector) => void | Promise<void>
}

export function ConnectorList({ connectors, onClick }: ConnectorListProps) {
    const [hasMounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!hasMounted) {
        return null
    }

    return (
        <>
            {connectors.map(connector => (
                <button
                    key={connector.id}
                    onClick={() => onClick(connector)}
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