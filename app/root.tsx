import {
  Links,
  LinksFunction,
  LiveReload,
  LoaderFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "remix";
import type { MetaFunction } from "remix";
import { Provider as WAGMIProvider } from 'wagmi'
import styles from './styles/app.css';
import { connectors } from "./utils/connectors";
import { useMemo } from "react";
import { Navigation } from './modules/common'
import { getSession } from "./sessions";
import { db } from "./utils/db.server";

export const meta: MetaFunction = () => {
  return { title: "RADLIB" };
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles }
  ]
}

type LoaderData = {
  infuraId: string
  isPublicRoute: boolean
  user: {
    id: string
    username: string
    address: string
    chainType: string
  } | null
}

export const loader: LoaderFunction = async ({
  request,
}) => {
  const url = new URL(request.url)
  const isPublicRoute = !url.pathname.startsWith('/admin')
  const cookie = request.headers.get("Cookie")
  const session = await getSession(cookie)
  let user = null
  if (session && session.has('siwe')) {
    const fields = session.get('siwe')
    user = await db.user.findUnique({
      where: {
        address: fields.address,
      },
      select: {
        username: true,
        address: true,
        chainType: true,
      },
    })
  }
  return {
    user,
    isPublicRoute,
    ENV: {
      infuraId: process.env.INFURA_ID!
    }
  }
}

export default function App() {
  const data = useLoaderData<LoaderData>()
  const walletConnectors = useMemo(() => connectors(data.infuraId), [data])
  return (
    <html lang="en" className="bg-gray-100">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <WAGMIProvider
          connectors={walletConnectors}
        >
          {data.isPublicRoute && <Navigation navItems={[]} user={data.user} />}
          <Outlet />
        </WAGMIProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
