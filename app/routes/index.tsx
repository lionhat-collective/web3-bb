import { Category, Forum, Prisma } from '@prisma/client'
import { LoaderFunction, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'

type CategoryType = (Category & {
  forums: {
    id: string
    name: string
    description: string | null
    slug: string
    _count: Prisma.PostCountOutputType;

      subForums: {
        id: string
        name: string
        slug: string
        _count: Prisma.PostCountOutputType;
      }[]
      posts: {
          id: string;
          title: string;
          _count: Prisma.PostCountOutputType;
          author: {
              id: string;
              username: string;
              address: string;
          };
      }[];
  }[];
})[]

type LoaderData = {
  categories: CategoryType
}

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
          posts: {
            take: 1,
            select: {
              id: true,
              title: true,
              author: {
                select: {
                  id: true,
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
  const data: LoaderData = {
    categories,
  }
  return data
}

export default function Index() {
  const data = useLoaderData<LoaderData>()
  return (
    <div>
      {data.categories.map(category => {
        return (
          <section key={category.id}>
            <header>{category.name}</header>
            <main>
              <ul>
                {category.forums.map(forum => {
                  const recentPost = forum.posts[0]
                  return (
                    <li key={forum.id} className='flex flex-row'>
                      <div className='flex flex-col'>
                        <a href={`/f/${category.slug}/${forum.slug}`}>{forum.name}</a>
                        {forum.description && <small>{forum.description}</small>}
                      </div>

                      {recentPost && (
                        <div>
                          <strong>Last Post</strong>
                          <a href={`/p/${recentPost.id}`}>{recentPost.title}</a>
                          by {recentPost.author.username}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </main>
          </section>
        )
      })}
    </div>
  );
}
