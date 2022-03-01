import { LoaderFunction, useLoaderData } from 'remix'

type LoaderData = { games: unknown[] }

export let loader: LoaderFunction = async () => {
  return []
}

export default function Index() {
  const data = useLoaderData<LoaderData>()
  return (
    <ul>
      {/* {data.games.map(game => {
        return (
          <li key={game.id}>
            <a href={`/radlib/${game.id}`}>{game.get('host') ?? 'UNKNOWN'}</a>
          </li>
        )
      })} */}
    </ul>
  );
}
