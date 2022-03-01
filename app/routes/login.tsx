import { useCallback } from "react";
import { ActionFunction, json, LoaderFunction, redirect, useLoaderData, useSubmit } from "remix";
import { generateNonce } from "siwe";
import { Connector, useConnect } from "wagmi";
import { ConnectorList } from "~/components/connector-list";
import { useLogin } from "~/hooks/useLogin";
import { commitSession, getSession } from "~/sessions";

// export const action: ActionFunction = async ({
//     request,
// }) => {
//     const form = await request.formData();
// }

type LoaderData = {
    nonce: string
}

export const loader: LoaderFunction = async () => {
    const session = await getSession()
    if (session.has('userId')) {
        return redirect('/')
    }
    
    const nonce = generateNonce()
    const data = {
        nonce,
        error: session.get('error')
    }

    session.set('nonce', nonce)

    return json(data, {
        headers: {
            'Set-Cookie': await commitSession(session)
        },
    })
}

function LoginRoute() {
    const data = useLoaderData<LoaderData>()
    const login = useLogin()
    const handleConnect = useCallback(async () => {
        try {
            const { message, signature } = await login(data.nonce)
            console.log(message, signature)
        } catch (error) {
            console.error(error)
        }
    }, [data, login])
    const handleConnectError = useCallback((error: Error) => {
        console.error(error)
    }, [])
    
    return (
        <div className="container">
            <ConnectorList
                onConnect={handleConnect}
                onError={handleConnectError}
            />
        </div>
    )
}

export default LoginRoute