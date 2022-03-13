import { Category, Prisma } from '@prisma/client'
import { Link, LoaderFunction, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import {
  ChatIcon,
} from '@heroicons/react/solid'

type CategoryType = (Category & {
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
  const data: LoaderData = {
    categories,
  }
  return data
}

export default function Index() {
  const data = useLoaderData<LoaderData>()
  return (
    <div className="container mx-auto mt-12">
      <div className="space-y-4">
        {data.categories.map(category => {
          return (
            <section
              key={category.id}
              className="rounded-b-sm bg-slate-50"
            >
              <header className="px-3 py-2 bg-slate-400 rounded-t-sm">
                <h3 className='font-semibold text-lg'>{category.name}</h3>
              </header>
              <main>
                <ul className="sm:mx-1">
                  {category.forums.map(forum => {
                    const recentPost = forum.posts[0]
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

                          {recentPost && (
                            <div>
                              <strong>Last Post</strong>
                              <Link to={`/p/${recentPost.id}`}>{recentPost.name}</Link>
                              by {recentPost.author.username}
                            </div>
                          )}
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
                </ul>
              </main>
            </section>
          )
        })}
      </div>
    </div>
  );
}
