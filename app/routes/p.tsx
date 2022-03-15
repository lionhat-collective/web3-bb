import { Outlet } from "remix"

function PostRouteOutlet() {
    return (
        // <div className="container mx-auto mt-12 space-y-4">
        //     <header className=''>
        //         <Breadcrumbs breadcrumbs={breadcrumbs} />
        //     </header>
            <div className='container mx-auto mt-12 space-y-4'>
                <Outlet />
            </div>
        // </div>
    )
}

export default PostRouteOutlet