import { Outlet } from "remix"

function ForumRouteOutlet() {
    return (
        // <div className="container mx-auto mt-12 space-y-4">
        //     <header className=''>
        //         <Breadcrumbs breadcrumbs={breadcrumbs} />
        //     </header>
            <main>
                <Outlet />
            </main>
        // </div>
    )
}

export default ForumRouteOutlet