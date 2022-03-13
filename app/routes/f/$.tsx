import { Category, Forum, Post, User } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";


type ForumWithCategory = Forum & {
    category: Category
}

type PostWithAuthor = Post & {
    author: User
}

type ForumWithCategoryAndPosts = ForumWithCategory & {
    posts: PostWithAuthor[]
}

type PostWithAuthorAndForum = PostWithAuthor & {
    forum: ForumWithCategory
}

type CategoryWithForums = Category & {
    forums: (Forum & {
        subForums: Forum[]
    })[]
}

type Resource = PostWithAuthorAndForum | ForumWithCategoryAndPosts | CategoryWithForums | null

type LoaderData = {
    resource: Resource
}

const findForumBySlug = async (slug: string): Promise<Resource> => {
    return await db.forum.findUnique({
        where: {
            slug: slug,
        },
        include: {
            category: true,
            subForums: true,
            posts: {
                include: {
                    author: true,
                }
            }
        }
    })
}

const findPostBySlug = async (slug: string): Promise<Resource> => {
    return await db.post.findUnique({
        where: {
            slug: slug,
        },
        include: {
            forum: {
                include: {
                    category: true,
                }
            },
            author: true,
        }
    })
}

const findCategoryBySlug = async (slug: string): Promise<Resource> => {
    return await db.category.findUnique({
        where: {
            slug,
        },
        include: {
            forums: {
                include: {
                    subForums: true,
                }
            }
        }
    })
}

const findForumOrPostBySlug = async (slug: string): Promise<Resource> => {
    let resource: Resource = await findForumBySlug(slug)
    if (resource) {
        return resource
    }

    resource = await findPostBySlug(slug)

    return resource
}

export const loader: LoaderFunction = async ({
    params,
}) => {
    const slug = params["*"]
    let data: LoaderData = {
        resource: null
    }
    if (!slug) {
        return data
    }
    const slugParts = slug.split('/')

    // if only category, show forums for that category.
    if (slugParts.length === 1) {
        data.resource = await findCategoryBySlug(slug)
    // if category and forum, show subforums and posts.
    } else if (slugParts.length === 2) {
        data.resource = await findForumBySlug(slug)
    // if category, forum, and subforum or post, find the post or subforum.
    } else if (slugParts.length === 3) {
        data.resource = await findForumOrPostBySlug(slug)
    // if category, forum, subforum, and post, show post.
    } else if (slugParts.length === 4) {
        data.resource = await findPostBySlug(slug)
    // otherwise 404.
    } else {
        data.resource = null
    }

    return data
}

function ForumRoute() {
    const data = useLoaderData<LoaderData>()
    console.log(data)
    if (!data.resource) {
        return <div>404</div>
    }
    return (
        <div>
            <h1>{data.resource?.name}</h1>
        </div>
    )
}

export default ForumRoute;