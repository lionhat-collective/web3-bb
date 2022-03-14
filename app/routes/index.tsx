import { LoaderFunction, useLoaderData } from 'remix'
import { ForumIndexLoaderData } from '~/modules/common/types'
import { ForumIndex } from '~/modules/forum-theme-classic/pages/forum-index'
import { db } from '~/utils/db.server'

export let loader: LoaderFunction = async () => {
  const categories = await db.category.findMany({
    include: {
      forums: {
        select: {
          id: true,
          name: true,
          description: true,
          _count: true,
          slug: true,
          parentId: true,
          posts: {
            take: 1,
            select: {
              id: true,
              name: true,
              author: {
                select: {
                  username: true,
                  address: true,
                }
              },
              _count: true,
            },
          },
          subForums: {
            select: {
              id: true,
              name: true,
              _count: true,
              slug: true,
            }
          }
        },
      },
    }
  })
  const data: ForumIndexLoaderData = {
    categories,
  }
  return data
}

export default function Index() {
  const data = useLoaderData<ForumIndexLoaderData>()
  return (
    <ForumIndex categories={data.categories} />
  );
}
