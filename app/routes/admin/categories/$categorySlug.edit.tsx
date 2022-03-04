import { Category } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type CategoryType = (Category & {
    forums: {
        name: string;
        slug: string;
        id: string;
    }[];
}) | null

type LoaderData = {
    category: CategoryType
}

export const loader: LoaderFunction = async ({
    params,
}) => {
    const categorySlug = params.categorySlug
    const category = await db.category.findFirst({
        where: {
            slug: categorySlug,
        },
        include: {
            forums: {
                select: {
                    id: true,
                    name: true,
                    slug: true,
                }
            }
        }
    })
    const data: LoaderData = {
        category,
    }
    return data
}

function AdminCategoryEditRoute() {
    const data = useLoaderData<LoaderData>()
    console.log(data)
    return (
        <>
            <div>
                <h1 className="font-black text-2xl">{data.category?.name}</h1>
                <p>{data.category?.description}</p>
            </div>
            <div>
                <div className='flex flex-row'>
                    <h2 className="font-extrabold text-xl">Forums</h2>
                    <div className='flex flex-row ml-auto'>
                        <a href={`/admin/forums/new?category=${data.category?.slug}`} rel="noreferrer" target="_blank">Create new Forum</a>
                    </div>
                </div>
                <ul>
                    {data.category?.forums.map(forum => {
                        return (
                            <li key={forum.id}>
                                <a href={`/admin/forums/${forum.slug}`}>{forum.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

export default AdminCategoryEditRoute;