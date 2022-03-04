import { Category } from "@prisma/client"
import { LoaderFunction, useLoaderData } from "remix"
import { db } from "~/utils/db.server"

type LoaderData = {
    categories: Category[]
}

export const loader: LoaderFunction = async () => {
    const categories = await db.category.findMany()
    const data: LoaderData = {
        categories,
    }
    return data
}

function AdminCategoriesIndexPage() {
    const data = useLoaderData<LoaderData>()
    return (
        <div>
            <h1>Categories</h1>
            <div>
                <ul>
                    {data.categories.map(category => {
                        return (
                            <li key={category.id}>
                                <a href={`/admin/categories/${category.slug}`}>{category.name}</a>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default AdminCategoriesIndexPage