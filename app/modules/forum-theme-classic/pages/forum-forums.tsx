import { Category, Forum, Post, User } from "@prisma/client"
import { useMemo } from "react"
import { Link } from "remix"
import { Breadcrumbs } from "~/modules/common/components/breadcrumbs"
import { Section } from "../components"

type ForumWithCategory = Forum & {
    category: Category
    parent: Forum | null
    subForums: Forum[]
}
type PostWithAuthor = Post & {
    author: User
}

type ForumWithCategoryAndPosts = ForumWithCategory & {
    posts: PostWithAuthor[]
}

type ForumForumsProps = {
    forum: ForumWithCategoryAndPosts
}

export function ForumForums({ forum }: ForumForumsProps) {
    const breadcrumbs = useMemo(() => {
        const paths = [
            { name: forum.category.name, href: `/f/${forum.category.slug}`, current: false },
        ]
        if (forum.parent) {
            paths.push({ name: forum.parent.name, href: `/f/${forum.parent.slug}`, current: true })
        }
        paths.push({ name: forum.name, href: `/f/${forum.slug}`, current: true })
        return paths
    }, [forum])
    return (
        <div className="container mx-auto mt-12 space-y-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
            <header className='space-y-2'>
                <h1 className='text-3xl font-black'>{forum.name}</h1>
                {forum.description && <h2 className="text-lg font-semibold">{forum.description}</h2>}
            </header>
            <main className='space-y-4'>
                {forum.subForums.length > 0 && (
                    <Section
                        name='Sub-Forums'
                    >
                        <ol>
                            {forum.subForums.map(subForum => (
                                <li key={subForum.id} className='flex flex-col px-3 py-2 border-b last:border-0'>
                                    <div className='flex flex-row items-center'>
                                        <div className='flex flex-col'>
                                            <Link
                                                to={`/f/${subForum.slug}`}
                                                className="font-semibold"
                                            >{subForum.name}</Link>
                                            {subForum.description && <small>{subForum.description}</small>}
                                        </div>

                                        {/* {recentPost && (
                                        <div>
                                            <strong>Last Post</strong>
                                            <Link to={`/p/${recentPost.id}`}>{recentPost.name}</Link>
                                            by {recentPost.author.username}
                                        </div>
                                    )} */}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </Section>
                )}
                <Section
                    name='Threads'
                >
                    {forum.posts.length > 0 && (
                        <ol>
                            {forum.posts.filter(post => post.parentId === null).map(post => {
                                return (
                                    <li key={post.id}>
                                        <Link to={post.slug}>
                                            {post.name}
                                        </Link>
                                    </li>
                                )
                            })}
                        </ol>
                    )}
                    {forum.posts.length === 0 && (
                        <div className='flex flex-col px-3 py-2 border-b last:border-0'>
                            <div className='flex flex-row items-center'>
                                <p>No posts in this forum.</p>
                            </div>
                        </div>
                    )}
                </Section>
            </main>
        </div>
    )
}