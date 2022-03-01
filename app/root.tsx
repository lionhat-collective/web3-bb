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

export const meta: MetaFunction = () => {
  return { title: "RADLIB" };
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles }
  ]
}

type LoaderData = { infuraId: string }

export const loader: LoaderFunction = () => {
  console.log(process.env.INFURA_ID!)
  return {
    ENV: {
      infuraId: process.env.INFURA_ID!
    }
  }
}

export default function App() {
  const data = useLoaderData<LoaderData>()
  const walletConnectors = useMemo(() => connectors(data.infuraId), [data])
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className='bg-gradient-to-r from-purple-500 to-pink-500'>
        <WAGMIProvider
          connectors={walletConnectors}
        >
          <Outlet />
        </WAGMIProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
