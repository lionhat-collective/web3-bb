import {
    StarIcon,
} from '@heroicons/react/solid'
import { Link } from 'remix'

type NavItem = {
    id: string
    name: string
    slug: string
}

type NavigationProps = {
    navItems: NavItem[]
    user: {
        id: string
        username: string
        address: string
        chainType: string
    } | null
}

export function Navigation({ navItems, user }: NavigationProps) {
    return (
        <nav
            className='py-1 bg-slate-900 text-slate-300 text-sm'
        >
            <div
                className='flex container mx-auto items-center'
            >
                <StarIcon className='w-5 h-5 fill-current' />
                <div
                    className='ml-auto'
                >
                    {user ? (
                        <div>
                            {user.username}
                        </div>
                    ) : (
                        <Link to='/login'>Log In</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}