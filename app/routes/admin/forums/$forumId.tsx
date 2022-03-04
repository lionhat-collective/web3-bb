import { Category, Forum } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type ForumType = {
    id: string;
    name: string;
    description: string | null;
    slug: string;
    subForums: Forum[];
    category: Category;
    parent: Forum | null;
} | null

type LoaderData = {
    forum: ForumType
    isParent: boolean
}

export const loader: LoaderFunction = async ({
    params,
}) => {
    const forumId = params.forumId
    const forum = await db.forum.findUnique({
        where: {
            id: forumId,
        },
        select: {
            id: true,
            name: true,
            description: true,
            slug: true,
            subForums: true,
            category: true,
            parent: true,
        },
    })
    const isParent = forum?.parent === null
    const data: LoaderData = {
        forum,
        isParent,
    }
    return data
}

function AdminCategoryRoute() {
    const data = useLoaderData<LoaderData>()
    return (
        <>
            <div>
                {/* <a href={`/admin/categories/${data.forum?.id}/edit`}>Edit</a> */}
            </div>
            <div>
                <h1 className="font-black text-2xl">{data.forum?.name}</h1>
                <p>{data.forum?.description}</p>
            </div>
            <div>
            </div>
        </>
    )
}

export default AdminCategoryRoute;