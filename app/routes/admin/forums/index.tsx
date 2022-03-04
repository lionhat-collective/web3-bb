import { Forum } from "@prisma/client"
import { LoaderFunction, useLoaderData } from "remix"
import { db } from "~/utils/db.server"

type LoaderData = {
    forums: Forum[]
}

export const loader: LoaderFunction = async () => {
    const forums = await db.forum.findMany()
    const data: LoaderData = {
        forums,
    }
    return data
}

function AdminForumsIndexPage() {
    const data = useLoaderData<LoaderData>()
    return (
        <div>
            <h1>Forums</h1>
            <div>
                <ul>
                    {data.forums.map(forum => {
                        return (
                            <li key={forum.id}>
                                <a href={`/admin/forums/${forum.id}`}>{forum.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default AdminForumsIndexPage