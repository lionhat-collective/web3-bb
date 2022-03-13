import { useCallback, useMemo, useState } from "react"
import { ActionFunction, LoaderFunction, redirect, useLoaderData } from "remix"
import { kebabCase } from 'lodash-es'
import { db } from "~/utils/db.server"
import { Prisma } from "@prisma/client"

export const action: ActionFunction = async ({
    request
}) => {
    const form = await request.formData()
    let name = form.get('name')
    let description = form.get('description')
    let slug = form.get('slug')
    let parentSlug = form.get('parent')
    let categorySlug = form.get('category')
    if (typeof name !== 'string') {
        throw new Error('Invalid name submitted')
    }
    if (typeof description !== 'string' && typeof description !== 'undefined') {
        throw new Error('Invalid description submitted')
    }
    if (typeof slug !== 'string') {
        throw new Error('Invalid slug submitted')
    }
    if (typeof categorySlug !== 'string') {
        throw new Error('Invalid category submitted')
    }
    if (typeof parentSlug !== 'string' && parentSlug !== null) {
        throw new Error('Invalid parent submitted')
    }
    slug = parentSlug ? `${parentSlug}/${kebabCase(slug ?? name)}` : `${categorySlug}/${kebabCase(slug ?? name)}`
    const category = await db.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true }
    })
    if (!category) {
        throw new Error('Invalid category submitted')
    }
    const parent = parentSlug ? await db.forum.findUnique({
        where: { slug: parentSlug },
        select: { id: true }
    }) : null
    const forum = await db.forum.create({
        data: {
            name,
            description,
            slug,
            parentId: parent?.id,
            categoryId: category.id,
            updatedAt: new Date(),
        },
    })
    return redirect(`/admin/forums/${forum.id}`)
}

type LoaderData = {
    category?: string
    categories: {
        id: string;
        name: string;
        slug: string;
        _count: Prisma.CategoryCountOutputType;
    }[]
    forums: {
        id: string;
        name: string;
        slug: string;
        category: {
            slug: string;
        };
        _count: Prisma.ForumCountOutputType;
    }[]
}

export const loader: LoaderFunction = async ({
    params,
}) => {
    const categorySlug = params.category
    const categories = await db.category.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            _count: true,
        },
    })
    const forums = await db.forum.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            category: {
                select: {
                    slug: true,
                },
            },
            _count: true,
        },
    })

    const data: LoaderData = {
        category: categorySlug,
        categories,
        forums,
    }

    return data
}

function AdminForumNewPage() {
    const data = useLoaderData<LoaderData>()
    const [name, setName] = useState('')
    const [category, setCategory] = useState(data.category ?? data.categories?.[0]?.slug ?? '')
    const [parent, setParent] = useState('')
    const handleFormChange = useCallback((event: React.ChangeEvent<HTMLFormElement>) => {
        const value = event.target.value
        if (event.target.name === 'name') {
            setName(value)
        }
        if (event.target.name === 'category') {
            setCategory(value)
        }
        if (event.target.name === 'parent') {
            setParent(value === 'none' ? '' : value)
        }
    }, [])
    const slug = useMemo(() => kebabCase(name), [name])
    const slugPath = useMemo(() => parent ? `${parent}/` : `${category}/`, [category, parent])
    const forums = useMemo(() => data.forums.filter(forum => forum.category.slug === category), [category, data])
    console.log(forums)
    return (
        <>
            <div>
                <h1>Create new Forum</h1>
            </div>
            <div>
                <form method="post" onChange={handleFormChange} className='space-y-3'>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                            Name
                        </label>
                        <div className='mt-1'>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
                            Description
                        </label>
                        <div className='mt-1'>
                            <textarea
                                name="description"
                                id="description"
                                className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            ></textarea>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                            Slug
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm">
                                {slugPath}
                            </span>
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                defaultValue={slug}
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-slate-500 focus:border-slate-500 sm:text-sm border-slate-300"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-slate-700">
                            Category
                        </label>
                        <select
                            id="category"
                            name="category"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md"
                            defaultValue={data.category}
                        >
                            {data.categories.map(category => {
                                return (
                                    <option key={category.id} value={category.slug}>{category.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="parent" className="block text-sm font-medium text-slate-700">
                            Parent Forum
                        </label>
                        <select
                            id="parent"
                            name="parent"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-slate-500 focus:border-slate-500 sm:text-sm rounded-md"
                            defaultValue={forums?.[0]?.id ?? 'none'}
                            disabled={forums.length === 0}
                        >
                            <option value='none'>None</option>
                            {forums.map(forum => {
                                return (
                                    <option key={forum.id} value={forum.slug}>{forum.name}</option>
                                )
                            })}
                        </select>
                    </div>
                    <div>
                        <button type='submit'>Create Forum</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AdminForumNewPage