import { Outlet } from "remix";

function RadlibRouteOutlet() {
    return (
        <div>
            <h1>Radlib</h1>
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default RadlibRouteOutlet;