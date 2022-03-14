import { Category, Prisma } from '@prisma/client'

export type ForumIndexCategory = (Category & {
    forums: {
        id: string
        name: string
        description: string | null
        slug: string
        _count: Prisma.PostCountOutputType;
        parentId: string | null
        subForums: {
            id: string
            name: string
            slug: string
            _count: Prisma.PostCountOutputType;
        }[]
        posts: {
            id: string;
            name: string;
            _count: Prisma.PostCountOutputType;
            author: {
                username: string;
                address: string;
            };
        }[];
    }[];
})[]

export type ForumIndexLoaderData = {
    categories: ForumIndexCategory
}