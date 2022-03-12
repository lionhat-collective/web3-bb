import { useCallback } from "react";
import { ActionFunction, json, LoaderFunction, redirect, useLoaderData, useSubmit } from "remix";
import { generateNonce, SiweMessage } from "siwe";
import { ConnectorList } from "~/modules/common";
import { LoginReturnType, useLogin } from "~/hooks/useLogin";
import { commitSession, getSession } from "~/sessions";
import { db } from "~/utils/db.server";
import { Connector } from "wagmi";

export const action: ActionFunction = async ({
    request,
}) => {
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)
    const form = await request.formData();

    const signature = form.get("signature")
    const message = form.get("message")
    const chainType = form.get("chainType")
    const nonce = session.get('nonce')

    if (typeof message !== 'string') {
        throw new Error('Invalid message')
    }

    if (typeof signature !== 'string') {
        throw new Error('Invalid signature')
    }

    if (typeof chainType !== 'string') {
        throw new Error('Invalid chainType')
    }

    const siweMessage = new SiweMessage(message)
    const fields = await siweMessage.validate(signature)

    if (fields.nonce !== nonce) {
        console.error('invalid nonce')
        session.flash('error', 'Invalid nonce')
        return redirect('/login', {
            status: 401,
        })
    }

    session.set('siwe', fields)
    session.unset('nonce')

    const user = await db.user.findUnique({
        where: {
            address: fields.address,
        }
    })

    if (user) {
        return redirect('/', {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        })
    }

    await db.user.create({
        data: {
            address: fields.address,
            chainType,
            username: fields.address,
            avatar: "",
            role: "user",
            updatedAt: new Date(),
        }
    })

    return redirect('/', {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    })
}

type LoaderData = { nonce: string, error?: string }

export const loader: LoaderFunction = async ({
    request
}) => {
    const cookie = request.headers.get('Cookie')
    const session = await getSession(cookie)
    if (session.has('siwe')) {
        return redirect('/', {
            headers: {
                'Set-Cookie': await commitSession(session)
            },
        })
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
    const { nonce, ...data } = useLoaderData<LoaderData>()
    const submit = useSubmit()
    const handleConnect = useCallback(async ({ message, signature }: LoginReturnType) => {
        try {
            const formData = new FormData()

            formData.append("message", message.toMessage())
            formData.append("signature", signature)
            formData.append("chainType", "eth")
            
            submit(formData, {
                action: 'login',
                method: 'post',
                encType: 'application/x-www-form-urlencoded',
                replace: true,
            })
        } catch (error) {
            console.error(error)
        }
    }, [submit])
    const [connectors, login] = useLogin(handleConnect)
    const handleConnectorClick = (connector: Connector) => {
        login(nonce, connector)
    }
    
    return (
        <div className="container">
            <ConnectorList
                connectors={connectors}
                onClick={handleConnectorClick}
            />
        </div>
    )
}

export default LoginRoute