import { Outlet } from "remix"
import { AdminLayout } from "~/modules/admin/admin-layout"

function AdminRouteOutlet() {
    return (
        <AdminLayout>
            <Outlet />
        </AdminLayout>
    )
}

export default AdminRouteOutlet