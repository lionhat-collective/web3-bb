import { LoaderFunction, useLoaderData } from "remix";

type LoaderData = { }

export const loader: LoaderFunction = async ({
    params,
}) => {
    // const data = { radlib: radlib.attributes }
    return {}
}

function PostRoute() {
    const data = useLoaderData<LoaderData>()
    console.log(data)
    return (
        <div>
            <h1>Radlib Game</h1>
        </div>
    )
}

export default PostRoute;