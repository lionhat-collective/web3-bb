import { ChatIcon } from "@heroicons/react/solid"
import { Category, Forum } from "@prisma/client"
import { useMemo } from "react"
import { Link } from "remix"
import { Breadcrumbs } from "~/modules/common/components/breadcrumbs"
import { Section } from "../components"

type CategoryWithForums = Category & {
    forums: (Forum & {
        subForums: Forum[]
    })[]
}

type ForumCategoryProps = {
    category: CategoryWithForums
}

export function ForumCategory({ category }: ForumCategoryProps) {
    const breadcrumbs = useMemo(() => [
        { name: category.name, href: `/f/${category.slug}`, current: true },
    ], [category])
    return (
        <div className="container mx-auto mt-12 space-y-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <header className='space-y-2'>
                <h1 className='text-3xl font-black'>{category.name}</h1>
                {category.description && <h2 className="text-lg font-semibold">{category.description}</h2>}
            </header>
            <main className='space-y-4'>
                <Section name="Forums">
                    {category.forums.map(forum => {
                        // const recentPost = forum.posts[0]
                        // skip sub-forums. we're iterating over those later.
                        if (forum.parentId) return null
                        return (
                            <li key={forum.id} className='flex flex-col px-3 py-2 border-b last:border-0'>
                                <div className='flex flex-row items-center'>
                                    <div className='flex flex-col'>
                                        <Link
                                            to={`/f/${forum.slug}`}
                                            className="font-semibold"
                                        >{forum.name}</Link>
                                        {forum.description && <small>{forum.description}</small>}
                                    </div>

                                    {/* {recentPost && (
                                <div>
                                    <strong>Last Post</strong>
                                    <Link to={`/p/${recentPost.id}`}>{recentPost.name}</Link>
                                    by {recentPost.author.username}
                                </div>
                            )} */}
                                </div>
                                {forum.subForums.length > 0 && (
                                    <div className='flex flex-row flex-wrap items-center sm:space-x-3'>
                                        <small className='font-semibold'>
                                            Sub-Forums
                                            <ChatIcon className='w-4 h-4 inline align-text-bottom ml-1' />
                                        </small>
                                        {forum.subForums.map(subForum => {
                                            return (
                                                <Link
                                                    key={subForum.id}
                                                    to={`/f/${subForum.slug}`}
                                                    className="hover:bg-slate-800 hover:text-slate-50 text-sm py-0.5 px-1 bg-slate-300 text-slate-700"
                                                >
                                                    {subForum.name}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                )}
                            </li>
                        )
                    })}
                </Section>
            </main>
        </div>
    )
}