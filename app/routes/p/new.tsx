import { TextEditor } from "~/modules/common/components/text-editor"

function PostNewRoute() {
    return (
        <>
            <header>
                <h1>New Post</h1>
            </header>
            <main>
                <form
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                            Title
                        </label>
                        <div className='mt-1'>
                            <input
                                type="text"
                                name="title"
                                id="title"
                                className="shadow-sm focus:ring-slate-500 focus:border-slate-500 block w-full sm:text-sm border-slate-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-sm font-medium text-slate-700">
                            Body
                        </label>
                        <div className='mt-1 rounded-md bg-slate-50 shadow-sm'>
                            <TextEditor />
                        </div>
                    </div>
                </form>
            </main>
        </>
    )
}

export default PostNewRoute