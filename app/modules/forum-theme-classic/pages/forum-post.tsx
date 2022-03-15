import { TextEditor } from "~/modules/common/components/text-editor"

type ForumPostProps = {
    post: unknown
    user: unknown
}

export function ForumPost({ post, user }: ForumPostProps) {
    return (
        <div>
            <TextEditor />
        </div>
    )
}