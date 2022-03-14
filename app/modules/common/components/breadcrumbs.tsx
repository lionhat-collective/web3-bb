/* This example requires Tailwind CSS v2.0+ */
import { HomeIcon } from '@heroicons/react/solid'
import { Link } from 'remix'

type Breadcrumb = {
    name: string
    href: string
    current: boolean
}

type BreadcrumbsProps = {
    breadcrumbs: Breadcrumb[]
}

export function Breadcrumbs({ breadcrumbs }: BreadcrumbsProps) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-4">
        <li>
          <div>
            <Link to={'/'} className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="flex-shrink-0 h-5 w-5" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </div>
        </li>
        {breadcrumbs.map((breadcrumb) => (
          <li key={breadcrumb.name}>
            <div className="flex items-center">
              <svg
                className="flex-shrink-0 h-5 w-5 text-gray-300"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
              </svg>
              <Link
                to={breadcrumb.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={breadcrumb.current ? 'page' : undefined}
              >
                {breadcrumb.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}