import { ActionFunction } from "remix"

export const action: ActionFunction = async ({
    request
}) => {
    const form = await request.formData()
    const name = form.get('name')
    const description = form.get('description')
    if (typeof name !== 'string') {
        throw new Error('Invalid name submitted')
    }
    if (typeof description !== 'string') {
        throw new Error('Invalid description submitted')
    }
}

function AdminCategoryNewPage() {
    return (
        <>
            <div>
                <h1>Create new Category</h1>
            </div>
            <div>
                <form method="post">
                    <div>
                        <label>Name</label>
                        <input type="text" name="name" />
                    </div>
                    <div>
                        <label>Description</label>
                        <textarea name="description"></textarea>
                    </div>
                    <div>
                        <button type='submit'>Create Category</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default AdminCategoryNewPage